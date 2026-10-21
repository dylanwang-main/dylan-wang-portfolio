import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";

// x %, y %, font rem, drift px, opacity
const SLOTS: Array<[number, number, number, number, number]> = [
  [8, 10, 1.1, 120, 0.45],
  [30, 4, 1.3, 220, 0.6],
  [58, 14, 1.0, 90, 0.4],
  [80, 6, 1.2, 190, 0.55],
  [4, 52, 1.6, 150, 0.7],
  [24, 70, 1.0, 260, 0.4],
  [46, 44, 2.4, 60, 1],
  [68, 62, 1.5, 170, 0.65],
  [86, 40, 1.1, 110, 0.45],
  [14, 88, 1.2, 230, 0.5],
  [54, 90, 1.0, 140, 0.4],
  [82, 84, 1.3, 200, 0.55],
];

function Word({ text, slot, depth }: { text: string; slot: (typeof SLOTS)[number]; depth: MotionValue<number> }) {
  const [x, y, size, drift, op] = slot;
  const dy = useTransform(depth, [0, 1], [drift * 0.5, -drift * 0.5]);
  return (
    <motion.span
      className="absolute font-editorial-serif italic whitespace-nowrap text-[var(--text-ink)]"
      style={{ left: `${x}%`, top: `${y}%`, fontSize: `${size}rem`, opacity: op, y: dy }}
    >
      {text}
    </motion.span>
  );
}

/** Drifting italic "/command" words, each at its own depth (Shopify Editions style). Real tool names only. */
export default function FloatingWords({ words, className = "" }: { words: string[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: depth } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return (
    <div ref={ref} aria-hidden="true" className={`relative hidden md:block h-[clamp(200px,32vh,320px)] ${className}`}>
      {words.slice(0, SLOTS.length).map((w, i) => (
        <Word key={w} text={w} slot={SLOTS[i]} depth={depth} />
      ))}
    </div>
  );
}
