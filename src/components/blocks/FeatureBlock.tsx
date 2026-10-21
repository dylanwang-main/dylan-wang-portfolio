import { useEffect, useRef, useState } from "react";
import { motion, MotionValue, useScroll } from "motion/react";
import ProofStage from "./ProofStage";
import HotspotBrowser from "./HotspotBrowser";
import { AnimatedTile } from "./MediaSlots";
import { ProjectData } from "../../data/portfolio";
import {
  DashboardMain,
  ResearchMain,
  WorkMain,
  WorkSide,
  SiteMain,
  ContentMain,
  ContentSide,
} from "../scenes/SceneShowcase";
import { fadeUp } from "../../lib/motion";
import { useReducedMotion } from "../../lib/useReducedMotion";

interface FeatureBlockProps {
  project: ProjectData;
  index: number;
}

type Proof = {
  Main: React.ComponentType<{ build: MotionValue<number> }>;
  Side?: React.ComponentType;
};

/** Which demo window proves each project. Wireframes only: no invented numbers. */
const PROOFS: Record<string, Proof> = {
  "tusd-data-assessment": { Main: DashboardMain },
  "rl-research-proposal": { Main: ResearchMain },
  "ds3-park-smart": { Main: WorkMain },
  "n10-dance-studios": { Main: SiteMain, Side: WorkSide },
  "personal-brand": { Main: ContentMain, Side: ContentSide },
};

/** Pin the demo on tall, wide screens; fall back to normal flow elsewhere. */
function usePinned() {
  const reduced = useReducedMotion();
  const [roomy, setRoomy] = useState(false);
  useEffect(() => {
    const f = () => setRoomy(window.innerWidth >= 1024 && window.innerHeight >= 640);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return roomy && !reduced;
}

export default function FeatureBlock({ project, index }: FeatureBlockProps) {
  const proof = PROOFS[project.id] ?? PROOFS["ds3-park-smart"];
  const { Main, Side } = proof;
  const pinned = usePinned();
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: pinP } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });

  const label = (
    <div className="flex items-center gap-3 text-[12px] uppercase tracking-[0.22em] text-[var(--taupe-subtle)] font-medium">
      <span>0{index + 1}</span>
      <span aria-hidden="true" className="block w-8 h-px bg-[var(--taupe-subtle)]/50" />
      <span>{project.category}</span>
    </div>
  );

  const meta = project.meta ? (
    <p className="mt-3 text-[12px] uppercase tracking-[0.16em] text-[var(--taupe-subtle)]">{project.meta}</p>
  ) : null;
  const hasSlots = !!project.slots && project.slots.length > 0;

  return (
    <article className={`relative border-b border-[var(--border-hairline)] last:border-b-0 ${hasSlots ? "" : "pb-[clamp(2rem,4vw,3.5rem)]"}`}>
      {/* Pinned: the screen holds still while the demo builds with scroll (Shopify's sticky chapters) */}
      <div ref={wrapRef} style={pinned ? { height: "140svh" } : undefined} className="relative">
        <div
          className={
            pinned
              ? "sticky top-0 h-svh flex flex-col justify-center pt-[76px] pb-8"
              : "py-[clamp(3.5rem,7vw,6rem)]"
          }
        >
          <motion.div
            {...fadeUp()}
          >
            {label}
            {pinned ? (
              <div className="mt-4 grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-10 items-end">
                <div>
                  <h3 className="statement-title font-editorial-serif italic text-[clamp(2.6rem,5vw,5.4rem)] leading-[0.98] tracking-[-0.02em] text-[var(--text-ink)] text-balance">
                    {project.title}
                  </h3>
                  {meta}
                </div>
                <p className="text-[clamp(1.1rem,1.5vw,1.5rem)] leading-[1.3] tracking-[-0.01em] text-[var(--text-ink)] pb-2">
                  {project.description}
                </p>
              </div>
            ) : (
              <>
                <h3 className="statement-title font-editorial-serif italic text-[clamp(3.2rem,7.6vw,8rem)] leading-[0.98] tracking-[-0.02em] text-[var(--text-ink)] mt-6 max-w-[14ch] text-balance">
                  {project.title}
                </h3>
                {meta}
                <div className="mt-10 grid grid-cols-1 lg:grid-cols-[200px_minmax(0,680px)] gap-4 lg:gap-14 items-start">
                  <span className="text-[16px] font-semibold text-[var(--text-ink)]">Overview</span>
                  <p className="text-[clamp(1.35rem,2.1vw,2rem)] leading-[1.28] tracking-[-0.01em] text-[var(--text-ink)]">
                    {project.description}
                  </p>
                </div>
              </>
            )}
          </motion.div>

          {pinned ? (
            <ProofStage
              Main={Main}
              Side={Side}
              cards={project.tools}
              progress={pinP}
              heightClass="h-[min(46vh,470px)]"
              className="mt-8"
            />
          ) : (
            <ProofStage Main={Main} Side={Side} cards={project.tools} />
          )}

          {!pinned && (
            <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-[var(--taupe-subtle)]">
              Placeholder preview · {project.imagePlaceholder.label}
            </p>
          )}
        </div>
      </div>

      {pinned && (
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--taupe-subtle)]">
          Placeholder preview · {project.imagePlaceholder.label}
        </p>
      )}

      {/* RESULTS: headline numbers from the resume */}
      {project.stats && project.stats.length > 0 && (
        <motion.dl
          {...fadeUp({ amount: 0.3, duration: 0.8 })}
          className={`mt-10 pt-6 border-t border-[var(--border-hairline)] grid grid-cols-2 gap-x-8 gap-y-6 ${project.stats.length > 3 ? "md:grid-cols-4" : "md:grid-cols-3"}`}
        >
          {project.stats.map((st) => (
            <div key={st.label}>
              <dt className="sr-only">{st.label}</dt>
              <dd className="font-editorial-serif italic text-[clamp(2.4rem,4.4vw,3.8rem)] leading-none tracking-[-0.02em] text-[var(--accent-oxblood)]">
                {st.value}
              </dd>
              <dd aria-hidden="true" className="mt-2 text-[13px] text-[var(--text-ink)]/75">{st.label}</dd>
            </div>
          ))}
        </motion.dl>
      )}
      {project.stats && project.stats.length > 0 && !project.hotspots && !hasSlots && <div className="pb-[clamp(2rem,4vw,3.5rem)]" />}

      {/* WALKTHROUGH: browser with pulsing hotspots (Shopify feature-tour pattern) */}
      {project.hotspots && project.hotspots.length > 0 && (
        <div className={`mt-10 ${hasSlots ? "" : "pb-[clamp(3.5rem,7vw,6rem)]"}`}>
          <HotspotBrowser title={project.title} hotspots={project.hotspots} />
        </div>
      )}

      {/* DETAIL CARDS: art tile + title + text (Shopify card-grid pattern; tiles hold real images later) */}
      {project.slots && project.slots.length > 0 && (
        <div className="mt-10 pb-[clamp(3.5rem,7vw,6rem)] grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {project.slots.map((slot, i) => (
            <motion.div
              key={slot.label}
              {...fadeUp({ amount: 0.3, duration: 0.8, delay: i * 0.1 })}
              className="group"
            >
              <AnimatedTile index={i} aspect="4/3" />
              <span className="block mt-4 text-[15px] font-semibold text-[var(--text-ink)]">
                {slot.label}
              </span>
              <span className="block mt-1.5 font-mono text-[14px] leading-snug italic text-[var(--accent-oxblood)]">
                {slot.prompt}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </article>
  );
}
