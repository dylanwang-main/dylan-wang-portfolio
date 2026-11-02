/**
 * A slow-drifting, heavily blurred collage of real screenshots, used as a scene background.
 * Columns scroll in alternating directions; each column holds its images twice so the loop is seamless.
 */
export default function BlurMontage({
  images,
  columns = 4,
  blur = 18,
  dim = 0.58,
}: {
  images: string[];
  columns?: number;
  /** Blur radius in px. High enough that the work reads as texture, low enough to see it is work. */
  blur?: number;
  /** Dark wash over the collage (0 to 1) so headings stay readable. */
  dim?: number;
}) {
  if (images.length === 0) return null;
  // Spread the images across columns, rotating the start so neighbours differ
  const cols = Array.from({ length: columns }, (_, c) =>
    Array.from({ length: Math.max(3, images.length) }, (_, i) => images[(i + c * 2) % images.length])
  );
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -inset-[18%] flex gap-[2.2vw] justify-center"
        style={{ transform: "rotate(-8deg)", filter: `blur(${blur}px) saturate(1.25)` }}
      >
        {cols.map((col, c) => (
          <div key={c} className="relative flex-1 max-w-[28vw] overflow-visible">
            <div className={`montage-col flex flex-col gap-[2.2vw] ${c % 2 ? "montage-col--down" : ""}`} style={{ animationDuration: `${70 + c * 12}s` }}>
              {[...col, ...col].map((src, i) => (
                <img key={i} src={src} alt="" loading="lazy" decoding="async" className="block w-full h-auto rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0" style={{ background: `rgba(22,19,16,${dim})` }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(10,8,7,0.6) 100%)" }} />
    </div>
  );
}
