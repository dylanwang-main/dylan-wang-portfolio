import { motion, MotionValue } from "motion/react";
import ProofStage from "./ProofStage";
import { ProjectData } from "../data/portfolio";
import {
  WorkMain,
  WorkSide,
  SiteMain,
  ContentMain,
  ContentSide,
} from "./SceneShowcase";

interface FeatureBlockProps {
  project: ProjectData;
  index: number;
  reverse?: boolean;
}

type Proof = {
  Main: React.ComponentType<{ build: MotionValue<number> }>;
  Side?: React.ComponentType;
};

/** Which demo window proves each project. Wireframes only: no invented numbers. */
const PROOFS: Record<string, Proof> = {
  "ds3-park-smart": { Main: WorkMain },
  "n10-dance-studios": { Main: SiteMain, Side: WorkSide },
  "personal-brand": { Main: ContentMain, Side: ContentSide },
};

const TILES = [
  "linear-gradient(135deg,#6B2D2D 0%,#1b1612 100%)",
  "linear-gradient(135deg,#3a2a20 0%,#8a6a5a 100%)",
  "linear-gradient(135deg,#2b3a4a 0%,#161310 100%)",
];

export default function FeatureBlock({ project, index }: FeatureBlockProps) {
  const proof = PROOFS[project.id] ?? PROOFS["ds3-park-smart"];
  const { Main, Side } = proof;

  return (
    <article
      className="relative py-[clamp(5rem,11vw,10rem)] border-b border-[var(--border-hairline)] last:border-b-0"
    >
      {/* STATEMENT: label, giant italic serif title, larger description */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-3 text-[12px] uppercase tracking-[0.22em] text-[var(--taupe-subtle)] font-medium">
          <span>0{index + 1}</span>
          <span aria-hidden="true" className="block w-8 h-px bg-[var(--taupe-subtle)]/50" />
          <span>{project.category}</span>
        </div>

        <h3 className="statement-title font-editorial-serif italic text-[clamp(3.2rem,7.6vw,8rem)] leading-[0.98] tracking-[-0.02em] text-[var(--text-ink)] mt-6 max-w-[14ch] text-balance">
          {project.title}
        </h3>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[200px_minmax(0,680px)] gap-4 lg:gap-14 items-start">
          <span className="text-[16px] font-semibold text-[var(--text-ink)]">Overview</span>
          <p className="text-[clamp(1.35rem,2.1vw,2rem)] leading-[1.28] tracking-[-0.01em] text-[var(--text-ink)]">
            {project.description}
          </p>
        </div>
      </motion.div>

      <ProofStage Main={Main} Side={Side} cards={project.tools} />

      <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-[var(--taupe-subtle)]">
        Placeholder preview · {project.imagePlaceholder.label}
      </p>

      {/* DETAIL CARDS: art tile + title + text (Shopify card-grid pattern; tiles hold real images later) */}
      {project.slots && project.slots.length > 0 && (
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {project.slots.map((slot, i) => (
            <motion.div
              key={slot.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group"
            >
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-lg"
                style={{ background: TILES[i % TILES.length] }}
              >
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ background: "radial-gradient(circle at 70% 25%, rgba(255,240,225,0.22), transparent 55%)" }} />
                <span className="absolute left-4 bottom-3 text-[10px] tracking-[0.22em] uppercase text-[#F4EFE6]/60">
                  Image slot
                </span>
              </div>
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
