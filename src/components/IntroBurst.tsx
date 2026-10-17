import { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import SectionOpener from "./SectionOpener";
import { SceneData } from "../data/portfolio";

/** How many viewport heights of scroll the pinned intro lasts. */
export const INTRO_VH = 2.5;

/** The "big bang" origin, in % of the viewport (where the figures' fingers would meet). */
const OX = 50;
const OY = 46;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
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

/** One background-image string with ~220 pin-prick stars. Cheap: a single element. */
function makeStars(count: number) {
  const rnd = mulberry32(77);
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = (rnd() * 100).toFixed(2);
    const y = (rnd() * 100).toFixed(2);
    const r = (0.6 + rnd() * 1.6).toFixed(2);
    const a = (0.35 + rnd() * 0.65).toFixed(2);
    parts.push(
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,246,232,${a}) 0, rgba(255,246,232,${a}) ${r}px, transparent ${(+r + 1.2).toFixed(2)}px)`
    );
  }
  // soft dust clouds
  parts.push(
    "radial-gradient(ellipse at 28% 62%, rgba(120,90,70,0.22) 0, transparent 38%)",
    "radial-gradient(ellipse at 66% 30%, rgba(90,80,110,0.18) 0, transparent 42%)"
  );
  return parts.join(",");
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
  const stars = useMemo(() => makeStars(220), []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onMq = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onMq);
    const onResize = () => setRingSize(maxRadius() * 2);
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      mq.removeEventListener("change", onMq);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const { scrollY } = useScroll();
  const p = useTransform(scrollY, (y) =>
    clamp01(y / ((typeof window !== "undefined" ? window.innerHeight : 900) * INTRO_VH))
  );

  // Radius of the expanding circle, in px
  const radius = useTransform(p, (v) => easeInOut(seg(v, 0.24, 0.86)) * maxRadius());

  // HERO
  const heroTransform = useTransform(p, (v) => {
    const s = 1 + 0.1 * seg(v, 0, 0.3) + 1.1 * Math.pow(seg(v, 0.3, 1), 2);
    return `scale(${s})`;
  });
  const heroOpacity = useTransform(p, (v) => 1 - seg(v, 0.3, 0.8));
  const heroFilter = useTransform(p, (v) => {
    const bright = 1 + 0.55 * seg(v, 0.05, 0.3) - 0.85 * seg(v, 0.3, 0.8);
    const blur = 7 * seg(v, 0.3, 0.9);
    return `brightness(${bright.toFixed(3)}) blur(${blur.toFixed(2)}px)`;
  });
  const heroVisibility = useTransform(p, (v) => (v >= 1 ? "hidden" : "visible"));

  // FLASH at the burst point
  const flashOpacity = useTransform(p, (v) => seg(v, 0.03, 0.2) * (1 - seg(v, 0.24, 0.4)));
  const flashTransform = useTransform(p, (v) => {
    const s = 0.25 + 1.6 * easeOut(seg(v, 0.03, 0.24)) + 5 * seg(v, 0.24, 0.4);
    return `translate(-50%, -50%) scale(${s.toFixed(3)})`;
  });

  // WORK scene revealed through the circle
  const clipPath = useTransform(radius, (r) =>
    r >= maxRadius() - 1 ? "none" : `circle(${r.toFixed(1)}px at ${OX}% ${OY}%)`
  );
  const workTransform = useTransform(p, (v) => {
    const s = 1.55 - 0.55 * easeOut(seg(v, 0.24, 1));
    return `scale(${s.toFixed(4)})`;
  });
  const starOpacity = useTransform(p, (v) => 1 - seg(v, 0.55, 0.96));

  // Glowing rim that rides the circle edge: fixed-size ring, scaled to match the radius
  const ringTransform = useTransform(radius, (r) => {
    const s = r / (maxRadius() || 1);
    return `translate(-50%, -50%) scale(${s.toFixed(4)})`;
  });
  const ringOpacity = useTransform(p, (v) => seg(v, 0.24, 0.3) * (1 - seg(v, 0.8, 0.95)));

  // Reduced motion: plain crossfade, nothing zooms or expands
  const rmWorkOpacity = useTransform(p, (v) => seg(v, 0.3, 0.7));
  const rmHeroOpacity = useTransform(p, (v) => 1 - seg(v, 0.3, 0.7));

  const origin = `${OX}% ${OY}%`;

  return (
    <div className="sticky top-0 w-full h-[100svh] z-10 overflow-hidden bg-[#161310]">
      {/* HERO (underneath) */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={
          reduced
            ? { opacity: rmHeroOpacity }
            : {
                transform: heroTransform,
                transformOrigin: origin,
                opacity: heroOpacity,
                filter: heroFilter,
                visibility: heroVisibility,
              }
        }
      >
        <SectionOpener scene={{ ...heroScene, id: "hero-scene" }} isHero />
      </motion.div>

      {/* WORK scene, revealed by the expanding circle */}
      <motion.div
        className="absolute inset-0"
        style={reduced ? { opacity: rmWorkOpacity } : { clipPath, WebkitClipPath: clipPath }}
      >
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={reduced ? undefined : { transform: workTransform, transformOrigin: origin }}
        >
          <SectionOpener scene={workScene} nextPageRef={nextPageRef} />
        </motion.div>

        {/* starfield + darkness that burns off as the scene settles */}
        {!reduced && (
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: starOpacity,
              backgroundColor: "#07060a",
              backgroundImage: stars,
              zIndex: 60,
            }}
          />
        )}
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
          {/* flash at the burst point */}
          <motion.div
            aria-hidden="true"
            className="absolute pointer-events-none will-change-transform"
            style={{
              left: `${OX}%`,
              top: `${OY}%`,
              width: 160,
              height: 160,
              borderRadius: "50%",
              opacity: flashOpacity,
              transform: flashTransform,
              background:
                "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,240,220,0.85) 22%, rgba(255,220,190,0.25) 55%, transparent 72%)",
              zIndex: 80,
            }}
          />
        </>
      )}
    </div>
  );
}
