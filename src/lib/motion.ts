import { MotionValue, useMotionValue, useMotionValueEvent } from "motion/react";

/** Shared motion presets, so every reveal on the site moves the same way. */

/** The site's one easing curve (fast out, long gentle settle). */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Fade + rise when an element scrolls into view (once). Spread onto a motion element. */
export function fadeUp({ y = 40, amount = 0.25, duration = 0.9, delay = 0 } = {}) {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount },
    transition: { duration, delay, ease: EASE },
  };
}

/**
 * Latches a 0..1 scroll progress at the furthest point it has reached, so a reveal that has played
 * stays played when the visitor scrolls back up. Use only for entrance-style progress (never for
 * pinned scenes that must run in both directions).
 */
export function useLatched(source: MotionValue<number>) {
  const out = useMotionValue(source.get());
  useMotionValueEvent(source, "change", (v) => {
    if (v > out.get()) out.set(v);
  });
  return out;
}
