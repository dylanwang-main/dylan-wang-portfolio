import { ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { fadeUp } from "../../lib/motion";

interface SubBlockProps {
  label: string;
  headline: string;
  /** Italic swash first letter (uses the same style as section statements) */
  swash?: boolean;
  linkLabel?: string;
  href?: string;
  /** Media slot: CardFan, TileGrid, PromptBar, or anything */
  children?: ReactNode;
}

/** Shopify-style sub-block: small label, big serif headline, pill link, media slot. */
export default function SubBlock({ label, headline, swash = true, linkLabel, href = "#", children }: SubBlockProps) {
  return (
    <article className="py-[clamp(3rem,5.5vw,5rem)] border-t border-[var(--border-hairline)] first:border-t-0">
      <motion.div
        {...fadeUp()}
        className="max-w-[900px]"
      >
        <span className="text-[12px] uppercase tracking-[0.22em] text-[var(--taupe-subtle)] font-medium">{label}</span>
        <h3
          className={`${swash ? "statement-title " : ""}font-editorial-serif italic text-[clamp(2.4rem,5vw,5rem)] leading-[1] tracking-[-0.02em] text-[var(--text-ink)] mt-4 text-balance`}
        >
          {headline}
        </h3>
        {linkLabel && (
          <a
            href={href}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--text-ink)]/70 px-5 py-2 text-[13px] font-medium text-[var(--text-ink)] hover:bg-[var(--text-ink)] hover:text-[var(--bg-cream)] transition-colors"
          >
            {linkLabel}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        )}
      </motion.div>
      {children && <div className="mt-[clamp(1.75rem,3.5vw,3rem)]">{children}</div>}
    </article>
  );
}
