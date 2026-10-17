import { motion } from "motion/react";

/** Big italic divider between groups of sub-blocks (like Shopify's "Designs, refined"). */
export default function GroupTitle({ title, kicker }: { title: string; kicker?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="py-[clamp(5rem,12vw,11rem)] text-center"
    >
      {kicker && (
        <span className="block mb-5 text-[12px] uppercase tracking-[0.28em] text-[var(--taupe-subtle)]">{kicker}</span>
      )}
      <h2 className="swash-grand font-editorial-serif italic text-[clamp(3.6rem,10vw,10rem)] leading-[0.95] tracking-[-0.03em] text-[var(--text-ink)] text-balance">
        {title}
      </h2>
    </motion.div>
  );
}
