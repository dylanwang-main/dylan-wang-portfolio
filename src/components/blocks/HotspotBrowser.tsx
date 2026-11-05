import { useState } from "react";
import { motion } from "motion/react";
import { EASE, fadeUp } from "../../lib/motion";
import { BlurLayer, PaintLayer, STAGE_PAINTING } from "./MediaSlots";

export interface Hotspot {
  /** Position over the page, in % of the browser viewport. */
  x: number;
  y: number;
  label: string;
  detail: string;
  /** Where the note opens, so it never covers what it describes. "up" (default), "down", or "right" (beside the dot). */
  dir?: "up" | "down" | "right";
  /** Distance from the dot for "right" notes, in px (clears a sidebar, for example). */
  gap?: number;
}

const CREAM = "#F4EFE6";
const LINE = "rgba(244,239,230,0.14)";

/** A generic site wireframe (nav, hero, cards). Swap for a real screenshot later. */
function SiteWireframe() {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#1b1612]">
      <div className="flex items-center justify-between px-[4%] h-[11%] shrink-0" style={{ borderBottom: `1px solid ${LINE}` }}>
        <span className="block w-[14%] h-2 rounded-full" style={{ background: CREAM, opacity: 0.8 }} />
        <span className="flex gap-[6%] w-[40%] justify-end">
          {[0, 1, 2, 3].map((i) => (
            <i key={i} className="block w-[18%] h-1.5 rounded-full" style={{ background: CREAM, opacity: 0.28 }} />
          ))}
        </span>
      </div>
      <div className="relative flex-1 m-[3%] rounded-md overflow-hidden" style={{ background: "linear-gradient(120deg,#6B2D2D,#2a1512 70%)" }}>
        <div className="absolute left-[6%] bottom-[12%] w-1/2 flex flex-col gap-2">
          <span className="block h-3 w-4/5 rounded-full" style={{ background: CREAM, opacity: 0.85 }} />
          <span className="block h-3 w-3/5 rounded-full" style={{ background: CREAM, opacity: 0.85 }} />
          <span className="block h-5 w-24 mt-2" style={{ background: "#E88080" }} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-[3%] px-[3%] pb-[3%] h-[24%] shrink-0">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-md" style={{ background: i === 1 ? "#E88080" : CREAM, opacity: i === 1 ? 0.55 : 0.14 }} />
        ))}
      </div>
    </div>
  );
}

/** Distance from the dot's center to the note's nearest corner. Same for every dot. */
const NOTE_OFFSET = 24;

function Spot({ spot, index, open, onToggle }: { spot: Hotspot; index: number; open: boolean; onToggle: () => void }) {
  // Notes always open up and to the right of the dot. Dots near the right edge mirror to up-left
  // with the same spacing, so the note never runs off the page.
  const flip = spot.x > 70;
  const dir = spot.dir ?? "up";
  const gap = dir === "right" ? spot.gap ?? NOTE_OFFSET : NOTE_OFFSET;
  const vertical = dir === "up" ? { bottom: NOTE_OFFSET } : dir === "down" ? { top: NOTE_OFFSET } : { top: -36 };
  return (
    <div className="absolute" style={{ left: `${spot.x}%`, top: `${spot.y}%`, zIndex: open ? 30 : 10 }}>
      <motion.button
        type="button"
        aria-expanded={open}
        aria-label={spot.label}
        onClick={onToggle}
        onMouseEnter={() => !open && onToggle()}
        className="relative -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E88080]"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, delay: 0.5 + index * 0.18, ease: EASE }}
      >
        {/* Oxblood (the site's accent red) with a white rim, so it reads on light and dark screenshots */}
        <span className="hotspot-ring absolute inset-0 rounded-full border-2 border-[var(--accent-oxblood)]" />
        <span className="hotspot-ring absolute inset-0 rounded-full border-2 border-[var(--accent-oxblood)]" style={{ animationDelay: "1.1s" }} />
        <span className="relative block w-3.5 h-3.5 rounded-full bg-[var(--accent-oxblood)] shadow-[0_0_0_2.5px_#fff,0_2px_10px_rgba(0,0,0,0.45)]" />
      </motion.button>
      {open && (
        <motion.div
          role="note"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          // pointer-events-none: the note can never cover or block a dot
          className="absolute hidden sm:block w-[240px] rounded-lg p-3.5 text-left pointer-events-none"
          style={{
            ...vertical,
            ...(flip ? { right: gap } : { left: gap }),
            background: "#FBF8F2",
            boxShadow: "0 14px 40px rgba(0,0,0,0.4)",
          }}
        >
          <span className="block text-[13px] font-semibold text-[var(--text-ink)]">{spot.label}</span>
          <span className="block mt-1 font-mono text-[12px] leading-snug italic text-[var(--accent-oxblood)]">{spot.detail}</span>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Shopify-style feature walkthrough: a browser on a painted stage with pulsing hotspots. Shows a real
 * screenshot when given one, otherwise a generic wireframe.
 * Hover or tap a ring to read what was built there.
 */
export default function HotspotBrowser({ title, hotspots, image, aspect = "1600/795" }: { title: string; hotspots: Hotspot[]; image?: string; aspect?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <motion.div {...fadeUp({ amount: 0.3 })} className="relative rounded-xl p-[clamp(0.75rem,2.5vw,1.75rem)]">
      {/* Clip only the painted backdrop, so hotspot notes can extend past the frame */}
      <div aria-hidden="true" className="absolute inset-0 rounded-xl overflow-hidden">
        {image ? <BlurLayer src={image} /> : <PaintLayer spec={STAGE_PAINTING} />}
      </div>
      <div className="relative mx-auto max-w-[980px] rounded-xl shadow-[0_30px_80px_rgba(0,0,0,0.5)]" style={{ border: `1px solid ${LINE}` }}>
        <div className="flex items-center gap-3 px-4 h-9 rounded-t-xl bg-[#221c17]" style={{ borderBottom: `1px solid ${LINE}` }}>
          <span className="flex gap-1.5">
            {["#E88080", "#C9A46B", "#7FA38A"].map((c) => (
              <i key={c} className="block w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.8 }} />
            ))}
          </span>
          <span className="flex-1 max-w-[360px] mx-auto h-5 rounded-full px-3 flex items-center text-[10px] tracking-[0.14em] uppercase truncate" style={{ background: "rgba(244,239,230,0.08)", color: "#8A7B6A" }}>
            {title}
          </span>
        </div>
        <div className={`relative ${image ? "" : "aspect-[4/5] sm:aspect-[16/10]"}`} style={image ? { aspectRatio: aspect.replace("/", " / ") } : undefined}>
          {image ? (
            <img src={image} alt={`${title} screenshot`} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover object-top rounded-b-xl" />
          ) : (
            <div className="absolute inset-0 rounded-b-xl overflow-hidden">
              <SiteWireframe />
            </div>
          )}
          {hotspots.map((h, i) => (
            <Spot key={h.label} spot={h} index={i} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </div>
      </div>
      {/* phones: the open note sits under the browser, where it can never be clipped */}
      {open !== null && hotspots[open] && (
        <div key={open} className="sm:hidden relative mx-auto mt-4 max-w-[980px] rounded-lg p-3.5" style={{ background: "#FBF8F2" }}>
          <span className="block text-[13px] font-semibold text-[var(--text-ink)]">{hotspots[open].label}</span>
          <span className="block mt-1 font-mono text-[12px] leading-snug italic text-[var(--accent-oxblood)]">{hotspots[open].detail}</span>
        </div>
      )}
    </motion.div>
  );
}
