import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import { EASE } from "../../lib/motion";


/** One skill chip. Pops in (slight overshoot) in turn as the window builds. */
function ToolCard({
  label,
  build,
  index,
  glow,
  delay,
}: {
  label: string;
  build: MotionValue<number>;
  index: number;
  glow: boolean;
  delay: number;
}) {
  const s0 = Math.min(0.2 + index * 0.13, 0.78);
  const scale = useTransform(build, [s0, s0 + 0.1, s0 + 0.2], [0.55, 1.08, 1]);
  const opacity = useTransform(build, [s0, s0 + 0.1], [0, 1]);
  return (
    <motion.div data-ps="chip" style={{ scale, opacity }}>
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
  /** Skill chips. Real data only (tools, school, discipline, platforms). */
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
 * Shopify-style proof stage. Desktop: three columns (chips | window | side window + chips), so
 * nothing ever sits on top of the window. Phones: the window, then the chips as a pill row.
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
  // each side column drifts as one unit, so chips in a column can never collide
  const drift = progress ? 24 : 60;
  const leftY = useTransform(depth, [0, 1], [drift, -drift]);
  const rightY = useTransform(depth, [0, 1], [drift * 1.4, -drift * 1.4]);

  const left = cards.filter((_, i) => i % 2 === 0);
  const right = cards.filter((_, i) => i % 2 === 1);
  const chip = (label: string) => {
    const i = cards.indexOf(label);
    return <ToolCard key={label} label={label} build={build} index={i} glow={i === 1} delay={(i * 0.9) % 3} />;
  };

  const win = (
    <motion.div
      data-ps="main"
      className={`relative h-full w-full ${mainWidth} mx-auto`}
      style={{
        y: windowY,
        scale: windowScale,
        transformOrigin: "50% 100%",
        ["--win-shadow" as string]: "0 24px 60px rgba(31,27,22,0.22)",
      }}
    >
      <Main build={build} />
    </motion.div>
  );

  return (
    <div ref={stageRef} className={`relative ${className}`}>
      {/* desktop */}
      <div className={`hidden lg:grid grid-cols-[minmax(150px,210px)_minmax(0,1fr)_minmax(150px,230px)] gap-8 ${heightClass}`}>
        <motion.div className="flex flex-col justify-evenly items-end gap-4" style={{ y: leftY }}>
          {left.map(chip)}
        </motion.div>
        <div className="relative min-w-0">{win}</div>
        <motion.div className="flex flex-col justify-evenly items-start gap-4" style={{ y: rightY }}>
          {Side && (
            <div data-ps="side" className="w-full h-[48%] shrink-0" style={{ ["--win-shadow" as string]: "0 18px 44px rgba(31,27,22,0.22)" }}>
              <Side />
            </div>
          )}
          {right.map(chip)}
        </motion.div>
      </div>

      {/* phones and tablets */}
      <div className="lg:hidden">
        <div className={`relative ${heightClass}`}>{win}</div>
        {cards.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {cards.map((c, i) => (
              <motion.span
                key={c}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                className="px-3.5 py-1.5 rounded-lg text-[13px] text-[var(--text-ink)] bg-[#FBF8F2] border border-[rgba(31,27,22,0.1)] shadow-[0_6px_18px_rgba(31,27,22,0.1)]"
              >
                {c}
              </motion.span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
