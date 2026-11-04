import { PAGE_COLUMN } from "../../lib/layout";
import { motion } from "motion/react";
import { ABOUT_PROFILE } from "../../data/portfolio";
import ProofStage from "../blocks/ProofStage";
import { AboutMain, AboutSide } from "../scenes/SceneShowcase";
import SubBlock from "../blocks/SubBlock";
import SealReveal from "../blocks/SealReveal";
import HobbyCard, { type Hobby } from "../blocks/HobbyCard";
import { fadeUp } from "../../lib/motion";

// The school and degree live on the education card, so the chips carry what it does not.
const CARDS = ["Content Creator", "Python", "Power BI", "Mandarin Chinese"];

// Add more photos to any hobby's list and its card becomes a carousel automatically.
const HOBBIES: Hobby[] = [
  { title: "Rock climbing", images: [{ src: "/about/climbing.jpg", alt: "Climbing shoes" }] },
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

      {/* PROOF: portrait window + floating facts */}
      <ProofStage
        Main={AboutMain}
        Side={AboutSide}
        cards={CARDS}
        mainWidth="lg:w-[min(100%,480px)]"
        gridCols="grid-cols-[minmax(130px,190px)_minmax(0,480px)_minmax(150px,230px)] justify-center"
        sideHeight=""
      />


      {/* OUTSIDE OF WORK */}
      <div className="mt-[clamp(2rem,4vw,3.5rem)]">
        <SubBlock label="Outside of work" headline="Hobbies.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
            {HOBBIES.map((h, i) => (
              <HobbyCard key={h.title} hobby={h} index={i} />
            ))}
          </div>
        </SubBlock>

      </div>

      <SealReveal />
    </section>
  );
}
