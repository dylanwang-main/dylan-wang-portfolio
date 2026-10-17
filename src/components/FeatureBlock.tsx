import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
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

// left %, top %, scroll drift in px, float delay
const CARD_SLOTS: Array<[number, number, number, number]> = [
  [-3, 6, 170, 0],
  [86, 2, 240, 1.4],
  [-6, 50, 120, 0.7],
  [90, 44, 200, 2.1],
  [3, 86, 260, 1.1],
  [80, 88, 150, 2.8],
];

function ToolCard({
  label,
  slot,
  depth,
  glow,
}: {
  label: string;
  slot: (typeof CARD_SLOTS)[number];
  depth: MotionValue<number>;
  glow: boolean;
}) {
  const [l, t, drift, delay] = slot;
  const y = useTransform(depth, [0, 1], [drift * 0.6, -drift * 0.6]);
  return (
    <motion.div className="absolute z-20 hidden lg:block" style={{ left: `${l}%`, top: `${t}%`, y }}>
      <div className="animate-ambient-float" style={{ animationDelay: `${delay}s` }}>
        <div
          className="px-5 py-3 rounded-xl text-[15px] text-[var(--text-ink)] whitespace-nowrap"
          style={{
            background: "#FBF8F2",
            border: "1px solid rgba(31,27,22,0.1)",
            boxShadow: glow
              ? "0 0 0 1px rgba(107,45,45,0.18), 0 14px 50px rgba(190,90,110,0.38)"
              : "0 10px 30px rgba(31,27,22,0.12)",
          }}
        >
          {label}
        </div>
      </div>
    </motion.div>
  );
}

export default function FeatureBlock({ project, index }: FeatureBlockProps) {
  const articleRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // 0 to 1 as the stage rises into view: the demo builds as you scroll
  const { scrollYProgress: build } = useScroll({
    target: stageRef,
    offset: ["start 0.92", "start 0.3"],
  });
  // 0 to 1 across the whole block: drives each floating card's own depth
  const { scrollYProgress: depth } = useScroll({
    target: articleRef,
    offset: ["start end", "end start"],
  });
  const windowY = useTransform(build, [0, 1], [90, 0]);
  const windowScale = useTransform(build, [0, 1], [0.94, 1]);
  const sideY = useTransform(depth, [0, 1], [110, -110]);

  const proof = PROOFS[project.id] ?? PROOFS["ds3-park-smart"];
  const { Main, Side } = proof;

  return (
    <article
      ref={articleRef}
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

      {/* PROOF STAGE: demo window + companion card + tool cards at their own depths */}
      <div
        ref={stageRef}
        className="relative mt-[clamp(4rem,8vw,7rem)] h-[clamp(360px,60vh,620px)]"
      >
        {project.tools.slice(0, CARD_SLOTS.length).map((tool, i) => (
          <ToolCard key={tool} label={tool} slot={CARD_SLOTS[i]} depth={depth} glow={i === 1} />
        ))}

        <motion.div
          className="absolute inset-y-0 left-0 right-0 mx-auto w-full lg:w-[min(100%,980px)] z-10"
          style={{ y: windowY, scale: windowScale, transformOrigin: "50% 100%", ["--win-shadow" as string]: "0 24px 60px rgba(31,27,22,0.22)" }}
        >
          <Main build={build} />
        </motion.div>

        {Side && (
          <motion.div
            className="absolute z-20 hidden md:block right-[-1%] bottom-[-6%] w-[min(22%,230px)] h-[52%]"
            style={{ y: sideY, rotate: 3, ["--win-shadow" as string]: "0 18px 44px rgba(31,27,22,0.22)" }}
          >
            <Side />
          </motion.div>
        )}
      </div>

      <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-[var(--taupe-subtle)]">
        Placeholder preview · {project.imagePlaceholder.label}
      </p>

      {/* DETAIL SLOTS: three short columns, no boxes */}
      {project.slots && project.slots.length > 0 && (
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-8 pt-8 border-t border-[var(--border-hairline)]">
          {project.slots.map((slot) => (
            <div key={slot.label}>
              <span className="block text-[12px] uppercase tracking-[0.2em] text-[var(--taupe-subtle)] font-semibold mb-2">
                {slot.label}
              </span>
              <span className="block font-mono text-[14px] italic text-[var(--accent-oxblood)]">
                {slot.prompt}
              </span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
