import { useEffect } from "react";
import Lenis from "lenis";

interface LenisProviderProps {
  children: React.ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    // Light smoothing only: wheel distance is never scaled or held back.
    const lenis = new Lenis({
      lerp: 0.12,
      wheelMultiplier: 1,
      syncTouch: false,
      touchMultiplier: 1,
      infinite: false,
    });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // NOTE: do not re-dispatch "scroll" events here. Lenis listens to the
    // window scroll event itself, so doing that recurses forever.
    // Framer Motion's useScroll already reads the native scroll position.

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
