import { PAGE_COLUMN } from "../../lib/layout";
import { useState } from "react";
import { motion } from "motion/react";
import { CONTACT_EMAIL, SOCIAL_LINKS, RESUME_LINK, WORK_PROJECTS, CONTENT_PROJECT } from "../../data/portfolio";
import ProofStage from "../blocks/ProofStage";
import FloatingWords from "../blocks/FloatingWords";
import { ContactMain } from "../scenes/SceneShowcase";
import { Mail, Check, Copy } from "lucide-react";
import { fadeUp } from "../../lib/motion";

const WORDS = Array.from(
  new Set([...WORK_PROJECTS.flatMap((p) => p.tools), ...CONTENT_PROJECT.tools])
).map((t) => "/" + t.toLowerCase().replace(/\s+/g, "-"));

export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API is restricted
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section className={`pt-[clamp(4rem,7vw,6.5rem)] pb-[clamp(11rem,13vw,12rem)] ${PAGE_COLUMN}`}>
      {/* STATEMENT (centred: the closing chapter reads as one column) */}
      <motion.div {...fadeUp()} className="text-center">
        <h3 className="statement-title font-editorial-serif italic text-[clamp(3.2rem,7.6vw,8rem)] leading-[0.98] tracking-[-0.02em] text-[var(--text-ink)] max-w-[14ch] mx-auto text-balance">
          Let’s start a conversation.
        </h3>
        <span className="mt-10 block text-[12px] uppercase tracking-[0.22em] text-[var(--taupe-subtle)] font-semibold">Open to</span>
        <p className="lead mt-3 max-w-[30ch] mx-auto text-balance">
          UCSD data and tech orgs, recruiters, brand partners, and future consulting clients.
        </p>
      </motion.div>

      {/* Drifting tool words */}
      <FloatingWords words={WORDS} className="mt-[clamp(2rem,4vw,3rem)]" />

      {/* PROOF: the message window + platform cards */}
      <ProofStage
        Main={ContactMain}
        cards={SOCIAL_LINKS.map((l) => l.platform)}
        mainWidth="lg:w-[min(100%,820px)]"
        className="mt-[clamp(2rem,4vw,4rem)]"
      />

      {/* ACTIONS: same width as the message window, centred under it */}
      <motion.div {...fadeUp({ amount: 0.3 })} className="mt-[clamp(2.5rem,5vw,4rem)] mx-auto w-full max-w-[820px]">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--text-ink)] text-[var(--bg-cream)] text-xs md:text-sm font-medium uppercase tracking-widest hover:bg-[var(--accent-oxblood)] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-oxblood)]"
        >
          <Mail className="w-4 h-4" />
          <span>Email {CONTACT_EMAIL}</span>
        </a>
        <div className="mt-3 flex justify-center">
          <button
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--accent-oxblood)] hover:underline focus:outline-none cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy address</span>
              </>
            )}
          </button>
        </div>

        {/* PROFILES: one card each, same grid as the button above */}
        <span className="mt-12 block text-center text-[12px] uppercase tracking-[0.22em] text-[var(--taupe-subtle)] font-semibold">
          Profiles
        </span>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...SOCIAL_LINKS.map((l) => ({ name: l.platform, url: l.url, handle: l.handleLabel })), { name: RESUME_LINK.label, url: RESUME_LINK.url, handle: "PDF, one page" }].map((l) => (
            <a
              key={l.name}
              href={l.url}
              target="_blank"
              rel="noopener"
              className="group flex flex-col justify-between gap-6 p-4 rounded-lg border border-[var(--border-hairline)] bg-[#FBF8F2] hover:border-[var(--accent-oxblood)] hover:-translate-y-0.5 transition-all"
            >
              <span className="flex items-start justify-between gap-2">
                <span className="font-editorial-serif italic text-[1.45rem] leading-none text-[var(--text-ink)] group-hover:text-[var(--accent-oxblood)] transition-colors">{l.name}</span>
                <span aria-hidden="true" className="text-[var(--taupe-subtle)] group-hover:text-[var(--accent-oxblood)] transition-colors">↗</span>
              </span>
              <span className="text-[12px] text-[var(--taupe-subtle)] truncate">{l.handle}</span>
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
