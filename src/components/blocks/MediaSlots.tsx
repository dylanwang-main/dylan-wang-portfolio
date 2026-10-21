import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { fadeUp, EASE } from "../../lib/motion";
import { PAINTINGS, PaintSpec, usePainting } from "../../lib/paint";

/** Dark, low-key painting for stages that hold UI on top (prompt bar, browser mockup). */
export const STAGE_PAINTING: PaintSpec = { style: "foliage", palette: ["#120d0b", "#3a1d1d", "#7a4a3a"], seed: 53 };

/** Painted texture filling its parent; fades in once painted (the parent's gradient shows until then). */
export function PaintLayer({ spec, className = "" }: { spec: PaintSpec; className?: string }) {
  const url = usePainting(spec);
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${className}`}
      style={{ backgroundImage: url ? `url(${url})` : undefined, opacity: url ? undefined : 0 }}
    />
  );
}

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

const CARD = { background: "#FBF8F2", boxShadow: "0 18px 50px rgba(0,0,0,0.35)" };
const skel = "rounded-full bg-[#1F1B16]/12";

/** Mini UI wireframes that play when the tile scrolls into view (no invented data). */
function BarsCard() {
  const hs = [42, 72, 56, 88, 64];
  return (
    <div className="p-[7%] h-full">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[var(--accent-oxblood)]" />
        <span className={`${skel} h-2 w-1/3`} />
      </div>
      <div className="mt-[6%] h-[58%] flex items-end gap-[5%] border-b border-[#1F1B16]/15">
        {hs.map((h, i) => (
          <motion.span
            key={i}
            className="flex-1 rounded-t-sm bg-[var(--accent-oxblood)]/80"
            style={{ height: `${h}%`, originY: 1 }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, delay: 0.3 + i * 0.09, ease: EASE }}
          />
        ))}
      </div>
    </div>
  );
}

function PromptCard() {
  return (
    <div className="relative h-full p-[7%]">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#d9a273]" />
        <span className={`${skel} h-2 w-1/4`} />
      </div>
      <div className={`${skel} h-2 w-2/3 mt-[8%]`} />
      <div className={`${skel} h-2 w-1/2 mt-[3%]`} />
      <div
        className="absolute left-[-4%] right-[-4%] top-[44%] rounded-full bg-white px-[5%] py-[3.5%] flex items-center gap-3"
        style={{ boxShadow: "0 0 0 1px rgba(107,45,45,0.12), 0 10px 40px rgba(190,90,110,0.4)" }}
      >
        <span className="w-3 h-3 rounded-full bg-[var(--accent-oxblood)] shrink-0" />
        <div className="flex-1 overflow-hidden">
          <motion.span
            className="block h-2 rounded-full bg-[#1F1B16]/35"
            initial={{ width: "0%" }}
            whileInView={{ width: "88%" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.6, delay: 0.5, ease: "easeOut" }}
          />
        </div>
        <motion.span
          className="w-5 h-5 rounded-full bg-[var(--accent-oxblood)] shrink-0"
          initial={{ scale: 1 }}
          whileInView={{ scale: [1, 1.35, 1] }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 2.1 }}
        />
      </div>
    </div>
  );
}

function ListCard() {
  return (
    <div className="p-[7%] h-full space-y-[5%]">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.3 + i * 0.14, ease: EASE }}
        >
          <span className={`w-3 h-3 rounded-full shrink-0 ${i === 1 ? "bg-[var(--accent-oxblood)]" : "bg-[#1F1B16]/20"}`} />
          <span className={`${skel} h-2`} style={{ width: `${[70, 55, 80, 45][i]}%` }} />
        </motion.div>
      ))}
    </div>
  );
}

const CARDS = [BarsCard, PromptCard, ListCard];

/**
 * Shopify-style tile: textured backdrop, a UI card that rises in, drifts with scroll,
 * and animates its own contents. Swap the card for a real image later.
 */
export function AnimatedTile({ index = 0, aspect = "4/3" }: { index?: number; aspect?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [26, -26]);
  const bgY = useTransform(scrollYProgress, [0, 1], [-14, 14]);
  const Card = CARDS[index % CARDS.length];
  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-lg aspect-[4/3] md:[aspect-ratio:var(--ar)]"
      style={{ ["--ar" as string]: aspect.replace("/", " / "), background: TONES[index % TONES.length] }}
    >
      <motion.div className="absolute -inset-[8%]" style={{ y: bgY }}>
        <PaintLayer spec={PAINTINGS[index % PAINTINGS.length]} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 70% 22%, rgba(255,240,225,0.24), transparent 55%)" }} />
        <div className="absolute inset-0 mix-blend-soft-light opacity-60" style={{ backgroundImage: GRAIN }} />
      </motion.div>
      <motion.div
        className="absolute left-[9%] right-[9%] top-[13%] bottom-[-10%] rounded-xl overflow-hidden"
        style={{ ...CARD, y }}
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <Card />
      </motion.div>
      <span className="absolute left-4 top-3 text-[10px] tracking-[0.22em] uppercase text-[#F4EFE6]/55">Image slot</span>
    </div>
  );
}

/** 2- or 3-column animated tiles; each tile is a slot for a real image later. */
export function TileGrid({ tiles, aspect = "4/3" }: { tiles: Tile[]; aspect?: string }) {
  const cols = tiles.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3";
  return (
    <div className={`grid grid-cols-1 ${cols} gap-5 md:gap-6`}>
      {tiles.map((t, i) => (
        <motion.div
          key={t.title}
          {...fadeUp({ amount: 0.3, duration: 0.8, delay: i * 0.1 })}
        >
          <AnimatedTile index={i} aspect={aspect} />
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
      <PaintLayer spec={STAGE_PAINTING} className="opacity-70" />
      <div aria-hidden="true" className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(22,19,16,0.15), rgba(22,19,16,0.75))" }} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: EASE }}
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
