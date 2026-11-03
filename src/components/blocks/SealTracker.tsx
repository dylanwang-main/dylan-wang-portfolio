import { AnimatePresence, motion } from "motion/react";
import { SEAL_LETTERS, SEAL_ORDER, SEAL_PHRASE, useSeals } from "../../lib/seals";

/** Letter slots for the phrase: collected seals show their letter, the rest a short rule. */
export function PhraseSlots({ size = "sm" }: { size?: "sm" | "lg" }) {
  const got = useSeals();
  let k = 0;
  const big = size === "lg";
  return (
    <span className={`inline-flex items-end ${big ? "gap-[0.16em]" : "gap-[3px]"}`} aria-hidden="true">
      {SEAL_PHRASE.split("").map((ch, i) => {
        if (ch === " ") return <span key={i} className={big ? "w-[0.45em]" : "w-2"} />;
        const slot = k++;
        const on = got.includes(SEAL_ORDER[slot]);
        return (
          <span key={i} className={`relative inline-flex justify-center ${big ? "w-[0.6em]" : "w-[9px]"}`}>
            <AnimatePresence initial={false}>
              {on && (
                <motion.span
                  initial={{ opacity: 0, y: big ? -18 : -6, scale: 1.6 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                  className="text-[var(--accent-oxblood)]"
                >
                  {SEAL_LETTERS[slot]}
                </motion.span>
              )}
            </AnimatePresence>
            {!on && <span className={`block ${big ? "h-[2px] w-full mb-[0.15em]" : "h-px w-full mb-[3px]"} bg-current opacity-35`} />}
          </span>
        );
      })}
    </span>
  );
}

/**
 * Quiet progress tag, bottom right. Hidden until the first seal is collected, so visitors who
 * never notice the game never see it.
 */
export default function SealTracker() {
  const got = useSeals();
  const n = got.length;
  const total = SEAL_ORDER.length;
  const done = n === total;
  return (
    <AnimatePresence>
      {n > 0 && (
        <motion.button
          type="button"
          onClick={() => document.getElementById("seal-reveal")?.scrollIntoView({ behavior: "smooth", block: "center" })}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.4 }}
          aria-label={`${n} of ${total} wax seals collected. Go to the hidden phrase.`}
          className="fixed z-[60] right-4 bottom-4 md:right-7 md:bottom-6 flex flex-col items-end gap-1.5 rounded-xl px-3.5 py-2.5 cursor-pointer text-[#1F1B16] bg-[#F4EFE6]/92 backdrop-blur-md border border-[rgba(31,27,22,0.12)] shadow-[0_10px_28px_rgba(31,27,22,0.22)]"
        >
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#8A7B6A]">
            {done ? "All seals found" : `Seals ${n} / ${total}`}
          </span>
          <span className="font-editorial-serif italic text-[15px] leading-none">
            <PhraseSlots />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
