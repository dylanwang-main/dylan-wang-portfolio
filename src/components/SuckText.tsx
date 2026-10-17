import { Fragment, useLayoutEffect, useMemo, useRef } from "react";
import { motion, useTransform, MotionValue } from "motion/react";

/**
 * Per-piece gravitational infall for the hero. Every word (or letter) measures where it sits
 * relative to the black hole and then, driven only by scroll progress, spirals in on its own
 * path: nearer pieces are grabbed first, each one swirls a different amount, gets stretched
 * along its direction of travel as the tide tears at it, and shrinks to nothing at the hole.
 */
export interface SuckCtx {
  /** Intro scroll progress, 0 to 1 */
  p: MotionValue<number>;
  /** Black hole position in % of the viewport */
  ox: number;
  oy: number;
}

const TAU = Math.PI * 2;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const smooth = (t: number) => t * t * (3 - 2 * t);

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Intro progress window in which the pieces fall (everything is gone by ~0.64). */
const START = 0.1;
const SPREAD = 0.27;

export function SuckUnit({
  ctx,
  seed,
  children,
}: {
  ctx: SuckCtx;
  seed: number;
  children: React.ReactNode;
}) {
  const outer = useRef<HTMLSpanElement>(null);
  const geo = useRef({ dx: 0, dy: 0, order: 0.5 });
  const [r1, r2] = useMemo(() => {
    const f = mulberry32(seed * 9973 + 7);
    return [f(), f()] as const;
  }, [seed]);
  const { ox, oy } = ctx;

  // Measure the untransformed wrapper (the animated inner span never changes its layout box).
  useLayoutEffect(() => {
    const measure = () => {
      const el = outer.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const px = (ox / 100) * W;
      const py = (oy / 100) * H;
      const dx = r.left + r.width / 2 - px;
      const dy = r.top + r.height / 2 - py;
      const dmax = Math.hypot(Math.max(px, W - px), Math.max(py, H - py));
      geo.current = {
        dx,
        dy,
        order: clamp01(0.75 * Math.min(1, Math.hypot(dx, dy) / dmax) + 0.25 * r1),
      };
    };
    measure();
    const t = window.setTimeout(measure, 1000);
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [ox, oy, r1]);

  const timeline = (v: number) => {
    const start = START + SPREAD * geo.current.order;
    const s = seg(v, start, start + 0.25 + 0.02 * r2);
    return { s, u: Math.pow(s, 1.9) };
  };

  const transform = useTransform(ctx.p, (v) => {
    const { s, u } = timeline(v);
    if (s <= 0) return "none";
    const { dx, dy } = geo.current;
    const r0 = Math.hypot(dx, dy);
    const th0 = Math.atan2(dy, dx);
    // spiral: angle winds up counter-clockwise while the radius collapses
    const swirl = (0.75 + 0.6 * r1) * TAU * Math.pow(u, 0.8);
    const th = th0 - swirl;
    const k = Math.pow(1 - u, 1.5);
    const tx = r0 * k * Math.cos(th) - dx;
    const ty = r0 * k * Math.sin(th) - dy;
    // glyph turns with the swirl, then lines up with its direction of travel (tangent + inflow)
    const frame = (-swirl * 180) / Math.PI;
    const vx = Math.sin(th) - 0.6 * Math.cos(th);
    const vy = -Math.cos(th) - 0.6 * Math.sin(th);
    const vdeg = (Math.atan2(vy, vx) * 180) / Math.PI;
    const vAligned = vdeg + 180 * Math.round((frame - vdeg) / 180);
    const m = smooth(seg(u, 0.2, 0.75));
    const a = frame * (1 - m) + vAligned * m;
    // spaghettification: long and thin along the path, then gone
    const shrink = 1 - Math.pow(seg(u, 0.55, 1), 1.2);
    const sx = (1 + 5 * m * u) * shrink;
    const sy = (1 - 0.6 * m * u) * shrink;
    return `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) rotate(${a.toFixed(1)}deg) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
  });

  const opacity = useTransform(ctx.p, (v) => 1 - seg(timeline(v).u, 0.85, 1));

  return (
    <span ref={outer} aria-hidden="true" className="inline-block">
      <motion.span className="inline-block will-change-transform" style={{ transform, opacity }}>
        {children}
      </motion.span>
    </span>
  );
}

export function SuckText({
  ctx,
  text,
  by = "word",
  seed = 0,
  swash = false,
}: {
  ctx: SuckCtx;
  text: string;
  by?: "word" | "letter";
  seed?: number;
  /** Big italic coloured first letter (replaces ::first-letter, which skips inline-blocks) */
  swash?: boolean;
}) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, wi) => (
        <Fragment key={wi}>
          <span className="inline-block whitespace-nowrap">
            {by === "letter" ? (
              Array.from(w).map((ch, ci) => (
                <SuckUnit key={ci} ctx={ctx} seed={seed + wi * 31 + ci}>
                  {ch}
                </SuckUnit>
              ))
            ) : (
              <SuckUnit ctx={ctx} seed={seed + wi * 31}>
                {swash && wi === 0 ? (
                  <>
                    <span className="swash-letter">{w[0]}</span>
                    {w.slice(1)}
                  </>
                ) : (
                  w
                )}
              </SuckUnit>
            )}
          </span>
          {wi < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
