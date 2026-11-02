import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import SectionOpener from "../scenes/SectionOpener";
import BlackHole from "./BlackHole";
import GravityField from "./GravityField";
import { SceneData } from "../../data/portfolio";
import { clamp01, seg, easeOutCubic, easeInOutQuad, mulberry32 } from "../../lib/math";
import { useReducedMotion } from "../../lib/useReducedMotion";
import { INTRO_VH } from "../../lib/timeline";


/** The "big bang" origin, in % of the viewport (where the figures' fingers would meet). */
const OX = 50;
const OY = 46;


function maxRadius() {
  if (typeof window === "undefined") return 1200;
  const dx = (Math.max(OX, 100 - OX) / 100) * window.innerWidth;
  const dy = (Math.max(OY, 100 - OY) / 100) * window.innerHeight;
  return Math.hypot(dx, dy) + 60;
}

/** Soft round glow, pre-rendered once per tint so each frame is just cheap drawImage calls. */
function glowSprite(rgb: string, size = 64) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const h = size / 2;
  const grad = g.createRadialGradient(h, h, 0, h, h, h);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.18, `rgba(${rgb},0.95)`);
  grad.addColorStop(0.45, `rgba(${rgb},0.22)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

/** Four-point diffraction sparkle for the brightest stars. */
function spikeSprite(size = 128) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const h = size / 2;
  for (const [dx, dy] of [[1, 0], [0, 1]]) {
    const grad = g.createLinearGradient(h - dx * h, h - dy * h, h + dx * h, h + dy * h);
    grad.addColorStop(0, "rgba(255,248,235,0)");
    grad.addColorStop(0.5, "rgba(255,248,235,0.95)");
    grad.addColorStop(1, "rgba(255,248,235,0)");
    g.fillStyle = grad;
    if (dx) g.fillRect(0, h - 0.75, size, 1.5);
    else g.fillRect(h - 0.75, 0, 1.5, size);
  }
  return c;
}

interface Star {
  x: number; // 0..1
  y: number;
  r: number; // css px
  a: number; // base brightness
  speed: number; // twinkle, rad/s
  phase: number;
  tint: number;
  spike: boolean;
}

/**
 * The starfield inside the reveal circle. Two dust clouds are painted once; the stars are redrawn
 * every frame so they twinkle, the brightest ones sparkle with a four-point flare, and a shooting
 * star crosses now and then. It keeps animating while the reader is paused mid-transition, and the
 * loop only runs while the circle is on screen.
 */
function StarCanvas({ w, h, p }: { w: number; h: number; p: MotionValue<number> }) {
  const dustRef = useRef<HTMLCanvasElement>(null);
  const ref = useRef<HTMLCanvasElement>(null);

  // dust clouds: static
  useEffect(() => {
    const c = dustRef.current;
    if (!c || !w || !h) return;
    c.width = Math.round(w * 0.5);
    c.height = Math.round(h * 0.5);
    const g = c.getContext("2d");
    if (!g) return;
    const W = c.width;
    const H = c.height;
    const dust = (fx: number, fy: number, rgb: string, alpha: number, stop: number) => {
      const rx = Math.max(fx, 1 - fx) * W * Math.SQRT2 * stop;
      const ry = Math.max(fy, 1 - fy) * H * Math.SQRT2 * stop;
      g.save();
      g.translate(fx * W, fy * H);
      g.scale(rx, ry);
      const grad = g.createRadialGradient(0, 0, 0, 0, 0, 1);
      grad.addColorStop(0, `rgba(${rgb},${alpha})`);
      grad.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = grad;
      g.fillRect(-1, -1, 2, 2);
      g.restore();
    };
    dust(0.28, 0.62, "120,90,70", 0.24, 0.38);
    dust(0.66, 0.3, "90,80,130", 0.2, 0.42);
    dust(0.5, 0.5, "107,45,45", 0.1, 0.5);
  }, [w, h]);

  // stars: animated
  useEffect(() => {
    const c = ref.current;
    if (!c || !w || !h) return;
    // the layer is scaled up 1.6x, so draw at 1.6x (capped) to keep stars crisp without a huge canvas
    const k = 1.6 * Math.min(window.devicePixelRatio || 1, 1.25);
    c.width = Math.round(w * k);
    c.height = Math.round(h * k);
    const g = c.getContext("2d");
    if (!g) return;
    const W = c.width;
    const H = c.height;

    const tints = ["255,244,228", "200,220,255", "255,214,160", "255,190,190"];
    const glows = tints.map((t) => glowSprite(t));
    const spike = spikeSprite();
    const rnd = mulberry32(77);
    const stars: Star[] = Array.from({ length: 260 }, () => {
      const bright = rnd();
      return {
        x: rnd(),
        y: rnd(),
        r: 0.5 + Math.pow(rnd(), 2.2) * 2.2,
        a: 0.35 + rnd() * 0.65,
        speed: 0.6 + rnd() * 2.4,
        phase: rnd() * Math.PI * 2,
        tint: bright > 0.82 ? 1 : bright > 0.7 ? 2 : bright > 0.66 ? 3 : 0,
        spike: bright > 0.93,
      };
    });

    // shooting star state
    let shoot: { t0: number; x: number; y: number; ang: number; len: number } | null = null;
    let nextShoot = 1.5;

    const draw = (now: number) => {
      const t = now / 1000;
      g.clearRect(0, 0, W, H);
      g.globalCompositeOperation = "lighter";
      for (const s of stars) {
        const tw = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
        const alpha = s.a * (0.35 + 0.65 * tw);
        const size = s.r * k * 6 * (0.85 + 0.3 * tw);
        const x = s.x * W;
        const y = s.y * H;
        g.globalAlpha = alpha;
        g.drawImage(glows[s.tint], x - size / 2, y - size / 2, size, size);
        if (s.spike) {
          // sharper pulse: the flare flashes, then fades
          const flare = Math.pow(tw, 3);
          const L = s.r * k * 16 * (0.4 + flare);
          g.globalAlpha = 0.85 * flare;
          g.drawImage(spike, x - L / 2, y - L / 2, L, L);
        }
      }
      // shooting star
      if (!shoot && t > nextShoot) {
        shoot = { t0: t, x: 0.15 + rnd() * 0.7, y: 0.1 + rnd() * 0.35, ang: Math.PI * (0.15 + rnd() * 0.2), len: 0.12 + rnd() * 0.1 };
      }
      if (shoot) {
        const u = (t - shoot.t0) / 0.9;
        if (u >= 1) {
          shoot = null;
          nextShoot = t + 2.5 + rnd() * 4;
        } else {
          const travel = 0.35 * u;
          const hx = (shoot.x + Math.cos(shoot.ang) * travel) * W;
          const hy = (shoot.y + Math.sin(shoot.ang) * travel) * H;
          const tx = hx - Math.cos(shoot.ang) * shoot.len * W;
          const ty = hy - Math.sin(shoot.ang) * shoot.len * W;
          const fade = Math.sin(Math.PI * u);
          const grad = g.createLinearGradient(tx, ty, hx, hy);
          grad.addColorStop(0, "rgba(255,240,225,0)");
          grad.addColorStop(1, `rgba(255,240,225,${(0.9 * fade).toFixed(3)})`);
          g.globalAlpha = 1;
          g.strokeStyle = grad;
          g.lineWidth = 1.6 * k;
          g.lineCap = "round";
          g.beginPath();
          g.moveTo(tx, ty);
          g.lineTo(hx, hy);
          g.stroke();
        }
      }
      g.globalAlpha = 1;
      g.globalCompositeOperation = "source-over";
    };

    // run only while the reveal circle (and its stars) can be seen
    const visible = (v: number) => v > 0.2 && v < 0.97;
    let raf = 0;
    const loop = (now: number) => {
      draw(now);
      raf = visible(p.get()) ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!raf && visible(p.get())) raf = requestAnimationFrame(loop);
    };
    const un = p.on("change", kick);
    draw(performance.now());
    kick();
    return () => {
      un();
      cancelAnimationFrame(raf);
    };
  }, [w, h, p]);

  return (
    <>
      <canvas ref={dustRef} aria-hidden="true" className="absolute inset-0 w-full h-full" />
      <canvas ref={ref} aria-hidden="true" className="absolute inset-0 w-full h-full" />
    </>
  );
}

interface IntroBurstProps {
  heroScene: SceneData;
  workScene: SceneData;
  nextPageRef: React.RefObject<HTMLElement | null>;
}

/**
 * Pinned intro. The hero stays on screen while the page scrolls underneath it:
 *  1. the hero drifts inward and a flash ignites at the burst point
 *  2. a dark starfield expands from that point as a circle (the "bang")
 *  3. inside the circle the Work scene settles from zoomed-in to normal
 *  4. the hero zooms past the camera and fades out
 * Everything is scroll-scrubbed (no timers), so scroll speed is never held or slowed.
 */
export default function IntroBurst({ heroScene, workScene, nextPageRef }: IntroBurstProps) {
  const reduced = useReducedMotion();
  const [ringSize, setRingSize] = useState(2400);
  const rootRef = useRef<HTMLDivElement>(null);
  // exact size of the pinned stage (the reveal wrapper needs real pixels)
  const [vp, setVp] = useState({ w: 1280, h: 800 });
  const vpRef = useRef(vp);
  vpRef.current = vp;

  useEffect(() => {
    const onResize = () => {
      setRingSize(maxRadius() * 2);
      const el = rootRef.current;
      if (el) setVp({ w: el.clientWidth, h: el.clientHeight });
    };
    onResize();
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    if (rootRef.current) ro.observe(rootRef.current);
    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, []);

  const { scrollY } = useScroll();
  const p = useTransform(scrollY, (y) =>
    clamp01(y / ((typeof window !== "undefined" ? window.innerHeight : 900) * INTRO_VH))
  );

  // Radius of the expanding circle, in px
  const radius = useTransform(p, (v) => easeInOutQuad(seg(v, 0.24, 0.86)) * maxRadius());

  // HERO: every word and letter is pulled in on its own spiral (see SuckText); the backdrop winds up too.
  // The container itself never transforms, so each piece can measure where it sits.
  const suck = useMemo(() => (reduced ? undefined : { p, ox: OX, oy: OY }), [reduced, p]);
  const heroOpacity = useTransform(p, (v) => 1 - seg(v, 0.56, 0.68));
  const heroVisibility = useTransform(p, (v) => (v >= 0.7 ? "hidden" : "visible"));

  // BLACK HOLE: forms at the burst point, grows, then the reveal circle swallows it
  const bhScale = useTransform(
    p,
    (v) => (0.08 + 0.92 * easeOutCubic(seg(v, 0.02, 0.2))) * (1 + 0.7 * seg(v, 0.3, 0.7))
  );
  const bhOpacity = useTransform(p, (v) => seg(v, 0.02, 0.1) * (1 - seg(v, 0.55, 0.8)));

  // WORK scene revealed through the circle
  // The reveal circle is an overflow-hidden, round-cornered box that grows from the hole, with the
  // Work scene counter-translated inside it. (A huge animated clip-path circle over GPU-composited
  // children left a stray rectangle of the scene showing outside the circle on some GPUs.)
  const full = (r: number) => r >= maxRadius() - 1;
  const wrapX = useTransform(radius, (r) => (full(r) ? 0 : (OX / 100) * vpRef.current.w - r));
  const wrapY = useTransform(radius, (r) => (full(r) ? 0 : (OY / 100) * vpRef.current.h - r));
  const wrapW = useTransform(radius, (r) => (full(r) ? vpRef.current.w : Math.max(0, r * 2)));
  const wrapH = useTransform(radius, (r) => (full(r) ? vpRef.current.h : Math.max(0, r * 2)));
  const wrapMask = useTransform(radius, r => full(r) ? "none" : "radial-gradient(circle closest-side, #000 99.6%, transparent 100%)");
  const wrapBR = useTransform(radius, (r) => (full(r) ? "0%" : "50%"));
  const innerX = useTransform(wrapX, (x) => -x);
  const innerY = useTransform(wrapY, (y) => -y);
  const workTransform = useTransform(p, (v) => {
    const s = 1.55 - 0.55 * easeOutCubic(seg(v, 0.24, 1));
    return `scale(${s.toFixed(4)})`;
  });
  const starOpacity = useTransform(p, (v) => 1 - seg(v, 0.55, 0.96));
  const starTransform = useTransform(p, (v) => `rotate(${(-50 * (1 - seg(v, 0.24, 0.9))).toFixed(2)}deg) scale(1.6)`);

  // Glowing rim that rides the circle edge: fixed-size ring, scaled to match the radius
  const ringTransform = useTransform(radius, (r) => {
    const s = r / (maxRadius() || 1);
    return `translate(-50%, -50%) scale(${s.toFixed(4)})`;
  });
  const ringOpacity = useTransform(p, (v) => seg(v, 0.24, 0.3) * (1 - seg(v, 0.8, 0.95)));

  // Showcase windows build in while the circle settles
  const workBuild = useTransform(p, [0.4, 1], [0, 1], { clamp: true });

  // Reduced motion: plain crossfade, nothing zooms or expands
  const rmWorkOpacity = useTransform(p, (v) => seg(v, 0.3, 0.7));
  const rmHeroOpacity = useTransform(p, (v) => 1 - seg(v, 0.3, 0.7));

  const origin = `${OX}% ${OY}%`;

  return (
    <div ref={rootRef} className="sticky top-0 w-full h-[100svh] z-10 overflow-hidden bg-[#161310]">
      {/* HERO (underneath) */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={
          reduced
            ? { opacity: rmHeroOpacity }
            : {
                opacity: heroOpacity,
                visibility: heroVisibility,
              }
        }
      >
        <SectionOpener scene={{ ...heroScene, id: "hero-scene" }} isHero suck={suck} />
      </motion.div>

      {/* stars and dust pulled in, then the black hole itself */}
      {!reduced && (
        <>
          <GravityField p={p} ox={OX} oy={OY} />
          <BlackHole x={OX} y={OY} scale={bhScale} opacity={bhOpacity} />
        </>
      )}

      {/* WORK scene, revealed by the expanding circle */}
      <motion.div
        className={reduced ? "absolute inset-0" : "absolute overflow-hidden"}
        style={
          reduced
            ? { opacity: rmWorkOpacity }
            : {
                left: 0,
                top: 0,
                x: wrapX,
                y: wrapY,
                width: wrapW,
                height: wrapH,
                borderRadius: wrapBR,
                // belt and braces: some GPUs leak promoted children past a rounded overflow clip
                WebkitMaskImage: wrapMask,
                maskImage: wrapMask,
              }
        }
      >
        {/* These two layers move every frame during the reveal. Promoting them to their own GPU
            layers means a move is just a re-position; without it the browser repaints the whole
            Work scene (blurred shadows, film grain, 200+ star gradients) on every frame. The
            circular mask on the wrapper above keeps them clipped to the circle. */}
        <motion.div
          className={reduced ? "absolute" : "absolute will-change-transform"}
          style={reduced ? { inset: 0 } : { left: 0, top: 0, width: vp.w, height: vp.h, x: innerX, y: innerY }}
        >
        <motion.div
          className={reduced ? "absolute inset-0" : "absolute inset-0 will-change-transform"}
          style={reduced ? undefined : { transform: workTransform, transformOrigin: origin }}
        >
          <SectionOpener scene={workScene} nextPageRef={nextPageRef} buildProgress={workBuild} />
        </motion.div>

        {/* starfield + darkness that burns off as the scene settles */}
        {!reduced && (
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: starOpacity,
              transform: starTransform,
              willChange: "transform, opacity",
              backgroundColor: "#07060a",
              zIndex: 60,
            }}
          >
            <StarCanvas w={vp.w} h={vp.h} p={p} />
          </motion.div>
        )}
        </motion.div>
      </motion.div>

      {!reduced && (
        <>
          {/* glowing rim on the circle edge */}
          <motion.div
            aria-hidden="true"
            className="absolute pointer-events-none will-change-transform"
            style={{
              left: `${OX}%`,
              top: `${OY}%`,
              width: ringSize,
              height: ringSize,
              borderRadius: "50%",
              opacity: ringOpacity,
              transform: ringTransform,
              background:
                "radial-gradient(circle closest-side, transparent 93%, rgba(255,236,214,0.0) 94%, rgba(255,236,214,0.55) 99%, rgba(255,255,255,0.0) 100%)",
              zIndex: 70,
            }}
          />
        </>
      )}
    </div>
  );
}
