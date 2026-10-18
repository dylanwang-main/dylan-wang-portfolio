interface PlaceholderImageProps {
  label: string;
  recommendedSize?: string;
  aspectRatio?: string;
  className?: string;
}

export default function PlaceholderImage({
  label,
  recommendedSize,
  aspectRatio = "16/10",
  className = "",
}: PlaceholderImageProps) {
  return (
    <div
      style={{ aspectRatio }}
      className={`relative w-full overflow-hidden border border-[var(--border-hairline)] bg-gradient-to-br from-[#EDE5D8] via-[#F4EFE6] to-[#E5DDD0] flex flex-col items-center justify-center p-6 text-center select-none ${className}`}
    >
      {/* Editorial corner tick marks */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[var(--taupe-subtle)]/40" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[var(--taupe-subtle)]/40" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[var(--taupe-subtle)]/40" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[var(--taupe-subtle)]/40" />

      {/* Subtle watermark seal */}
      <div className="w-12 h-12 rounded-full border border-[var(--taupe-subtle)]/30 flex items-center justify-center mb-3">
        <span className="font-editorial-serif text-sm italic text-[var(--taupe-subtle)]">
          DW
        </span>
      </div>

      {/* Labeled slot */}
      <p className="font-editorial-sans text-xs uppercase tracking-widest text-[var(--text-ink)] font-semibold max-w-sm">
        {label}
      </p>

      {recommendedSize && (
        <span className="text-[11px] text-[var(--taupe-subtle)] mt-1.5 font-mono">
          Slot: {recommendedSize}
        </span>
      )}

      <span className="text-[10px] text-[var(--taupe-subtle)]/75 mt-2 italic">
        (Placeholder frame · ready for image swap)
      </span>
    </div>
  );
}
