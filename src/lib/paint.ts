import { useEffect, useState } from "react";
import { mulberry32 } from "./math";

/**
 * Procedural "painted" textures: cracked plaster, layered foliage and loose fresco brushwork, in
 * the site's own palette. Each one is painted once onto a small canvas when the browser is idle,
 * cached as a JPEG data URL, and reused as a CSS background. Until it is ready, callers show
 * their flat gradient fallback, so nothing waits on it.
 */

export type PaintStyle = "plaster" | "foliage" | "fresco";

export interface PaintSpec {
  style: PaintStyle;
  /** Base, mid and highlight colours (hex). */
  palette: [string, string, string];
  seed: number;
}

/** Three ready-made textures, one per tile slot, matching the old flat gradients' colours. */
export const PAINTINGS: PaintSpec[] = [
  { style: "plaster", palette: ["#3a1515", "#6B2D2D", "#a5594a"], seed: 11 },
  { style: "fresco", palette: ["#2a1d15", "#6e5040", "#b48c6c"], seed: 23 },
  { style: "foliage", palette: ["#10171a", "#2b3a4a", "#5d7a6a"], seed: 37 },
];

const SIZE = 640;
const cache = new Map<string, string>();
const keyOf = (s: PaintSpec) => `${s.style}:${s.palette.join(",")}:${s.seed}`;

function hexToRgb(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const rgba = ([r, g, b]: [number, number, number], a: number) => `rgba(${r | 0},${g | 0},${b | 0},${a.toFixed(3)})`;

function jitter(c: [number, number, number], rnd: () => number, amt: number): [number, number, number] {
  const k = (rnd() - 0.5) * amt;
  return [c[0] + k, c[1] + k * 0.9, c[2] + k * 0.8];
}

/** Soft round blob (radial gradient), the basic mottling brush. */
function blob(g: CanvasRenderingContext2D, x: number, y: number, r: number, c: [number, number, number], a: number) {
  const grad = g.createRadialGradient(x, y, 0, x, y, r);
  grad.addColorStop(0, rgba(c, a));
  grad.addColorStop(1, rgba(c, 0));
  g.fillStyle = grad;
  g.fillRect(x - r, y - r, r * 2, r * 2);
}

/** Dry-brush stroke: a bundle of thin parallel bristle lines. */
function stroke(g: CanvasRenderingContext2D, rnd: () => number, x: number, y: number, len: number, ang: number, c: [number, number, number], a: number) {
  const bristles = 6 + ((rnd() * 8) | 0);
  const width = 6 + rnd() * 18;
  g.lineCap = "round";
  for (let i = 0; i < bristles; i++) {
    const off = (i / bristles - 0.5) * width;
    const ox = -Math.sin(ang) * off;
    const oy = Math.cos(ang) * off;
    const l = len * (0.6 + rnd() * 0.4);
    g.strokeStyle = rgba(jitter(c, rnd, 30), a * (0.4 + rnd() * 0.6));
    g.lineWidth = 0.6 + rnd() * 1.8;
    g.beginPath();
    g.moveTo(x + ox, y + oy);
    g.quadraticCurveTo(
      x + ox + Math.cos(ang) * l * 0.5 + (rnd() - 0.5) * 8,
      y + oy + Math.sin(ang) * l * 0.5 + (rnd() - 0.5) * 8,
      x + ox + Math.cos(ang) * l,
      y + oy + Math.sin(ang) * l
    );
    g.stroke();
  }
}

/** Branching hairline cracks, drawn as a dark line with a lighter lip beside it. */
function cracks(g: CanvasRenderingContext2D, rnd: () => number, dark: [number, number, number], light: [number, number, number]) {
  const walk = (x: number, y: number, ang: number, life: number, w: number) => {
    const pts: [number, number][] = [[x, y]];
    for (let i = 0; i < life; i++) {
      ang += (rnd() - 0.5) * 0.9;
      x += Math.cos(ang) * (4 + rnd() * 6);
      y += Math.sin(ang) * (4 + rnd() * 6);
      pts.push([x, y]);
      if (rnd() < 0.05 && life - i > 6) walk(x, y, ang + (rnd() < 0.5 ? 1 : -1) * (0.6 + rnd()), (life - i) * 0.6, w * 0.7);
    }
    for (const [c, a, dx] of [[light, 0.18, 1], [dark, 0.55, 0]] as const) {
      g.strokeStyle = rgba(c, a);
      g.lineWidth = w;
      g.beginPath();
      pts.forEach(([px, py], i) => (i ? g.lineTo(px + dx, py + dx) : g.moveTo(px + dx, py + dx)));
      g.stroke();
    }
  };
  for (let i = 0; i < 14; i++) walk(rnd() * SIZE, rnd() * SIZE, rnd() * Math.PI * 2, 20 + rnd() * 50, 0.8 + rnd() * 0.9);
}

/** One leaf: pointed oval with a lighter midrib. */
function leaf(g: CanvasRenderingContext2D, x: number, y: number, len: number, ang: number, fill: [number, number, number], rib: [number, number, number], a: number) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  const w = len * 0.38;
  g.beginPath();
  g.moveTo(0, -len);
  g.quadraticCurveTo(w, -len * 0.1, 0, len);
  g.quadraticCurveTo(-w, -len * 0.1, 0, -len);
  g.fillStyle = rgba(fill, a);
  g.fill();
  g.strokeStyle = rgba(rib, a * 0.5);
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(0, -len * 0.9);
  g.lineTo(0, len * 0.95);
  g.stroke();
  g.restore();
}

function paint(spec: PaintSpec): string {
  const c = document.createElement("canvas");
  c.width = SIZE;
  c.height = SIZE;
  const g = c.getContext("2d");
  if (!g) return "";
  const rnd = mulberry32(spec.seed);
  const [base, mid, high] = spec.palette.map(hexToRgb) as [[number, number, number], [number, number, number], [number, number, number]];

  g.fillStyle = rgba(base, 1);
  g.fillRect(0, 0, SIZE, SIZE);

  // 1. mottled underpainting
  for (let i = 0; i < 70; i++) {
    const t = rnd();
    blob(g, rnd() * SIZE, rnd() * SIZE, 60 + rnd() * 200, t < 0.55 ? jitter(mid, rnd, 40) : t < 0.8 ? jitter(base, rnd, 30) : jitter(high, rnd, 40), 0.12 + rnd() * 0.22);
  }

  if (spec.style === "plaster") {
    // 2. trowel marks: wide, flat, low-contrast strokes
    for (let i = 0; i < 60; i++) stroke(g, rnd, rnd() * SIZE, rnd() * SIZE, 60 + rnd() * 140, rnd() * Math.PI, rnd() < 0.5 ? high : base, 0.08);
    // 3. a light wash where the "light" hits the wall
    blob(g, SIZE * 0.68, SIZE * 0.24, SIZE * 0.55, high, 0.18);
    cracks(g, rnd, [base[0] * 0.5, base[1] * 0.5, base[2] * 0.5], high);
  } else if (spec.style === "fresco") {
    // 2. loose, directional brushwork in two passes (dark under, light over)
    for (let i = 0; i < 140; i++) {
      const ang = -0.6 + (rnd() - 0.5) * 0.9;
      stroke(g, rnd, rnd() * SIZE, rnd() * SIZE, 40 + rnd() * 120, ang, rnd() < 0.6 ? mid : base, 0.16);
    }
    for (let i = 0; i < 70; i++) stroke(g, rnd, rnd() * SIZE, rnd() * SIZE, 30 + rnd() * 80, -0.6 + (rnd() - 0.5), high, 0.12);
    blob(g, SIZE * 0.3, SIZE * 0.7, SIZE * 0.5, base, 0.35);
  } else {
    // 2. layered foliage: big dark leaves at the back, smaller lit leaves in front
    for (let layer = 0; layer < 3; layer++) {
      const n = 26 + layer * 22;
      const k = layer / 2;
      for (let i = 0; i < n; i++) {
        const len = (70 - layer * 18) * (0.6 + rnd() * 0.7);
        const fill: [number, number, number] = [
          base[0] + (high[0] - base[0]) * (0.15 + 0.6 * k) + (rnd() - 0.5) * 20,
          base[1] + (high[1] - base[1]) * (0.15 + 0.6 * k) + (rnd() - 0.5) * 20,
          base[2] + (high[2] - base[2]) * (0.15 + 0.6 * k) + (rnd() - 0.5) * 20,
        ];
        leaf(g, rnd() * SIZE, rnd() * SIZE, len, rnd() * Math.PI * 2, fill, high, 0.55 + 0.3 * k);
      }
    }
    blob(g, SIZE * 0.72, SIZE * 0.2, SIZE * 0.45, high, 0.12);
  }

  // 4. pigment speckle so it reads as paint, not vector art
  for (let i = 0; i < 2600; i++) {
    g.fillStyle = rgba(rnd() < 0.5 ? high : base, 0.05 + rnd() * 0.12);
    g.fillRect(rnd() * SIZE, rnd() * SIZE, 1 + rnd() * 1.5, 1 + rnd() * 1.5);
  }
  // 5. soft vignette
  const v = g.createRadialGradient(SIZE / 2, SIZE / 2, SIZE * 0.25, SIZE / 2, SIZE / 2, SIZE * 0.75);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(0,0,0,0.35)");
  g.fillStyle = v;
  g.fillRect(0, 0, SIZE, SIZE);

  return c.toDataURL("image/jpeg", 0.82);
}

/** Paint (once, when idle) and return the texture URL; empty string until it is ready. */
export function usePainting(spec: PaintSpec) {
  const key = keyOf(spec);
  const [url, setUrl] = useState(() => cache.get(key) ?? "");
  useEffect(() => {
    if (url) return;
    let alive = true;
    const run = () => {
      let hit = cache.get(key);
      if (hit === undefined) {
        hit = paint(spec);
        cache.set(key, hit);
      }
      if (alive) setUrl(hit);
    };
    const w = window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (h: number) => void };
    const h = w.requestIdleCallback ? w.requestIdleCallback(run, { timeout: 2000 }) : window.setTimeout(run, 300);
    return () => {
      alive = false;
      if (w.cancelIdleCallback) w.cancelIdleCallback(h);
      else window.clearTimeout(h);
    };
    // spec is identified by its key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, url]);
  return url;
}
