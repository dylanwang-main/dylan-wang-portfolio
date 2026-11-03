import { PAGE_COLUMN } from "../../lib/layout";
import { motion } from "motion/react";
import { ABOUT_PROFILE } from "../../data/portfolio";
import ProofStage from "../blocks/ProofStage";
import { AboutMain, AboutSide } from "../scenes/SceneShowcase";
import SubBlock from "../blocks/SubBlock";
import { TileGrid } from "../blocks/MediaSlots";
import { fadeUp } from "../../lib/motion";

// The school and degree live on the education card, so the chips carry what it does not.
const CARDS = ["Content Creator", "Python", "Power BI", "Mandarin Chinese"];

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
      <ProofStage
        Main={AboutMain}
        Side={AboutSide}
        cards={CARDS}
        mainWidth="lg:w-[min(100%,480px)]"
        gridCols="grid-cols-[minmax(130px,190px)_minmax(0,480px)_minmax(150px,230px)] justify-center"
        sideHeight=""
      />


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

      </div>

    </section>
  );
}
