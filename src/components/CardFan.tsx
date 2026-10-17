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
      <div ref={ref} className="relative hidden md:block h-[clamp(420px,62vh,620px)]">
        {cards.slice(0, 3).map((c, i) => (
          <FanItem key={c.label} card={c} i={i} p={p} />
        ))}
      </div>
      <div className="md:hidden grid grid-cols-1 gap-6">
        {cards.map((c) => (
          <PlaceholderImage key={c.label} label={c.label} recommendedSize={c.recommendedSize} aspectRatio={c.aspectRatio ?? "9/14"} />
        ))}
      </div>
    </>
  );
}
