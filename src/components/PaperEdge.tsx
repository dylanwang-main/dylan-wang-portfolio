import { useEffect, useRef } from "react";

/**
 * Torn paper edge, with a slow burn running along the tear.
 *
 * The main canvas is transparent ABOVE the ragged line (so the scene behind shows
 * through) and filled with `fill` BELOW it (so it merges into the page that sits
 * directly under the canvas). A second, transparent canvas on top animates an ember
 * line: a hot front sweeps along the tear leaving a dimmer glowing trail, with the odd
 * spark lifting off. It is only an illusion of burning (the paper never changes), it
 * only runs while the edge is on screen, and it stays still for reduced motion.
 */

const EDGE_HEIGHT = 220;

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface PaperEdgeProps {
  seed: number;
  /** Page color below the tear. Must match the page this edge belongs to. */
  fill: string;
  /** RGB triple for the fibrous rim, e.g. "255,255,255". */
  rim?: string;
  /** Shadow cast onto the page behind (the side ABOVE the tear). */
  shadow?: string;
  height?: number;
  /** Is the paper itself light (cream) or dark? Lets the nav read contrast from the real pixels. */
  paper?: "light" | "dark";
  /** Animate the ember along the tear. */
  burn?: boolean;
}

type Spark = { x: number; y: number; vx: number; vy: number; age: number; life: number; r: number };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Ember colour for a heat value 0..1: dull red, orange, then pale yellow at the hot front. */
function heatColor(i: number) {
  const a = clamp01((i - 0.06) * 1.15);
  let r: number, g: number, b: number;
  if (i < 0.5) {
    const t = i / 0.5;
    r = mix(150, 255, t);
    g = mix(28, 110, t);
    b = mix(12, 32, t);
  } else {
    const t = Math.min(1, (i - 0.5) / 0.5);
    r = 255;
    g = mix(110, 232, t);
    b = mix(32, 176, t);
  }
  return `rgba(${r | 0},${g | 0},${b | 0},${a.toFixed(3)})`;
}

export default function PaperEdge({
  seed,
  fill,
  rim = "255,255,255",
  shadow = "rgba(0,0,0,0.45)",
  height = EDGE_HEIGHT,
  paper = "light",
  burn = true,
}: PaperEdgeProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const fx = fxRef.current;
    if (!canvas || !fx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = burn && !reduced;

    let W = 0;
    let dpr = 1;
    let ys: number[] = [];
    let path: Path2D | null = null;
    const sparks: Spark[] = [];
    const period = 9000 + (seed % 5) * 1300;
    const phase = (seed * 0.6180339) % 1;

    const paintFx = (t: number, dt: number) => {
      const ctx = fx.getContext("2d");
      if (!ctx || !path || !W) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, height);

      // two burn fronts at different speeds, so the line never looks looped
      const f1 = ((t / period + phase) % 1) * W * 1.4 - W * 0.2;
      const f2 = ((t / (period * 1.7) + phase * 1.7 + 0.35) % 1) * W * 1.4 - W * 0.2;

      const front = (x: number, f: number) =>
        x > f ? Math.exp(-(((x - f) / 55) ** 2)) : Math.exp(-(f - x) / (W * 0.2));

      const grad = ctx.createLinearGradient(0, 0, W, 0);
      const STEP = 16;
      for (let x = 0; x <= W; x += STEP) {
        const flick =
          0.62 +
          0.38 *
            (0.5 + 0.5 * Math.sin(x * 0.07 + t * 0.007 + seed) * Math.sin(x * 0.023 - t * 0.0043));
        const heat = clamp01(0.11 + front(x, f1) * 0.95 + front(x, f2) * 0.55) * flick;
        grad.addColorStop(Math.min(1, x / W), heatColor(heat));
      }

      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = grad;
      ctx.globalAlpha = 0.22;
      ctx.lineWidth = 18;
      ctx.stroke(path);
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 7;
      ctx.stroke(path);
      ctx.globalAlpha = 1;
      ctx.lineWidth = 2.2;
      ctx.stroke(path);

      // sparks lift off the hot front
      if (animate) {
        if (sparks.length < 26 && Math.random() < 0.55) {
          const f = Math.random() < 0.7 ? f1 : f2;
          const x = f + (Math.random() - 0.5) * 90;
          if (x > 0 && x < W) {
            sparks.push({
              x,
              y: ys[Math.floor(x)] - 2,
              vx: (Math.random() - 0.5) * 0.03,
              vy: -(0.02 + Math.random() * 0.05),
              age: 0,
              life: 900 + Math.random() * 900,
              r: 0.8 + Math.random() * 1.4,
            });
          }
        }
        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i];
          s.age += dt;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          s.vx += (Math.random() - 0.5) * 0.002;
          if (s.age >= s.life || s.y < -10) {
            sparks.splice(i, 1);
            continue;
          }
          const k = (1 - s.age / s.life) ** 1.5;
          ctx.fillStyle = `rgba(255,${(150 + 80 * k) | 0},70,${(0.9 * k).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.ceil(canvas.parentElement?.clientWidth || window.innerWidth);
      const H = height;

      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = "100%";
      canvas.style.height = `${H}px`;
      fx.width = W * dpr;
      fx.height = H * dpr;
      fx.style.width = "100%";
      fx.style.height = `${H}px`;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const rnd = mulberry32(seed);
      // amplitude (px) and frequency of each noise octave: slow waves down to fine tear
      const oct = [
        { a: 40, f: 0.0035 },
        { a: 22, f: 0.011 },
        { a: 10, f: 0.03 },
        { a: 5, f: 0.09 },
        { a: 2, f: 0.25 },
      ];
      const ph = oct.map(() => rnd() * 1000);
      const base = H * 0.55;
      ys = [];
      for (let x = 0; x <= W; x++) {
        let y = base;
        oct.forEach((o, i) => {
          y +=
            o.a *
            Math.sin(x * o.f + ph[i]) *
            (0.6 + 0.4 * Math.sin(x * o.f * 0.37 + ph[i] * 1.7));
        });
        ys.push(y + (rnd() - 0.5) * 2);
      }

      const body = () => {
        ctx.beginPath();
        ctx.moveTo(0, H + 2);
        for (let x = 0; x <= W; x++) ctx.lineTo(x, ys[x]);
        ctx.lineTo(W, H + 2);
        ctx.closePath();
      };

      // 1. paper body (solid all the way to the bottom row)
      body();
      ctx.fillStyle = fill;
      ctx.fill();

      // 2. fibrous rim, drawn inside the paper along the tear
      ctx.save();
      body();
      ctx.clip();
      ctx.beginPath();
      ctx.moveTo(0, ys[0]);
      for (let x = 1; x <= W; x++) ctx.lineTo(x, ys[x]);
      ctx.lineJoin = "round";
      ctx.strokeStyle = `rgba(${rim},0.55)`;
      ctx.lineWidth = 16;
      ctx.stroke();
      ctx.strokeStyle = `rgba(${rim},0.95)`;
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.restore();

      // 3. loose fibers sticking out above the tear
      ctx.lineWidth = 0.7;
      for (let i = 0; i < W * 3; i++) {
        const x = Math.floor(rnd() * W);
        const y = ys[x];
        const len = 2 + rnd() * 9;
        const dx = (rnd() - 0.5) * 5;
        ctx.strokeStyle = `rgba(${rim},${0.25 + rnd() * 0.5})`;
        ctx.beginPath();
        ctx.moveTo(x, y + 1);
        ctx.lineTo(x + dx, y - len);
        ctx.stroke();
      }

      // ember path rides the tear line
      const p = new Path2D();
      p.moveTo(0, ys[0] - 1);
      for (let x = 1; x <= W; x++) p.lineTo(x, ys[x] - 1);
      path = p;

      if (burn) paintFx(performance.now(), 16);
    };

    build();

    // animation loop: only while on screen, ~30fps
    let raf = 0;
    let last = 0;
    let running = false;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = now - last;
      if (dt < 33) return;
      last = now;
      paintFx(now, Math.min(dt, 100));
    };
    const start = () => {
      if (running || !animate) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) (e.isIntersecting ? start : stop)();
      },
      { rootMargin: "200px 0px 200px 0px" }
    );
    io.observe(canvas);

    let rraf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rraf);
      rraf = requestAnimationFrame(build);
    });
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    return () => {
      stop();
      cancelAnimationFrame(rraf);
      io.disconnect();
      ro.disconnect();
    };
  }, [seed, fill, rim, height, burn]);

  // bottom edge of the canvases sits 2px inside the page below (no hairline seam)
  const pos = {
    bottom: "calc(100% - 2px)",
    height,
    // let the glow and shadow spill upward onto the scene, never down onto the page below
    clipPath: "inset(-90px 0 0 0)",
  } as const;

  return (
    <>
      <canvas
        ref={ref}
        aria-hidden="true"
        data-edge-paper={paper}
        className="pointer-events-none select-none absolute left-0 w-full"
        style={{ ...pos, filter: `drop-shadow(0 -10px 22px ${shadow})`, zIndex: 5 }}
      />
      <canvas
        ref={fxRef}
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-0 w-full"
        style={{ ...pos, zIndex: 6 }}
      />
    </>
  );
}
