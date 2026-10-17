import { useRef } from "react";
import LenisProvider from "./components/LenisProvider";
import Navigation from "./components/Navigation";
import SectionOpener from "./components/SectionOpener";
import IntroBurst, { INTRO_VH, SCENE_DWELL_VH } from "./components/IntroBurst";
import FeatureBlock from "./components/FeatureBlock";
import CardFan from "./components/CardFan";
import SubBlock from "./components/SubBlock";
import { TileGrid, PromptBar } from "./components/MediaSlots";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import SectionContentWrapper from "./components/SectionContentWrapper";
import {
  WORK_PROJECTS,
  CONTENT_PROJECT,
  HERO_SCENE,
  SECTION_SCENES,
} from "./data/portfolio";

export default function App() {
  const workSectionRef = useRef<HTMLDivElement>(null);
  const workContentRef = useRef<HTMLDivElement>(null);

  const contentSectionRef = useRef<HTMLDivElement>(null);
  const contentContentRef = useRef<HTMLDivElement>(null);

  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const aboutContentRef = useRef<HTMLDivElement>(null);

  const contactSectionRef = useRef<HTMLDivElement>(null);
  const contactContentRef = useRef<HTMLDivElement>(null);

  return (
    <LenisProvider>
      <div className="min-h-screen w-full bg-[#161310] text-[var(--text-ink)] selection:bg-[var(--accent-oxblood)] selection:text-[var(--bg-cream)]">
        {/* Floating Two-State Navigation */}
        <Navigation />

        {/* Main Content Stream with Pair Structure */}
        <div className="w-full">
          <main className="w-full">
            {/* SECTION I: WORK */}
            <section
              id="work-section"
              ref={workSectionRef}
              aria-labelledby="section-work-heading"
              className="w-full m-0 p-0 relative z-20"
            >
              {/* Anchors: #hero is the very top, #work is where the intro has finished */}
              <div id="hero" aria-hidden="true" className="absolute top-0 left-0 h-px w-px pointer-events-none" />
              <div
                id="work"
                aria-hidden="true"
                className="absolute left-0 w-full bottom-0 pointer-events-none"
                style={{ top: `${INTRO_VH * 100}vh` }}
              />

              {/* Pinned intro: hero -> big bang -> Work scene. Stays pinned for the whole section. */}
              <IntroBurst
                heroScene={HERO_SCENE}
                workScene={SECTION_SCENES.work}
                nextPageRef={workContentRef}
              />

              {/* Scroll runway the intro plays across (transparent; the pinned stage stays on screen) */}
              <div aria-hidden="true" style={{ height: `${(INTRO_VH + 1 + SCENE_DWELL_VH) * 100}vh`, marginTop: "-100svh" }} />

              {/* Page B: normal flow, directly below A, with torn edge attached to top overlapping A */}
              <SectionContentWrapper ref={workContentRef} seed={101} folio="I · Work">
                <div className="w-full px-6 sm:px-10 md:pl-[170px] lg:pl-[190px] xl:pl-[210px] md:pr-10 lg:pr-14 max-w-[1400px] pt-[clamp(8rem,16vw,16rem)] pb-[clamp(14rem,18vw,18rem)]">
                  <div>
                    {WORK_PROJECTS.map((project, idx) => (
                      <FeatureBlock
                        key={project.id}
                        project={project}
                        index={idx}
                        reverse={idx % 2 !== 0}
                      />
                    ))}
                  </div>
                </div>
              </SectionContentWrapper>
            </section>

            {/* SECTION II: CONTENT */}
            <section
              id="content"
              ref={contentSectionRef}
              aria-labelledby="section-content-heading"
              className="w-full m-0 p-0 relative z-30"
            >
              {/* Page A: position sticky, top 0, height 100svh, so it stays behind */}
              <div className="sticky top-0 w-full h-[100svh] z-10">
                <SectionOpener
                  scene={SECTION_SCENES.content}
                  edgeSeed={201}
                  nextPageRef={contentContentRef}
                />
              </div>

              {/* Dwell: scene stays pinned and composed for a beat (scroll-scrubbed, never slowed) */}
              <div aria-hidden="true" style={{ height: `${SCENE_DWELL_VH * 100}vh` }} />

              {/* Page B: normal flow, directly below A, with torn edge attached to top overlapping A */}
              <SectionContentWrapper ref={contentContentRef} seed={202} folio="II · Content">
                <div className="w-full px-6 sm:px-10 md:pl-[170px] lg:pl-[190px] xl:pl-[210px] md:pr-10 lg:pr-14 max-w-[1400px] pt-[clamp(8rem,16vw,16rem)] pb-[clamp(14rem,18vw,18rem)]">
                  {/* Featured Content Project Overview */}
                  <FeatureBlock project={CONTENT_PROJECT} index={0} />

                  <SubBlock
                    label="Short-form"
                    headline="Hooks that earn the next second."
                    linkLabel="See the breakdown"
                  >
                    <CardFan
                      cards={[
                        { label: "STILL: short-form video concept & hook", recommendedSize: "9:16 vertical / 1080 × 1920" },
                        { label: "WORKFLOW: DaVinci Resolve editing timeline", recommendedSize: "16:9 cinematic / 1920 × 1080" },
                        { label: "METRIC / STORYBOARD: audience insight deck", recommendedSize: "4:5 editorial / 1080 × 1350" },
                      ]}
                    />
                  </SubBlock>

                  <SubBlock label="Process" headline="From raw footage to a clean cut." linkLabel="How I edit">
                    <TileGrid
                      tiles={[
                        { title: "Plan", note: "[Add: storyboard still]" },
                        { title: "Shoot", note: "[Add: behind the scenes]" },
                        { title: "Edit", note: "[Add: timeline frame]" },
                      ]}
                    />
                  </SubBlock>

                  <SubBlock label="Workflow" headline="Ask better questions of the data." linkLabel="See the tools">
                    <PromptBar
                      prompt="Which hooks held viewers past 3 seconds?"
                      chips={["Retention", "Audience", "Posting time"]}
                    />
                  </SubBlock>
                </div>
              </SectionContentWrapper>
            </section>

            {/* SECTION III: ABOUT */}
            <section
              id="about"
              ref={aboutSectionRef}
              aria-labelledby="section-about-heading"
              className="w-full m-0 p-0 relative z-40"
            >
              {/* Page A: position sticky, top 0, height 100svh, so it stays behind */}
              <div className="sticky top-0 w-full h-[100svh] z-10">
                <SectionOpener
                  scene={SECTION_SCENES.about}
                  edgeSeed={301}
                  nextPageRef={aboutContentRef}
                />
              </div>

              {/* Dwell: scene stays pinned and composed for a beat (scroll-scrubbed, never slowed) */}
              <div aria-hidden="true" style={{ height: `${SCENE_DWELL_VH * 100}vh` }} />

              {/* Page B: normal flow, directly below A, with torn edge attached to top overlapping A */}
              <SectionContentWrapper ref={aboutContentRef} seed={302} folio="III · About">
                <AboutSection />
              </SectionContentWrapper>
            </section>

            {/* SECTION IV: CONTACT */}
            <section
              id="contact"
              ref={contactSectionRef}
              aria-labelledby="section-contact-heading"
              className="w-full m-0 p-0 relative z-50"
            >
              {/* Page A: position sticky, top 0, height 100svh, so it stays behind */}
              <div className="sticky top-0 w-full h-[100svh] z-10">
                <SectionOpener
                  scene={SECTION_SCENES.contact}
                  edgeSeed={401}
                  nextPageRef={contactContentRef}
                />
              </div>

              {/* Dwell: scene stays pinned and composed for a beat (scroll-scrubbed, never slowed) */}
              <div aria-hidden="true" style={{ height: `${SCENE_DWELL_VH * 100}vh` }} />

              {/* Page B: normal flow, directly below A, with torn edge attached to top overlapping A */}
              <SectionContentWrapper ref={contactContentRef} seed={402} folio="IV · Contact">
                <ContactSection />
              </SectionContentWrapper>
            </section>
          </main>

          {/* Quiet Monograph Footer */}
          <div className="relative z-50">
            <Footer />
          </div>
        </div>
      </div>
    </LenisProvider>
  );
}
