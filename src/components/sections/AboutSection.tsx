import { PAGE_COLUMN } from "../../lib/layout";
import { motion } from "motion/react";
import { ABOUT_PROFILE, EXPERIENCE, EDUCATION, LEADERSHIP, SKILLS, RESUME_LINK } from "../../data/portfolio";
import IndexPanel, { IndexList, SkillList } from "../blocks/IndexPanel";
import ProofStage from "../blocks/ProofStage";
import { AboutMain, AboutSide } from "../scenes/SceneShowcase";
import SubBlock from "../blocks/SubBlock";
import CardFan from "../blocks/CardFan";
import { TileGrid } from "../blocks/MediaSlots";
import { fadeUp } from "../../lib/motion";

const CARDS = ["UC San Diego", "Data Science", "Content Creator", "Mandarin Chinese"];

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
          <p className="lead">
            {ABOUT_PROFILE.summary}
          </p>
        </div>
      </motion.div>

      {/* PROOF: portrait window + floating facts */}
      <ProofStage Main={AboutMain} Side={AboutSide} cards={CARDS} mainWidth="lg:w-[min(100%,480px)]" />


      {/* SUB-BLOCKS (placeholder copy and image slots; swap in real photos) */}
      <div className="mt-[clamp(2rem,4vw,3.5rem)]">
        <SubBlock label="Background" headline="Data science student. Content creator.">
          <TileGrid
            aspect="4/3"
            tiles={[
              { title: "UC San Diego", note: "[Add: campus photo]" },
              { title: "Data Science", note: "[Add: project or classroom photo]" },
              { title: "Content creator", note: "[Add: filming photo]" },
            ]}
          />
        </SubBlock>

        <SubBlock label="Leadership" headline="Mentoring five students. Teaching twenty more.">
          <CardFan
            cards={[
              { label: "PHOTO: mentorship cohort", recommendedSize: "4:5 / 1080 × 1350" },
              { label: "PHOTO: coding workshop", recommendedSize: "4:5 / 1080 × 1350" },
              { label: "PHOTO: Discovery Cube volunteering", recommendedSize: "4:5 / 1080 × 1350" },
            ]}
          />
        </SubBlock>
      </div>

      {/* INDEX: the resume at a glance */}
      <SubBlock label="At a glance" headline="Experience, education, and the rest." linkLabel="Download resume" href={RESUME_LINK.url}>
        <IndexPanel>
          <IndexList heading="Experience" entries={EXPERIENCE} />
          <IndexList heading="Education" entries={EDUCATION} />
          <IndexList heading="Leadership & Volunteering" entries={LEADERSHIP} />
          <SkillList groups={SKILLS} />
        </IndexPanel>
      </SubBlock>
    </section>
  );
}
