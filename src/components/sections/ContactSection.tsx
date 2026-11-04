import { PAGE_COLUMN } from "../../lib/layout";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { CONTACT_EMAIL, SOCIAL_LINKS, RESUME_LINK } from "../../data/portfolio";
import { SealFace } from "../blocks/ProofStage";
import { Check, Copy } from "lucide-react";
import { fadeUp, EASE } from "../../lib/motion";

/** Who is writing. Each choice sets the subject line and the opening of the letter. */
const INTENTS = [
  { numeral: "I", label: "Recruiting", subject: "Opportunity", opener: "I'm reaching out about a role at " },
  { numeral: "II", label: "A UCSD org", subject: "UCSD collaboration", opener: "I'm with a UCSD org and we'd love to talk about " },
  { numeral: "III", label: "A brand", subject: "Brand partnership", opener: "We're a brand and we'd love to work with you on " },
  { numeral: "IV", label: "Consulting", subject: "Project inquiry", opener: "I have a project I'd like to talk through: " },
];

const seed = (i: number) => `Hi Dylan,\n\n${INTENTS[i].opener}`;

const LINKS = [
  ...SOCIAL_LINKS.map((l) => ({ name: l.platform, url: l.url, hint: l.handleLabel })),
  { name: RESUME_LINK.label, url: RESUME_LINK.url, hint: "PDF" },
];

export default function ContactSection() {
  const [intent, setIntent] = useState(0);
  const [name, setName] = useState("");
  const [message, setMessage] = useState(seed(0));
  const [sealed, setSealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const pick = (i: number) => {
    // swap the opener only if the letter is still untouched, so typed words are never lost
    if (message === seed(intent) || message.trim() === "") setMessage(seed(i));
    setIntent(i);
    setSealed(false);
  };

  const subject = `${INTENTS[intent].subject}${name.trim() ? ` · ${name.trim()}` : ""}`;

  const send = () => {
    setSealed(true);
    const body = `${message.trim()}${name.trim() ? `\n\n${name.trim()}` : ""}`;
    later(() => {
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }, 750);
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
        <span className="mt-10 block text-[12px] uppercase tracking-[0.22em] text-[var(--taupe-subtle)] font-semibold">Open to</span>
        <p className="lead mt-3 max-w-[30ch] mx-auto text-balance">
          UCSD data and tech orgs, recruiters, brand partners, and future consulting clients.
        </p>
      </motion.div>

      {/* THE LETTER: pick who you are, write, seal it. Opens a pre-filled email. */}
      <motion.div
        {...fadeUp({ amount: 0.15 })}
        className="mt-[clamp(3rem,6vw,5.5rem)] mx-auto grid w-full max-w-[1040px] gap-10 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-14"
      >
        {/* who is writing */}
        <div role="radiogroup" aria-label="Who is writing" className="flex flex-col">
          <span className="text-[12px] uppercase tracking-[0.22em] text-[var(--taupe-subtle)] font-semibold">I’m writing as</span>
          <div className="mt-4 grid grid-cols-2 gap-x-6 lg:grid-cols-1">
            {INTENTS.map((it, i) => {
              const on = i === intent;
              return (
                <button
                  key={it.label}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => pick(i)}
                  className="group relative flex items-baseline gap-3 border-b border-[var(--border-hairline)] py-3.5 text-left cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-oxblood)]"
                >
                  <motion.span
                    aria-hidden="true"
                    className="absolute -bottom-px left-0 h-px bg-[var(--accent-oxblood)]"
                    initial={false}
                    animate={{ width: on ? "100%" : "0%" }}
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                  <span className={`font-editorial-serif italic text-[1.05rem] w-7 transition-colors ${on ? "text-[var(--accent-oxblood)]" : "text-[var(--taupe-subtle)]"}`}>{it.numeral}</span>
                  <span className={`font-editorial-serif italic text-[clamp(1.5rem,2vw,1.85rem)] leading-none transition-colors ${on ? "text-[var(--text-ink)]" : "text-[var(--taupe-subtle)] group-hover:text-[var(--text-ink)]"}`}>
                    {it.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* the paper */}
        <div className="relative rounded-[3px] border border-[var(--border-hairline)] bg-[#FBF8F2] px-6 py-7 shadow-[0_30px_70px_-30px_rgba(31,27,22,0.45)] sm:px-10 sm:py-9 md:-rotate-[0.4deg]">
          <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-3 border-b border-[var(--border-hairline)] pb-5">
            <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--taupe-subtle)]">To</span>
            <span className="font-editorial-serif italic text-[1.5rem] leading-none text-[var(--text-ink)]">
              Dylan Wang <span className="not-italic font-sans text-[13px] text-[var(--taupe-subtle)] ml-2 break-all">{CONTACT_EMAIL}</span>
            </span>
            <label htmlFor="contact-name" className="text-[11px] uppercase tracking-[0.22em] text-[var(--taupe-subtle)]">From</label>
            <input
              id="contact-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              className="min-w-0 bg-transparent font-editorial-serif italic text-[1.5rem] leading-none text-[var(--text-ink)] placeholder:text-[var(--taupe-subtle)]/60 focus:outline-none"
            />
            <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--taupe-subtle)]">Re</span>
            <span className="font-editorial-serif italic text-[1.5rem] leading-none text-[var(--accent-oxblood)]">{subject}</span>
          </div>

          <label htmlFor="contact-message" className="sr-only">Message</label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={7}
            spellCheck
            className="mt-4 block w-full resize-none bg-transparent font-editorial-serif italic text-[1.35rem] text-[var(--text-ink)] focus:outline-none"
            style={{
              lineHeight: "2.1rem",
              backgroundImage:
                "repeating-linear-gradient(transparent, transparent calc(2.1rem - 1px), rgba(31,27,22,0.12) calc(2.1rem - 1px), rgba(31,27,22,0.12) 2.1rem)",
              backgroundAttachment: "local",
            }}
          />

          <div className="mt-5 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={send}
              disabled={sealed}
              className="pop-btn inline-flex items-center gap-2 rounded-full border border-[var(--text-ink)]/25 px-5 py-2.5 text-[13px] font-medium tracking-wide text-[var(--text-ink)] cursor-pointer disabled:cursor-default focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-oxblood)]"
            >
              <span>{sealed ? "Opening your mail app" : "Seal and send"}</span>
              <span aria-hidden="true" className="pop-arrow">↗</span>
            </button>

            {/* the seal lands here when you send */}
            <div className="relative h-16 w-16 shrink-0" aria-hidden="true">
              <div className="absolute inset-1 rounded-full border border-dashed border-[var(--taupe-subtle)]/50" />
              {sealed && (
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 2, rotate: -30, opacity: 0 }}
                  animate={{ scale: [2, 0.9, 1], rotate: -8, opacity: 1 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  style={{ filter: "drop-shadow(0 3px 5px rgba(63,22,22,0.35))" }}
                >
                  <SealFace seed="contact-seal" glyph="DW" />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ELSEWHERE: one row of the same pill buttons used across the site */}
      <motion.div
        {...fadeUp({ amount: 0.5 })}
        className="mt-[clamp(3rem,5vw,4.5rem)] mx-auto flex w-full max-w-[1040px] flex-wrap items-center justify-center gap-3 border-t border-[var(--border-hairline)] pt-8"
      >
        <button
          type="button"
          onClick={copy}
          aria-live="polite"
          className="pop-btn inline-flex items-center gap-2 rounded-full border border-[var(--text-ink)]/25 px-4 py-2 text-[13px] font-medium text-[var(--text-ink)] cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-oxblood)]"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? "Copied" : CONTACT_EMAIL}</span>
        </button>
        {LINKS.map((l) => (
          <a
            key={l.name}
            href={l.url}
            target="_blank"
            rel="noopener"
            title={l.hint}
            className="pop-btn inline-flex items-center gap-2 rounded-full border border-[var(--text-ink)]/25 px-4 py-2 text-[13px] font-medium text-[var(--text-ink)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-oxblood)]"
          >
            <span>{l.name}</span>
            <span aria-hidden="true" className="pop-arrow">↗</span>
          </a>
        ))}
      </motion.div>
    </section>
  );
}
