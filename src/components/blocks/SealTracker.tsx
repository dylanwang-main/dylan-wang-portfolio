import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SEAL_LETTERS, SEAL_ORDER, SEAL_PHRASE, labelForSlot, landSeal, sealIndex, useFlights, useSeals, type Flight } from "../../lib/seals";
import { SealFace } from "./ProofStage";

/**
 * The phrase as a row of seal slots: collected seals sit in their slot, the rest are an empty
 * dashed ring. Each slot carries data-seal-slot so a flying seal
 * knows where to land.
 */
export function PhraseSlots({ size = 22, track = false }: { size?: number; track?: boolean }) {
  const got = useSeals();
  let k = 0;
  return (
    <span className="inline-flex items-center" style={{ gap: size * 0.18 }} aria-hidden="true">
      {SEAL_PHRASE.split("").map((ch, i) => {
        if (ch === " ") return <span key={i} style={{ width: size * 0.45 }} />;
        const slot = k++;
        const label = labelForSlot(slot);
        const on = got.includes(label);
        return (
          <span
            key={i}
            {...(track ? { "data-seal-slot": slot } : {})}
            className="relative inline-block shrink-0"
            style={{ width: size, height: size }}
          >
            {on ? (
              <motion.span
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 520, damping: 14 }}
                className="absolute inset-0"
                style={{ filter: "drop-shadow(0 2px 3px rgba(63,22,22,0.35))" }}
              >
                <SealFace seed={label} glyph={SEAL_LETTERS[slot]} />
              </motion.span>
            ) : (
              // empty slot: just the dashed impression, no letter, so the phrase stays a surprise
              <span className="absolute inset-[8%] rounded-full" style={{ border: "1px dashed rgba(138,123,106,0.55)" }} />
            )}
          </span>
        );
      })}
    </span>
  );
}

/** A seal copy flying from where it was clicked to its slot, along an arc, shrinking as it goes. */
function FlyingSeal({ f }: { f: Flight }) {
  const slot = sealIndex(f.label);
  const [to, setTo] = useState<{ x: number; y: number; size: number } | null>(null);
  useEffect(() => {
    // wait a frame so the tracker (and its slot) has mounted
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const el = document.querySelector(`[data-seal-slot="${slot}"]`);
        const r = el?.getBoundingClientRect();
        if (!r) return landSeal(f.id);
        setTo({ x: r.left + r.width / 2, y: r.top + r.height / 2, size: r.width });
      })
    );
    return () => cancelAnimationFrame(id);
  }, [f.id, slot]);
  if (!to) return null;
  const { x: x0, y: y0, size: s0 } = f.from;
  // control point: up and toward the target, so it loops over rather than sliding straight
  const mx = (x0 + to.x) / 2;
  const my = Math.min(y0, to.y) - Math.max(140, Math.abs(to.x - x0) * 0.25);
  return (
    <motion.div
      className="fixed left-0 top-0 z-[70] pointer-events-none"
      style={{ width: s0, height: s0, marginLeft: -s0 / 2, marginTop: -s0 / 2, filter: "drop-shadow(0 10px 16px rgba(63,22,22,0.4))" }}
      initial={{ x: x0, y: y0, scale: 1.25, rotate: 0 }}
      animate={{ x: [x0, mx, to.x], y: [y0, my, to.y], scale: [1.25, 1.1, to.size / s0], rotate: [0, 200, 360] }}
      transition={{ duration: 0.9, ease: [0.45, 0, 0.2, 1], times: [0, 0.45, 1] }}
      onAnimationComplete={() => landSeal(f.id)}
    >
      <SealFace seed={f.label} glyph={SEAL_LETTERS[slot]} />
    </motion.div>
  );
}

/** Confetti bursting outward from every side of the tracker box when the last seal lands. */
function Confetti({ w, h }: { w: number; h: number }) {
  const bits = useMemo(
    () =>
      Array.from({ length: 72 }, (_, i) => {
        // start on a random point of the box's edge, then fly outward from the centre
        const side = i % 4;
        const t = Math.random();
        const x = side === 0 ? t * w : side === 1 ? w : side === 2 ? t * w : 0;
        const y = side === 0 ? 0 : side === 1 ? t * h : side === 2 ? h : t * h;
        const a = Math.atan2(y - h / 2, x - w / 2) + (Math.random() - 0.5) * 0.9;
        const v = 70 + Math.random() * 170;
        return {
          i,
          x,
          y,
          dx: Math.cos(a) * v,
          dy: Math.sin(a) * v,
          rot: (Math.random() - 0.5) * 720,
          color: ["#6B2D2D", "#1E3A9E", "#D9B26F", "#F4EFE6", "#E88080"][i % 5],
          sw: 5 + Math.random() * 5,
          sh: 3 + Math.random() * 4,
        };
      }),
    [w, h]
  );
  return (
    <span className="absolute inset-0 pointer-events-none overflow-visible" aria-hidden="true">
      {bits.map((b) => (
        <motion.span
          key={b.i}
          className="absolute block rounded-[1px]"
          style={{ left: b.x, top: b.y, width: b.sw, height: b.sh, background: b.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
          animate={{ x: b.dx, y: [0, b.dy, b.dy + 140], opacity: [1, 1, 0], rotate: b.rot, scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut", times: [0, 0.4, 1] }}
        />
      ))}
    </span>
  );
}

/**
 * Quiet tracker, bottom right: "Seals n / 11" over a row of seal slots. Hidden until the first
 * seal is clicked, so visitors who never notice the game never see it.
 */
export default function SealTracker() {
  const got = useSeals();
  const flights = useFlights();
  const n = got.length;
  const total = SEAL_ORDER.length;
  const done = n === total;
  const [party, setParty] = useState(false);
  useEffect(() => {
    if (!done) return;
    setParty(true);
    const t = window.setTimeout(() => setParty(false), 2200);
    return () => window.clearTimeout(t);
  }, [done]);
  const show = n > 0 || flights.length > 0;
  const [box, setBox] = useState({ w: 240, h: 64 });
  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.button
            type="button"
            onClick={() => document.getElementById("seal-reveal")?.scrollIntoView({ behavior: "smooth", block: "center" })}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3 }}
            aria-label={`${n} of ${total} wax seals collected. Go to the hidden phrase.`}
            ref={(el) => {
              if (el && (el.offsetWidth !== box.w || el.offsetHeight !== box.h)) setBox({ w: el.offsetWidth, h: el.offsetHeight });
            }}
            className="fixed z-[60] right-3 bottom-3 md:right-7 md:bottom-6 flex flex-col items-end gap-2 rounded-xl px-3 py-2.5 cursor-pointer text-[#1F1B16] bg-[#F4EFE6]/92 backdrop-blur-md border border-[rgba(31,27,22,0.12)] shadow-[0_10px_28px_rgba(31,27,22,0.22)]"
          >
            {party && <Confetti w={box.w} h={box.h} />}
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#8A7B6A]">
              {done ? "Stay curious?" : `Seals ${n} / ${total}`}
            </span>
            <PhraseSlots size={20} track />
          </motion.button>
        )}
      </AnimatePresence>
      {flights.map((f) => (
        <FlyingSeal key={f.id} f={f} />
      ))}
    </>
  );
}
