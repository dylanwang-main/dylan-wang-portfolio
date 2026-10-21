import { motion } from "motion/react";
import { IndexEntry } from "../../data/portfolio";
import { fadeUp } from "../../lib/motion";

/** One list in the index: title ····· dates, with organization and a short note underneath. */
export function IndexList({ heading, entries }: { heading: string; entries: IndexEntry[] }) {
  return (
    <div>
      <h4 className="text-[12px] uppercase tracking-[0.22em] text-[var(--taupe-subtle)] font-semibold pb-3 border-b border-[var(--border-hairline)]">
        {heading}
      </h4>
      <ul>
        {entries.map((e) => (
          <li key={e.title + e.org} className="py-4 border-b border-[var(--border-hairline)]">
            <div className="flex items-baseline gap-3">
              <span className="font-editorial-serif italic text-[clamp(1.25rem,1.8vw,1.6rem)] leading-tight text-[var(--text-ink)]">{e.title}</span>
              {e.dates && (
                <>
                  <span aria-hidden="true" className="flex-1 min-w-6 border-b border-dotted border-[var(--taupe-subtle)]/50 translate-y-[-4px]" />
                  <span className="shrink-0 text-[12px] tracking-[0.06em] text-[var(--taupe-subtle)]">{e.dates}</span>
                </>
              )}
            </div>
            <div className="mt-1 text-[14px] text-[var(--text-ink)]/80">
              {e.org}
              {e.note && <span className="text-[var(--taupe-subtle)]"> · {e.note}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Skills as grouped inline lists. */
export function SkillList({ groups }: { groups: { group: string; items: string[] }[] }) {
  return (
    <div>
      <h4 className="text-[12px] uppercase tracking-[0.22em] text-[var(--taupe-subtle)] font-semibold pb-3 border-b border-[var(--border-hairline)]">
        Skills
      </h4>
      {groups.map((g) => (
        <div key={g.group} className="py-4 border-b border-[var(--border-hairline)] grid grid-cols-[96px_minmax(0,1fr)] gap-4">
          <span className="text-[13px] font-semibold text-[var(--text-ink)]">{g.group}</span>
          <span className="flex flex-wrap gap-1.5">
            {g.items.map((i) => (
              <span key={i} className="px-2.5 py-1 rounded-md text-[13px] text-[var(--text-ink)] bg-[#FBF8F2] border border-[var(--border-hairline)]">
                {i}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Shopify-style two-column index: everything at a glance, in one scannable panel. */
export default function IndexPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div {...fadeUp({ amount: 0.15 })} className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 gap-y-12">
      {children}
    </motion.div>
  );
}
