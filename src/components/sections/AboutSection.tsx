import { PAGE_COLUMN } from "../../lib/layout";
import { motion } from "motion/react";
import { ABOUT_PROFILE } from "../../data/portfolio";
import ProofStage from "../blocks/ProofStage";
import { AboutMain, AboutSide } from "../scenes/SceneShowcase";
import SubBlock from "../blocks/SubBlock";
import CardFan from "../blocks/CardFan";
import { TileGrid } from "../blocks/MediaSlots";
import { fadeUp } from "../../lib/motion";

const CARDS = ["UC San Diego", "Data Science", "Content Creator", "Short-form Content"];

export default function AboutSection() {
  return (
    <section className={`pt-[clamp(4rem,7vw,6.5rem)] pb-[clamp(11rem,13vw,12rem)] ${PAGE_COLUMN}`}>
      {/* STATEMENT */}
      <motion.div
        {...fadeUp()}
      >
        <h3 className="statement-title font-editorial-serif italic text-[clamp(3.2rem,7.6vw,8rem)] leading-[0.98] tracking-[-0.02em] text-[var(--text-ink)]">
          Dylan Wang
        </h3>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[200px_minmax(0,680px)] gap-4 lg:gap-14 items-start">
          <span className="text-[16px] font-semibold text-[var(--text-ink)]">Overview</span>
          <p className="text-[clamp(1.35rem,2.1vw,2rem)] leading-[1.28] tracking-[-0.01em] text-[var(--text-ink)]">
            Incoming data science student at UC San Diego. Also a content creator.
          </p>
        </div>
      </motion.div>

      {/* PROOF: portrait window + floating facts */}
      <ProofStage Main={AboutMain} Side={AboutSide} cards={CARDS} mainWidth="lg:w-[min(100%,480px)]" />

      <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-[var(--taupe-subtle)]">
        Placeholder preview · {ABOUT_PROFILE.photoPlaceholder.label}
      </p>

      {/* SUB-BLOCKS (placeholder copy and image slots; swap in real photos) */}
      <div className="mt-[clamp(2rem,4vw,3.5rem)]">
        <SubBlock label="Background" headline="Data by training, storytelling by habit.">
          <TileGrid
            aspect="4/3"
            tiles={[
              { title: "UC San Diego", note: "[Add: campus photo]" },
              { title: "Data Science", note: "[Add: project or classroom photo]" },
              { title: "Content creator", note: "[Add: filming photo]" },
            ]}
          />
        </SubBlock>

        <SubBlock label="Leadership" headline="Captained a team. Coached players. Mentored students.">
          <CardFan
            cards={[
              { label: "PHOTO: JV tennis team", recommendedSize: "4:5 / 1080 × 1350" },
              { label: "PHOTO: coaching a session", recommendedSize: "4:5 / 1080 × 1350" },
              { label: "PHOTO: mentoring students", recommendedSize: "4:5 / 1080 × 1350" },
            ]}
          />
        </SubBlock>
      </div>

      {/* DETAILS */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-8 pt-8 border-t border-[var(--border-hairline)]">
        <div>
          <span className="block text-[12px] uppercase tracking-[0.2em] text-[var(--taupe-subtle)] font-semibold mb-3">
            Open to
          </span>
          <ul className="space-y-2 text-[15px] text-[var(--text-ink)]">
            {ABOUT_PROFILE.audiences.map((a) => (
              <li key={a} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-oxblood)] shrink-0" />
                {a}
              </li>
            ))}
          </ul>
        </div>
        {ABOUT_PROFILE.slots.map((slot) => (
          <div key={slot.title}>
            <span className="block text-[12px] uppercase tracking-[0.2em] text-[var(--taupe-subtle)] font-semibold mb-2">
              {slot.title}
            </span>
            <span className="block font-mono text-[14px] italic text-[var(--accent-oxblood)]">
              {slot.placeholder}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
