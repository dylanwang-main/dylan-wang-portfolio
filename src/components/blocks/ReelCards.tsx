import { motion, MotionValue, useTransform } from "motion/react";
import { CONTENT_PROJECT } from "../../data/portfolio";

/**
 * Top reels as three phone cards, fanned like a hand of cards: the best one in the middle and
 * raised. Each card links to the reel. Sized with container units so three 9:16 cards always fit
 * the stage, whichever of its width or height is tighter.
 */
export default function ReelCards({ build }: { build: MotionValue<number> }) {
  const reels = CONTENT_PROJECT.reels ?? [];
  // best in the middle: [2nd, 1st, 3rd]
  const order = reels.length === 3 ? [reels[1], reels[0], reels[2]] : reels;
  const fan = [
    { rotate: -6, y: 18, scale: 0.94 },
    { rotate: 0, y: 0, scale: 1 },
    { rotate: 6, y: 18, scale: 0.94 },
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-[3cqw]" style={{ containerType: "size" }}>
      {order.map((r, i) => (
        <ReelCard key={r.url} reel={r} rank={reels.indexOf(r) + 1} pose={fan[i] ?? fan[1]} build={build} delay={i} />
      ))}
    </div>
  );
}

function ReelCard({
  reel,
  rank,
  pose,
  build,
  delay,
}: {
  reel: NonNullable<typeof CONTENT_PROJECT.reels>[number];
  rank: number;
  pose: { rotate: number; y: number; scale: number };
  build: MotionValue<number>;
  delay: number;
}) {
  const s0 = 0.1 + delay * 0.12;
  const opacity = useTransform(build, [s0, s0 + 0.2], [0, 1]);
  const y = useTransform(build, [s0, s0 + 0.3], [pose.y + 40, pose.y]);
  return (
    <motion.a
      href={reel.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open reel with ${reel.views} views on Instagram`}
      className="group relative block shrink-0 rounded-[18px] overflow-hidden"
      style={{
        width: "min(29cqw, calc(92cqh * 9 / 16))",
        // the card is its own container, so its text scales with the card on any screen
        containerType: "inline-size",
        aspectRatio: "9 / 16",
        rotate: pose.rotate,
        scale: pose.scale,
        y,
        opacity,
        zIndex: rank === 1 ? 2 : 1,
        boxShadow: "0 22px 50px rgba(31,27,22,0.32)",
      }}
    >
      <img
        src={reel.cover}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(14,11,9,0.92) 0%, rgba(14,11,9,0.35) 38%, transparent 60%)" }} />
      <span className="absolute left-[6cqw] top-[6cqw] rounded-full whitespace-nowrap font-semibold tracking-[0.12em] uppercase text-white bg-[var(--accent-oxblood)]"
        style={{ fontSize: "clamp(7px, 5.4cqw, 11px)", padding: "1.6cqw 4cqw" }}>
        {reel.vsMedian} median
      </span>
      <div className="absolute left-[6cqw] right-[6cqw] bottom-[6cqw] text-[#F4EFE6]">
        <span className="block font-editorial-serif italic leading-none" style={{ fontSize: "clamp(16px, 17cqw, 40px)" }}>{reel.views}</span>
        <span className="block mt-0.5 uppercase tracking-[0.18em] text-[#F4EFE6]/70" style={{ fontSize: "clamp(7px, 5cqw, 10px)" }}>views</span>
        <span className="block mt-[3cqw] text-[#F4EFE6]/80" style={{ fontSize: "clamp(7px, 5.6cqw, 12px)" }}>
          {reel.likes} likes · {reel.engagement} engagement
        </span>
      </div>
      <span
        aria-hidden="true"
        className="absolute right-3 bottom-3 w-7 h-7 rounded-full grid place-items-center text-[13px] text-white bg-[var(--accent-pop)] opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
      >
        ↗
      </span>
    </motion.a>
  );
}
