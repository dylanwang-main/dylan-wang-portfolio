import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Hobby } from "./HobbyCard";
import { fadeUp } from "../../lib/motion";

/** Crossfading photos for the open strip; auto-advances while open, with dots when there are several. */
function Photos({ hobby, open }: { hobby: Hobby; open: boolean }) {
  const [i, setI] = useState(0);
  const n = hobby.images.length;
  useEffect(() => {
    if (!open || n < 2) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % n), 3800);
    return () => window.clearInterval(t);
  }, [open, n]);
  const img = hobby.images[i];
  // no photos yet: a quiet painted gradient instead of an empty box
  if (!img)
    return (
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 30% 25%, #4a2a26 0%, #241a16 55%, #161310 100%)" }}
      />
    );
  return (
    <>
      <AnimatePresence initial={false}>
        <motion.img
          key={img.src}
          src={img.src}
          alt={img.alt}
          loading="lazy"
          decoding="async"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out"
          style={{ transform: open ? "scale(1)" : "scale(1.12)" }}
        />
      </AnimatePresence>
      {open && n > 1 && (
        <div className="absolute right-6 bottom-6 flex gap-1.5 z-10">
          {hobby.images.map((_, k) => (
            <button
              key={k}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setI(k);
              }}
              aria-label={`Photo ${k + 1} of ${n}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${k === i ? "w-5 bg-[#F4EFE6]" : "w-1.5 bg-[#F4EFE6]/45"}`}
            />
          ))}
        </div>
      )}
    </>
  );
}

/**
 * Hobbies as tall strips side by side. The open strip widens to show its photos, name and line;
 * the rest narrow to a sliver with the name running up the edge. Hover (or tap) a strip to open it.
 * Phones: stacked strips that open downward on tap.
 */
export default function HobbyStrips({ hobbies }: { hobbies: Hobby[] }) {
  const [active, setActive] = useState(0);
  return (
    <motion.div
      {...fadeUp({ amount: 0.2, duration: 0.9 })}
      className="flex flex-col md:flex-row gap-3 md:h-[clamp(440px,68vh,640px)]"
      role="list"
    >
      {hobbies.map((h, i) => {
        const open = i === active;
        return (
          <div
            key={h.title}
            role="listitem"
            tabIndex={0}
            aria-expanded={open}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            // basis-0 only in the row layout: in the phone column, overflow-hidden would collapse it to 0
            className="relative overflow-hidden rounded-xl cursor-pointer basis-auto md:basis-0 shrink-0 md:shrink bg-[#1b1612] shadow-[0_22px_50px_rgba(31,27,22,0.26)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-pop)] min-w-0"
            style={{
              flexGrow: open ? 5 : 1,
              transition: "flex-grow 0.75s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            {/* phones: the strip's height does the opening */}
            <div className={`md:hidden ${open ? "h-[58vh]" : "h-20"} transition-[height] duration-500`} />
            <Photos hobby={h} open={open} />

            {/* shade: heavy when closed, a soft bottom fade when open */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-700"
              style={{ background: "rgba(14,11,9,0.62)", opacity: open ? 0 : 1 }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(14,11,9,0.85) 0%, rgba(14,11,9,0.25) 40%, transparent 65%)" }}
            />

            {/* closed: number and name running up the edge (desktop) / across (phones) */}
            <div
              className="absolute inset-0 flex md:flex-col items-center md:items-center justify-between md:justify-end px-5 md:px-0 md:py-6 gap-3 transition-opacity duration-500 pointer-events-none"
              style={{ opacity: open ? 0 : 1 }}
            >
              <span className="hidden md:block text-[11px] tracking-[0.24em] text-[#F4EFE6]/60 md:order-2">0{i + 1}</span>
              <span
                className="font-editorial-serif italic text-[clamp(1.4rem,2vw,1.9rem)] text-[#F4EFE6] whitespace-nowrap md:[writing-mode:vertical-rl] md:rotate-180"
              >
                <span className="text-[#E88080]">{h.title.charAt(0)}</span>
                {h.title.slice(1)}
              </span>
              <span className="md:hidden text-[11px] tracking-[0.24em] text-[#F4EFE6]/60">0{i + 1}</span>
            </div>

            {/* open: big title and line, bottom left */}
            <div
              className="absolute left-6 right-20 bottom-6 md:left-9 md:bottom-9 text-[#F4EFE6] pointer-events-none transition-all duration-700"
              style={{ opacity: open ? 1 : 0, transform: open ? "translateY(0)" : "translateY(14px)", transitionDelay: open ? "0.25s" : "0s" }}
            >
              <span className="block text-[11px] uppercase tracking-[0.24em] text-[#F4EFE6]/65">0{i + 1} / 0{hobbies.length}</span>
              <span className="block mt-2 font-editorial-serif italic text-[clamp(2.4rem,4.6vw,4.4rem)] leading-none whitespace-nowrap">
                <span className="text-[#E88080]">{h.title.charAt(0)}</span>
                {h.title.slice(1)}
              </span>
              {h.note && <span className="block mt-3 text-[15px] text-[#F4EFE6]/85 max-w-[44ch]">{h.note}</span>}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
