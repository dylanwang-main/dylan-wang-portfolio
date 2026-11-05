import { motion, MotionValue, useTransform } from "motion/react";
import { CONTENT_PROJECT } from "../../data/portfolio";

/**
 * Top reels as a stack of three wide cards (phone cover on the left, the numbers big beside it),
 * best first. Stacking, instead of three phone covers side by side, keeps every cover and every
 * number large enough to read on a phone and on a desktop. Each card links to the reel.
 */
export default function ReelCards({ build }: { build: MotionValue<number> }) {
  const reels = CONTENT_PROJECT.reels ?? [];
  return (
    <div className="relative w-full max-w-[880px] mx-auto">
      <ol className="flex flex-col gap-4 sm:gap-6">
        {reels.map((r, i) => (
          <li key={r.url}>
            <ReelCard reel={r} rank={i + 1} build={build} delay={i} />
          </li>
        ))}
      </ol>
      <p className="mt-6 text-center font-editorial-serif italic text-[16px] text-[var(--taupe-subtle)]">
        “× median” compares each reel to my typical post, about 4K views.
      </p>
    </div>
  );
}

function ReelCard({
  reel,
  rank,
  build,
  delay,
}: {
  reel: NonNullable<typeof CONTENT_PROJECT.reels>[number];
  rank: number;
  build: MotionValue<number>;
  delay: number;
}) {
  const s0 = 0.1 + delay * 0.14;
  const opacity = useTransform(build, [s0, s0 + 0.2], [0, 1]);
  const y = useTransform(build, [s0, s0 + 0.3], [40, 0]);
  return (
    <motion.a
      href={reel.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open reel number ${rank}, ${reel.views} views, on Instagram`}
      className="group relative flex items-stretch gap-4 sm:gap-8 rounded-[22px] p-3 sm:p-5 bg-[#FBF8F2] border border-[rgba(31,27,22,0.1)]"
      style={{ opacity, y, boxShadow: "0 18px 44px rgba(31,27,22,0.16)" }}
    >
      <div className="relative shrink-0 overflow-hidden rounded-[14px] aspect-[9/16] w-[clamp(118px,34vw,200px)]" style={{ boxShadow: "0 12px 28px rgba(31,27,22,0.28)" }}>
        <img
          src={reel.cover}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 sm:gap-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="font-editorial-serif italic text-[22px] sm:text-[28px] leading-none text-[var(--accent-oxblood)]">№ {rank}</span>
          <span className="rounded-full bg-[var(--accent-oxblood)] px-3 py-1 text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.12em] text-white whitespace-nowrap">
            {reel.vsMedian} median
          </span>
        </div>
        <div>
          <span className="block font-editorial-serif italic leading-[0.95] tracking-[-0.02em] text-[var(--text-ink)] text-[clamp(3rem,10vw,5.5rem)]">{reel.views}</span>
          <span className="block mt-1 text-[12px] sm:text-[13px] uppercase tracking-[0.2em] text-[var(--taupe-subtle)]">views</span>
        </div>
        <p className="text-[15px] sm:text-[17px] leading-snug text-[var(--text-ink)]/80">
          {reel.likes} likes · {reel.engagement} engagement
        </p>
      </div>
      <span
        aria-hidden="true"
        className="absolute right-3 bottom-3 sm:right-5 sm:bottom-5 w-8 h-8 rounded-full grid place-items-center text-[14px] text-white bg-[var(--accent-pop)] transition-transform duration-300 group-hover:-translate-y-0.5"
      >
        ↗
      </span>
    </motion.a>
  );
}
