import { useRef } from "react";
import LenisProvider from "./components/LenisProvider";
import Navigation from "./components/Navigation";
import SectionOpener from "./components/SectionOpener";
import FeatureBlock from "./components/FeatureBlock";
import PlaceholderImage from "./components/PlaceholderImage";
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
import { motion } from "motion/react";

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
            {/* HERO: Page A (sticky, top 0, height 100svh, stays behind) */}
            <div className="sticky top-0 w-full h-[100svh] z-10">
              <SectionOpener
                scene={HERO_SCENE}
                isHero={true}
                nextPageRef={workSectionRef}
              />
            </div>

            {/* SECTION I: WORK */}
            <section
              id="work"
              ref={workSectionRef}
              aria-labelledby="section-work-heading"
              className="w-full m-0 p-0 relative z-20"
            >
              {/* Page A: position sticky, top 0, height 100svh, so it stays behind */}
              <div className="sticky top-0 w-full h-[100svh] z-10">
                <SectionOpener
                  scene={SECTION_SCENES.work}
                  nextPageRef={workContentRef}
                />
              </div>

              {/* Page B: normal flow, directly below A, with torn edge attached to top overlapping A */}
              <SectionContentWrapper ref={workContentRef} seed={101}>
                <div className="w-full px-6 sm:px-10 md:pl-[170px] lg:pl-[190px] xl:pl-[210px] md:pr-10 lg:pr-14 max-w-[1400px] py-[clamp(8rem,16vw,16rem)]">
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

              {/* Page B: normal flow, directly below A, with torn edge attached to top overlapping A */}
              <SectionContentWrapper ref={contentContentRef} seed={202}>
                <div className="w-full px-6 sm:px-10 md:pl-[170px] lg:pl-[190px] xl:pl-[210px] md:pr-10 lg:pr-14 max-w-[1400px] py-[clamp(8rem,16vw,16rem)]">
                  {/* Featured Content Project Overview */}
                  <FeatureBlock project={CONTENT_PROJECT} index={0} />

                  {/* Editorial Content Frame Showcase */}
                  <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-[var(--space-xl)] pt-[var(--space-xl)] border-t border-[var(--border-hairline)]"
                  >
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                      <div>
                        <span className="text-xs uppercase tracking-widest text-[var(--taupe-subtle)] font-medium">
                          Content Creation
                        </span>
                        <h4 className="font-editorial-serif text-2xl sm:text-3xl font-medium text-[var(--text-ink)] mt-1">
                          Media & Workflow Placeholders
                        </h4>
                      </div>
                      <span className="text-xs text-[var(--taupe-subtle)]">
                        Swap with production stills or video embeds
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <PlaceholderImage
                        label="STILL: short-form video concept & hook"
                        recommendedSize="9:16 vertical / 1080 × 1920"
                        aspectRatio="9/14"
                      />
                      <PlaceholderImage
                        label="WORKFLOW: DaVinci Resolve editing timeline"
                        recommendedSize="16:9 cinematic / 1920 × 1080"
                        aspectRatio="9/14"
                      />
                      <PlaceholderImage
                        label="METRIC / STORYBOARD: audience insight deck"
                        recommendedSize="4:5 editorial / 1080 × 1350"
                        aspectRatio="9/14"
                      />
                    </div>
                  </motion.div>
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

              {/* Page B: normal flow, directly below A, with torn edge attached to top overlapping A */}
              <SectionContentWrapper ref={aboutContentRef} seed={302}>
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

              {/* Page B: normal flow, directly below A, with torn edge attached to top overlapping A */}
              <SectionContentWrapper ref={contactContentRef} seed={402}>
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
