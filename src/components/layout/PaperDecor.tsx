import { useEffect, useState } from "react";
import { paperGrain } from "../../lib/noise";

/**
 * Quiet detail for the cream pages, so the empty space has something to look at while still
 * reading as empty space. Everything here is static (no animation, no filters), sits behind the
 * content, and is faint enough that it only shows when you look for it:
 *  - paper grain: a tiny speckle tile, generated once
 *  - a dot grid with a small plus at every fourth point (graph paper, a nod to the data work)
 *  - a few hairline circle diagrams drifting off the page edges, echoing the intro line art
 *  - a ruler along the right edge
 */

const INK = "31,27,22";

const svgUrl = (svg: string) => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

// 32px dot grid
const DOTS = svgUrl(
  `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="0.9" fill="rgba(${INK},0.13)"/></svg>`
);
// a small plus on a 128px lattice, aligned to the dot grid
const PLUS = svgUrl(
  `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><path d="M64 58v12M58 64h12" stroke="rgba(${INK},0.2)" stroke-width="1" fill="none"/></svg>`
);

/** Concentric hairline circles with axes, drawn once. */
function Rings({ className, flip = false }: { className: string; flip?: boolean }) {
  const stroke = `rgba(${INK},0.09)`;
  return (
    <svg
      aria-hidden="true"
      viewBox="-500 -500 1000 1000"
      className={`absolute ${className}`}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      fill="none"
      stroke={stroke}
      strokeWidth="1"
    >
      {[130, 230, 350, 480].map((r) => (
        <circle key={r} cx="0" cy="0" r={r} vectorEffect="non-scaling-stroke" />
      ))}
      <path d="M-500 0H500M0 -500V500" vectorEffect="non-scaling-stroke" strokeDasharray="2 7" />
      <path d="M-353 353L353 -353" vectorEffect="non-scaling-stroke" />
      <circle cx="0" cy="0" r="3" fill={stroke} stroke="none" />
    </svg>
  );
}

export default function PaperDecor() {
  const [grain, setGrain] = useState("");
  useEffect(() => {
    setGrain(paperGrain());
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* grain */}
      {grain && <div className="absolute inset-0" style={{ backgroundImage: `url(${grain})`, backgroundSize: "180px 180px" }} />}

      {/* dot grid + plus marks. Faded in just below the tear so the edge stays clean */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `${PLUS}, ${DOTS}`,
          backgroundSize: "128px 128px, 32px 32px",
          backgroundPosition: "0 0, 0 0",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0, #000 220px)",
          maskImage: "linear-gradient(to bottom, transparent 0, #000 220px)",
        }}
      />

      {/* circle diagrams drifting off the edges */}
      <Rings className="w-[760px] h-[760px] -right-[300px] top-[3%]" />
      <Rings className="hidden md:block w-[680px] h-[680px] -left-[360px] top-[40%]" flip />
      <Rings className="w-[820px] h-[820px] -right-[380px] top-[74%]" />

      {/* right-edge ruler */}
      <div className="hidden lg:block absolute right-5 top-[260px] bottom-[140px] w-4">
        <div
          className="absolute right-0 top-0 bottom-0 w-[6px]"
          style={{ backgroundImage: `repeating-linear-gradient(to bottom, rgba(${INK},0.2) 0 1px, transparent 1px 12px)` }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-[13px]"
          style={{ backgroundImage: `repeating-linear-gradient(to bottom, rgba(${INK},0.3) 0 1px, transparent 1px 60px)` }}
        />
      </div>
    </div>
  );
}
