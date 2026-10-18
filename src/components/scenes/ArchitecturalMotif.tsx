/**
 * Line-art architecture behind each full-screen scene, one drawing per motif id
 * (see `motifId` on the scene layers in data/portfolio.ts). Pure inline SVG.
 */
const strokeColor = "#CBB39C"; // muted warm line art tone

function MotifSvg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 1400 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full object-contain pointer-events-none select-none opacity-[0.3]"
    >
      {children}
    </svg>
  );
}

export default function ArchitecturalMotif({ type }: { type?: string }) {
  switch (type) {
    case "hero-arch":
      return (
        <MotifSvg>
          {/* Ground Baseline / Stylobate */}
          <line x1="100" y1="820" x2="1300" y2="820" stroke={strokeColor} strokeWidth="1" />
          <line x1="120" y1="832" x2="1280" y2="832" stroke={strokeColor} strokeWidth="0.6" strokeDasharray="4 4" />

          {/* Left Fluted Column Pair */}
          <rect x="240" y="240" width="48" height="580" stroke={strokeColor} strokeWidth="0.8" />
          <line x1="252" y1="240" x2="252" y2="820" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="264" y1="240" x2="264" y2="820" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="276" y1="240" x2="276" y2="820" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" />
          <rect x="232" y="804" width="64" height="16" stroke={strokeColor} strokeWidth="0.8" />
          <rect x="234" y="226" width="60" height="14" stroke={strokeColor} strokeWidth="0.8" />

          {/* Right Fluted Column Pair */}
          <rect x="1112" y="240" width="48" height="580" stroke={strokeColor} strokeWidth="0.8" />
          <line x1="1124" y1="240" x2="1124" y2="820" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="1136" y1="240" x2="1136" y2="820" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="1148" y1="240" x2="1148" y2="820" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="3 3" />
          <rect x="1104" y="804" width="64" height="16" stroke={strokeColor} strokeWidth="0.8" />
          <rect x="1106" y="226" width="60" height="14" stroke={strokeColor} strokeWidth="0.8" />

          {/* Inner Pilasters Supporting Arch */}
          <rect x="390" y="340" width="36" height="480" stroke={strokeColor} strokeWidth="0.8" />
          <rect x="974" y="340" width="36" height="480" stroke={strokeColor} strokeWidth="0.8" />

          {/* Semicircular Classical Triumphal Arch */}
          <path d="M 426 340 A 274 274 0 0 1 974 340" stroke={strokeColor} strokeWidth="1.2" />
          <path d="M 390 340 A 310 310 0 0 1 1010 340" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="6 4" />

          {/* Keystone at Apex */}
          <polygon points="688,30 712,30 718,72 682,72" stroke={strokeColor} strokeWidth="0.8" />

          {/* Architrave / Entablature */}
          <line x1="180" y1="226" x2="1220" y2="226" stroke={strokeColor} strokeWidth="1" />
          <line x1="180" y1="190" x2="1220" y2="190" stroke={strokeColor} strokeWidth="0.8" />
          <line x1="200" y1="160" x2="1200" y2="160" stroke={strokeColor} strokeWidth="0.8" />

          {/* Pediment Guidelines */}
          <line x1="200" y1="160" x2="700" y2="70" stroke={strokeColor} strokeWidth="0.7" strokeDasharray="4 4" />
          <line x1="1200" y1="160" x2="700" y2="70" stroke={strokeColor} strokeWidth="0.7" strokeDasharray="4 4" />
          <circle cx="700" cy="115" r="28" stroke={strokeColor} strokeWidth="0.6" strokeDasharray="3 3" />
        </MotifSvg>
      );

    case "work-colonnade":
      return (
        <MotifSvg>
          <line x1="80" y1="800" x2="1320" y2="800" stroke={strokeColor} strokeWidth="1" />
          <line x1="60" y1="816" x2="1340" y2="816" stroke={strokeColor} strokeWidth="0.6" />
          <line x1="80" y1="220" x2="1320" y2="220" stroke={strokeColor} strokeWidth="1" />
          <line x1="80" y1="190" x2="1320" y2="190" stroke={strokeColor} strokeWidth="0.7" />

          {[160, 390, 620, 850, 1080].map((x, idx) => (
            <g key={idx}>
              <line x1={x} y1="360" x2={x} y2="800" stroke={strokeColor} strokeWidth="0.8" />
              <line x1={x + 160} y1="360" x2={x + 160} y2="800" stroke={strokeColor} strokeWidth="0.8" />
              <line x1={x + 6} y1="360" x2={x + 6} y2="800" stroke={strokeColor} strokeWidth="0.4" strokeDasharray="4 4" />
              <line x1={x + 154} y1="360" x2={x + 154} y2="800" stroke={strokeColor} strokeWidth="0.4" strokeDasharray="4 4" />
              <path d={`M ${x} 360 A 80 80 0 0 1 ${x + 160} 360`} stroke={strokeColor} strokeWidth="1" />
              <path d={`M ${x - 8} 360 A 88 88 0 0 1 ${x + 168} 360`} stroke={strokeColor} strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1={x + 80} y1="272" x2={x + 80} y2="288" stroke={strokeColor} strokeWidth="0.9" />
            </g>
          ))}
        </MotifSvg>
      );

    case "content-vault":
      return (
        <MotifSvg>
          <line x1="120" y1="820" x2="1280" y2="820" stroke={strokeColor} strokeWidth="1" />
          <line x1="140" y1="836" x2="1260" y2="836" stroke={strokeColor} strokeWidth="0.6" />

          {/* Left Arch Bay */}
          <rect x="220" y="320" width="36" height="500" stroke={strokeColor} strokeWidth="0.8" />
          <rect x="620" y="320" width="36" height="500" stroke={strokeColor} strokeWidth="0.8" />
          <path d="M 256 320 A 182 182 0 0 1 620 320" stroke={strokeColor} strokeWidth="1.2" />
          <path d="M 238 320 A 200 200 0 0 1 638 320" stroke={strokeColor} strokeWidth="0.6" strokeDasharray="4 4" />
          <line x1="438" y1="138" x2="438" y2="162" stroke={strokeColor} strokeWidth="1" />

          {/* Right Arch Bay */}
          <rect x="744" y="320" width="36" height="500" stroke={strokeColor} strokeWidth="0.8" />
          <rect x="1144" y="320" width="36" height="500" stroke={strokeColor} strokeWidth="0.8" />
          <path d="M 780 320 A 182 182 0 0 1 1144 320" stroke={strokeColor} strokeWidth="1.2" />
          <path d="M 762 320 A 200 200 0 0 1 1162 320" stroke={strokeColor} strokeWidth="0.6" strokeDasharray="4 4" />
          <line x1="962" y1="138" x2="962" y2="162" stroke={strokeColor} strokeWidth="1" />

          <line x1="140" y1="180" x2="1260" y2="180" stroke={strokeColor} strokeWidth="0.8" />
          <line x1="180" y1="150" x2="1220" y2="150" stroke={strokeColor} strokeWidth="0.6" strokeDasharray="6 6" />
        </MotifSvg>
      );

    case "about-portico":
      return (
        <MotifSvg>
          <line x1="160" y1="810" x2="1240" y2="810" stroke={strokeColor} strokeWidth="1" />
          <line x1="140" y1="824" x2="1260" y2="824" stroke={strokeColor} strokeWidth="0.8" />
          <line x1="120" y1="838" x2="1280" y2="838" stroke={strokeColor} strokeWidth="0.6" />

          {[240, 420, 600, 780, 960, 1140].map((x, idx) => (
            <g key={idx}>
              <rect x={x - 18} y="240" width="36" height="570" stroke={strokeColor} strokeWidth="0.8" />
              <line x1={x - 6} y1="240" x2={x - 6} y2="810" stroke={strokeColor} strokeWidth="0.4" strokeDasharray="4 4" />
              <line x1={x + 6} y1="240" x2={x + 6} y2="810" stroke={strokeColor} strokeWidth="0.4" strokeDasharray="4 4" />
              <rect x={x - 24} y="796" width="48" height="14" stroke={strokeColor} strokeWidth="0.8" />
              <rect x={x - 24} y="228" width="48" height="12" stroke={strokeColor} strokeWidth="0.8" />
            </g>
          ))}

          <rect x="180" y="196" width="1040" height="32" stroke={strokeColor} strokeWidth="0.9" />
          <polygon points="180,196 700,54 1220,196" stroke={strokeColor} strokeWidth="1.2" />
          <polygon points="204,190 700,72 1196,190" stroke={strokeColor} strokeWidth="0.6" strokeDasharray="4 4" />
          <circle cx="700" cy="135" r="24" stroke={strokeColor} strokeWidth="0.7" strokeDasharray="3 3" />
        </MotifSvg>
      );

    case "contact-rotunda":
      return (
        <MotifSvg>
          <ellipse cx="700" cy="810" rx="520" ry="24" stroke={strokeColor} strokeWidth="1" />
          <ellipse cx="700" cy="824" rx="540" ry="26" stroke={strokeColor} strokeWidth="0.6" />

          <path d="M 280 240 A 420 220 0 0 1 1120 240" stroke={strokeColor} strokeWidth="1.2" />
          <path d="M 320 240 A 380 200 0 0 1 1080 240" stroke={strokeColor} strokeWidth="0.6" strokeDasharray="4 4" />
          <line x1="700" y1="20" x2="700" y2="44" stroke={strokeColor} strokeWidth="1.2" />

          {[300, 460, 620, 780, 940, 1100].map((x, idx) => (
            <g key={idx}>
              <line x1={x} y1="240" x2={x} y2="810" stroke={strokeColor} strokeWidth="0.8" />
              <line x1={x + 6} y1="240" x2={x + 6} y2="810" stroke={strokeColor} strokeWidth="0.4" strokeDasharray="4 4" />
              <line x1={x - 6} y1="240" x2={x - 6} y2="810" stroke={strokeColor} strokeWidth="0.4" strokeDasharray="4 4" />
            </g>
          ))}

          <g>
            <line x1="620" y1="440" x2="620" y2="810" stroke={strokeColor} strokeWidth="0.9" />
            <line x1="780" y1="440" x2="780" y2="810" stroke={strokeColor} strokeWidth="0.9" />
            <path d="M 620 440 A 80 80 0 0 1 780 440" stroke={strokeColor} strokeWidth="1" />
            <line x1="700" y1="360" x2="700" y2="810" stroke={strokeColor} strokeWidth="0.5" strokeDasharray="4 4" />
          </g>

          <rect x="220" y="210" width="960" height="36" stroke={strokeColor} strokeWidth="0.9" />
          <polygon points="220,210 700,70 1180,210" stroke={strokeColor} strokeWidth="1.2" />
          <polygon points="244,204 700,88 1156,204" stroke={strokeColor} strokeWidth="0.6" strokeDasharray="4 4" />
        </MotifSvg>
      );

    default:
      return null;
  }
}
