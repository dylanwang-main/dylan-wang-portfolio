import { PAGE_COLUMN } from "../../lib/layout";
import { motion } from "motion/react";
import { ABOUT_PROFILE } from "../../data/portfolio";
import ProofStage from "../blocks/ProofStage";
import { AboutMain } from "../scenes/SceneShowcase";
import SubBlock from "../blocks/SubBlock";
import SealReveal from "../blocks/SealReveal";
import type { Hobby } from "../blocks/HobbyCard";
import HobbyStrips from "../blocks/HobbyStrips";
import { fadeUp } from "../../lib/motion";

// Notes around the portrait (left, right, left, ...), each with a collectible wax seal.
const NOTES: Record<string, string> = {
  "UC San Diego": "B.S. Data Science, expected June 2030",
  "Content Creator": "3M+ views on short-form video",
  Python: "cleaning and analyzing data",
  "Power BI": "dashboards for 30+ schools",
  "Mandarin Chinese": "bilingual",
};
const NOTE_LABELS = Object.keys(NOTES);

// Add more photos to any hobby's list and its card becomes a carousel automatically.
const HOBBIES: Hobby[] = [
  { title: "Rock climbing", images: [{ src: "/about/climbing-wall.jpg", alt: "Dylan bouldering at a climbing gym" }, { src: "/about/climbing.jpg", alt: "Climbing shoes" }] },
  { title: "Tennis", images: [{ src: "/about/tennis.jpg", alt: "Tennis racket and ball" }] },
  { title: "Travel", images: [{ src: "/about/travel.jpg", alt: "Boarding pass to Japan" }] },
  { title: "Hiking", images: [{ src: "/about/hiking.jpg", alt: "Worn hiking boots" }] },
];

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

      {/* PORTRAIT with margin notes, the same marginalia style as the project pages */}
      <ProofStage
        Main={AboutMain}
        cards={NOTE_LABELS}
        notes={NOTES}
        sealPrefix="about:"
        mainWidth="lg:w-[min(100%,460px)]"
      />

      {/* OUTSIDE OF WORK */}
      <div className="mt-[clamp(2rem,4vw,3.5rem)]">
        <SubBlock label="Outside of work" headline="Hobbies.">
          <HobbyStrips hobbies={HOBBIES} />
        </SubBlock>

      </div>

      <SealReveal />
    </section>
  );
}
