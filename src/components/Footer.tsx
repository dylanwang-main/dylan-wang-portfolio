import { NAVIGATION_ITEMS } from "../data/portfolio";
import PaperEdge from "./PaperEdge";

/** Finale: a dark page torn in from below the last cream page, with a giant wordmark. */
export default function Footer() {
  const scrollToTop = () => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (n: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (n: HTMLElement) => void } }).__lenis;
    if (lenis) lenis.scrollTo(el);
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      data-nav-theme="dark"
      className="relative z-[60] w-full bg-[#161310] text-[#F4EFE6] pt-[clamp(1.5rem,3vw,3rem)] pb-10 px-6 sm:px-10 md:pl-[170px] lg:pl-[190px] xl:pl-[210px] md:pr-10 lg:pr-14 overflow-x-clip"
    >
      <PaperEdge seed={502} fill="#161310" rim="232,221,207" shadow="rgba(0,0,0,0.16)" paper="dark" />

      <div className="relative max-w-[1400px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-[13px] text-[#C0B4A4]">
          <p className="max-w-sm leading-relaxed">
            Incoming data science student at UC San Diego, and a content creator.
          </p>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Footer">
            {NAVIGATION_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="hover:text-[#E88080] transition-colors focus:outline-none cursor-pointer"
              >
                <span className="font-editorial-serif italic mr-1.5">{item.numeral}</span>
                {item.label}
              </button>
            ))}
            <button
              onClick={scrollToTop}
              className="hover:text-[#E88080] transition-colors focus:outline-none cursor-pointer"
            >
              Top ↑
            </button>
          </nav>
        </div>

        <div
          aria-hidden="true"
          className="font-editorial-serif italic select-none leading-[1.12] tracking-[-0.03em] text-[clamp(4.5rem,15.5vw,16rem)] mt-[clamp(1rem,3vw,2.5rem)] pb-[0.08em] whitespace-nowrap"
          style={{ color: "rgba(244,239,230,0.92)" }}
        >
          Dylan Wang
        </div>

        <div className="mt-8 pt-5 border-t border-[rgba(244,239,230,0.14)] flex flex-col sm:flex-row justify-between gap-2 text-[11px] tracking-[0.18em] uppercase text-[#8A7B6A]">
          <span>© {new Date().getFullYear()} Dylan Wang</span>
          <span>UC San Diego · Data Science</span>
        </div>
      </div>
    </footer>
  );
}
