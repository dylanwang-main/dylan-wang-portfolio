/** Small numeric helpers shared by the scroll-driven animations and canvas effects. */

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Where `v` sits between `a` and `b`, clamped to 0..1. The workhorse for scroll timelines. */
export const seg = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Smoothstep on 0..1. */
export const smooth = (t: number) => t * t * (3 - 2 * t);

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Tiny seeded random generator: the same seed always gives the same sequence (stable art on every load). */
export function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
