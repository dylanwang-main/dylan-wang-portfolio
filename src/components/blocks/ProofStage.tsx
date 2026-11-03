import { useId, useRef } from "react";
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

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/** Irregular wax outline: a circle whose radius wobbles like melted wax, seeded per tool. */
function waxPath(seed: string) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const a1 = (h % 7) + 5;
  const a2 = ((h >> 3) % 5) + 9;
  const p1 = (h % 360) * (Math.PI / 180);
  const N = 72;
  let d = "";
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI * 2;
    const r = 1 + 0.045 * Math.sin(a1 * t + p1) + 0.03 * Math.sin(a2 * t - p1 * 1.7) + 0.02 * Math.sin(19 * t);
    d += `${i ? "L" : "M"}${(Math.cos(t) * r).toFixed(3)} ${(Math.sin(t) * r).toFixed(3)}`;
  }
  return d + "Z";
}

/** One face of a wax seal: melted edge, pressed inner ring, embossed glyph. */
function SealFace({ seed, glyph, serif = true }: { seed: string; glyph: string; serif?: boolean }) {
  // unique per instance: the desktop and phone layouts both render seals, and a gradient defined
  // inside a hidden (display:none) copy would leave the visible copy unfilled
  const id = `wax-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="-1.15 -1.15 2.3 2.3" className="w-full h-full">
      <defs>
        <radialGradient id={`${id}-g`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#9b3b3b" />
          <stop offset="55%" stopColor="#6B2D2D" />
          <stop offset="100%" stopColor="#3f1616" />
        </radialGradient>
        <radialGradient id={`${id}-in`} cx="60%" cy="65%" r="70%">
          <stop offset="0%" stopColor="#5a2222" />
          <stop offset="100%" stopColor="#7a3030" />
        </radialGradient>
      </defs>
      <path d={waxPath(seed)} fill={`url(#${id}-g)`} />
      {/* pressed ring: dark inner edge, light outer lip */}
      <circle r="0.72" fill={`url(#${id}-in)`} />
      <circle r="0.72" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="0.05" />
      <circle r="0.77" fill="none" stroke="rgba(255,220,210,0.22)" strokeWidth="0.03" />
      {/* embossed glyph: light highlight offset up-left, dark shadow down-right */}
      {[
        ["rgba(0,0,0,0.45)", 0.03],
        ["rgba(255,225,215,0.35)", -0.025],
        ["#c9817a", 0],
      ].map(([fill, o], i) => (
        <text
          key={i}
          x={o as number}
          y={(o as number) + 0.02}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={glyph.length > 2 ? 0.62 : 0.95}
          fontStyle={serif ? "italic" : "normal"}
          fontFamily="'Cormorant Garamond', Garamond, Georgia, serif"
          fill={fill as string}
        >
          {glyph}
        </text>
      ))}
    </svg>
  );
}

/**
 * Wax seal for a tool: stamped in as the note appears, flips on hover to show its Roman numeral.
 */
function WaxSeal({ label, index, build, s0 }: { label: string; index: number; build: MotionValue<number>; s0: number }) {
  const scale = useTransform(build, [s0 + 0.02, s0 + 0.12, s0 + 0.18], [1.7, 0.9, 1]);
  const rotate = useTransform(build, [s0 + 0.02, s0 + 0.18], [-28, -6]);
  const opacity = useTransform(build, [s0 + 0.02, s0 + 0.08], [0, 1]);
  return (
    <motion.div
      className="seal w-12 h-12 shrink-0"
      style={{ scale, rotate, opacity, filter: "drop-shadow(0 3px 5px rgba(63,22,22,0.35))" }}
    >
      <div className="seal-inner">
        <div className="seal-face"><SealFace seed={label} glyph={label.charAt(0)} /></div>
        <div className="seal-face seal-back"><SealFace seed={label + "b"} glyph={ROMAN[index] ?? "❧"} serif={false} /></div>
      </div>
    </motion.div>
  );
}

/**
 * Marginalia: a tool written in the margin like a note in Leonardo's notebook, with a hairline
 * leader that draws in toward the window and a short line on what the tool was used for.
 */
function MarginNote({
  label,
  note,
  side,
  build,
  index,
}: {
  label: string;
  note?: string;
  side: "left" | "right";
  build: MotionValue<number>;
  index: number;
}) {
  const s0 = Math.min(0.2 + index * 0.13, 0.78);
  const opacity = useTransform(build, [s0, s0 + 0.12], [0, 1]);
  const x = useTransform(build, [s0, s0 + 0.18], [side === "left" ? -10 : 10, 0]);
  const line = useTransform(build, [s0 + 0.04, s0 + 0.26], [0, 1]);
  const toWindow = side === "left";
  return (
    <motion.div data-ps="note" style={{ opacity, x }} className={`group flex items-center gap-3 w-full ${toWindow ? "justify-end" : "justify-start flex-row-reverse"}`}>
      <WaxSeal label={label} index={index} build={build} s0={s0} />
      <div className={toWindow ? "text-right" : "text-left"}>
        <span className="block font-editorial-serif italic text-[21px] leading-tight text-[var(--text-ink)] whitespace-nowrap">
          <span className="text-[var(--accent-oxblood)]">{label.charAt(0)}</span>
          {label.slice(1)}
        </span>
        {note && <span className="block mt-1 font-editorial-serif italic text-[15px] leading-snug text-[var(--taupe-subtle)]">{note}</span>}
      </div>
      {/* leader: hairline with a small dot where it meets the window */}
      <div className="relative w-[clamp(28px,4vw,64px)] h-px shrink-0">
        <motion.span
          className="absolute inset-0 bg-[var(--text-ink)]/35"
          style={{ scaleX: line, transformOrigin: toWindow ? "left" : "right" }}
        />
        <motion.span
          className={`absolute top-1/2 -translate-y-1/2 ${toWindow ? "right-0" : "left-0"} w-1.5 h-1.5 rounded-full bg-[var(--accent-oxblood)]`}
          style={{ opacity: line }}
        />
      </div>
    </motion.div>
  );
}

interface ProofStageProps {
  /** One-line "what it was used for", keyed by tool. When given, tools render as marginalia notes. */
  notes?: Record<string, string>;
  Main: React.ComponentType<{ build: MotionValue<number> }>;
  Side?: React.ComponentType;
  /** Skill chips. Real data only (tools, school, discipline, platforms). */
  cards: string[];
  /** Tailwind width classes for the main window, e.g. "lg:w-[min(100%,980px)]". */
  mainWidth?: string;
  className?: string;
  /** Stage height classes. */
  heightClass?: string;
  /** Desktop column template. Narrow it to keep the chips close to a small window. */
  gridCols?: string;
  /** Height of the side window's slot. Pass "" to let the side window size to its content. */
  sideHeight?: string;
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
  notes,
  mainWidth = "lg:w-[min(100%,980px)]",
  className = "mt-[clamp(2.5rem,5vw,4.5rem)]",
  heightClass = "h-[clamp(360px,60vh,620px)]",
  gridCols = "grid-cols-[minmax(150px,210px)_minmax(0,1fr)_minmax(150px,230px)]",
  sideHeight = "h-[48%]",
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
    if (notes) {
      return <MarginNote key={label} label={label} note={notes[label]} side={i % 2 === 0 ? "left" : "right"} build={build} index={i} />;
    }
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
      <div
        className={`hidden lg:grid ${
          // margin notes (seal + name + note) need wider side columns than chips
          notes ? "grid-cols-[minmax(230px,290px)_minmax(0,1fr)_minmax(230px,290px)]" : gridCols
        } gap-6 ${heightClass}`}
      >
        <motion.div className={`flex flex-col justify-evenly gap-4 ${notes ? "items-stretch" : "items-end"}`} style={{ y: leftY }}>
          {left.map(chip)}
        </motion.div>
        <div className="relative min-w-0">{win}</div>
        <motion.div className={`flex flex-col justify-evenly gap-4 ${notes ? "items-stretch" : "items-start"}`} style={{ y: rightY }}>
          {Side && (
            <div data-ps="side" className={`w-full ${sideHeight} shrink-0`} style={{ ["--win-shadow" as string]: "0 18px 44px rgba(31,27,22,0.22)" }}>
              <Side />
            </div>
          )}
          {right.map(chip)}
        </motion.div>
      </div>

      {/* phones and tablets */}
      <div className="lg:hidden">
        <div className={`relative ${heightClass}`}>{win}</div>
        {cards.length > 0 && notes && (
          <ul className="mt-6 space-y-2">
            {cards.map((c) => (
              <li key={c} className="flex items-center gap-3 font-editorial-serif italic text-[17px] text-[var(--text-ink)]">
                <span className="w-7 h-7 shrink-0 -rotate-6" style={{ filter: "drop-shadow(0 2px 3px rgba(63,22,22,0.3))" }}>
                  <SealFace seed={c} glyph={c.charAt(0)} />
                </span>
                <span>
                <span className="text-[var(--accent-oxblood)]">{c.charAt(0)}</span>
                {c.slice(1)}
                {notes[c] && <span className="text-[var(--taupe-subtle)]"> · {notes[c]}</span>}
                </span>
              </li>
            ))}
          </ul>
        )}
        {cards.length > 0 && !notes && (
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
