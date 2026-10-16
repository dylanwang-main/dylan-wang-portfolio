import { NAVIGATION_ITEMS } from "../data/portfolio";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer
      data-nav-theme="light"
      className="w-full border-t border-[var(--border-hairline)] bg-[var(--bg-cream)] py-14 px-6 sm:px-10 md:pl-[170px] lg:pl-[190px] xl:pl-[210px] md:pr-10 lg:pr-14"
    >
      <div className="max-w-[1400px] flex flex-col md:flex-row items-center justify-between gap-8 text-xs text-[var(--taupe-subtle)]">
        {/* Left: Brand Monogram & School */}
        <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
          <span className="font-editorial-serif text-lg font-bold text-[var(--text-ink)] tracking-tight">
            Dylan Wang
          </span>
          <span aria-hidden="true" className="hidden md:inline">
            ·
          </span>
          <span>Incoming Data Science Student, UC San Diego</span>
        </div>

        {/* Center: Roman Nav Links */}
        <div className="flex items-center gap-5">
          {NAVIGATION_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="hover:text-[var(--text-ink)] transition-colors focus:outline-none"
            >
              <span className="font-editorial-serif mr-1">{item.numeral}.</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right: Back to top */}
        <div className="flex items-center gap-4">
          <button
            onClick={scrollToTop}
            className="hover:text-[var(--accent-oxblood)] transition-colors focus:outline-none"
          >
            ↑ Top of Page
          </button>
        </div>
      </div>
    </footer>
  );
}
