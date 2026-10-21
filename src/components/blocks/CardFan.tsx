import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import PlaceholderImage from "./PlaceholderImage";

export interface FanCard {
  label: string;
  recommendedSize?: string;
  aspectRatio?: string;
}

function FanItem({ card, i, p }: { card: FanCard; i: number; p: MotionValue<number> }) {
  const k = i - 1; // -1, 0, 1
  const x = useTransform(p, [0, 1], [k * 14, k * 118]);
  const rotate = useTransform(p, [0, 1], [k * 4, k * 5]);
  const y = useTransform(p, [0, 1], [Math.abs(k) * 6, Math.abs(k) * 28]);
  return (
    <motion.div
      className="absolute top-0 left-1/2 w-[min(30%,340px)] -ml-[min(15%,170px)] shadow-[0_24px_60px_rgba(31,27,22,0.22)] bg-[var(--bg-cream)]"
      style={{ x: useTransform(x, (v) => `${v}%`), rotate, y, zIndex: 3 - Math.abs(k) }}
    >
      <PlaceholderImage label={card.label} recommendedSize={card.recommendedSize} aspectRatio={card.aspectRatio ?? "9/14"} />
    </motion.div>
  );
}

/** Cards that start stacked like a deck and fan out as you scroll (Shopify "Pulse" stack). */
export default function CardFan({ cards }: { cards: FanCard[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start 0.85", "start 0.2"] });
  return (
    <>
      <div ref={ref} className="relative hidden md:block h-[clamp(360px,52vh,540px)]">
        {cards.slice(0, 3).map((c, i) => (
          <FanItem key={c.label} card={c} i={i} p={p} />
        ))}
      </div>
      {/* phones: the fanned-out row as a swipe strip (no stacking) */}
      <div className="md:hidden -mx-6 sm:-mx-10 px-6 sm:px-10 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 [scrollbar-width:none]">
        {cards.map((c) => (
          <div key={c.label} className="w-[64%] shrink-0 snap-center shadow-[0_14px_36px_rgba(31,27,22,0.18)] bg-[var(--bg-cream)]">
            <PlaceholderImage label={c.label} recommendedSize={c.recommendedSize} aspectRatio={c.aspectRatio ?? "9/14"} />
          </div>
        ))}
      </div>
    </>
  );
}
