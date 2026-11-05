import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../lib/useReducedMotion";

interface Blob {
  x: number;
  y: number;
  r: number; // final radius, px
  born: number; // ms
  seed: number;
}

/**
 * A black-and-white photo you paint colour back into. Moving the pointer over it (or tapping, on touch screens) drops watercolour
 * blooms that blossom outward with soft, uneven edges, revealing the colour photo underneath.
 * Leaving the photo lets the paint slowly dry away back to black and white.
 */
export default function PaintedPortrait({ src, alt, position = "50% 50%" }: { src: string; alt: string; position?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || reduced) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.decoding = "async";
    img.src = src;

    const mask = document.createElement("canvas"); // baked paint
    const mctx = mask.getContext("2d")!;
    const [px, py] = position.split(" ").map((v) => parseFloat(v) / 100);
    let W = 0;
    let H = 0;
    let dpr = 1;
    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      for (const c of [canvas, mask]) {
        c.width = Math.round(W * dpr);
        c.height = Math.round(H * dpr);
      }
    };
    size();

    const blobs: Blob[] = [];
    let raf = 0;
    let fading = false;
    let fade = 1; // overall paint strength, eases to 0 after the pointer leaves
    let last: { x: number; y: number; t: number } | null = null;
    const GROW = 900; // ms for a bloom to reach full size

    // one watercolour bloom: overlapping soft lobes, a slightly darker pooled rim
    const drawBlob = (g: CanvasRenderingContext2D, b: Blob, k: number) => {
      const r = b.r * (0.25 + 0.75 * (1 - Math.pow(1 - k, 3))) * dpr;
      const x = b.x * dpr;
      const y = b.y * dpr;
      let s = b.seed;
      const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
      for (let i = 0; i < 7; i++) {
        const a = rnd() * Math.PI * 2;
        const d = r * 0.35 * rnd();
        const lr = r * (0.55 + 0.45 * rnd());
        const cx = x + Math.cos(a) * d;
        const cy = y + Math.sin(a) * d;
        const grad = g.createRadialGradient(cx, cy, 0, cx, cy, lr);
        grad.addColorStop(0, "rgba(0,0,0,0.85)");
        grad.addColorStop(0.45, "rgba(0,0,0,0.7)");
        grad.addColorStop(0.7, "rgba(0,0,0,0.55)"); // faint pooled ring
        grad.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = grad;
        g.beginPath();
        g.arc(cx, cy, lr, 0, Math.PI * 2);
        g.fill();
      }
    };

    // object-fit: cover, honouring the object-position
    const drawCover = () => {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (!iw) return;
      const sc = Math.max(canvas.width / iw, canvas.height / ih);
      const dw = iw * sc;
      const dh = ih * sc;
      ctx.drawImage(img, (canvas.width - dw) * px, (canvas.height - dh) * py, dw, dh);
    };

    const frame = (now: number) => {
      raf = 0;
      // bake finished blooms into the mask
      for (let i = blobs.length - 1; i >= 0; i--) {
        const k = (now - blobs[i].born) / GROW;
        if (k >= 1) {
          drawBlob(mctx, blobs[i], 1);
          blobs.splice(i, 1);
        }
      }
      if (fading) fade = Math.max(0, fade - 0.012);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.drawImage(mask, 0, 0);
      for (const b of blobs) drawBlob(ctx, b, Math.min(1, (now - b.born) / GROW));
      ctx.globalCompositeOperation = "source-in";
      ctx.globalAlpha = fade;
      drawCover();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      if (fading && fade <= 0) {
        mctx.clearRect(0, 0, mask.width, mask.height);
        blobs.length = 0;
        fading = false;
        fade = 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      if (blobs.length || fading) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    let dryTimer = 0;
    // keep the paint wet while the visitor is still interacting; dry it away after a pause
    const wake = () => {
      window.clearTimeout(dryTimer);
      if (fading) {
        fading = false;
        fade = Math.max(fade, 0.6);
      }
    };
    const dryLater = (ms: number) => {
      window.clearTimeout(dryTimer);
      dryTimer = window.setTimeout(() => {
        fading = true;
        kick();
      }, ms);
    };
    // a single big bloom, for taps (and for the gentle hint on touch screens)
    const bloomAt = (x: number, y: number, scale = 1.9) => {
      wake();
      const base = Math.min(W, H) * 0.17;
      blobs.push({ x, y, r: base * scale * (0.9 + Math.random() * 0.3), born: performance.now(), seed: (Math.random() * 1e9) | 1 });
      kick();
    };

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const t = performance.now();
      wake();
      // drop a bloom every ~22px of travel; faster strokes leave bigger, wetter blooms
      if (last && Math.hypot(x - last.x, y - last.y) < 18) return;
      const speed = last ? Math.hypot(x - last.x, y - last.y) / Math.max(16, t - last.t) : 0;
      last = { x, y, t };
      const base = Math.min(W, H) * 0.17;
      blobs.push({ x, y, r: base * (0.8 + Math.min(1.2, speed * 0.8)) * (0.85 + Math.random() * 0.4), born: t, seed: (Math.random() * 1e9) | 1 });
      kick();
    };
    const onLeave = (e?: PointerEvent) => {
      last = null;
      // let the paint sit for a moment (longer on touch, where there is no cursor to watch), then dry away
      dryLater(e && e.pointerType !== "mouse" ? 4500 : 1400);
    };

    // tap to paint: a quick touch (or click) that did not travel drops one big bloom right under the finger
    let down: { x: number; y: number; t: number } | null = null;
    const onDown = (e: PointerEvent) => {
      down = { x: e.clientX, y: e.clientY, t: performance.now() };
    };
    const onUp = (e: PointerEvent) => {
      const d = down;
      down = null;
      if (!d || e.pointerType === "mouse") return; // a mouse already paints on hover
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 12 || performance.now() - d.t > 500) return;
      const r = wrap.getBoundingClientRect();
      bloomAt(e.clientX - r.left, e.clientY - r.top);
      setTouched(true);
      onLeave(e);
    };
    const onCancel = (e: PointerEvent) => {
      down = null;
      onLeave(e);
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointerup", onUp);
    wrap.addEventListener("pointercancel", onCancel);

    // touch screens get a small demonstration the first time the photo scrolls into view
    let hintTimer = 0;
    const io = new IntersectionObserver(
      ([en]) => {
        if (!en.isIntersecting) return;
        io.disconnect();
        if (!window.matchMedia("(hover: none)").matches) return;
        hintTimer = window.setTimeout(() => {
          bloomAt(W * 0.36, H * 0.4, 1.6);
          window.setTimeout(() => bloomAt(W * 0.64, H * 0.52, 1.6), 450);
          dryLater(3200);
        }, 700);
      },
      { threshold: 0.6 }
    );
    io.observe(wrap);
    const ro = new ResizeObserver(() => {
      size();
      mctx.clearRect(0, 0, mask.width, mask.height);
      kick();
    });
    ro.observe(wrap);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(dryTimer);
      window.clearTimeout(hintTimer);
      io.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointerup", onUp);
      wrap.removeEventListener("pointercancel", onCancel);
      ro.disconnect();
    };
  }, [src, position, reduced]);

  return (
    <div ref={wrapRef} className="group absolute inset-0 overflow-hidden" style={{ touchAction: "pan-y" }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 w-full h-full object-cover transition-[filter] duration-700 ${reduced ? "[filter:grayscale(1)] group-hover:[filter:none]" : "[filter:grayscale(1)_contrast(1.08)]"}`}
        style={{ objectPosition: position }}
      />
      {!reduced && <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" />}
      {!reduced && !touched && (
        <span aria-hidden="true" className="paint-hint pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-3.5 py-1.5 text-[12px] tracking-[0.12em] uppercase text-[#F4EFE6] backdrop-blur-sm">
          Tap to paint
        </span>
      )}
    </div>
  );
}
