import { useEffect, useRef, useState } from "react";
import { motion, MotionValue, useScroll } from "motion/react";
import ProofStage from "./ProofStage";
import { AnimatedTile } from "./MediaSlots";
import { ProjectData } from "../../data/portfolio";
import {
  DashboardMain,
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
    <article className={`relative border-b border-[var(--border-hairline)] last:border-b-0 ${hasSlots ? "" : "pb-[clamp(3rem,6vw,5rem)]"}`}>
      {/* Pinned: the screen holds still while the demo builds with scroll (Shopify's sticky chapters) */}
      <div ref={wrapRef} style={pinned ? { height: "250svh" } : undefined} className="relative">
        <div
          className={
            pinned
              ? "sticky top-0 h-svh flex flex-col justify-center pt-[76px] pb-8"
              : "py-[clamp(5rem,11vw,10rem)]"
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

      {/* DETAIL CARDS: art tile + title + text (Shopify card-grid pattern; tiles hold real images later) */}
      {project.slots && project.slots.length > 0 && (
        <div className="mt-16 pb-[clamp(5rem,11vw,10rem)] grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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
