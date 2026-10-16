import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import { SceneData, SceneLayer, RESUME_LINK } from "../data/portfolio";

interface SectionOpenerProps {
  scene: SceneData;
  isHero?: boolean;
}

function LayerElement({
  layer,
  scrollYProgress,
  prefersReducedMotion,
  zIndex,
}: {
  layer: SceneLayer;
  scrollYProgress: MotionValue<number>;
  prefersReducedMotion: boolean;
  zIndex: number;
}) {
  const [isDebug, setIsDebug] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDebug(new URLSearchParams(window.location.search).has("debug"));
    }
  }, []);

  // Compute smooth parallax translation based on layer.parallaxSpeed
  const travelPx = Math.round(layer.parallaxSpeed * 80);
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${travelPx}px`, `${travelPx}px`]
  );

  const style: React.CSSProperties = {
    opacity: layer.opacity,
    mixBlendMode:
      (layer.blendMode as React.CSSProperties["mixBlendMode"]) || "normal",
    zIndex,
  };

  return (
    <motion.div
      style={prefersReducedMotion ? style : { ...style, y }}
      className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
    >
      {layer.imagePath ? (
        <img
          src={layer.imagePath}
          alt={layer.label || "Scene layer"}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div
          className={`w-full h-full ${layer.gradientFallback} relative overflow-hidden`}
        >
          {isDebug && layer.label && (
            <div className="absolute bottom-3 right-4 pointer-events-none select-none opacity-40">
              <span className="text-[9px] uppercase tracking-widest font-mono text-[var(--taupe-subtle)]">
                {layer.label}
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function SectionOpener({
  scene,
  isHero = false,
}: SectionOpenerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Scroll progress through this section (start end to end start for natural flow, no pinning)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: isHero ? ["start start", "end start"] : ["start end", "end start"],
  });

  // Hero exit transforms: gentle scale, translation, and fade as page scrolls naturally
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.4, 0]);
  const heroContentY = useTransform(scrollYProgress, [0, 1], ["0px", "-50px"]);

  // Standard Opener scroll-linked motion (as it enters from bottom and exits through top)
  const yHeading = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["50px", "0px", "-50px"]
  );
  const scaleHeading = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.97, 1, 0.97]
  );
  const opacityHeading = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.4, 1, 1, 0.3]
  );

  const yTagline = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["65px", "0px", "-30px"]
  );
  const opacityTagline = useTransform(
    scrollYProgress,
    [0, 0.25, 0.8, 1],
    [0.3, 1, 1, 0.3]
  );

  const yWatermark = useTransform(scrollYProgress, [0, 1], ["30px", "-30px"]);

  const scrollToWork = () => {
    const el = document.getElementById("work");
    if (el) {
      const lenis = (
        window as unknown as {
          __lenis?: { scrollTo: (target: HTMLElement | string) => void };
        }
      ).__lenis;
      if (lenis) {
        lenis.scrollTo(el);
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const isDark = scene.theme === "dark";

  if (isHero) {
    return (
      <div
        id={scene.id}
        ref={containerRef}
        data-nav-theme={scene.theme || "dark"}
        className={`relative w-full h-[100svh] min-h-[100svh] max-h-[100svh] flex flex-col justify-between items-center text-center px-6 md:px-12 lg:px-20 py-8 md:py-12 overflow-hidden select-none ${
          isDark ? "bg-[#161310]" : "bg-[var(--bg-cream)]"
        }`}
      >
        {/* Parallax Layers mapped from scene.layers */}
        {scene.layers.map((layer, index) => (
          <LayerElement
            key={index}
            layer={layer}
            scrollYProgress={scrollYProgress}
            prefersReducedMotion={prefersReducedMotion}
            zIndex={index * 10}
          />
        ))}

        {/* Top Editorial Kicker */}
        <motion.div
          style={prefersReducedMotion ? undefined : { opacity: heroOpacity }}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full flex items-center justify-between text-xs pt-12 md:pt-4 max-w-6xl relative z-30 ${
            isDark ? "text-[#A89A8A]" : "text-[var(--taupe-subtle)]"
          }`}
        >
          <span className="font-editorial-sans tracking-widest uppercase text-[11px]">
            {scene.kicker}
          </span>
          <span className="font-editorial-sans tracking-widest uppercase text-[11px]">
            {scene.subtitle}
          </span>
        </motion.div>

        {/* Main Hero Center: Shrinks and fades gently as it leaves, zero hold */}
        <motion.div
          style={
            prefersReducedMotion
              ? undefined
              : {
                  scale: heroScale,
                  opacity: heroOpacity,
                  y: heroContentY,
                }
          }
          className="my-auto max-w-6xl flex flex-col items-center will-change-transform relative z-30"
        >
          {/* Ambient Floating Monogram Seal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 will-change-transform"
          >
            <div
              className={`animate-ambient-float w-14 h-14 md:w-16 md:h-16 rounded-full border flex flex-col items-center justify-center p-2 shadow-xs select-none ${
                isDark
                  ? "border-[#6B2D2D]/70 bg-[#221D18]"
                  : "border-[var(--accent-oxblood)]/40 bg-[var(--bg-cream)]"
              }`}
              title="Dylan Wang Monogram Seal"
            >
              <span
                className={`font-editorial-serif text-lg md:text-xl font-bold italic ${
                  isDark ? "text-[#EFE8DC]" : "text-[var(--accent-oxblood)]"
                }`}
              >
                DW
              </span>
              <span
                className={`text-[7px] uppercase tracking-widest ${
                  isDark ? "text-[#9E9080]" : "text-[var(--taupe-subtle)]"
                }`}
              >
                UCSD
              </span>
            </div>
          </motion.div>

          {/* Hero Name Heading: refined grand scale giving breathing room */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`font-editorial-serif text-[clamp(4.25rem,10.5vw,9.5rem)] font-normal tracking-tight leading-[0.9] mb-4 will-change-transform ${
              isDark ? "text-[#F4EFE6]" : "text-[var(--text-ink)]"
            }`}
          >
            {scene.heading}
          </motion.h1>

          {/* Serif Italic Tagline: refined clamp with swash initial */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={
              {
                "--swash-color": isDark ? "#E88080" : "#6B2D2D",
              } as React.CSSProperties
            }
            className={`font-editorial-serif italic text-[clamp(1.35rem,2.2vw,2.25rem)] swash-grand max-w-3xl leading-relaxed text-balance will-change-transform ${
              isDark ? "text-[#D5C9B8]" : "text-[var(--taupe-subtle)]"
            }`}
          >
            {scene.tagline}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-4 mt-6 will-change-transform"
          >
            <button
              onClick={scrollToWork}
              className={`px-6 py-2.5 text-xs font-medium uppercase tracking-widest transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-oxblood)] ${
                isDark
                  ? "bg-[#F4EFE6] text-[#161310] hover:bg-[#6B2D2D] hover:text-[#F4EFE6]"
                  : "bg-[var(--text-ink)] text-[var(--bg-cream)] hover:bg-[var(--accent-oxblood)]"
              }`}
            >
              Explore Work
            </button>

            <span
              className={`px-5 py-2.5 text-xs font-medium uppercase tracking-widest border cursor-not-allowed ${
                isDark
                  ? "border-white/20 text-[#A89A8A]"
                  : "border-[var(--border-hairline)] text-[var(--taupe-subtle)]"
              }`}
              title="Resume coming soon"
            >
              {RESUME_LINK.label} (coming soon)
            </span>
          </motion.div>
        </motion.div>

        {/* Bottom Scroll Prompt */}
        <motion.div
          style={prefersReducedMotion ? undefined : { opacity: heroOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col items-center text-center pb-4 relative z-30"
        >
          <button
            onClick={scrollToWork}
            className={`group flex flex-col items-center gap-2 transition-colors focus:outline-none ${
              isDark
                ? "text-[#A89A8A] hover:text-[#F4EFE6]"
                : "text-[var(--taupe-subtle)] hover:text-[var(--text-ink)]"
            }`}
          >
            <span className="text-[10px] uppercase tracking-widest">
              Scroll to begin · Roman I through IV
            </span>
            <div
              className={`w-[1px] h-6 transition-all duration-300 group-hover:h-9 ${
                isDark
                  ? "bg-gradient-to-b from-[#E88080] to-transparent"
                  : "bg-gradient-to-b from-[var(--accent-oxblood)] to-transparent"
              }`}
            />
          </button>
        </motion.div>
      </div>
    );
  }

  // Standard Sections (I. Work, II. Content, III. About, IV. Contact)
  // Full-bleed 100vw by 100svh, scrolling naturally at normal speed with scroll-linked transforms, zero hold, zero seam
  return (
    <div
      id={`${scene.id}-opener`}
      ref={containerRef}
      data-nav-theme={scene.theme || "dark"}
      className={`relative w-full h-[100svh] min-h-[100svh] max-h-[100svh] flex flex-col justify-between items-center text-center px-6 md:pl-[170px] lg:pl-[190px] xl:pl-[210px] md:pr-10 lg:pr-14 py-8 md:py-12 overflow-hidden select-none ${
        isDark ? "bg-[#161310]" : "bg-[var(--bg-cream)]"
      }`}
    >
      {/* Parallax Layers mapped from scene.layers */}
      {scene.layers.map((layer, index) => (
        <LayerElement
          key={index}
          layer={layer}
          scrollYProgress={scrollYProgress}
          prefersReducedMotion={prefersReducedMotion}
          zIndex={index * 10}
        />
      ))}

      {/* Editorial Watermark Numeral in Background */}
      {scene.numeral && (
        <motion.span
          style={prefersReducedMotion ? undefined : { y: yWatermark }}
          aria-hidden="true"
          className={`absolute pointer-events-none select-none font-editorial-serif text-[22vw] md:text-[18vw] leading-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-25 will-change-transform ${
            isDark ? "text-white/[0.04]" : "text-[var(--taupe-subtle)]/8"
          }`}
        >
          {scene.numeral}
        </motion.span>
      )}

      {/* Top spacer */}
      <div className="w-full pt-8 md:pt-4 max-w-5xl relative z-30" />

      {/* Main Center Content: Scroll-linked translateY, scale, opacity without pinning */}
      <div className="my-auto max-w-5xl flex flex-col items-center relative z-30">
        {/* Roman Numeral Kicker */}
        {scene.numeral && (
          <motion.div
            style={
              prefersReducedMotion
                ? undefined
                : { y: yHeading, opacity: opacityHeading }
            }
            className="flex items-center gap-3 mb-4 will-change-transform"
          >
            <div
              className={`w-8 h-[1px] ${
                isDark ? "bg-[#E88080]" : "bg-[var(--accent-oxblood)]"
              }`}
            />
            <span
              className={`font-editorial-serif text-sm md:text-base tracking-[0.25em] uppercase font-semibold ${
                isDark ? "text-[#E88080]" : "text-[var(--accent-oxblood)]"
              }`}
            >
              {scene.numeral} · {scene.heading}
            </span>
            <div
              className={`w-8 h-[1px] ${
                isDark ? "bg-[#E88080]" : "bg-[var(--accent-oxblood)]"
              }`}
            />
          </motion.div>
        )}

        {/* Section Heading: refined grand scale giving breathing room */}
        <motion.h2
          style={
            prefersReducedMotion
              ? undefined
              : {
                  y: yHeading,
                  scale: scaleHeading,
                  opacity: opacityHeading,
                }
          }
          className={`font-editorial-serif text-[clamp(4.5rem,11.5vw,10.5rem)] font-normal tracking-[-0.03em] leading-[0.88] mb-4 will-change-transform drop-shadow-xs ${
            isDark ? "text-[#F4EFE6]" : "text-[var(--text-ink)]"
          }`}
        >
          {scene.heading}
        </motion.h2>

        {/* Serif Italic Tagline: refined clamp with swash initial */}
        <motion.p
          style={
            prefersReducedMotion
              ? {
                  "--swash-color": isDark ? "#E88080" : "#6B2D2D",
                } as React.CSSProperties
              : {
                  y: yTagline,
                  opacity: opacityTagline,
                  "--swash-color": isDark ? "#E88080" : "#6B2D2D",
                } as unknown as React.CSSProperties
          }
          className={`font-editorial-serif italic text-[clamp(1.35rem,2.2vw,2.25rem)] swash-grand max-w-3xl leading-relaxed text-balance will-change-transform ${
            isDark ? "text-[#D5C9B8]" : "text-[var(--taupe-subtle)]"
          }`}
        >
          {scene.tagline}
        </motion.p>
      </div>

      {/* Bottom Downward Indicator */}
      <motion.div
        style={prefersReducedMotion ? undefined : { opacity: opacityTagline }}
        className={`w-full flex flex-col items-center text-center pb-6 md:pb-8 relative z-30 ${
          isDark ? "text-[#9E9080]" : "text-[var(--taupe-subtle)]"
        }`}
      >
        <span className="text-[10px] tracking-widest uppercase">
          Scroll to explore {scene.heading}
        </span>
        <div
          className={`w-[1px] h-6 mt-2 ${
            isDark
              ? "bg-gradient-to-b from-[#E88080] to-transparent"
              : "bg-gradient-to-b from-[var(--accent-oxblood)] to-transparent"
          }`}
        />
      </motion.div>
    </div>
  );
}
