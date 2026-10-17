import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, MotionValue } from "motion/react";
import { SceneData, SceneLayer, RESUME_LINK } from "../data/portfolio";
import PaperEdge from "./PaperEdge";
import SceneShowcase from "./SceneShowcase";

interface SectionOpenerProps {
  scene: SceneData;
  isHero?: boolean;
  edgeSeed?: number;
  nextPageRef?: React.RefObject<HTMLElement | null>;
  /** 0 to 1 "build-in" progress for the showcase. Defaults to this scene's own entry progress. */
  buildProgress?: MotionValue<number>;
}

/**
 * Architectural Motifs rendered with pure inline SVG line art.
 * Each section has a distinctive classical composition with tall arches and columns.
 */
function ArchitecturalMotif({ type: rawType }: { type?: string }) {
  const strokeColor = "#CBB39C"; // muted warm line art tone
  // Scene data uses these ids; map them to the drawings that exist.
  const aliases: Record<string, string> = {
    "about-rotunda": "about-portico",
    "contact-portico": "contact-rotunda",
  };
  const type = rawType ? aliases[rawType] ?? rawType : rawType;

  switch (type) {
    case "hero-arch":
      return (
        <svg
          viewBox="0 0 1400 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain pointer-events-none select-none opacity-[0.3]"
        >
          {/* Ground Baseline / Stylobate */}
          <line x1="100" y1="820" x2="1300" y2="820" stroke={strokeColor} strokeWidth="1" />
          <line x1="120" y1="832" x2="1280" y2="832" stroke={strokeColor} strokeWidth="0.6" strokeDasharray="4 4" />

          {/* Left Fluted Column Pair */}
          <rect x="240" y="240" width="48" height="580" stroke={strokeColor} strokeWidth="0.8" />
          <line x1="252" y1="240" x2="252" y2="820" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="264" y1="240" x2="264" y2="820" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="276" y1="240" x2="276" y2="820" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" />
          <rect x="232" y="804" width="64" height="16" stroke={strokeColor} strokeWidth="0.8" />
          <rect x="234" y="226" width="60" height="14" stroke={strokeColor} strokeWidth="0.8" />

          {/* Right Fluted Column Pair */}
          <rect x="1112" y="240" width="48" height="580" stroke={strokeColor} strokeWidth="0.8" />
          <line x1="1124" y1="240" x2="1124" y2="820" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="1136" y1="240" x2="1136" y2="820" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="1148" y1="240" x2="1148" y2="820" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" />
          <rect x="1104" y="804" width="64" height="16" stroke={strokeColor} strokeWidth="0.8" />
          <rect x="1106" y="226" width="60" height="14" stroke={strokeColor} strokeWidth="0.8" />

          {/* Inner Pilasters Supporting Arch */}
          <rect x="390" y="340" width="36" height="480" stroke={strokeColor} strokeWidth="0.8" />
          <rect x="974" y="340" width="36" height="480" stroke={strokeColor} strokeWidth="0.8" />

          {/* Semicircular Classical Triumphal Arch */}
          <path d="M 426 340 A 274 274 0 0 1 974 340" stroke={strokeColor} strokeWidth="1.2" />
          <path d="M 390 340 A 310 310 0 0 1 1010 340" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="6 4" />

          {/* Keystone at Apex */}
          <polygon points="688,30 712,30 718,72 682,72" stroke={strokeColor} strokeWidth="0.8" />

          {/* Architrave / Entablature */}
          <line x1="180" y1="226" x2="1220" y2="226" stroke={strokeColor} strokeWidth="1" />
          <line x1="180" y1="190" x2="1220" y2="190" stroke={strokeColor} strokeWidth="0.8" />
          <line x1="200" y1="160" x2="1200" y2="160" stroke={strokeColor} strokeWidth="0.8" />

          {/* Pediment Guidelines */}
          <line x1="200" y1="160" x2="700" y2="70" stroke={strokeColor} strokeWidth="0.7" strokeDasharray="4 4" />
          <line x1="1200" y1="160" x2="700" y2="70" stroke={strokeColor} strokeWidth="0.7" strokeDasharray="4 4" />
          <circle cx="700" cy="115" r="28" stroke={strokeColor} strokeWidth="0.6" strokeDasharray="3 3" />
        </svg>
      );

    case "work-colonnade":
      return (
        <svg
          viewBox="0 0 1400 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain pointer-events-none select-none opacity-[0.3]"
        >
          <line x1="80" y1="800" x2="1320" y2="800" stroke={strokeColor} strokeWidth="1" />
          <line x1="60" y1="816" x2="1340" y2="816" stroke={strokeColor} strokeWidth="0.6" />
          <line x1="80" y1="220" x2="1320" y2="220" stroke={strokeColor} strokeWidth="1" />
          <line x1="80" y1="190" x2="1320" y2="190" stroke={strokeColor} strokeWidth="0.7" />

          {[160, 390, 620, 850, 1080].map((x, idx) => (
            <g key={idx}>
              <line x1={x} y1="360" x2={x} y2="800" stroke={strokeColor} strokeWidth="0.8" />
              <line x1={x + 160} y1="360" x2={x + 160} y2="800" stroke={strokeColor} strokeWidth="0.8" />
              <line x1={x + 6} y1="360" x2={x + 6} y2="800" stroke={strokeColor} strokeWidth="0.4" strokeDasharray="4 4" />
              <line x1={x + 154} y1="360" x2={x + 154} y2="800" stroke={strokeColor} strokeWidth="0.4" strokeDasharray="4 4" />
              <path d={`M ${x} 360 A 80 80 0 0 1 ${x + 160} 360`} stroke={strokeColor} strokeWidth="1" />
              <path d={`M ${x - 8} 360 A 88 88 0 0 1 ${x + 168} 360`} stroke={strokeColor} strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1={x + 80} y1="272" x2={x + 80} y2="288" stroke={strokeColor} strokeWidth="0.9" />
            </g>
          ))}
        </svg>
      );

    case "content-vault":
      return (
        <svg
          viewBox="0 0 1400 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain pointer-events-none select-none opacity-[0.3]"
        >
          <line x1="120" y1="820" x2="1280" y2="820" stroke={strokeColor} strokeWidth="1" />
          <line x1="140" y1="836" x2="1260" y2="836" stroke={strokeColor} strokeWidth="0.6" />

          {/* Left Arch Bay */}
          <rect x="220" y="320" width="36" height="500" stroke={strokeColor} strokeWidth="0.8" />
          <rect x="620" y="320" width="36" height="500" stroke={strokeColor} strokeWidth="0.8" />
          <path d="M 256 320 A 182 182 0 0 1 620 320" stroke={strokeColor} strokeWidth="1.2" />
          <path d="M 238 320 A 200 200 0 0 1 638 320" stroke={strokeColor} strokeWidth="0.6" strokeDasharray="4 4" />
          <line x1="438" y1="138" x2="438" y2="162" stroke={strokeColor} strokeWidth="1" />

          {/* Right Arch Bay */}
          <rect x="744" y="320" width="36" height="500" stroke={strokeColor} strokeWidth="0.8" />
          <rect x="1144" y="320" width="36" height="500" stroke={strokeColor} strokeWidth="0.8" />
          <path d="M 780 320 A 182 182 0 0 1 1144 320" stroke={strokeColor} strokeWidth="1.2" />
          <path d="M 762 320 A 200 200 0 0 1 1162 320" stroke={strokeColor} strokeWidth="0.6" strokeDasharray="4 4" />
          <line x1="962" y1="138" x2="962" y2="162" stroke={strokeColor} strokeWidth="1" />

          <line x1="140" y1="180" x2="1260" y2="180" stroke={strokeColor} strokeWidth="0.8" />
          <line x1="180" y1="150" x2="1220" y2="150" stroke={strokeColor} strokeWidth="0.6" strokeDasharray="6 6" />
        </svg>
      );

    case "about-portico":
      return (
        <svg
          viewBox="0 0 1400 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain pointer-events-none select-none opacity-[0.3]"
        >
          <line x1="160" y1="810" x2="1240" y2="810" stroke={strokeColor} strokeWidth="1" />
          <line x1="140" y1="824" x2="1260" y2="824" stroke={strokeColor} strokeWidth="0.8" />
          <line x1="120" y1="838" x2="1280" y2="838" stroke={strokeColor} strokeWidth="0.6" />

          {[240, 420, 600, 780, 960, 1140].map((x, idx) => (
            <g key={idx}>
              <rect x={x - 18} y="240" width="36" height="570" stroke={strokeColor} strokeWidth="0.8" />
              <line x1={x - 6} y1="240" x2={x - 6} y2="810" stroke={strokeColor} strokeWidth="0.4" strokeDasharray="4 4" />
              <line x1={x + 6} y1="240" x2={x + 6} y2="810" stroke={strokeColor} strokeWidth="0.4" strokeDasharray="4 4" />
              <rect x={x - 24} y="796" width="48" height="14" stroke={strokeColor} strokeWidth="0.8" />
              <rect x={x - 24} y="228" width="48" height="12" stroke={strokeColor} strokeWidth="0.8" />
            </g>
          ))}

          <rect x="180" y="196" width="1040" height="32" stroke={strokeColor} strokeWidth="0.9" />
          <polygon points="180,196 700,54 1220,196" stroke={strokeColor} strokeWidth="1.2" />
          <polygon points="204,190 700,72 1196,190" stroke={strokeColor} strokeWidth="0.6" strokeDasharray="4 4" />
          <circle cx="700" cy="135" r="24" stroke={strokeColor} strokeWidth="0.7" strokeDasharray="3 3" />
        </svg>
      );

    case "contact-rotunda":
      return (
        <svg
          viewBox="0 0 1400 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain pointer-events-none select-none opacity-[0.3]"
        >
          <ellipse cx="700" cy="810" rx="520" ry="24" stroke={strokeColor} strokeWidth="1" />
          <ellipse cx="700" cy="824" rx="540" ry="26" stroke={strokeColor} strokeWidth="0.6" />

          <path d="M 280 240 A 420 220 0 0 1 1120 240" stroke={strokeColor} strokeWidth="1.2" />
          <path d="M 320 240 A 380 200 0 0 1 1080 240" stroke={strokeColor} strokeWidth="0.6" strokeDasharray="4 4" />
          <line x1="700" y1="20" x2="700" y2="44" stroke={strokeColor} strokeWidth="1.2" />

          {[300, 460, 620, 780, 940, 1100].map((x, idx) => (
            <g key={idx}>
              <line x1={x} y1="240" x2={x} y2="810" stroke={strokeColor} strokeWidth="0.8" />
              <line x1={x + 6} y1="240" x2={x + 6} y2="810" stroke={strokeColor} strokeWidth="0.4" strokeDasharray="4 4" />
              <line x1={x - 6} y1="240" x2={x - 6} y2="810" stroke={strokeColor} strokeWidth="0.4" strokeDasharray="4 4" />
            </g>
          ))}

          <g>
            <line x1="620" y1="440" x2="620" y2="810" stroke={strokeColor} strokeWidth="0.9" />
            <line x1="780" y1="440" x2="780" y2="810" stroke={strokeColor} strokeWidth="0.9" />
            <path d="M 620 440 A 80 80 0 0 1 780 440" stroke={strokeColor} strokeWidth="1" />
            <line x1="700" y1="360" x2="700" y2="810" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="4 4" />
          </g>

          <rect x="220" y="210" width="960" height="36" stroke={strokeColor} strokeWidth="0.9" />
          <polygon points="220,210 700,70 1180,210" stroke={strokeColor} strokeWidth="1.2" />
          <polygon points="244,204 700,88 1156,204" stroke={strokeColor} strokeWidth="0.6" strokeDasharray="4 4" />
        </svg>
      );

    default:
      return null;
  }
}

function LayerElement({
  layer,
  layerY,
  prefersReducedMotion,
  zIndex,
}: {
  layer: SceneLayer;
  layerY: MotionValue<string>;
  prefersReducedMotion: boolean;
  zIndex: number;
}) {
  const style: React.CSSProperties = {
    opacity: layer.opacity,
    mixBlendMode:
      (layer.blendMode as React.CSSProperties["mixBlendMode"]) || "normal",
    transform:
      layer.scale && layer.scale !== 1 ? `scale(${layer.scale})` : undefined,
    zIndex,
  };

  return (
    <motion.div
      style={prefersReducedMotion ? style : { ...style, y: layerY }}
      className="absolute inset-0 w-full h-full pointer-events-none will-change-transform flex items-center justify-center"
    >
      {/* 1. Soft Warm Radial Glow */}
      {layer.motifId === "radial-glow" && (
        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(107,45,45,0.22)_0%,_rgba(138,123,106,0.14)_45%,_transparent_75%)]" />
      )}

      {/* 2. Film Grain Noise Overlay & Gentle Vignette */}
      {layer.motifId === "vignette-grain" && (
        <>
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.038] pointer-events-none mix-blend-overlay"
            xmlns="http://www.w3.org/2000/svg"
          >
            <filter id="film-grain-filter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.8"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#film-grain-filter)" />
          </svg>
          <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(10,8,7,0.72)_100%)] pointer-events-none" />
        </>
      )}

      {/* 3. Inline SVG Architectural Line Art Motif */}
      {layer.motifId &&
        layer.motifId !== "radial-glow" &&
        layer.motifId !== "vignette-grain" && (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center p-4">
            <ArchitecturalMotif type={layer.motifId} />
          </div>
        )}
    </motion.div>
  );
}

export default function SectionOpener({
  scene,
  isHero = false,
  edgeSeed,
  nextPageRef,
  buildProgress,
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

  // Entry scroll progress when this scene enters as Page B from "start end" to "start start"
  const { scrollYProgress: entryP } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });

  // Exit scroll progress: p of Page B rising over this scene (Page A)
  // from "B's top at the bottom of the viewport" (p=0) to "B's top at the top of the viewport" (p=1)
  const defaultP = useMotionValue(0);
  const { scrollYProgress: hookExitP } = useScroll(
    nextPageRef
      ? { target: nextPageRef, offset: ["start end", "start start"] }
      : { target: containerRef, offset: ["start start", "end start"] }
  );
  const p = nextPageRef ? hookExitP : defaultP;

  // While p goes 0 to 1:
  // - A's background layer translateY: 0 to -6vh
  const bgY = useTransform(p, [0, 1], ["0vh", "-10vh"]);
  // - A's midground layer: 0 to -14vh
  const midY = useTransform(p, [0, 1], ["0vh", "-24vh"]);
  // - A's foreground layer: 0 to -30vh
  const fgY = useTransform(p, [0, 1], ["0vh", "-30vh"]);
  // - A dims: a black overlay from 0 to 0.45 opacity
  const dimOpacity = useTransform(p, [0, 1], [0, 0.45]);

  // - A's heading and tagline: 0 to -22vh, scale 1 to 0.94, opacity 1 to 0.35
  // - B's own heading and tagline rise from +10vh to 0 as B comes in
  const headingY = useTransform(() => {
    const exitVal = p.get();
    if (exitVal > 0) {
      return `${-22 * exitVal}vh`;
    }
    if (!isHero) {
      const entryVal = entryP.get();
      return `${10 * (1 - entryVal)}vh`;
    }
    return "0vh";
  });

  const headingScale = useTransform(p, [0, 1], [1, 0.94]);
  const headingOpacity = useTransform(p, [0, 1], [1, 0.35]);

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
        data-nav-theme={scene.theme}
        className={`relative w-full h-[100svh] min-h-[100svh] max-h-[100svh] flex flex-col justify-between items-center text-center px-6 md:px-12 lg:px-20 py-8 md:py-12 overflow-hidden select-none z-10 ${
          isDark ? "bg-[#161310]" : "bg-[var(--bg-cream)]"
        }`}
      >
        {/* Parallax Layers: Background (0 to -6vh), Midground (0 to -14vh), Foreground (0 to -30vh) */}
        {scene.layers.map((layer, index) => {
          const layerY = index === 0 ? bgY : index === 1 ? midY : fgY;
          return (
            <LayerElement
              key={index}
              layer={layer}
              layerY={layerY}
              prefersReducedMotion={prefersReducedMotion}
              zIndex={index * 10}
            />
          );
        })}

        {/* A dims: black overlay from 0 to 0.45 opacity */}
        <motion.div
          style={prefersReducedMotion ? undefined : { opacity: dimOpacity }}
          className="absolute inset-0 bg-black pointer-events-none z-20 will-change-transform"
          aria-hidden="true"
        />

        {/* Top Editorial Kicker */}
        <motion.div
          style={prefersReducedMotion ? undefined : { opacity: headingOpacity }}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full flex items-center justify-between text-xs pt-12 md:pt-4 max-w-6xl relative z-30 ${
            isDark ? "text-[#C0B4A4]" : "text-[var(--taupe-subtle)]"
          }`}
        >
          <span className="font-editorial-sans tracking-widest uppercase text-[11px]">
            {scene.kicker}
          </span>
          <span className="font-editorial-sans tracking-widest uppercase text-[11px]">
            {scene.subtitle}
          </span>
        </motion.div>

        {/* Centerpiece: Heading & Tagline (0 to -22vh, scale 1 to 0.94, opacity 1 to 0.35) */}
        <motion.div
          style={
            prefersReducedMotion
              ? undefined
              : {
                  y: headingY,
                  scale: headingScale,
                  opacity: headingOpacity,
                }
          }
          className="w-full flex flex-col items-center select-none will-change-transform z-30"
        >
          <h1
            className={`font-editorial-serif text-[clamp(4.2rem,12vw,10.5rem)] font-normal tracking-[-0.035em] leading-[0.88] mb-6 text-balance ${
              isDark ? "text-[#F4EFE6]" : "text-[var(--text-ink)]"
            }`}
          >
            {scene.heading}
          </h1>

          <p
            style={
              {
                "--swash-color": isDark ? "#E88080" : "#6B2D2D",
              } as React.CSSProperties
            }
            className={`font-editorial-serif italic text-[clamp(1.4rem,2.4vw,2.4rem)] swash-grand max-w-2xl text-balance leading-relaxed ${
              isDark ? "text-[#D5C9B8]" : "text-[var(--taupe-subtle)]"
            }`}
          >
            {scene.tagline}
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 flex items-center gap-3"
          >
            <span
              className={`text-xs tracking-widest uppercase px-3 py-1.5 rounded-none border ${
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
          style={prefersReducedMotion ? undefined : { opacity: headingOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col items-center text-center pb-4 relative z-30"
        >
          <button
            onClick={scrollToWork}
            className={`group flex flex-col items-center gap-2 transition-colors focus:outline-none ${
              isDark
                ? "text-[#C0B4A4] hover:text-[#F4EFE6]"
                : "text-[var(--taupe-subtle)] hover:text-[var(--text-ink)]"
            }`}
          >
            <span className="text-[10px] uppercase tracking-widest">
              Scroll to begin · Roman I through IV
            </span>
            <div
              className={`w-[1px] h-6 transition-all duration-300 group-hover:h-9 ${
                isDark ? "bg-[#E88080]" : "bg-[var(--accent-oxblood)]"
              }`}
            />
          </button>
        </motion.div>
      </div>
    );
  }

  // Standard Sections (I. Work, II. Content, III. About, IV. Contact)
  return (
    <div
      id={`${scene.id}-opener`}
      ref={containerRef}
      data-nav-theme={scene.theme}
      className={`relative w-full h-[100svh] min-h-[100svh] max-h-[100svh] flex flex-col justify-between items-center text-center px-6 md:pl-[170px] lg:pl-[190px] xl:pl-[210px] md:pr-10 lg:pr-14 py-8 md:py-12 select-none z-10 ${
        isDark ? "bg-[#161310]" : "bg-[var(--bg-cream)]"
      }`}
    >
      {/* Dark torn edge ABOVE this scene: it rises over the previous cream page */}
      {edgeSeed && (
        <PaperEdge
          seed={edgeSeed}
          fill="#161310"
          rim="232,221,207"
          shadow="rgba(0,0,0,0.16)"
        />
      )}

      {/* Parallax Layers & Numeral */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none select-none"
        style={
          edgeSeed
            ? {
                // fade the scene art in under the torn edge so no seam shows
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0, #000 240px)",
                maskImage: "linear-gradient(to bottom, transparent 0, #000 240px)",
              }
            : undefined
        }
      >
        {scene.layers.map((layer, index) => {
          const layerY = index === 0 ? bgY : index === 1 ? midY : fgY;
          return (
            <LayerElement
              key={index}
              layer={layer}
              layerY={layerY}
              prefersReducedMotion={prefersReducedMotion}
              zIndex={index * 10}
            />
          );
        })}

        {/* Huge, Low-Contrast Numeral Anchored to Lower Left Behind Everything */}
        {scene.numeral && (
          <span
            aria-hidden="true"
            className="absolute -bottom-[4vw] -left-[2vw] font-editorial-serif font-bold text-[40vw] leading-[0.72] pointer-events-none select-none z-10 text-[#F4EFE6] opacity-[0.055]"
          >
            {scene.numeral}
          </span>
        )}
      </div>

      {/* A dims: black overlay from 0 to 0.45 opacity */}
      <motion.div
        style={prefersReducedMotion ? undefined : { opacity: dimOpacity }}
        className="absolute inset-0 bg-black pointer-events-none z-20 will-change-transform"
        aria-hidden="true"
      />

      {/* Showcase: windows that build in and drift at different depths */}
      <SceneShowcase
        kind={scene.id}
        build={buildProgress ?? entryP}
        exit={p}
        reduced={prefersReducedMotion}
      />

      {/* Top spacer */}
      <div className="w-full pt-8 md:pt-4 max-w-5xl relative z-30" />

      {/* Main Center Content:
          - B's own heading and tagline rise from +10vh to 0 as B comes in
          - As next page rises over this scene, translates 0 to -22vh, scale 1 to 0.94, opacity 1 to 0.35 */}
      <motion.div
        style={
          prefersReducedMotion
            ? undefined
            : {
                y: headingY,
                scale: headingScale,
                opacity: headingOpacity,
              }
        }
        className="my-auto md:-translate-y-[10vh] w-full max-w-7xl flex flex-col items-center relative z-30 will-change-transform"
      >
        {/* Roman Numeral Kicker */}
        {scene.numeral && (
          <div className="flex items-center gap-3 mb-4">
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
          </div>
        )}

        {/* Section Heading: Largest & Widest element in scene, clamp(8rem, 20vw, 22rem) */}
        <h2
          className={`font-editorial-serif text-[clamp(8rem,20vw,22rem)] font-normal tracking-[-0.035em] leading-[0.82] select-none text-center mb-4 drop-shadow-xs ${
            isDark ? "text-[#F4EFE6]" : "text-[var(--text-ink)]"
          }`}
        >
          {scene.heading}
        </h2>

        {/* Serif Italic Tagline: Capped at about 70% of heading width */}
        <p
          style={
            {
              "--swash-color": isDark ? "#E88080" : "#6B2D2D",
              textShadow: "0 2px 28px rgba(0,0,0,0.75)",
            } as React.CSSProperties
          }
          className={`font-editorial-serif italic text-[clamp(1.35rem,2.2vw,2.25rem)] swash-grand max-w-[70vw] lg:max-w-[70%] w-fit mx-auto leading-relaxed text-balance ${
            isDark ? "text-[#D5C9B8]" : "text-[var(--taupe-subtle)]"
          }`}
        >
          {scene.tagline}
        </p>
      </motion.div>

      {/* Bottom Downward Indicator */}
      <motion.div
        style={prefersReducedMotion ? undefined : { opacity: headingOpacity }}
        className={`hidden w-full flex-col items-center text-center pb-6 md:pb-8 relative z-30 ${
          isDark ? "text-[#C0B4A4]" : "text-[var(--taupe-subtle)]"
        }`}
      >
        <span className="text-[10px] tracking-widest uppercase">
          Scroll to explore {scene.heading}
        </span>
        <div
          className={`w-[1px] h-6 mt-2 ${
            isDark ? "bg-[#E88080]" : "bg-[var(--accent-oxblood)]"
          }`}
        />
      </motion.div>
    </div>
  );
}
