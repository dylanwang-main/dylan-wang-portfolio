import { useEffect, useRef } from "react";
import { MotionValue } from "motion/react";
import { clamp01, seg, mulberry32 } from "../../lib/math";

interface P {
  r0: number;
  a0: number;
  w: number;
  tone: number;
}

/**
 * Stars and dust pulled into the black hole. Each particle follows a log spiral that
 * tightens and speeds up toward the centre, drawn as a streak. Position depends only on
 * scroll progress `p`, so it scrubs forward and backward with the page.
 */
export default function GravityField({
  p,
  ox,
  oy,
  count = 240,
}: {
  p: MotionValue<number>;
  ox: number;
  oy: number;
  count?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const rnd = mulberry32(31);
    const parts: P[] = Array.from({ length: count }, () => ({
      r0: 70 + Math.pow(rnd(), 0.8) * 900,
      a0: rnd() * Math.PI * 2,
      w: 0.6 + rnd() * 1.1,
      tone: rnd(),
    }));

    let W = 0;
    let H = 0;
    const size = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    size();

    const pos = (q: P, u: number, cx: number, cy: number) => {
      const rr = q.r0 * Math.pow(1 - u, 1.8);
      const ang = q.a0 + 1.9 * Math.log((q.r0 + 30) / (rr + 30)) * 1.6;
      return [cx + rr * Math.cos(ang), cy + rr * Math.sin(ang) * 0.92] as const;
    };

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const v = p.get();
      ctx.clearRect(0, 0, W, H);
      const fade = seg(v, 0.03, 0.12) * (1 - seg(v, 0.5, 0.68));
      if (fade <= 0.001) return;
      const pull = Math.pow(seg(v, 0.04, 0.62), 1.6);
      const cx = (ox / 100) * W;
      const cy = (oy / 100) * H;
      ctx.lineCap = "round";
      for (const q of parts) {
        const u = clamp01(pull * q.w);
        if (u >= 0.992) continue;
        const [x1, y1] = pos(q, u, cx, cy);
        const near = 1 - Math.min(1, Math.hypot(x1 - cx, y1 - cy) / 420);
        const a = fade * (0.3 + 0.7 * near);
        ctx.strokeStyle =
          q.tone > 0.7
            ? `rgba(255,${(170 + 60 * near) | 0},110,${a.toFixed(3)})`
            : `rgba(255,${(236 - 40 * near) | 0},${(222 - 90 * near) | 0},${a.toFixed(3)})`;
        ctx.lineWidth = 0.8 + near * 1.8;
        // trail follows the spiral, so it curves like a real infall path
        ctx.beginPath();
        const TRAIL = 6;
        for (let k = TRAIL; k >= 0; k--) {
          const [tx, ty] = pos(q, Math.max(0, u - (0.06 * k) / TRAIL), cx, cy);
          if (k === TRAIL) ctx.moveTo(tx, ty);
          else ctx.lineTo(tx, ty);
        }
        ctx.stroke();
      }
    };

    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        draw();
      });
    };
    const un = p.on("change", schedule);
    const onResize = () => {
      size();
      draw();
    };
    window.addEventListener("resize", onResize);
    draw();
    return () => {
      un();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [p, ox, oy, count]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" />;
}
