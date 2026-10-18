/** Smooth-scroll helpers. Lenis is created in LenisProvider and parked on window. */
import type Lenis from "lenis";

export function getLenis(): Lenis | undefined {
  return typeof window === "undefined" ? undefined : (window as unknown as { __lenis?: Lenis }).__lenis;
}

export function setLenis(lenis: Lenis | undefined) {
  const w = window as unknown as { __lenis?: Lenis };
  if (lenis) w.__lenis = lenis;
  else delete w.__lenis;
}

/** Smooth-scroll to an element by id (falls back to native smooth scroll). */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(el);
  else el.scrollIntoView({ behavior: "smooth" });
}

export function scrollToTop() {
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: "smooth" });
}
