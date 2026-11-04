import { PAGE_COLUMN } from "../../lib/layout";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { CONTACT_EMAIL, SOCIAL_LINKS, RESUME_LINK } from "../../data/portfolio";
import { SealFace } from "../blocks/ProofStage";
import { Check, Copy } from "lucide-react";
import { fadeUp } from "../../lib/motion";

const LINKS = [
  ...SOCIAL_LINKS.map((l) => ({ name: l.platform, url: l.url, hint: l.handleLabel })),
  { name: RESUME_LINK.label, url: RESUME_LINK.url, hint: "PDF" },
];

const PILL =
  "pop-btn inline-flex items-center gap-2 rounded-full border border-[var(--text-ink)]/25 px-4 py-2 text-[13px] font-medium text-[var(--text-ink)] cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-oxblood)]";

export default function ContactSection() {
  const [pop, setPop] = useState(0);
  const [copied, setCopied] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  // the seal presses down, then the mail app opens (plain mailto, nothing pre-written)
  const sendEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    setPop((n) => n + 1);
    later(() => {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }, 450);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
    } catch {
      /* clipboard can be restricted; still show the confirmation */
    }
    setCopied(true);
    later(() => setCopied(false), 2200);
  };

  return (
    <section className={`pt-[clamp(4rem,7vw,6.5rem)] pb-[clamp(9rem,12vw,12rem)] ${PAGE_COLUMN}`}>
      {/* STATEMENT */}
      <motion.div {...fadeUp()} className="text-center">
        <h3 className="statement-title font-editorial-serif italic text-[clamp(3.2rem,7.6vw,8rem)] leading-[0.98] tracking-[-0.02em] text-[var(--text-ink)] max-w-[14ch] mx-auto text-balance">
          Let’s start a conversation.
        </h3>
        <p className="lead mt-10 max-w-[30ch] mx-auto text-balance">
          Open to chatting about anything, really.
        </p>
      </motion.div>

      {/* ONE WAY IN: press the seal to email */}
      <motion.div {...fadeUp({ amount: 0.3 })} className="mt-[clamp(3rem,6vw,5rem)] flex flex-col items-center">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          onClick={sendEmail}
          aria-label={`Email Dylan at ${CONTACT_EMAIL}`}
          className="pop-host group flex flex-col items-center gap-5 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-oxblood)] rounded-lg"
        >
          <span
            key={pop}
            className={`block h-[clamp(6rem,9vw,7.5rem)] w-[clamp(6rem,9vw,7.5rem)] transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-105 ${pop ? "seal-pop" : ""}`}
            style={{ filter: "drop-shadow(0 6px 10px rgba(63,22,22,0.35))" }}
          >
            <SealFace seed="contact-seal" glyph="DW" />
          </span>
          <span className="pop-line font-editorial-serif italic text-[clamp(1.7rem,3.2vw,2.6rem)] leading-none text-[var(--text-ink)] break-all text-center">
            {CONTACT_EMAIL}
          </span>
        </a>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={copy} aria-live="polite" className={PILL}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied" : "Copy email"}</span>
          </button>
          {LINKS.map((l) => (
            <a key={l.name} href={l.url} target="_blank" rel="noopener" title={l.hint} className={PILL}>
              <span>{l.name}</span>
              <span aria-hidden="true" className="pop-arrow">↗</span>
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
