import { mulberry32 } from "./math";

/**
 * Seeded noise tiles, generated once on a tiny canvas and reused as a repeating CSS background.
 * Much cheaper than an SVG feTurbulence filter, which the browser re-rasterises at full screen size.
 */
const cache = new Map<string, string>();

type Pixel = (rnd: () => number) => [number, number, number, number];

export function noiseTile(key: string, size: number, seed: number, pixel: Pixel) {
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  if (typeof document === "undefined") return "";
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d");
  if (!g) return "";
  const img = g.createImageData(size, size);
  const rnd = mulberry32(seed);
  for (let i = 0; i < size * size; i++) {
    const [r, gr, b, a] = pixel(rnd);
    const k = i * 4;
    img.data[k] = r;
    img.data[k + 1] = gr;
    img.data[k + 2] = b;
    img.data[k + 3] = a;
  }
  g.putImageData(img, 0, 0);
  const url = c.toDataURL("image/png");
  cache.set(key, url);
  return url;
}

/** Grey film grain (used at a few % opacity in overlay blend over the dark scenes). */
export const filmGrain = () =>
  noiseTile("film", 160, 9001, (rnd) => {
    const v = (rnd() * 255) | 0;
    return [v, v, v, 255];
  });

/** Paper speckle for the cream pages: ~22% of pixels get a faint warm speck. */
export const paperGrain = () =>
  noiseTile("paper", 180, 4242, (rnd) => {
    const on = rnd() < 0.22;
    return [70, 52, 36, on ? (rnd() < 0.12 ? 18 : 6) : 0];
  });
