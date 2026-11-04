import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { fadeUp } from "../../lib/motion";

export interface Hobby {
  title: string;
  /** One short line under the title. Optional. */
  note?: string;
  images: { src: string; alt: string }[];
}

/**
 * One hobby as a large card: a crossfading photo carousel with the hobby's name over the bottom.
 * With one photo it is a still; with more it auto-advances (pausing on hover) and gets arrows
 * and dots.
 */
export default function HobbyCard({ hobby, index }: { hobby: Hobby; index: number }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = hobby.images.length;
  useEffect(() => {
    if (n < 2 || paused) return;
    // stagger the four cards so they never all change at once
    const t = window.setInterval(() => setI((v) => (v + 1) % n), 4200 + index * 650);
    return () => window.clearInterval(t);
  }, [n, paused, index]);
  const go = (d: number) => setI((v) => (v + d + n) % n);
  const img = hobby.images[i];

  return (
    <motion.figure
      {...fadeUp({ amount: 0.25, duration: 0.8, delay: (index % 2) * 0.1 })}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="group relative overflow-hidden rounded-xl aspect-[4/3] bg-[#1b1612] shadow-[0_22px_50px_rgba(31,27,22,0.26)]"
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={img.src}
          src={img.src}
          alt={img.alt}
          loading="lazy"
          decoding="async"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
        />
      </AnimatePresence>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(14,11,9,0.82) 0%, rgba(14,11,9,0.25) 38%, transparent 62%)" }} />

      <figcaption className="absolute left-6 right-6 bottom-5 md:left-8 md:bottom-7 text-[#F4EFE6]">
        <span className="block text-[11px] uppercase tracking-[0.24em] text-[#F4EFE6]/65">0{index + 1}</span>
        <span className="block mt-1 font-editorial-serif italic text-[clamp(2rem,3.4vw,3.2rem)] leading-none">
          <span className="text-[#E88080]">{hobby.title.charAt(0)}</span>
          {hobby.title.slice(1)}
        </span>
        {hobby.note && <span className="block mt-2 text-[14px] text-[#F4EFE6]/80">{hobby.note}</span>}
      </figcaption>

      {n > 1 && (
        <>
          {(["‹", "›"] as const).map((ch, k) => (
            <button
              key={ch}
              type="button"
              onClick={() => go(k ? 1 : -1)}
              aria-label={k ? "Next photo" : "Previous photo"}
              className={`absolute top-1/2 -translate-y-1/2 ${k ? "right-3" : "left-3"} w-10 h-10 rounded-full grid place-items-center text-[22px] leading-none text-white bg-black/35 backdrop-blur-sm opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity cursor-pointer hover:bg-[var(--accent-pop)]`}
            >
              {ch}
            </button>
          ))}
          <div className="absolute right-6 bottom-6 md:right-8 md:bottom-8 flex gap-1.5">
            {hobby.images.map((_, k) => (
              <button
                key={k}
                type="button"
                onClick={() => setI(k)}
                aria-label={`Photo ${k + 1} of ${n}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${k === i ? "w-5 bg-[#F4EFE6]" : "w-1.5 bg-[#F4EFE6]/45"}`}
              />
            ))}
          </div>
        </>
      )}
    </motion.figure>
  );
}
