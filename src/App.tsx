import { useRef } from "react";
import LenisProvider from "./components/layout/LenisProvider";
import Navigation from "./components/layout/Navigation";
import SealTracker from "./components/blocks/SealTracker";
import IntroBurst from "./components/intro/IntroBurst";
import { INTRO_VH, SCENE_DWELL_VH } from "./lib/timeline";
import Chapter, { ChapterPage } from "./components/layout/Chapter";
import FeatureBlock from "./components/blocks/FeatureBlock";
import AboutSection from "./components/sections/AboutSection";
import ContactSection from "./components/sections/ContactSection";
import Footer from "./components/layout/Footer";
import SkipIntro from "./components/layout/SkipIntro";
import SectionContentWrapper from "./components/layout/SectionContentWrapper";
import { WORK_PROJECTS, CONTENT_PROJECT, HERO_SCENE, SECTION_SCENES } from "./data/portfolio";

export default function App() {
  const workPageRef = useRef<HTMLDivElement>(null);

  return (
    <LenisProvider>
      <div className="min-h-screen w-full bg-[#161310] text-[var(--text-ink)] selection:bg-[var(--accent-oxblood)] selection:text-[var(--bg-cream)]">
        <Navigation />
        <SealTracker />
        <SkipIntro />

        <div className="w-full">
          <main className="w-full">
            {/* I. WORK: the pinned intro (hero -> black hole -> Work scene), then the Work page */}
            <section id="work-section" className="w-full m-0 p-0 relative z-20">
              {/* Anchors: #hero is the very top, #work is where the intro has finished */}
              <div id="hero" aria-hidden="true" className="absolute top-0 left-0 h-px w-px pointer-events-none" />
              <div
                id="work"
                aria-hidden="true"
                className="absolute left-0 w-full bottom-0 pointer-events-none"
                style={{ top: `${INTRO_VH * 100}vh` }}
              />

              <IntroBurst heroScene={HERO_SCENE} workScene={SECTION_SCENES.work} nextPageRef={workPageRef} />

              {/* Scroll runway the intro plays across (transparent; the pinned stage stays on screen) */}
              <div aria-hidden="true" style={{ height: `${(INTRO_VH + 1 + SCENE_DWELL_VH) * 100}vh`, marginTop: "-100svh" }} />

              <SectionContentWrapper ref={workPageRef} seed={101}>
                <ChapterPage>
                  <div>
                    {WORK_PROJECTS.map((project, idx) => (
                      <FeatureBlock key={project.id} project={project} index={idx} />
                    ))}
                  </div>
                </ChapterPage>
              </SectionContentWrapper>
            </section>

            {/* II. CONTENT */}
            <Chapter id="content" scene={SECTION_SCENES.content} zClass="z-30" edgeSeed={201} pageSeed={202}>
              <ChapterPage>
                <FeatureBlock project={CONTENT_PROJECT} index={0} />


              </ChapterPage>
            </Chapter>

            {/* III. ABOUT */}
            <Chapter id="about" scene={SECTION_SCENES.about} zClass="z-40" edgeSeed={301} pageSeed={302}>
              <AboutSection />
            </Chapter>

            {/* IV. CONTACT */}
            <Chapter id="contact" scene={SECTION_SCENES.contact} zClass="z-50" edgeSeed={401} pageSeed={402}>
              <ContactSection />
            </Chapter>
          </main>

          <div className="relative z-50">
            <Footer />
          </div>
        </div>
      </div>
    </LenisProvider>
  );
}
