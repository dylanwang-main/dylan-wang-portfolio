import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from "motion/react";

function Word({ w, dir, p }: { w: string; dir: 1 | -1; p: MotionValue<number> }) {
  const x = useTransform(p, [0.15, 0.5, 0.85], [dir * 12, 0, dir * 5]);
  return (
    <motion.span style={{ x: useTransform(x, (v) => `${v}vw`) }} className="inline-block will-change-transform">
      {w}
    </motion.span>
  );
}

/**
 * Big italic divider between groups of sub-blocks (Shopify's "Designs, refined").
 * Words slide in from opposite sides and pass each other as you scroll, so the title earns its space.
 */
export default function GroupTitle({ title }: { title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const words = title.split(" ");
  return (
    <div ref={ref} className="py-[clamp(2.5rem,7vw,6rem)] overflow-hidden">
      <h2 className="swash-grand font-editorial-serif italic text-[clamp(3.6rem,11vw,11rem)] leading-[1.1] tracking-[-0.03em] text-[var(--text-ink)] flex flex-col md:flex-row md:justify-center md:gap-[0.3em]">
        {words.map((w, i) =>
          reduce ? (
            <span key={i}>{w}</span>
          ) : (
            <Word key={i} w={w} dir={i % 2 ? 1 : -1} p={p} />
          )
        )}
      </h2>
    </div>
  );
}
