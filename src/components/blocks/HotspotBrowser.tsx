import { useState } from "react";
import { motion } from "motion/react";
import { EASE, fadeUp } from "../../lib/motion";
import { PaintLayer, STAGE_PAINTING } from "./MediaSlots";

export interface Hotspot {
  /** Position over the page, in % of the browser viewport. */
  x: number;
  y: number;
  label: string;
  detail: string;
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

function Spot({ spot, index, open, onToggle }: { spot: Hotspot; index: number; open: boolean; onToggle: () => void }) {
  const right = spot.x > 55; // open the card toward the middle so it stays inside the browser
  const below = spot.y < 30;
  return (
    <div className="absolute" style={{ left: `${spot.x}%`, top: `${spot.y}%`, zIndex: open ? 20 : 10 }}>
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
        <span className="hotspot-ring absolute inset-0 rounded-full border border-[#F4EFE6]" />
        <span className="hotspot-ring absolute inset-0 rounded-full border border-[#F4EFE6]" style={{ animationDelay: "1.1s" }} />
        <span className="relative block w-3 h-3 rounded-full bg-[#F4EFE6] shadow-[0_0_0_3px_rgba(232,128,128,0.55)]" />
      </motion.button>
      {open && (
        <motion.div
          role="note"
          initial={{ opacity: 0, y: below ? -6 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className={`absolute w-[min(240px,60vw)] rounded-lg p-3.5 text-left ${right ? "right-5" : "left-5"} ${below ? "top-4" : "bottom-4"}`}
          style={{ background: "#FBF8F2", boxShadow: "0 14px 40px rgba(0,0,0,0.4)" }}
        >
          <span className="block text-[13px] font-semibold text-[var(--text-ink)]">{spot.label}</span>
          <span className="block mt-1 font-mono text-[12px] leading-snug italic text-[var(--accent-oxblood)]">{spot.detail}</span>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Shopify-style feature walkthrough: a browser on a painted stage with pulsing hotspots.
 * Hover or tap a ring to read what was built there.
 */
export default function HotspotBrowser({ title, hotspots }: { title: string; hotspots: Hotspot[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <motion.div {...fadeUp({ amount: 0.3 })} className="relative overflow-hidden rounded-xl p-[clamp(1rem,5vw,4.5rem)]">
      <PaintLayer spec={STAGE_PAINTING} />
      <div className="relative mx-auto max-w-[980px] rounded-xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)]" style={{ border: `1px solid ${LINE}` }}>
        <div className="flex items-center gap-3 px-4 h-9 bg-[#221c17]" style={{ borderBottom: `1px solid ${LINE}` }}>
          <span className="flex gap-1.5">
            {["#E88080", "#C9A46B", "#7FA38A"].map((c) => (
              <i key={c} className="block w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.8 }} />
            ))}
          </span>
          <span className="flex-1 max-w-[360px] mx-auto h-5 rounded-full px-3 flex items-center text-[10px] tracking-[0.14em] uppercase truncate" style={{ background: "rgba(244,239,230,0.08)", color: "#8A7B6A" }}>
            {title}
          </span>
        </div>
        <div className="relative aspect-[4/5] sm:aspect-[16/10]">
          <SiteWireframe />
          {hotspots.map((h, i) => (
            <Spot key={h.label} spot={h} index={i} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
