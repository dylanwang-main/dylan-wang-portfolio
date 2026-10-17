import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import SectionOpener from "./SectionOpener";
import BlackHole from "./BlackHole";
import GravityField from "./GravityField";
import { SceneData } from "../data/portfolio";

/** How many viewport heights of scroll the pinned intro lasts. */
export const INTRO_VH = 2.5;

/** Extra scroll (in viewport heights) each scene stays composed before the next page rises over it. */
export const SCENE_DWELL_VH = 0.6;

/** The "big bang" origin, in % of the viewport (where the figures' fingers would meet). */
const OX = 50;
const OY = 46;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => Math.pow(t, 2.2);
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function maxRadius() {
  if (typeof window === "undefined") return 1200;
  const dx = (Math.max(OX, 100 - OX) / 100) * window.innerWidth;
  const dy = (Math.max(OY, 100 - OY) / 100) * window.innerHeight;
  return Math.hypot(dx, dy) + 60;
}

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * ~220 pin-prick stars and two soft dust clouds, painted ONCE onto a canvas.
 * (This used to be 222 stacked CSS radial-gradients, which the browser had to re-draw in full
 * every time the layer moved or faded, the main cost during the reveal.) The canvas is drawn at
 * 1.6x because the layer is scaled up by that much, so stars stay crisp.
 */
function StarCanvas({ w, h }: { w: number; h: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || !w || !h) return;
    const k = 1.6 * Math.min(window.devicePixelRatio || 1, 1.5);
    c.width = Math.round(w * k);
    c.height = Math.round(h * k);
    const g = c.getContext("2d");
    if (!g) return;
    const W = c.width;
    const H = c.height;
    g.clearRect(0, 0, W, H);

    // dust clouds underneath: elliptical, sized like CSS "ellipse farthest-corner"
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
    dust(0.28, 0.62, "120,90,70", 0.22, 0.38);
    dust(0.66, 0.3, "90,80,110", 0.18, 0.42);

    // stars: same sequence as before (x, y, radius, brightness per star)
    const rnd = mulberry32(77);
    for (let i = 0; i < 220; i++) {
      const x = rnd() * W;
      const y = rnd() * H;
      const r = (0.6 + rnd() * 1.6) * k;
      const a = 0.35 + rnd() * 0.65;
      const edge = r + 1.2 * k;
      const grad = g.createRadialGradient(x, y, 0, x, y, edge);
      grad.addColorStop(0, `rgba(255,246,232,${a.toFixed(2)})`);
      grad.addColorStop(r / edge, `rgba(255,246,232,${a.toFixed(2)})`);
      grad.addColorStop(1, "rgba(255,246,232,0)");
      g.fillStyle = grad;
      g.fillRect(x - edge, y - edge, edge * 2, edge * 2);
    }
  }, [w, h]);
  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 w-full h-full" />;
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
  const [reduced, setReduced] = useState(false);
  const [ringSize, setRingSize] = useState(2400);
  const rootRef = useRef<HTMLDivElement>(null);
  // exact size of the pinned stage (the reveal wrapper needs real pixels)
  const [vp, setVp] = useState({ w: 1280, h: 800 });
  const vpRef = useRef(vp);
  vpRef.current = vp;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onMq = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onMq);
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
      mq.removeEventListener("change", onMq);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, []);

  const { scrollY } = useScroll();
  const p = useTransform(scrollY, (y) =>
    clamp01(y / ((typeof window !== "undefined" ? window.innerHeight : 900) * INTRO_VH))
  );

  // Radius of the expanding circle, in px
  const radius = useTransform(p, (v) => easeInOut(seg(v, 0.24, 0.86)) * maxRadius());

  // HERO: every word and letter is pulled in on its own spiral (see SuckText); the backdrop winds up too.
  // The container itself never transforms, so each piece can measure where it sits.
  const suck = useMemo(() => (reduced ? undefined : { p, ox: OX, oy: OY }), [reduced, p]);
  const heroOpacity = useTransform(p, (v) => 1 - seg(v, 0.56, 0.68));
  const heroVisibility = useTransform(p, (v) => (v >= 0.7 ? "hidden" : "visible"));

  // BLACK HOLE: forms at the burst point, grows, then the reveal circle swallows it
  const bhScale = useTransform(
    p,
    (v) => (0.08 + 0.92 * easeOut(seg(v, 0.02, 0.2))) * (1 + 0.7 * seg(v, 0.3, 0.7))
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
    const s = 1.55 - 0.55 * easeOut(seg(v, 0.24, 1));
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
            <StarCanvas w={vp.w} h={vp.h} />
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
