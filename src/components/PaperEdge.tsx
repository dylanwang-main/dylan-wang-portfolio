import { useEffect, useRef } from "react";

/**
 * Torn paper edge.
 *
 * The canvas is transparent ABOVE the ragged line (so the scene behind shows
 * through) and filled with `fill` BELOW it (so it merges into the page that
 * sits directly under the canvas). Place it so its bottom edge touches the top
 * of the page it belongs to. Use <PaperEdge.Anchor> or the `anchor` prop for that.
 */

const EDGE_HEIGHT = 220;

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface PaperEdgeProps {
  seed: number;
  /** Page color below the tear. Must match the page this edge belongs to. */
  fill: string;
  /** RGB triple for the fibrous rim, e.g. "255,255,255". */
  rim?: string;
  /** Shadow cast onto the page behind (the side ABOVE the tear). */
  shadow?: string;
  height?: number;
}

export default function PaperEdge({
  seed,
  fill,
  rim = "255,255,255",
  shadow = "rgba(0,0,0,0.45)",
  height = EDGE_HEIGHT,
}: PaperEdgeProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = Math.ceil(canvas.parentElement?.clientWidth || window.innerWidth);
      const H = height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = "100%";
      canvas.style.height = `${H}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const rnd = mulberry32(seed);
      // amplitude (px) and frequency of each noise octave: slow waves down to fine tear
      const oct = [
        { a: 40, f: 0.0035 },
        { a: 22, f: 0.011 },
        { a: 10, f: 0.03 },
        { a: 5, f: 0.09 },
        { a: 2, f: 0.25 },
      ];
      const ph = oct.map(() => rnd() * 1000);
      const base = H * 0.55;
      const ys: number[] = [];
      for (let x = 0; x <= W; x++) {
        let y = base;
        oct.forEach((o, i) => {
          y +=
            o.a *
            Math.sin(x * o.f + ph[i]) *
            (0.6 + 0.4 * Math.sin(x * o.f * 0.37 + ph[i] * 1.7));
        });
        ys.push(y + (rnd() - 0.5) * 2);
      }

      const body = () => {
        ctx.beginPath();
        ctx.moveTo(0, H + 2);
        for (let x = 0; x <= W; x++) ctx.lineTo(x, ys[x]);
        ctx.lineTo(W, H + 2);
        ctx.closePath();
      };

      // 1. paper body (solid all the way to the bottom row)
      body();
      ctx.fillStyle = fill;
      ctx.fill();

      // 2. fibrous rim, drawn inside the paper along the tear
      ctx.save();
      body();
      ctx.clip();
      ctx.beginPath();
      ctx.moveTo(0, ys[0]);
      for (let x = 1; x <= W; x++) ctx.lineTo(x, ys[x]);
      ctx.lineJoin = "round";
      ctx.strokeStyle = `rgba(${rim},0.55)`;
      ctx.lineWidth = 16;
      ctx.stroke();
      ctx.strokeStyle = `rgba(${rim},0.95)`;
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.restore();

      // 3. loose fibers sticking out above the tear
      ctx.lineWidth = 0.7;
      for (let i = 0; i < W * 3; i++) {
        const x = Math.floor(rnd() * W);
        const y = ys[x];
        const len = 2 + rnd() * 9;
        const dx = (rnd() - 0.5) * 5;
        ctx.strokeStyle = `rgba(${rim},${0.25 + rnd() * 0.5})`;
        ctx.beginPath();
        ctx.moveTo(x, y + 1);
        ctx.lineTo(x + dx, y - len);
        ctx.stroke();
      }
    };

    draw();
    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    });
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [seed, fill, rim, height]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none select-none absolute left-0 w-full"
      style={{
        // bottom edge of the canvas sits 2px inside the page below (no hairline seam)
        bottom: "calc(100% - 2px)",
        height,
        filter: `drop-shadow(0 -10px 22px ${shadow})`,
        // let the shadow spill upward onto the scene, never down onto the page below
        clipPath: "inset(-90px 0 0 0)",
        zIndex: 5,
      }}
    />
  );
}
