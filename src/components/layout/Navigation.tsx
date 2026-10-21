import { useEffect, useState, useRef } from "react";
import { NAVIGATION_ITEMS, RESUME_LINK, GRAD_YEAR_SHORT } from "../../data/portfolio";
import { edgeToneAt } from "../../lib/paperEdges";
import { getLenis, scrollToId } from "../../lib/scroll";
import { useReducedMotion } from "../../lib/useReducedMotion";
import { easeInOutCubic } from "../../lib/math";
import { INTRO_VH } from "../../lib/timeline";

export default function Navigation() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  // how far through the active chapter the reader is (0 to 1), drawn along the rail leader
  const [chapterProgress, setChapterProgress] = useState(0);
  const [isDarkSection, setIsDarkSection] = useState<boolean>(true);
  const [heroScroll, setHeroScroll] = useState<number>(0);
  const [viewport, setViewport] = useState({ width: 1200, height: 800 });
  const prefersReducedMotion = useReducedMotion();
  // Per-element contrast: the torn edge can pass under one nav item but not the next
  const elRefs = useRef<Record<string, HTMLElement | null>>({});
  const [darkMap, setDarkMap] = useState<Record<string, boolean>>({});
  const darkKey = useRef("");

  useEffect(() => {
    const updateMeasurements = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateMeasurements();

    // Sections tag themselves light or dark; the torn edges (lib/paperEdges) refine that at the tear.
    const themedElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-theme]")
    );

    /** true = dark behind (x,y). Follows the ragged tear line exactly. */
    const darkAt = (x: number, y: number): boolean | null => {
      const edge = edgeToneAt(x, y);
      if (edge !== null) return edge;
      for (let i = themedElements.length - 1; i >= 0; i--) {
        const r = themedElements[i].getBoundingClientRect();
        if (r.top <= y && r.bottom > y) {
          return themedElements[i].getAttribute("data-nav-theme") === "dark";
        }
      }
      return null;
    };

    const updateElementThemes = () => {
      if (window.innerWidth < 768) return;
      const next: Record<string, boolean> = {};
      let key = "";
      for (const [id, el] of Object.entries(elRefs.current)) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const cy = r.top + r.height / 2;
        // sample left, middle and right of the label: the torn line slopes across it
        let dark = 0;
        let seen = 0;
        for (const fx of [0.08, 0.5, 0.92]) {
          const d = darkAt(r.left + r.width * fx, cy);
          if (d !== null) {
            seen++;
            if (d) dark++;
          }
        }
        if (seen) {
          // text is light-on-dark only when the whole label sits on dark; any cream under it needs dark text
          const d = dark === seen;
          next[id] = d;
          key += `${id}${d ? 1 : 0}`;
        }
      }
      if (key !== darkKey.current) {
        darkKey.current = key;
        setDarkMap(next);
      }
    };

    const updateThemeFromPosition = () => {
      const scrollY = window.scrollY;
      const isMobile = window.innerWidth < 768;
      // In top state, sample near top (32px); in rail state, sample at rail vertical center (46% of viewport)
      const sampleY = isMobile
        ? 32
        : scrollY < 80
          ? 32
          : window.innerHeight * 0.46;

      for (let i = themedElements.length - 1; i >= 0; i--) {
        const el = themedElements[i];
        const rect = el.getBoundingClientRect();
        if (rect.top <= sampleY && rect.bottom > sampleY) {
          const theme = el.getAttribute("data-nav-theme") as "dark" | "light";
          setIsDarkSection(theme === "dark");
          break;
        }
      }
    };

    // A thin scan line where the nav sits also reports which section passes under it. It fires on
    // its own schedule (not just on scroll), so it is what settles the mobile header colour.
    const isMobileAtMount = window.innerWidth < 768;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const theme = entry.target.getAttribute("data-nav-theme");
          if (theme) setIsDarkSection(theme === "dark");
        }
      },
      {
        rootMargin: isMobileAtMount ? "-28px 0px -90% 0px" : "-45% 0px -54% 0px",
        threshold: [0, 0.05, 0.5],
      }
    );
    themedElements.forEach((el) => observer.observe(el));

    const updateNavState = () => {
      const scrollY = window.scrollY;

      // 1. Scrubbable scroll progress through hero (0 at top to 1 at 320px)
      const progress = Math.min(1, Math.max(0, scrollY / 320));
      setHeroScroll(progress);

      // 2. Real-time theme verification at nav's exact vertical position
      updateThemeFromPosition();
      updateElementThemes();

      // 3. Scrollspy: identify currently active section
      if (scrollY < window.innerHeight * INTRO_VH * 0.92) {
        setActiveSection("hero");
        return;
      }

      const sectionIds = NAVIGATION_ITEMS.map((item) => item.id);
      const spyY = window.innerHeight * 0.44;
      let currentActive = "hero";
      let chapterP = 0;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= spyY && rect.bottom > spyY) {
            currentActive = id;
            chapterP = (spyY - rect.top) / rect.height;
            break;
          }
        }
      }

      // If scrolled near bottom of page, highlight Contact
      if (
        window.innerHeight + scrollY >=
        document.documentElement.scrollHeight - 80
      ) {
        currentActive = "contact";
        chapterP = 1;
      }

      setActiveSection(currentActive);
      setChapterProgress(Math.round(chapterP * 100) / 100);
    };

    updateNavState();

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateNavState();
          ticking = false;
        });
        ticking = true;
      }
    };

    const onResize = () => {
      updateMeasurements();
      onScroll();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const offLenis = getLenis()?.on("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      offLenis?.();
      observer.disconnect();
    };
  }, []);


  const scrollToSection = scrollToId;

  // Staggered travel calculation for navigation items
  const getStaggeredT = (index: number) => {
    if (prefersReducedMotion) {
      return heroScroll >= 0.5 ? 1 : 0;
    }
    const start = 0.04 + index * 0.09;
    const duration = 0.54;
    if (heroScroll <= start) return 0;
    if (heroScroll >= start + duration) return 1;
    return easeInOutCubic((heroScroll - start) / duration);
  };

  const darkOf = (k: string) => darkMap[k] ?? isDarkSection;

  const isDesktop = viewport.width >= 768;
  const centerX = viewport.width / 2;
  const railX = 38; // Compact left inset for dedicated whitespace
  const railCenterY = viewport.height * 0.46;

  return (
    <>
      {/* ======================================================== */}
      {/* DESKTOP TWO-STATE GLIDING NAVIGATION (>=768px)           */}
      {/* 250ms transition, >=4.5:1 contrast, visible accent markers */}
      {/* ======================================================== */}
      {isDesktop && (
        <nav aria-label="Main Navigation">
          {/* DW Monogram: Top-left header -> Rail top. Always visible. */}
          {(() => {
            const t = prefersReducedMotion
              ? heroScroll >= 0.5
                ? 1
                : 0
              : Math.min(1, heroScroll * 1.3);
            const startX = 40;
            const startY = 30;
            const endX = railX;
            const endY = 44;
            const curX = startX + (endX - startX) * t;
            const curY = startY + (endY - startY) * t;
            const inRail = t > 0.45;
            const dark = darkOf("dw");

            return (
              <button
                ref={(el) => {
                  elRefs.current.dw = el;
                }}
                onClick={() => scrollToSection("hero")}
                style={{
                  position: "fixed",
                  left: 0,
                  top: 0,
                  transform: `translate3d(${curX}px, ${curY}px, 0) translate(${
                    inRail ? "0%" : "-50%"
                  }, -50%)`,
                  zIndex: 60,
                }}
                className="group flex flex-col items-start focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-oxblood)] select-none will-change-transform cursor-pointer"
                title="Dylan Wang - Return to Top"
              >
                <span
                  className={`font-editorial-serif text-xl lg:text-2xl font-bold tracking-tight transition-colors duration-[250ms] ease-out ${
                    dark
                      ? "text-[#FFFFFF] group-hover:text-[#E88080]"
                      : "text-[#161310] group-hover:text-[#6B2D2D]"
                  }`}
                >
                  DW
                </span>
                <span
                  className={`text-[8.5px] tracking-[0.2em] uppercase font-semibold mt-0.5 transition-colors duration-[250ms] ease-out ${
                    dark
                      ? "text-[#D5C9B8]"
                      : "text-[#54473C]"
                  }`}
                >
                  UCSD {GRAD_YEAR_SHORT}
                </span>
              </button>
            );
          })()}

          {/* 4 Staggered Navigation Items: Top Header -> Dedicated Left Whitespace Rail */}
          {NAVIGATION_ITEMS.map((item, index) => {
            const t = getStaggeredT(index);
            const isActive = activeSection === item.id;
            const dark = darkOf(item.id);

            // In top state: centered across the top header with compact spacing
            const topOffsets = [-190, -65, 65, 190];
            const startX = centerX + topOffsets[index];
            const startY = 30;

            // In left rail state: compact vertical stack in dedicated left whitespace
            const railOffsets = [-78, -26, 26, 78];
            const endX = railX;
            const endY = railCenterY + railOffsets[index];

            const curX = startX + (endX - startX) * t;
            const curY = startY + (endY - startY) * t;

            const inRailState = t > 0.45;
            const transX = -50 * (1 - t);

            return (
              <button
                key={item.id}
                ref={(el) => {
                  elRefs.current[item.id] = el;
                }}
                onClick={() => scrollToSection(item.id)}
                style={{
                  position: "fixed",
                  left: 0,
                  top: 0,
                  transform: `translate3d(${curX}px, ${curY}px, 0) translate(${transX}%, -50%)`,
                  zIndex: 60,
                }}
                className={`group flex items-center select-none will-change-transform focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-oxblood)] cursor-pointer ${
                  inRailState
                    ? "flex-row text-left"
                    : "flex-row items-baseline gap-1.5 text-center"
                } ${isActive ? "scale-105" : "hover:scale-105"}`}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active indicator bar when in rail state */}
                {inRailState && (
                  <span
                    className={`w-[3px] transition-all duration-[250ms] ease-out mr-2.5 rounded-full ${
                      isActive
                        ? dark
                          ? "h-4 bg-[#E88080] shadow-[0_0_8px_rgba(232,128,128,0.7)]"
                          : "h-4 bg-[#6B2D2D] shadow-[0_0_4px_rgba(107,45,45,0.4)]"
                        : "h-1 opacity-0 group-hover:opacity-40 " +
                          (dark ? "bg-[#D5C9B8]" : "bg-[#54473C]")
                    }`}
                  />
                )}

                {/* Roman Numeral: >=4.5:1 contrast at all times */}
                <span
                  className={`font-editorial-serif tracking-tight transition-colors duration-[250ms] ease-out ${
                    inRailState ? "w-6 text-[15px] lg:text-[16px]" : "text-[14px] lg:text-[15px]"
                  } ${
                    isActive
                      ? dark
                        ? "font-bold text-[#FFFFFF]"
                        : "font-bold text-[#161310]"
                      : dark
                        ? "font-medium text-[#E8D8C5] group-hover:text-[#FFFFFF]"
                        : "font-medium text-[#1F1B16] group-hover:text-[#161310]"
                  }`}
                >
                  {item.numeral}
                </span>

                {/* Section Label: >=4.5:1 contrast at all times */}
                <span
                  className={`text-[13.5px] lg:text-[14.5px] tracking-wide transition-colors duration-[250ms] ease-out ${
                    isActive
                      ? dark
                        ? "font-bold text-[#FFFFFF]"
                        : "font-bold text-[#161310]"
                      : dark
                        ? "font-normal text-[#E8D8C5] group-hover:text-[#FFFFFF]"
                        : "font-normal text-[#26201B] group-hover:text-[#161310]"
                  }`}
                >
                  {item.label}
                </span>

                {/* Rail: dotted leader after each label; the active chapter fills it as you read */}
                {inRailState && (
                  <span aria-hidden="true" className="relative ml-2.5 w-6 self-center h-px">
                    <span
                      className={`absolute inset-0 border-b border-dotted transition-colors duration-[250ms] ease-out ${
                        dark ? "border-[#D5C9B8]/50" : "border-[#54473C]/45"
                      }`}
                    />
                    {isActive && (
                      <span
                        className={`absolute left-0 top-0 h-px origin-left ${dark ? "bg-[#E88080]" : "bg-[#6B2D2D]"}`}
                        style={{ width: "100%", transform: `scaleX(${chapterProgress})` }}
                      />
                    )}
                  </span>
                )}

                {/* Active accent marker when in top header state */}
                {!inRailState && isActive && (
                  <span
                    className={`w-1.5 h-1.5 ml-1.5 self-center rounded-full transition-colors duration-[250ms] ease-out ${
                      dark
                        ? "bg-[#E88080] shadow-[0_0_8px_rgba(232,128,128,0.8)]"
                        : "bg-[#6B2D2D] shadow-[0_0_4px_rgba(107,45,45,0.5)]"
                    }`}
                  />
                )}
              </button>
            );
          })}

          {/* Resume Link: Top-right header -> Bottom-left rail */}
          {(() => {
            const t = prefersReducedMotion
              ? heroScroll >= 0.5
                ? 1
                : 0
              : Math.min(1, Math.max(0, (heroScroll - 0.2) / 0.7));
            const startX = viewport.width - 215;
            const startY = 30;
            const endX = railX;
            const endY = viewport.height - 44;
            const curX = startX + (endX - startX) * t;
            const curY = startY + (endY - startY) * t;
            const inRail = t > 0.45;
            const dark = darkOf("resume");

            return (
              <div
                ref={(el) => {
                  elRefs.current.resume = el;
                }}
                style={{
                  position: "fixed",
                  left: 0,
                  top: 0,
                  transform: `translate3d(${curX}px, ${curY}px, 0) translate(${
                    inRail ? "0%" : "-50%"
                  }, -50%)`,
                  zIndex: 60,
                }}
                className="flex flex-col items-start text-left select-none will-change-transform"
              >
                <a
                  href={RESUME_LINK.url}
                  target="_blank"
                  rel="noopener"
                  className={`text-[13px] lg:text-[13.5px] font-medium tracking-wide transition-colors duration-[250ms] ease-out focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-oxblood)] ${
                    dark
                      ? "text-[#D5C9B8] hover:text-[#FFFFFF]"
                      : "text-[#3D332A] hover:text-[#6B2D2D]"
                  }`}
                >
                  {RESUME_LINK.label} ↗
                </a>
              </div>
            );
          })()}

          {/* Persistent call to action, top right (Shopify's "Start for free" slot) */}
          {(() => {
            const dark = darkOf("cta");
            return (
              <button
                ref={(el) => {
                  elRefs.current.cta = el;
                }}
                onClick={() => scrollToSection("contact")}
                style={{ position: "fixed", top: 18, right: 28, zIndex: 60 }}
                className={`rounded-full px-4 py-2 text-[13px] font-medium tracking-wide transition-colors duration-[250ms] ease-out cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-oxblood)] ${
                  dark
                    ? "bg-[#F4EFE6] text-[#161310] hover:bg-white"
                    : "bg-[#161310] text-[#F4EFE6] hover:bg-[#6B2D2D]"
                }`}
              >
                Get in touch
              </button>
            );
          })()}
        </nav>
      )}

      {/* ======================================================== */}
      {/* MOBILE COMPACT TOP BAR (<768px)                          */}
      {/* Fixed clean header for mobile screens                    */}
      {/* ======================================================== */}
      {!isDesktop && (
        <header
          className={`fixed top-0 left-0 right-0 z-50 px-4 py-2.5 select-none flex items-center justify-between border-b transition-colors duration-[250ms] ease-out backdrop-blur-md ${
            isDarkSection
              ? "bg-[#161310]/95 border-[rgba(244,239,230,0.12)] text-[#FFFFFF]"
              : "bg-[#F4EFE6]/95 border-[rgba(31,27,22,0.15)] text-[#161310]"
          }`}
        >
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-1 focus:outline-none cursor-pointer"
          >
            <span
              className={`font-editorial-serif text-lg font-bold transition-colors duration-[250ms] ease-out ${
                isDarkSection ? "text-[#FFFFFF]" : "text-[#161310]"
              }`}
            >
              DW
            </span>
          </button>

          <nav className="flex items-center gap-2" aria-label="Mobile Navigation">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-1.5 py-0.5 text-xs transition-colors duration-[250ms] ease-out focus:outline-none cursor-pointer ${
                    isActive
                      ? isDarkSection
                        ? "font-bold text-[#E88080]"
                        : "font-bold text-[#6B2D2D]"
                      : isDarkSection
                        ? "text-[#E8D8C5] hover:text-[#FFFFFF]"
                        : "text-[#26201B] hover:text-[#161310]"
                  }`}
                >
                  <span className="font-editorial-serif text-sm mr-0.5">
                    {item.numeral}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <a
            href={RESUME_LINK.url}
            target="_blank"
            rel="noopener"
            className={`text-[10px] transition-colors duration-[250ms] ease-out ${
              isDarkSection ? "text-[#D5C9B8]" : "text-[#3D332A]"
            }`}
          >
            CV
          </a>
        </header>
      )}
    </>
  );
}
