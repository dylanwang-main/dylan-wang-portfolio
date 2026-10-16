interface CompactRowProps {
  label: string;
  value?: React.ReactNode;
  prompt?: string;
  className?: string;
}

export default function CompactRow({
  label,
  value,
  prompt,
  className = "",
}: CompactRowProps) {
  return (
    <div
      className={`border-b border-[var(--border-hairline)] py-3 md:py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-6 ${className}`}
    >
      {/* Label Left */}
      <span className="font-editorial-sans text-xs uppercase tracking-wider text-[var(--taupe-subtle)] font-medium shrink-0 sm:w-1/3">
        {label}
      </span>

      {/* Text / Slot Right */}
      <div className="sm:w-2/3 text-left sm:text-right">
        {prompt ? (
          <span className="font-mono text-xs text-[var(--accent-oxblood)] italic leading-relaxed">
            {prompt}
          </span>
        ) : typeof value === "string" ? (
          <span className="font-editorial-sans text-sm text-[var(--text-ink)] leading-relaxed">
            {value}
          </span>
        ) : (
          value
        )}
      </div>
    </div>
  );
}
