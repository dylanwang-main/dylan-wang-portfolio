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
