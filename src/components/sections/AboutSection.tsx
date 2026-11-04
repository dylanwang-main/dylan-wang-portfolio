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
const P = "/about/hobbies/";
const HOBBIES: Hobby[] = [
  {
    title: "Sports",
    images: [
      { src: P + "sports-climbing.jpg", alt: "Bouldering at a climbing gym", position: "50% 55%" },
      { src: P + "sports-tennis.jpg", alt: "With coaches after a tennis match", position: "50% 40%" },
      { src: P + "sports-halfdome.jpg", alt: "Sitting above Half Dome in Yosemite", position: "40% 65%" },
      { src: P + "sports-summit.jpg", alt: "Celebrating on a summit with a friend", position: "50% 45%" },
      { src: P + "sports-gym.jpg", alt: "Flexing after a gym session", position: "50% 30%" },
    ],
  },
  {
    title: "Travel",
    images: [
      { src: P + "travel-inari.jpg", alt: "Fushimi Inari shrine gates in Kyoto", position: "40% 60%" },
      { src: P + "travel-waterfall.jpg", alt: "Standing in front of a waterfall", position: "50% 70%" },
      { src: P + "travel-snorkel.jpg", alt: "Snorkeling off a green coastline", position: "50% 50%" },
      { src: P + "travel-yosemite.jpg", alt: "A waterfall in Yosemite", position: "50% 45%" },
      { src: P + "travel-friends.jpg", alt: "With friends at a jungle waterfall", position: "50% 40%" },
    ],
  },
  {
    title: "Food",
    images: [
      { src: P + "food-ramen.jpg", alt: "A bowl of tonkotsu ramen", position: "50% 55%" },
      { src: P + "food-okonomiyaki.jpg", alt: "Two okonomiyaki topped with fried eggs", position: "50% 50%" },
      { src: P + "food-tuna.jpg", alt: "Fresh tuna cuts at a market", position: "50% 40%" },
      { src: P + "food-crepe.jpg", alt: "A matcha crepe with berries", position: "50% 50%" },
      { src: P + "food-ramen-duo.jpg", alt: "Two bowls of ramen at a counter", position: "50% 55%" },
      { src: P + "food-tantan.jpg", alt: "Tantanmen set with side dishes", position: "50% 50%" },
      { src: P + "food-pancakes.jpg", alt: "Matcha souffle pancakes", position: "50% 55%" },
      { src: P + "food-matcha.jpg", alt: "Matcha latte and a block of matcha", position: "50% 45%" },
      { src: P + "food-steak.jpg", alt: "A seared steak with rosemary", position: "50% 50%" },
      { src: P + "food-drinks.jpg", alt: "Iced coffee and tea", position: "50% 55%" },
    ],
  },
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
