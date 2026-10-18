import { useRef } from "react";
import SectionOpener from "../scenes/SectionOpener";
import SectionContentWrapper from "./SectionContentWrapper";
import { SCENE_DWELL_VH } from "../../lib/timeline";
import { SceneData } from "../../data/portfolio";
import { PAGE_X } from "../../lib/layout";

/**
 * One chapter of the site: a full-screen scene (page A) pinned in place while the cream page
 * (page B, with its torn top edge) scrolls up over it. Add a chapter = add one of these.
 */
export default function Chapter({
  id,
  scene,
  /** Stacking order: each chapter sits above the one before it (z-30, z-40, ...). */
  zClass,
  /** Seeds for the two torn edges (dark one over the previous page, cream one on this page). */
  edgeSeed,
  pageSeed,
  children,
}: {
  id: string;
  scene: SceneData;
  zClass: string;
  edgeSeed: number;
  pageSeed: number;
  children: React.ReactNode;
}) {
  const pageRef = useRef<HTMLDivElement>(null);
  return (
    <section id={id} className={`w-full m-0 p-0 relative ${zClass}`}>
      {/* Page A: sticky, stays behind while page B rises */}
      <div className="sticky top-0 w-full h-[100svh] z-10">
        <SectionOpener scene={scene} edgeSeed={edgeSeed} nextPageRef={pageRef} />
      </div>

      {/* Dwell: the scene holds, composed, for a beat (scroll-scrubbed, never slowed) */}
      <div aria-hidden="true" style={{ height: `${SCENE_DWELL_VH * 100}vh` }} />

      {/* Page B: normal flow, torn edge on top overlapping page A */}
      <SectionContentWrapper ref={pageRef} seed={pageSeed}>
        {children}
      </SectionContentWrapper>
    </section>
  );
}

/** Standard inner column for a chapter page built from blocks (Work, Content). */
export function ChapterPage({ children }: { children: React.ReactNode }) {
  return (
    <div className={`w-full ${PAGE_X} max-w-[1400px] pt-[clamp(8rem,16vw,16rem)] pb-[clamp(14rem,18vw,18rem)]`}>
      {children}
    </div>
  );
}
