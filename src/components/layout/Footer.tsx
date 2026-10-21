import { useRef } from "react";
import { motion, MotionValue, useScroll, useTransform } from "motion/react";
import { NAVIGATION_ITEMS } from "../../data/portfolio";
import { seg } from "../../lib/math";
import { useReducedMotion } from "../../lib/useReducedMotion";
import PaperEdge from "./PaperEdge";
import { scrollToId, scrollToTop } from "../../lib/scroll";
import { PAGE_X } from "../../lib/layout";

const EASE_OUT = (t: number) => 1 - Math.pow(1 - t, 3);

/** Finale wordmark: each letter rises out of a slot in turn as the footer scrolls into view. */
function Wordmark({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const letters = Array.from(text);
  return (
    <div
      ref={ref}
      aria-label={text}
      role="img"
      className="font-editorial-serif italic select-none leading-[1.12] tracking-[-0.03em] text-[clamp(4.5rem,15.5vw,16rem)] mt-[clamp(1rem,3vw,2.5rem)] pb-[0.08em] whitespace-nowrap overflow-hidden"
      style={{ color: "rgba(244,239,230,0.92)" }}
    >
      {letters.map((ch, i) =>
        ch === " " ? (
          <span key={i}> </span>
        ) : (
          <Letter key={i} ch={ch} i={i} n={letters.length} p={p} still={reduced} />
        )
      )}
    </div>
  );
}

function Letter({ ch, i, n, p, still }: { ch: string; i: number; n: number; p: MotionValue<number>; still: boolean }) {
  const a = 0.15 + (i / n) * 0.45;
  const t = useTransform(p, (v) => EASE_OUT(seg(v, a, a + 0.4)));
  const y = useTransform(t, (v) => `${(1 - v) * 100}%`);
  const rotate = useTransform(t, (v) => (1 - v) * 8);
  return (
    <motion.span aria-hidden="true" className="inline-block will-change-transform" style={still ? undefined : { y, rotate, opacity: t }}>
      {ch}
    </motion.span>
  );
}

/** The closing hairline draws itself across, with a short ember glint at its leading end. */
function ClosingRule() {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scaleX = useTransform(p, [0, 0.9], [0, 1], { clamp: true });
  const glint = useTransform(scaleX, (v) => `${v * 100}%`);
  const glintOpacity = useTransform(scaleX, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  return (
    <span ref={ref} aria-hidden="true" className="absolute left-0 right-0 top-0 h-px">
      <motion.span
        className="absolute inset-0 origin-left bg-[rgba(244,239,230,0.14)]"
        style={reduced ? undefined : { scaleX }}
      />
      {!reduced && (
        <motion.span
          className="absolute top-[-1px] w-16 h-[3px] -translate-x-full rounded-full"
          style={{ left: glint, opacity: glintOpacity, background: "linear-gradient(90deg, transparent, #E88080, #ffd9a8)" }}
        />
      )}
    </span>
  );
}

/** Finale: a dark page torn in from below the last cream page, with a giant wordmark. */
export default function Footer() {
  return (
    <footer
      data-nav-theme="dark"
      className={`relative z-[60] w-full bg-[#161310] text-[#F4EFE6] pt-[clamp(1.5rem,3vw,3rem)] pb-10 ${PAGE_X} overflow-x-clip`}
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
                onClick={() => scrollToId(item.id)}
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

        <Wordmark text="Dylan Wang" />

        <div className="relative mt-8 pt-5 flex flex-col sm:flex-row justify-between gap-2 text-[11px] tracking-[0.18em] uppercase text-[#8A7B6A]">
          <ClosingRule />
          <span>© {new Date().getFullYear()} Dylan Wang</span>
          <span>UC San Diego · Data Science</span>
        </div>
      </div>
    </footer>
  );
}
