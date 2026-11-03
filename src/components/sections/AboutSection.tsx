import { PAGE_COLUMN } from "../../lib/layout";
import { motion } from "motion/react";
import { ABOUT_PROFILE } from "../../data/portfolio";
import ProofStage from "../blocks/ProofStage";
import { AboutMain, AboutSide } from "../scenes/SceneShowcase";
import SubBlock from "../blocks/SubBlock";
import SealReveal from "../blocks/SealReveal";
import { fadeUp } from "../../lib/motion";

// The school and degree live on the education card, so the chips carry what it does not.
const CARDS = ["Content Creator", "Python", "Power BI", "Mandarin Chinese"];

const HOBBIES = [
  { title: "Rock climbing", img: "/about/climbing.jpg", alt: "Climbing shoes" },
  { title: "Tennis", img: "/about/tennis.jpg", alt: "Tennis racket and ball" },
  { title: "Travel", img: "/about/travel.jpg", alt: "Boarding pass to Japan" },
  { title: "Hiking", img: "/about/hiking.jpg", alt: "Worn hiking boots" },
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
        <SubBlock label="Outside of work" headline="Climbing, tennis, travel, hiking.">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {HOBBIES.map((h, i) => (
              <motion.figure key={h.title} {...fadeUp({ amount: 0.3, duration: 0.8, delay: i * 0.08 })}>
                <div className="overflow-hidden rounded-lg aspect-square shadow-[0_14px_34px_rgba(31,27,22,0.22)]">
                  <img src={h.img} alt={h.alt} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.05]" />
                </div>
                <figcaption className="mt-3 font-editorial-serif italic text-[clamp(1.25rem,1.8vw,1.6rem)] text-[var(--text-ink)]">
                  <span className="text-[var(--accent-oxblood)]">{h.title.charAt(0)}</span>
                  {h.title.slice(1)}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </SubBlock>

      </div>

      <SealReveal />
    </section>
  );
}
