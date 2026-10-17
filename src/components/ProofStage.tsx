import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";

// left %, top %, scroll drift in px, float delay. Ordered so the first few spread around the window.
const CARD_SLOTS: Array<[number, number, number, number]> = [
  [-2, 8, 170, 0],
  [82, 42, 240, 1.4],
  [26, 90, 120, 0.7],
  [84, 0, 200, 2.1],
  [-5, 58, 260, 1.1],
  [64, 92, 150, 2.8],
  [42, -4, 140, 0.4],
  [90, 76, 210, 1.8],
  [10, 30, 180, 2.4],
];

function ToolCard({
  label,
  slot,
  depth,
  build,
  index,
  glow,
  driftScale = 1,
}: {
  label: string;
  slot: (typeof CARD_SLOTS)[number];
  depth: MotionValue<number>;
  build: MotionValue<number>;
  index: number;
  glow: boolean;
  driftScale?: number;
}) {
  const [l, t, drift, delay] = slot;
  const y = useTransform(depth, [0, 1], [drift * 0.6 * driftScale, -drift * 0.6 * driftScale]);
  // pop-up: each card springs in (slight overshoot) one after another as the window builds
  const s0 = Math.min(0.2 + index * 0.13, 0.78);
  const scale = useTransform(build, [s0, s0 + 0.1, s0 + 0.2], [0.55, 1.08, 1]);
  const opacity = useTransform(build, [s0, s0 + 0.1], [0, 1]);
  return (
    <motion.div className="absolute z-20 hidden lg:block" style={{ left: `${l}%`, top: `${t}%`, y, scale, opacity }}>
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

interface ProofStageProps {
  Main: React.ComponentType<{ build: MotionValue<number> }>;
  Side?: React.ComponentType;
  /** Floating label cards. Real data only (tools, school, discipline, platforms). */
  cards: string[];
  /** Tailwind width classes for the main window, e.g. "lg:w-[min(100%,980px)]". */
  mainWidth?: string;
  className?: string;
  /** Stage height classes. */
  heightClass?: string;
  /** When given (0 to 1), this drives the build and depth instead of the stage's own scroll position. */
  progress?: MotionValue<number>;
}

/**
 * Shopify-style proof stage: a large window that rises and builds as you scroll,
 * a companion card, and label cards floating at their own depths.
 */
export default function ProofStage({
  Main,
  Side,
  cards,
  mainWidth = "lg:w-[min(100%,980px)]",
  className = "mt-[clamp(4rem,8vw,7rem)]",
  heightClass = "h-[clamp(360px,60vh,620px)]",
  progress,
}: ProofStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: ownBuild } = useScroll({
    target: stageRef,
    offset: ["start 0.92", "start 0.3"],
  });
  const { scrollYProgress: ownDepth } = useScroll({
    target: stageRef,
    offset: ["start end", "end start"],
  });
  const driven = useTransform(progress ?? ownBuild, [0.08, 0.7], [0, 1], { clamp: true });
  const build = progress ? driven : ownBuild;
  const depth = progress ?? ownDepth;
  const windowY = useTransform(build, [0, 1], [90, 0]);
  const windowScale = useTransform(build, [0, 1], [0.94, 1]);
  const sideY = useTransform(depth, [0, 1], [110, -110]);

  return (
    <div ref={stageRef} className={`relative ${heightClass} ${className}`}>
      {cards.slice(0, CARD_SLOTS.length).map((label, i) => (
        <ToolCard key={label} label={label} slot={CARD_SLOTS[i]} depth={depth} build={build} index={i} glow={i === 1} driftScale={progress ? 0.3 : 1} />
      ))}

      <motion.div
        className={`absolute inset-y-0 left-0 right-0 mx-auto w-full ${mainWidth} z-10`}
        style={{
          y: windowY,
          scale: windowScale,
          transformOrigin: "50% 100%",
          ["--win-shadow" as string]: "0 24px 60px rgba(31,27,22,0.22)",
        }}
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
      {/* small screens: same skills as a simple row of pills under the window */}
      <div className="lg:hidden absolute left-0 right-0 -bottom-16 flex flex-wrap gap-2">
        {cards.map((c) => (
          <span key={c} className="px-3.5 py-1.5 rounded-lg text-[13px] text-[var(--text-ink)] bg-[#FBF8F2] border border-[rgba(31,27,22,0.1)] shadow-[0_6px_18px_rgba(31,27,22,0.1)]">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
