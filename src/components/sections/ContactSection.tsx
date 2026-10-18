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
    <section className={`pt-[clamp(6rem,12vw,11rem)] pb-[clamp(14rem,18vw,18rem)] ${PAGE_COLUMN}`}>
      {/* STATEMENT */}
      <motion.div
        {...fadeUp()}
      >
        <h3 className="statement-title font-editorial-serif italic text-[clamp(3.2rem,7.6vw,8rem)] leading-[0.98] tracking-[-0.02em] text-[var(--text-ink)] max-w-[14ch] text-balance">
          Let’s start a conversation.
        </h3>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[200px_minmax(0,680px)] gap-4 lg:gap-14 items-start">
          <span className="text-[16px] font-semibold text-[var(--text-ink)]">Open to</span>
          <p className="text-[clamp(1.35rem,2.1vw,2rem)] leading-[1.28] tracking-[-0.01em] text-[var(--text-ink)]">
            UCSD data and tech orgs, recruiters, brand partners, and future consulting clients.
          </p>
        </div>
      </motion.div>

      {/* Drifting tool words */}
      <FloatingWords words={WORDS} className="mt-[clamp(3rem,6vw,5rem)]" />

      {/* PROOF: the message window + platform cards */}
      <ProofStage
        Main={ContactMain}
        cards={SOCIAL_LINKS.map((l) => l.platform)}
        mainWidth="lg:w-[min(100%,820px)]"
        className="mt-[clamp(2rem,4vw,4rem)]"
      />

      {/* Real action: mail + copy */}
      <div className="mt-[clamp(4rem,7vw,6rem)] max-w-lg flex flex-col gap-4">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--text-ink)] text-[var(--bg-cream)] text-xs md:text-sm font-medium uppercase tracking-widest hover:bg-[var(--accent-oxblood)] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-oxblood)]"
        >
          <Mail className="w-4 h-4" />
          <span>Email {CONTACT_EMAIL}</span>
        </a>
        <button
          onClick={handleCopyEmail}
          className="self-start inline-flex items-center gap-1.5 text-sm text-[var(--accent-oxblood)] hover:underline focus:outline-none cursor-pointer"
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

      {/* Platforms */}
      <div className="mt-12 pt-8 border-t border-[var(--border-hairline)]">
        <span className="block text-[12px] uppercase tracking-[0.2em] text-[var(--taupe-subtle)] font-semibold mb-5">
          Profiles
        </span>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
          {[...SOCIAL_LINKS.map((l) => l.platform), RESUME_LINK.label].map((name) => (
            <span key={name} className="flex items-baseline gap-1.5 text-[var(--text-ink)] font-medium">
              {name}
              <span className="text-xs italic font-normal text-[var(--taupe-subtle)]">(coming soon)</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
