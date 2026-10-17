import { motion } from "motion/react";

const TONES = [
  "linear-gradient(135deg,#6B2D2D 0%,#1b1612 100%)",
  "linear-gradient(135deg,#3a2a20 0%,#8a6a5a 100%)",
  "linear-gradient(135deg,#2b3a4a 0%,#161310 100%)",
];
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence baseFrequency='.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .5 0'/></filter><rect width='120' height='120' filter='url(%23n)' opacity='.35'/></svg>\")";

export interface Tile {
  title: string;
  note?: string;
}

/** 2- or 3-column textured tiles; each tile is a slot for a real image later. */
export function TileGrid({ tiles, aspect = "4/5" }: { tiles: Tile[]; aspect?: string }) {
  const cols = tiles.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3";
  return (
    <div className={`grid grid-cols-1 ${cols} gap-5 md:gap-6`}>
      {tiles.map((t, i) => (
        <motion.div
          key={t.title}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="group"
        >
          <div
            className="relative overflow-hidden rounded-lg"
            style={{ background: TONES[i % TONES.length], aspectRatio: aspect }}
          >
            <div
              className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ background: "radial-gradient(circle at 70% 22%, rgba(255,240,225,0.24), transparent 55%)" }}
            />
            <div className="absolute inset-0 mix-blend-soft-light opacity-60" style={{ backgroundImage: GRAIN }} />
            <span className="absolute left-4 bottom-3 text-[10px] tracking-[0.22em] uppercase text-[#F4EFE6]/60">
              Image slot
            </span>
          </div>
          <span className="block mt-4 text-[15px] font-semibold text-[var(--text-ink)]">{t.title}</span>
          {t.note && (
            <span className="block mt-1 font-mono text-[13px] italic text-[var(--accent-oxblood)]">{t.note}</span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

/** Glowing prompt bar on a dark stage (Shopify's "Sidekick" bar). */
export function PromptBar({ prompt, chips = [], caption }: { prompt: string; chips?: string[]; caption?: string }) {
  return (
    <div
      className="relative overflow-hidden rounded-xl px-5 py-[clamp(3rem,8vw,7rem)] flex flex-col items-center gap-6"
      style={{ background: "radial-gradient(ellipse at 50% 120%, #3a1d1d 0%, #161310 65%)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[640px]"
      >
        <div
          aria-hidden="true"
          className="absolute -inset-3 rounded-full blur-2xl opacity-70 animate-pulse"
          style={{ background: "linear-gradient(90deg,#6B2D2D,#d9a273,#6B2D2D)" }}
        />
        <div className="relative rounded-full border border-[#F4EFE6]/25 bg-[#161310] px-6 py-4 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#d9a273]" />
          <span className="font-mono text-[14px] text-[#F4EFE6]/85 truncate">{prompt}</span>
        </div>
      </motion.div>
      {chips.length > 0 && (
        <div className="relative flex flex-wrap justify-center gap-2">
          {chips.map((c) => (
            <span key={c} className="rounded-full border border-[#F4EFE6]/20 px-3 py-1 text-[12px] text-[#F4EFE6]/70">
              {c}
            </span>
          ))}
        </div>
      )}
      {caption && (
        <span className="relative text-[10px] uppercase tracking-[0.22em] text-[#F4EFE6]/40">{caption}</span>
      )}
    </div>
  );
}
