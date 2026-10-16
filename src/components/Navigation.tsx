import { useEffect, useState } from "react";
import { NAVIGATION_ITEMS, RESUME_LINK } from "../data/portfolio";

export default function Navigation() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isDarkSection, setIsDarkSection] = useState<boolean>(true);
  const [heroScroll, setHeroScroll] = useState<number>(0);
  const [viewport, setViewport] = useState({ width: 1200, height: 800 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const mqHandler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", mqHandler);

    const updateMeasurements = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateMeasurements();

    const updateNavState = () => {
      const scrollY = window.scrollY;
      const isMobile = window.innerWidth < 768;

      // 1. Scrubbable scroll progress through hero (0 at top to 1 at 320px)
      const progress = Math.min(1, Math.max(0, scrollY / 320));
      setHeroScroll(progress);

      // 2. Sample coordinate behind navigation to detect theme
      const sampleY = isMobile
        ? 32
        : progress < 0.4
          ? 32
          : window.innerHeight * 0.46;

      const themedElements = Array.from(
        document.querySelectorAll<HTMLElement>("[data-nav-theme]")
      );

      let detectedTheme: "dark" | "light" = "dark";
      for (const el of themedElements) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= sampleY && rect.bottom > sampleY) {
          detectedTheme =
            (el.getAttribute("data-nav-theme") as "dark" | "light") || "dark";
          break;
        }
      }
      setIsDarkSection(detectedTheme === "dark");

      // 3. Scrollspy: identify currently active section
      if (scrollY < window.innerHeight * 0.38) {
        setActiveSection("hero");
        return;
      }

      const sectionIds = NAVIGATION_ITEMS.map((item) => item.id);
      const spyY = window.innerHeight * 0.44;
      let currentActive = "hero";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= spyY && rect.bottom > spyY) {
            currentActive = id;
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
      }

      setActiveSection(currentActive);
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

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      updateMeasurements();
      onScroll();
    });

    const lenis = (
      window as unknown as {
        __lenis?: { on: (event: string, callback: () => void) => void };
      }
    ).__lenis;
    if (lenis && typeof lenis.on === "function") {
      lenis.on("scroll", onScroll);
    }

    return () => {
      mq.removeEventListener("change", mqHandler);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const lenis = (
        window as unknown as {
          __lenis?: { scrollTo: (target: HTMLElement | string) => void };
        }
      ).__lenis;
      if (lenis) {
        lenis.scrollTo(element);
      } else {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Staggered travel calculation for navigation items
  const getStaggeredT = (index: number) => {
    if (prefersReducedMotion) {
      return heroScroll >= 0.5 ? 1 : 0;
    }
    const start = 0.04 + index * 0.09;
    const duration = 0.54;
    if (heroScroll <= start) return 0;
    if (heroScroll >= start + duration) return 1;
    const t = (heroScroll - start) / duration;
    // Cubic ease-in-out
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const isDesktop = viewport.width >= 768;
  const centerX = viewport.width / 2;
  const railX = 38; // Slightly more compact left inset for breathing room
  const railCenterY = viewport.height * 0.46;

  return (
    <>
      {/* ======================================================== */}
      {/* DESKTOP TWO-STATE GLIDING NAVIGATION (>=768px)           */}
      {/* Compact refined scale giving the main pages room to breathe */}
      {/* ======================================================== */}
      {isDesktop && (
        <nav aria-label="Main Navigation">
          {/* DW Monogram: Top-left header -> Rail top */}
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

            return (
              <button
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
                  className={`font-editorial-serif text-xl lg:text-2xl font-bold tracking-tight transition-colors duration-500 ease-out ${
                    isDarkSection
                      ? "text-[#F4EFE6] group-hover:text-[#E88080]"
                      : "text-[var(--text-ink)] group-hover:text-[var(--accent-oxblood)]"
                  }`}
                >
                  DW
                </span>
                <span
                  className={`text-[8.5px] tracking-[0.2em] uppercase font-semibold mt-0.5 transition-colors duration-500 ease-out ${
                    isDarkSection
                      ? "text-[#A89A8A]"
                      : "text-[var(--taupe-subtle)]"
                  }`}
                >
                  UCSD &apos;26
                </span>
              </button>
            );
          })()}

          {/* 4 Staggered Navigation Items: Top Header -> Dedicated Left Whitespace Rail */}
          {NAVIGATION_ITEMS.map((item, index) => {
            const t = getStaggeredT(index);
            const isActive = activeSection === item.id;

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
                    className={`w-[2.5px] transition-all duration-300 mr-2 rounded-full ${
                      isActive
                        ? isDarkSection
                          ? "h-4 bg-[#E88080]"
                          : "h-4 bg-[var(--accent-oxblood)]"
                        : "h-1 opacity-0 group-hover:opacity-40 " +
                          (isDarkSection ? "bg-[#A89A8A]" : "bg-[var(--taupe-subtle)]")
                    }`}
                  />
                )}

                {/* Roman Numeral */}
                <span
                  className={`font-editorial-serif tracking-tight transition-colors duration-500 ease-out ${
                    inRailState ? "w-6 text-[15px] lg:text-[16px]" : "text-[14px] lg:text-[15px]"
                  } ${
                    isActive
                      ? isDarkSection
                        ? "font-bold text-[#F4EFE6]"
                        : "font-bold text-[var(--text-ink)]"
                      : isDarkSection
                        ? "font-normal text-[#A89A8A] group-hover:text-[#F4EFE6]"
                        : "font-normal text-[var(--taupe-subtle)] group-hover:text-[var(--text-ink)]"
                  }`}
                >
                  {item.numeral}
                </span>

                {/* Section Label */}
                <span
                  className={`text-[13.5px] lg:text-[14.5px] tracking-wide transition-colors duration-500 ease-out ${
                    isActive
                      ? isDarkSection
                        ? "font-semibold text-[#F4EFE6]"
                        : "font-semibold text-[var(--text-ink)]"
                      : isDarkSection
                        ? "font-normal text-[#A89A8A] group-hover:text-[#F4EFE6]"
                        : "font-normal text-[var(--taupe-subtle)] group-hover:text-[var(--text-ink)]"
                  }`}
                >
                  {item.label}
                </span>

                {/* Subtle active dot when in top header state */}
                {!inRailState && isActive && (
                  <span
                    className={`w-1 h-1 ml-1 self-center rounded-full ${
                      isDarkSection
                        ? "bg-[#E88080] shadow-[0_0_6px_rgba(232,128,128,0.7)]"
                        : "bg-[var(--accent-oxblood)]"
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
            const startX = viewport.width - 56;
            const startY = 30;
            const endX = railX;
            const endY = viewport.height - 44;
            const curX = startX + (endX - startX) * t;
            const curY = startY + (endY - startY) * t;
            const inRail = t > 0.45;

            return (
              <div
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
                <span
                  className={`text-[13px] lg:text-[13.5px] font-medium tracking-wide cursor-not-allowed transition-colors duration-500 ease-out ${
                    isDarkSection
                      ? "text-[#A89A8A]"
                      : "text-[var(--taupe-subtle)]"
                  }`}
                  title="Resume coming soon"
                >
                  {RESUME_LINK.label} ↗
                  <span
                    className={`block text-[9px] transition-colors duration-500 ease-out ${
                      isDarkSection
                        ? "text-[#A89A8A]/70"
                        : "text-[var(--taupe-subtle)]/70"
                    }`}
                  >
                    (coming soon)
                  </span>
                </span>
              </div>
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
          className={`fixed top-0 left-0 right-0 z-50 px-4 py-2.5 select-none flex items-center justify-between border-b transition-colors duration-500 backdrop-blur-md ${
            isDarkSection
              ? "bg-[#161310]/90 border-[rgba(244,239,230,0.08)] text-[#F4EFE6]"
              : "bg-[#F4EFE6]/90 border-[rgba(31,27,22,0.12)] text-[var(--text-ink)]"
          }`}
        >
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-1 focus:outline-none cursor-pointer"
          >
            <span className="font-editorial-serif text-lg font-bold">DW</span>
          </button>

          <nav className="flex items-center gap-2" aria-label="Mobile Navigation">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-1.5 py-0.5 text-xs transition-colors duration-300 focus:outline-none cursor-pointer ${
                    isActive
                      ? isDarkSection
                        ? "font-bold text-[#E88080]"
                        : "font-bold text-[var(--accent-oxblood)]"
                      : isDarkSection
                        ? "text-[#A89A8A] hover:text-[#F4EFE6]"
                        : "text-[var(--taupe-subtle)] hover:text-[var(--text-ink)]"
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

          <span
            className={`text-[10px] cursor-not-allowed transition-colors duration-500 ${
              isDarkSection ? "text-[#A89A8A]" : "text-[var(--taupe-subtle)]"
            }`}
            title="Resume coming soon"
          >
            CV
          </span>
        </header>
      )}
    </>
  );
}
