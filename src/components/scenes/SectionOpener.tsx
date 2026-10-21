import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, MotionValue } from "motion/react";
import { SceneData, SceneLayer, RESUME_LINK } from "../../data/portfolio";
import PaperEdge from "../layout/PaperEdge";
import SceneShowcase from "./SceneShowcase";
import ArchitecturalMotif from "./ArchitecturalMotif";
import { filmGrain } from "../../lib/noise";
import { scrollToId } from "../../lib/scroll";
import { useReducedMotion } from "../../lib/useReducedMotion";
import { seg, smooth } from "../../lib/math";
import { EASE } from "../../lib/motion";
import { SuckCtx, SuckText, SuckUnit } from "../intro/SuckText";

const SCENE_TINT: Record<string, string> = {
  work: "#2f4f7a",
  content: "#8a3040",
  about: "#3f6a52",
  contact: "#5a4390",
};

interface SectionOpenerProps {
  scene: SceneData;
  isHero?: boolean;
  edgeSeed?: number;
  nextPageRef?: React.RefObject<HTMLElement | null>;
  /** 0 to 1 "build-in" progress for the showcase. Defaults to this scene's own entry progress. */
  buildProgress?: MotionValue<number>;
  /** Hero only: pieces of text fall into the black hole as this progress advances */
  suck?: SuckCtx;
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
          <div
            className="absolute inset-0 w-full h-full opacity-[0.038] pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: `url(${filmGrain()})` }}
          />
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
  suck,
}: SectionOpenerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

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

  // Hero backdrop: the whole painted background winds up and shrinks toward the hole
  const suckP = suck?.p ?? defaultP;
  const bgSwirl = useTransform(suckP, (v) => {
    const k = Math.pow(seg(v, 0.1, 0.62), 2.2);
    return `rotate(${(-70 * k).toFixed(2)}deg) scale(${(1 - 0.6 * k).toFixed(4)})`;
  });
  const bgFade = useTransform(suckP, (v) => {
    return 1 - 0.88 * smooth(seg(v, 0.12, 0.5));
  });
  const S = suck && !prefersReducedMotion ? suck : null;

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
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={S ? { transform: bgSwirl, opacity: bgFade, transformOrigin: `${S.ox}% ${S.oy}%` } : undefined}
        >
          {scene.layers.map((layer, index) => {
            if (layer.motifId === "vignette-grain") return null;
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
        </motion.div>

        {/* Film grain + vignette stay out of the swirl: an SVG filter inside a rotating, shrinking
            layer gets rasterised as a hard rectangle (the "box" behind the hole) */}
        {scene.layers.map((layer, index) =>
          layer.motifId === "vignette-grain" ? (
            <LayerElement
              key={`g${index}`}
              layer={layer}
              layerY={fgY}
              prefersReducedMotion={prefersReducedMotion}
              zIndex={index * 10}
            />
          ) : null
        )}

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
          transition={{ duration: 0.8, ease: EASE }}
          className={`w-full flex items-center justify-between text-xs pt-12 md:pt-4 max-w-6xl relative z-30 ${
            isDark ? "text-[#C0B4A4]" : "text-[var(--taupe-subtle)]"
          }`}
        >
          {/* Sections already show their name as the big heading, so only the hero keeps a kicker */}
          <span className="font-editorial-sans tracking-widest uppercase text-[11px]">
            {scene.numeral ? null : S ? <SuckText ctx={S} text={scene.kicker ?? ""} seed={1} /> : scene.kicker}
          </span>
          <span className="font-editorial-sans tracking-widest uppercase text-[11px]">
            {S ? <SuckText ctx={S} text={scene.subtitle ?? ""} seed={50} /> : scene.subtitle}
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
            aria-label={scene.heading}
            className={`font-editorial-serif text-[clamp(4.2rem,12vw,10.5rem)] font-normal tracking-[-0.035em] leading-[0.88] mb-6 text-balance ${
              isDark ? "text-[#F4EFE6]" : "text-[var(--text-ink)]"
            }`}
          >
            {S ? <SuckText ctx={S} text={scene.heading} by="letter" seed={100} /> : scene.heading}
          </h1>

          <p
            style={
              {
                "--swash-color": isDark ? "#E88080" : "#6B2D2D",
              } as React.CSSProperties
            }
            aria-label={scene.tagline}
            className={`font-editorial-serif italic text-[clamp(1.4rem,2.4vw,2.4rem)] ${S ? "" : "swash-grand"} max-w-2xl text-balance leading-relaxed ${
              isDark ? "text-[#D5C9B8]" : "text-[var(--taupe-subtle)]"
            }`}
          >
            {S ? <SuckText ctx={S} text={scene.tagline} swash seed={200} /> : scene.tagline}
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 flex items-center gap-3"
          >
            {(() => {
              const chip = (
                <a
                  href={RESUME_LINK.url}
                  target="_blank"
                  rel="noopener"
                  className={`inline-block text-xs tracking-widest uppercase px-3 py-1.5 rounded-none border transition-colors ${
                    isDark
                      ? "border-white/20 text-[#A89A8A] hover:text-[#F4EFE6] hover:border-white/40"
                      : "border-[var(--border-hairline)] text-[var(--taupe-subtle)] hover:text-[var(--text-ink)]"
                  }`}
                >
                  {RESUME_LINK.label} ↗
                </a>
              );
              return S ? (
                <SuckUnit ctx={S} seed={300}>
                  {chip}
                </SuckUnit>
              ) : (
                chip
              );
            })()}
          </motion.div>
        </motion.div>

        {/* Bottom Scroll Prompt */}
        <motion.div
          style={prefersReducedMotion ? undefined : { opacity: headingOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          className="w-full flex flex-col items-center text-center pb-4 relative z-30"
        >
          <button
            onClick={() => scrollToId("work")}
            className={`group flex flex-col items-center gap-2 transition-colors focus:outline-none ${
              isDark
                ? "text-[#C0B4A4] hover:text-[#F4EFE6]"
                : "text-[var(--taupe-subtle)] hover:text-[var(--text-ink)]"
            }`}
          >
            <span className="text-[10px] uppercase tracking-widest">
              {S ? (
                <SuckText ctx={S} text="Scroll to begin · Roman I through IV" seed={400} />
              ) : (
                "Scroll to begin · Roman I through IV"
              )}
            </span>
            {(() => {
              const line = (
                <div
                  className={`w-[1px] h-6 transition-all duration-300 group-hover:h-9 ${
                    isDark ? "bg-[#E88080]" : "bg-[var(--accent-oxblood)]"
                  }`}
                />
              );
              return S ? (
                <SuckUnit ctx={S} seed={500}>
                  {line}
                </SuckUnit>
              ) : (
                line
              );
            })()}
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
          paper="dark"
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

        {/* Colour world: each chapter gets its own glow until real artwork arrives */}
        {SCENE_TINT[scene.id] && (
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              zIndex: 5,
              background: `radial-gradient(ellipse 75% 60% at 50% 66%, ${SCENE_TINT[scene.id]}80 0%, transparent 72%), linear-gradient(to bottom, ${SCENE_TINT[scene.id]}2e 0%, transparent 45%)`,
              mixBlendMode: "screen",
            }}
          />
        )}

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
        className="my-auto md:-translate-y-[14vh] w-full max-w-7xl flex flex-col items-center relative z-30 will-change-transform"
      >
        {/* Section Heading: Largest & Widest element in scene, clamp(8rem, 20vw, 22rem) */}
        <h2
          className={`font-display text-[clamp(5.5rem,15vw,17rem)] font-semibold tracking-[-0.055em] leading-[0.9] select-none text-center mb-4 drop-shadow-xs ${
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

    </div>
  );
}
