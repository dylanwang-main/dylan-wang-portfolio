import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "../../lib/scroll";
import { prefersReducedMotion } from "../../lib/useReducedMotion";

interface LenisProviderProps {
  children: React.ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    // Light smoothing only: wheel distance is never scaled or held back.
    const lenis = new Lenis({
      lerp: 0.12,
      wheelMultiplier: 1,
      syncTouch: false,
      touchMultiplier: 1,
      infinite: false,
    });
    setLenis(lenis);

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
      setLenis(undefined);
    };
  }, []);

  return <>{children}</>;
}
