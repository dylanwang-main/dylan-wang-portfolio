import { motion } from "motion/react";
import { SEAL_ORDER, SEAL_PHRASE, resetSeals, useSeals } from "../../lib/seals";
import { PhraseSlots } from "./SealTracker";

/** End of About: the phrase the seals spell, blank until every seal is collected. */
export default function SealReveal() {
  const got = useSeals();
  const total = SEAL_ORDER.length;
  const done = got.length === total;
  return (
    <div id="seal-reveal" className="mt-[clamp(4rem,8vw,7rem)] pt-10 border-t border-[var(--border-hairline)] text-center">
      <span className="block text-[12px] uppercase tracking-[0.22em] text-[var(--taupe-subtle)]">Hidden in the margins</span>
      {done ? (
        <motion.p
          key="done"
          initial={{ opacity: 0, scale: 1.25, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-6 font-editorial-serif italic text-[clamp(3rem,8vw,7rem)] leading-none text-[var(--accent-oxblood)]"
        >
          {SEAL_PHRASE.charAt(0) + SEAL_PHRASE.slice(1).toLowerCase()}?
        </motion.p>
      ) : null}
      <div className="mt-8 flex justify-center">
        <PhraseSlots size={44} />
      </div>
      <p className="mt-6 text-[15px] text-[var(--text-ink)]/70">
        {done
          ? "You found every wax seal on the site. Thanks for looking closely."
          : got.length === 0
            ? `There are ${total} wax seals hidden beside my work. Click each one to collect it.`
            : `${got.length} of ${total} wax seals found. The rest are beside my work.`}
      </p>
      {done && (
        <button type="button" onClick={resetSeals} className="mt-4 text-[12px] uppercase tracking-[0.2em] text-[var(--taupe-subtle)] hover:text-[var(--text-ink)] cursor-pointer">
          Hide them again
        </button>
      )}
    </div>
  );
}
