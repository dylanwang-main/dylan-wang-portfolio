import { useEffect, useRef } from "react";
import { clamp01, mix, mulberry32 } from "../../lib/math";
import { prefersReducedMotion } from "../../lib/useReducedMotion";
import { registerPaperEdge } from "../../lib/paperEdges";

/**
 * A living torn-paper edge.
 *
 * The main canvas is transparent ABOVE the ragged line (so the scene behind shows through)
 * and filled with `fill` BELOW it (so it merges into the page directly under the canvas).
 * Nothing about it is frozen:
 *  - the tear line flows like a calm ocean: a few wide travelling swells roll sideways at
 *    at different steady speeds (no fine jitter, no scroll coupling)
 *  - the rim is a band of varying width (not a constant stroke), so it looks fibrous
 *  - pixel flakes lift off the edge and fade as they rise; char / dust specks twinkle
 *    just inside the paper
 *  - a second transparent canvas carries the ember line (two hot fronts travelling along
 *    the tear) and the odd spark
 * It only runs while the edge is on screen, and holds a single still frame for reduced motion.
 */

const EDGE_HEIGHT = 220;
/** Global slow-down for every moving part (1 = the livelier first pass) */
const SLOW = 0.3;
const FLAKE_RISE = 48;
const CHAR_DEPTH = 24;

interface PaperEdgeProps {
  seed: number;
  /** Page color below the tear. Must match the page this edge belongs to. */
  fill: string;
  /** RGB triple for the fibrous rim, e.g. "255,255,255". */
  rim?: string;
  /** Shadow cast onto the page behind (the side ABOVE the tear). */
  shadow?: string;
  height?: number;
  /** Is the paper itself light (cream) or dark? The nav uses this (via lib/paperEdges) for contrast. */
  paper?: "light" | "dark";
  /** Animate the edge and the ember along the tear. */
  burn?: boolean;
}

type Spark = { x: number; y: number; vx: number; vy: number; age: number; life: number; r: number };

const hash = (n: number) => {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
};
/** Smooth 2D value noise, 0..1 */
function vn(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const h = (a: number, b: number) => hash(a * 57 + b * 131 + 17);
  return mix(mix(h(xi, yi), h(xi + 1, yi), u), mix(h(xi, yi + 1), h(xi + 1, yi + 1), u), v);
}

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

/**
 * Calm-ocean swells. Each one is a true travelling wave: its phase advances at a steady
 * speed (px per second, + = rolls to the right), so crests visibly flow sideways along the tear.
 * Wide wavelengths only, constant speed, no scroll coupling: that is what reads as buttery.
 */
const SWELLS = [
  { a: 20, len: 760, v: 46 }, // wide primary swell
  { a: 11, len: 430, v: 72 }, // medium swell, faster, slides across the primary
  { a: 13, len: 1350, v: 18 }, // very wide, slow roll so the overall shape keeps changing
];
/** One travelling wave with slightly rounded crests and flatter troughs, like a real swell. */
const swell = (x: number, t: number, a: number, len: number, v: number, p: number) => {
  const th = ((x - v * t) / len) * Math.PI * 2 + p;
  return a * (Math.sin(th) + 0.18 * Math.sin(2 * th + 1.1));
};

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
  const shRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const fx = fxRef.current;
    const sh = shRef.current;
    if (!canvas || !fx || !sh) return;

    const reduced = prefersReducedMotion();
    const animate = burn && !reduced;

    let W = 0;
    let dpr = 1;
    let ys: number[] = [];
    const H = height;
    const base = H * 0.55;
    const sparks: Spark[] = [];
    const period = 9000 + (seed % 5) * 1300;
    const phase = (seed * 0.6180339) % 1;
    const charRGB = paper === "light" ? "70,42,28" : rim;

    type Fibre = { x: number; len: number; dx: number; ph: number; w: number; bucket: number };
    type Flake = { x: number; d0: number; v: number; ph: number; w: number; sz: number; a: number };
    type Char = { x: number; d: number; ph: number; w: number; sz: number; a: number };
    let ph: number[] = [];
    let fibres: Fibre[] = [];
    let flakes: Flake[] = [];
    let chars: Char[] = [];

    /** The tear line at time t (ms). */
    const compute = (t: number) => {
      const tt = animate ? t / 1000 : 0;
      // the ragged tear detail is carried along by the swell (coarse bits faster, fine bits
      // not at all), so the edge looks like one material rolling, not noise being re-rolled
      const u1 = tt * 26;
      const u2 = tt * 14;
      for (let x = 0; x <= W; x++) {
        let y = base;
        for (let i = 0; i < SWELLS.length; i++) {
          const s = SWELLS[i];
          y += swell(x, tt, s.a, s.len, s.v, ph[i]);
        }
        y +=
          (vn((x - u1) * 0.06 + seed, 3.7) - 0.5) * 10 +
          (vn((x - u2) * 0.22 + seed * 3.1, 9.1) - 0.5) * 4.4 +
          (vn(x * 0.9 + seed * 1.7, 21.3) - 0.5) * 2.2;
        ys[x] = y;
      }
    };

    const paintMain = (t: number) => {
      // Keep this canvas on the CPU rasteriser: it draws thousands of tiny alpha rects per frame,
      // which is the path this effect was tuned on (the GPU path was far slower in testing).
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx || !W) return;
      const T = animate ? (t / 1000) * SLOW : 0;
      const tt = animate ? t / 1000 : 0;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const bodyP = new Path2D();
      const edgeP = new Path2D();
      bodyP.moveTo(0, H + 2);
      edgeP.moveTo(0, ys[0]);
      for (let x = 0; x <= W; x++) {
        bodyP.lineTo(x, ys[x]);
        edgeP.lineTo(x, ys[x]);
      }
      bodyP.lineTo(W, H + 2);
      bodyP.closePath();

      // 1. paper body (solid all the way to the bottom row)
      ctx.fillStyle = fill;
      ctx.fill(bodyP);

      // 2. rim: soft haze, then a band whose width wanders along the tear
      ctx.save();
      ctx.clip(bodyP);
      ctx.lineJoin = "round";
      ctx.strokeStyle = `rgba(${rim},0.5)`;
      ctx.lineWidth = 16;
      ctx.stroke(edgeP);

      const rimP = new Path2D();
      rimP.moveTo(0, ys[0]);
      for (let x = 1; x <= W; x++) rimP.lineTo(x, ys[x]);
      for (let x = W; x >= 0; x--) {
        const w = 3.2 + 6.5 * vn((x - tt * 14) * 0.08 + seed, 5.3) + 2 * vn(x * 0.5 + seed * 2, 8.1);
        rimP.lineTo(x, ys[x] + w);
      }
      rimP.closePath();
      ctx.fillStyle = `rgba(${rim},0.96)`;
      ctx.fill(rimP);

      // 3. char / dust specks just inside the paper, twinkling in and out
      ctx.fillStyle = `rgb(${charRGB})`;
      for (const c of chars) {
        const al = c.a * (1 - c.d / CHAR_DEPTH) * (0.7 + 0.3 * Math.sin(T * c.w + c.ph));
        if (al < 0.03) continue;
        ctx.globalAlpha = al;
        ctx.fillRect(c.x | 0, (ys[c.x | 0] + 5 + c.d) | 0, c.sz, c.sz);
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      // 4. loose fibres sticking out above the tear, swaying
      ctx.lineWidth = 0.7;
      const alphas = [0.3, 0.5, 0.75];
      for (let b = 0; b < 3; b++) {
        ctx.strokeStyle = `rgba(${rim},${alphas[b]})`;
        ctx.beginPath();
        for (const f of fibres) {
          if (f.bucket !== b) continue;
          const y = ys[f.x | 0];
          const len = f.len * (0.55 + 0.45 * Math.sin(T * f.w + f.ph));
          const dx = f.dx * (0.6 + 0.4 * Math.cos(T * f.w * 0.7 + f.ph));
          ctx.moveTo(f.x, y + 1);
          ctx.lineTo(f.x + dx, y - len);
        }
        ctx.stroke();
      }

      // 5. flakes of paper lifting off the tear and fading as they rise (pixel-snapped)
      ctx.fillStyle = `rgb(${rim})`;
      for (const f of flakes) {
        const d = (f.d0 + T * f.v) % FLAKE_RISE;
        const al = f.a * Math.pow(1 - d / FLAKE_RISE, 1.3);
        if (al < 0.03) continue;
        ctx.globalAlpha = al;
        ctx.fillRect(f.x | 0, (ys[f.x | 0] - d - 1) | 0, f.sz, f.sz);
      }
      ctx.globalAlpha = 1;
    };

    const paintFx = (t: number, dt: number) => {
      const ctx = fx.getContext("2d");
      if (!ctx || !W) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const path = new Path2D();
      path.moveTo(0, ys[0] - 1);
      for (let x = 1; x <= W; x++) path.lineTo(x, ys[x] - 1);

      const ts = t * SLOW;
      // two burn fronts at different speeds, so the line never looks looped
      const f1 = ((ts / period + phase) % 1) * W * 1.4 - W * 0.2;
      const f2 = ((ts / (period * 1.7) + phase * 1.7 + 0.35) % 1) * W * 1.4 - W * 0.2;
      const front = (x: number, f: number) =>
        x > f ? Math.exp(-(((x - f) / 55) ** 2)) : Math.exp(-(f - x) / (W * 0.2));

      const grad = ctx.createLinearGradient(0, 0, W, 0);
      const STEP = 16;
      for (let x = 0; x <= W; x += STEP) {
        const flick =
          0.62 +
          0.38 *
            (0.5 + 0.5 * Math.sin(x * 0.07 + ts * 0.007 + seed) * Math.sin(x * 0.023 - ts * 0.0043));
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
        if (sparks.length < 26 && Math.random() < 0.3) {
          const f = Math.random() < 0.7 ? f1 : f2;
          const x = f + (Math.random() - 0.5) * 90;
          if (x > 0 && x < W) {
            sparks.push({
              x,
              y: ys[Math.floor(x)] - 2,
              vx: (Math.random() - 0.5) * 0.03,
              vy: -(0.012 + Math.random() * 0.03),
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

    // The shadow is a tiny silhouette, blurred by CSS, redrawn only every few frames: the edge
    // moves slowly, so nobody can tell, and the GPU isn't re-blurring a huge canvas every frame.
    const SC = 4;
    const paintShadow = () => {
      const ctx = sh.getContext("2d");
      if (!ctx || !W) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, sh.width, sh.height);
      ctx.fillStyle = shadow;
      ctx.beginPath();
      ctx.moveTo(0, sh.height + 1);
      for (let x = 0; x <= W; x += SC) ctx.lineTo(x / SC, (ys[x] - 10) / SC);
      ctx.lineTo(sh.width, sh.height + 1);
      ctx.closePath();
      ctx.fill();
    };

    let frame = 0;
    const draw = (t: number, dt: number) => {
      compute(t);
      paintMain(t);
      if (burn) paintFx(t, dt);
      // the edge now travels ~50px/s, so keep the (tiny, cheap) shadow in step: every 2nd frame
      if (frame++ % 2 === 0) paintShadow();
    };

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, animate ? 1.5 : 2);
      W = Math.ceil(canvas.parentElement?.clientWidth || window.innerWidth);

      for (const c of [canvas, fx]) {
        c.width = W * dpr;
        c.height = H * dpr;
        c.style.width = "100%";
        c.style.height = `${H}px`;
      }
      sh.width = Math.ceil(W / SC);
      sh.height = Math.ceil(H / SC);
      sh.style.width = "100%";
      sh.style.height = `${H}px`;
      frame = 0;

      const rnd = mulberry32(seed);
      ph = SWELLS.map(() => rnd() * 6.2832);
      ys = new Array(W + 1).fill(base);

      fibres = Array.from({ length: Math.round(W * 1.3) }, () => ({
        x: rnd() * W,
        len: 2 + rnd() * 10,
        dx: (rnd() - 0.5) * 5,
        ph: rnd() * 6.28,
        w: 0.25 + rnd() * 0.6,
        bucket: Math.min(2, Math.floor(rnd() * 3)),
      }));
      flakes = Array.from({ length: Math.round(W * 1.7) }, () => ({
        x: rnd() * W,
        d0: rnd() * FLAKE_RISE,
        v: 2.5 + rnd() * 6,
        ph: rnd() * 6.28,
        w: 1 + rnd() * 2.5,
        sz: rnd() < 0.5 ? 1 : rnd() < 0.7 ? 2 : rnd() < 0.9 ? 3 : 4,
        a: 0.55 + rnd() * 0.45,
      }));
      chars = Array.from({ length: Math.round(W * 1.1) }, () => ({
        x: rnd() * W,
        d: rnd() * CHAR_DEPTH,
        ph: rnd() * 6.28,
        w: 0.3 + rnd() * 0.8,
        sz: rnd() < 0.6 ? 1 : rnd() < 0.85 ? 2 : 3,
        a: 0.35 + rnd() * 0.45,
      }));

      draw(performance.now(), 16);
    };

    build();
    const unregister = registerPaperEdge({ el: canvas, paper, line: () => ys });

    // animation loop: only while on screen, ~60fps (motion is slow, so frames stay cheap and silky)
    let raf = 0;
    let last = 0;
    let running = false;
    // ~30fps is plenty for slow motion and keeps the main thread free for smooth scrolling; slower machines drop to ~15fps
    let minDt = 32;
    let avg = 4;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = now - last;
      if (dt < minDt) return;
      last = now;
      const t0 = performance.now();
      draw(now, Math.min(dt, 100));
      avg = avg * 0.9 + (performance.now() - t0) * 0.1;
      (window as unknown as { __edgeMs?: number }).__edgeMs = avg;
      minDt = avg > 12 ? 66 : avg < 8 ? 32 : minDt;
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
      unregister();
      stop();
      cancelAnimationFrame(rraf);
      io.disconnect();
      ro.disconnect();
    };
  }, [seed, fill, rim, height, burn, paper]);

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
        ref={shRef}
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-0 w-full"
        style={{ ...pos, filter: "blur(11px)", zIndex: 4 }}
      />
      <canvas
        ref={ref}
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-0 w-full"
        style={{ ...pos, zIndex: 5 }}
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
