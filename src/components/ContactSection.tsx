import { useState } from "react";
import { motion } from "motion/react";
import { CONTACT_EMAIL, SOCIAL_LINKS, RESUME_LINK } from "../data/portfolio";
import { Mail, Check, Copy } from "lucide-react";

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
    <section className="py-[clamp(8rem,16vw,16rem)] px-6 sm:px-10 md:pl-[170px] lg:pl-[190px] xl:pl-[210px] md:pr-10 lg:pr-14 max-w-[1400px] w-full">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center space-y-[var(--space-lg)]"
      >
        {/* Main Invitation */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs uppercase tracking-widest text-[var(--taupe-subtle)] font-medium">
            Inquiries & Direct Correspondence
          </span>
          <h3 className="statement-title font-editorial-serif italic text-[clamp(3rem,7vw,7rem)] tracking-[-0.02em] text-[var(--text-ink)] leading-[1]">
            Let’s start a conversation.
          </h3>
          <p className="font-editorial-sans text-[18px] md:text-[20px] text-[var(--taupe-subtle)] leading-relaxed">
            Available for UCSD data and tech orgs, recruiters, brand partners,
            and future consulting clients.
          </p>
        </div>

        {/* Primary Mailto Action & Copy Bar */}
        <div className="w-full max-w-lg bg-[var(--card-cream)]/70 border border-[var(--border-hairline)] p-6 md:p-8 flex flex-col items-center gap-5">
          <span className="text-[11px] uppercase tracking-widest text-[var(--taupe-subtle)] font-semibold">
            Direct Email Channel
          </span>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[var(--text-ink)] text-[var(--bg-cream)] text-xs md:text-sm font-medium uppercase tracking-widest hover:bg-[var(--accent-oxblood)] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-oxblood)]"
          >
            <Mail className="w-4 h-4" />
            <span>Open Mail App ({CONTACT_EMAIL})</span>
          </a>

          <div className="flex items-center justify-center gap-3 text-xs text-[var(--taupe-subtle)]">
            <span className="font-mono text-[var(--text-ink)] font-medium">
              {CONTACT_EMAIL}
            </span>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1.5 text-xs text-[var(--accent-oxblood)] hover:underline focus:outline-none"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Address</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social & Resume Placeholder Channels */}
        <div className="w-full pt-8 border-t border-[var(--border-hairline)]">
          <span className="block text-[11px] uppercase tracking-widest text-[var(--taupe-subtle)] mb-6 font-semibold">
            Digital Profiles & Platforms
          </span>

          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm">
            {SOCIAL_LINKS.map((link) => (
              <div
                key={link.platform}
                className="flex items-center gap-1.5 text-[var(--taupe-subtle)]"
                title={`${link.platform} profile coming soon`}
              >
                <span className="font-medium text-[var(--text-ink)]">
                  {link.platform}
                </span>
                <span className="text-xs text-[var(--taupe-subtle)]/75 italic">
                  (coming soon)
                </span>
              </div>
            ))}

            <div
              className="flex items-center gap-1.5 text-[var(--taupe-subtle)]"
              title="Resume link coming soon"
            >
              <span className="font-medium text-[var(--text-ink)]">
                {RESUME_LINK.label}
              </span>
              <span className="text-xs text-[var(--taupe-subtle)]/75 italic">
                (coming soon)
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
