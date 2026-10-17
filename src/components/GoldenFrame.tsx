import { useMemo } from "react";
import { motion, MotionValue, useTransform } from "motion/react";

const PHI = 1.618034;
const H = 1000;
const W = Math.round(H * PHI);

/** Golden rectangle split into squares (left, top, right, bottom...) with a clockwise quarter-arc in each. */
function build() {
  let x = 0, y = 0, w = W, h = H;
  const squares: string[] = [];
  const arcs: string[] = [];
  for (let i = 0; i < 8; i++) {
    const m = i % 4;
    if (m === 0) {
      const s = h;
      squares.push(`M${x} ${y}h${s}v${s}h${-s}z`);
      arcs.push(`M${x} ${y + s}A${s} ${s} 0 0 1 ${x + s} ${y}`);
      x += s; w -= s;
    } else if (m === 1) {
      const s = w;
      squares.push(`M${x} ${y}h${s}v${s}h${-s}z`);
      arcs.push(`M${x} ${y}A${s} ${s} 0 0 1 ${x + s} ${y + s}`);
      y += s; h -= s;
    } else if (m === 2) {
      const s = h;
      squares.push(`M${x + w - s} ${y}h${s}v${s}h${-s}z`);
      arcs.push(`M${x + w} ${y}A${s} ${s} 0 0 1 ${x + w - s} ${y + s}`);
      w -= s;
    } else {
      const s = w;
      squares.push(`M${x} ${y + h - s}h${s}v${s}h${-s}z`);
      arcs.push(`M${x + s} ${y + h}A${s} ${s} 0 0 1 ${x} ${y + h - s}`);
      h -= s;
    }
  }
  return { squares, arcs };
}

/**
 * Black, golden-ratio line-art frame behind the hero title. Draws itself in on load, then
 * turns and shrinks toward the black hole as you scroll. Pure vector, one transformed layer.
 */
export default function GoldenFrame({ p, reduced }: { p?: MotionValue<number>; reduced?: boolean }) {
  const { squares, arcs } = useMemo(build, []);
  const fallback = useMemo(() => ({ get: () => 0 }) as unknown as MotionValue<number>, []);
  const src = p ?? fallback;
  const seg = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));
  const scale = useTransform(src, (v) => 1 - 0.2 * seg(v, 0.04, 0.5));
  const rotate = useTransform(src, (v) => -14 * seg(v, 0.04, 0.5));
  const draw = (delay: number, dur = 1.8) =>
    reduced ? { initial: false } : {
      initial: { pathLength: 0, opacity: 0 },
      animate: { pathLength: 1, opacity: 1 },
      transition: { duration: dur, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    };

  return (
    <motion.div
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 pointer-events-none will-change-transform"
      style={{
        width: "min(92vw, calc(78svh * 1.618))",
        aspectRatio: `${PHI}`,
        x: "-50%",
        y: "-50%",
        scale: reduced ? 1 : scale,
        rotate: reduced ? 0 : rotate,
        zIndex: 12,
      }}
    >
      <svg viewBox={`-6 -6 ${W + 12} ${H + 12}`} className="w-full h-full overflow-visible" fill="none">
        {/* outer frame */}
        <motion.rect x="0" y="0" width={W} height={H} stroke="rgba(244,239,230,0.42)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" {...draw(0.2, 1.6)} />
        {/* squares */}
        {squares.map((d, i) => (
          <motion.path key={`s${i}`} d={d} stroke="rgba(244,239,230,0.13)" strokeWidth="1" vectorEffect="non-scaling-stroke" {...draw(0.6 + i * 0.12)} />
        ))}
        {/* spiral */}
        {arcs.map((d, i) => (
          <motion.path key={`a${i}`} d={d} stroke="rgba(232,128,128,0.55)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" {...draw(1 + i * 0.22, 1.4)} />
        ))}
      </svg>
    </motion.div>
  );
}
