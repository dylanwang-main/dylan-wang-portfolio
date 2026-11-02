import { useEffect, useRef, useState } from "react";
import { motion, MotionValue, useScroll } from "motion/react";
import ProofStage from "./ProofStage";
import HotspotBrowser from "./HotspotBrowser";
import { AnimatedTile, SidePopups } from "./MediaSlots";
import { ProjectData } from "../../data/portfolio";
import {
  DashboardMain,
  WorkMain,
  WorkSide,
  SiteMain,
  ContentMain,
  ContentSide,
} from "../scenes/SceneShowcase";
import { fadeUp } from "../../lib/motion";
import { useReducedMotion } from "../../lib/useReducedMotion";

interface FeatureBlockProps {
  project: ProjectData;
  index: number;
}

type Proof = {
  Main: React.ComponentType<{ build: MotionValue<number> }>;
  Side?: React.ComponentType;
};

/** Which demo window proves each project. Wireframes only: no invented numbers. */
const PROOFS: Record<string, Proof> = {
  "tusd-data-assessment": { Main: DashboardMain },
  "ds3-park-smart": { Main: WorkMain },
  "n10-dance-studios": { Main: SiteMain, Side: WorkSide },
  "personal-brand": { Main: ContentMain, Side: ContentSide },
};

/** Pin the demo on tall, wide screens; fall back to normal flow elsewhere. */
function usePinned() {
  const reduced = useReducedMotion();
  const [roomy, setRoomy] = useState(false);
  useEffect(() => {
    const f = () => setRoomy(window.innerWidth >= 1024 && window.innerHeight >= 640);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return roomy && !reduced;
}

export default function FeatureBlock({ project, index }: FeatureBlockProps) {
  const proof = PROOFS[project.id] ?? PROOFS["ds3-park-smart"];
  const { Main, Side } = proof;
  // A project with a real screenshot is shown by its hotspot browser instead of a wireframe demo.
  const hasDemo = !project.screenshot;
  const roomy = usePinned();
  const pinned = hasDemo && roomy;
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: pinP } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });

  const label = (
    <div className="flex items-center gap-3 text-[12px] uppercase tracking-[0.22em] text-[var(--taupe-subtle)] font-medium">
      <span>0{index + 1}</span>
      <span aria-hidden="true" className="block w-8 h-px bg-[var(--taupe-subtle)]/50" />
      <span>{project.category}</span>
    </div>
  );

  const meta = project.meta || project.links?.length ? (
    <>
      {project.meta && <p className="mt-3 text-[12px] uppercase tracking-[0.16em] text-[var(--taupe-subtle)]">{project.meta}</p>}
      {project.links && project.links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2.5">
          {project.links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--text-ink)]/25 px-4 py-2 text-[13px] font-medium text-[var(--text-ink)] hover:bg-[var(--accent-pop)] hover:border-[var(--accent-pop)] hover:text-white transition-colors"
            >
              {l.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      )}
    </>
  ) : null;
  const hasSlots = !!project.slots && project.slots.length > 0;
  const hasStats = !!project.stats && project.stats.length > 0;
  const statsBottom = !!project.statsAtBottom && hasStats;

  const statsRow = hasStats ? (
    <motion.dl
      {...fadeUp({ amount: 0.3, duration: 0.8 })}
      className={
        statsBottom
          ? `w-full mx-auto pt-8 border-t border-[var(--border-hairline)] grid gap-y-8 justify-items-center text-center ${project.stats!.length > 3 ? "max-w-[1000px] grid-cols-2 md:grid-cols-4" : "max-w-[860px] grid-cols-1 sm:grid-cols-3"}`
          : `mt-10 pt-6 border-t border-[var(--border-hairline)] grid grid-cols-2 gap-x-8 gap-y-6 ${project.stats!.length > 3 ? "md:grid-cols-4" : "md:grid-cols-3"}`
      }
    >
      {project.stats!.map((st) => (
        <div key={st.label}>
          <dt className="sr-only">{st.label}</dt>
          <dd className="font-editorial-serif italic text-[clamp(2.4rem,4.4vw,3.8rem)] leading-none tracking-[-0.02em] text-[var(--accent-oxblood)]">
            {st.value}
          </dd>
          <dd aria-hidden="true" className="mt-2 text-[13px] text-[var(--text-ink)]/75">{st.label}</dd>
        </div>
      ))}
    </motion.dl>
  ) : null;

  return (
    <article className={`relative border-b border-[var(--border-hairline)] last:border-b-0 ${hasSlots ? "" : "pb-[clamp(2rem,4vw,3.5rem)]"}`}>
      {/* Pinned: the screen holds still while the demo builds with scroll (Shopify's sticky chapters) */}
      <div ref={wrapRef} style={pinned ? { height: "140svh" } : undefined} className="relative">
        <div
          className={
            pinned
              ? "sticky top-0 h-svh flex flex-col justify-center pt-[76px] pb-8"
              : "py-[clamp(3.5rem,7vw,6rem)]"
          }
        >
          <motion.div
            {...fadeUp()}
          >
            {label}
            {pinned ? (
              <div className="mt-4 grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-10 items-end">
                <div>
                  <h3 className="statement-title font-editorial-serif italic text-[clamp(2.6rem,5vw,5.4rem)] leading-[0.98] tracking-[-0.02em] text-[var(--text-ink)] text-balance">
                    {project.title}
                  </h3>
                  {meta}
                </div>
                <p className="lead-sm pb-2">
                  {project.description}
                </p>
              </div>
            ) : (
              <>
                <h3 className="statement-title font-editorial-serif italic text-[clamp(3.2rem,7.6vw,8rem)] leading-[0.98] tracking-[-0.02em] text-[var(--text-ink)] mt-6 max-w-[14ch] text-balance">
                  {project.title}
                </h3>
                {meta}
                <div className="mt-10 grid grid-cols-1 lg:grid-cols-[200px_minmax(0,680px)] gap-4 lg:gap-14 items-start">
                  <span className="text-[16px] font-semibold text-[var(--text-ink)]">Overview</span>
                  <p className="lead">
                    {project.description}
                  </p>
                </div>
              </>
            )}
          </motion.div>

          {!hasDemo ? null : pinned ? (
            <ProofStage
              Main={Main}
              Side={Side}
              cards={project.tools}
              progress={pinP}
              heightClass="h-[min(46vh,470px)]"
              className="mt-8"
            />
          ) : (
            <ProofStage Main={Main} Side={Side} cards={project.tools} />
          )}

          {hasDemo && !pinned && (
            <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-[var(--taupe-subtle)]">
              Placeholder preview · {project.imagePlaceholder.label}
            </p>
          )}
        </div>
      </div>

      {hasDemo && pinned && (
        <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--taupe-subtle)]">
          Placeholder preview · {project.imagePlaceholder.label}
        </p>
      )}

      {/* RESULTS: headline numbers from the resume */}
      {!statsBottom && statsRow}
      {hasStats && !statsBottom && !project.hotspots && !hasSlots && <div className="pb-[clamp(2rem,4vw,3.5rem)]" />}

      {/* WALKTHROUGH: browser with pulsing hotspots (Shopify feature-tour pattern) */}
      {project.hotspots && project.hotspots.length > 0 && (
        <div className={`mt-10 ${hasSlots ? "" : "pb-[clamp(3.5rem,7vw,6rem)]"}`}>
          <HotspotBrowser title={project.screenshotTitle ?? project.title} hotspots={project.hotspots} image={project.screenshot} aspect={project.screenshotAspect} />
        </div>
      )}

      {/* DETAIL CARDS: art tile + title + text (Shopify card-grid pattern; tiles hold real images later) */}
      {project.slots && project.slots.length > 0 && (
        <div className={`mt-10 ${statsBottom ? "pb-10" : "pb-[clamp(3.5rem,7vw,6rem)]"} grid grid-cols-1 gap-6 md:gap-8 ${project.slots.length === 1 ? (project.slots[0].popups?.length ? "" : "md:max-w-[860px] md:mx-auto") : project.slots.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {project.slots.map((slot, i) => (
            <motion.div
              key={slot.label}
              {...fadeUp({ amount: 0.3, duration: 0.8, delay: i * 0.1 })}
              className={`group ${project.slots!.length === 1 ? "text-center" : ""}`}
            >
              {project.slotsTextOnly ? (
                <span aria-hidden="true" className="block w-8 h-px bg-[var(--accent-oxblood)]" />
              ) : slot.popups && slot.popups.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,180px)_minmax(0,1fr)_minmax(0,180px)] lg:gap-6 items-stretch">
                  <SidePopups side="left" labels={slot.popups.filter((_, k) => k % 2 === 0)} />
                  <AnimatedTile index={i} aspect={slot.aspect ?? "16/10"} image={slot.image} alt={slot.label} />
                  <SidePopups side="right" labels={slot.popups.filter((_, k) => k % 2 === 1)} offset={1} />
                </div>
              ) : (
                <AnimatedTile index={i} aspect={project.slots!.length === 1 ? "2/1" : "4/3"} image={slot.image} alt={slot.label} />
              )}
              <span className="block mt-4 text-[15px] font-semibold text-[var(--text-ink)]">
                {slot.label}
              </span>
              <span className="block mt-1.5 font-mono text-[14px] leading-snug italic text-[var(--accent-oxblood)]">
                {slot.prompt}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* RESULTS AT THE BOTTOM: centered stats row, then one centered line of text */}
      {statsBottom && (
        <div className="pb-[clamp(3.5rem,7vw,6rem)]">
          {statsRow}
          {project.statsNote && (
            <p className="mt-8 text-center font-mono text-[13px] italic text-[var(--text-ink)]/70">{project.statsNote}</p>
          )}
        </div>
      )}
    </article>
  );
}
