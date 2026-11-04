import { useEffect, useRef } from "react";
import { motion, useTransform, motionValue, MotionValue } from "motion/react";
import {
  WORK_PROJECTS,
  CONTENT_PROJECT,
  SOCIAL_LINKS,
  CONTACT_EMAIL,
  ABOUT_PROFILE,
  EDUCATION,
} from "../../data/portfolio";

/**
 * The "show something off" layer of each full-screen scene.
 * A big hero window + a smaller companion card + floating labels, all at different
 * depths. They build in with scroll (`build`, 0 to 1) and drift at different speeds as the
 * next page rises over them (`exit`, 0 to 1). Nothing here is a made-up metric:
 * charts and timelines are unlabeled wireframes, text comes from portfolio.ts.
 */

const PANEL = "#1b1612";
const LINE = "rgba(244,239,230,0.14)";
const CREAM = "#F4EFE6";
const ROSE = "#E88080";
const TAUPE = "#8A7B6A";

type V = MotionValue<number>;

/** Look a project up by id, so reordering the list never changes which window shows which title. */
const projectTitle = (id: string) => WORK_PROJECTS.find((p) => p.id === id)?.title ?? "";

function useRange(v: V, a: number, b: number) {
  return useTransform(v, [a, b], [0, 1], { clamp: true });
}

export function Win({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="w-full h-full rounded-xl overflow-hidden flex flex-col"
      style={{
        background: PANEL,
        border: `1px solid ${LINE}`,
        boxShadow: "var(--win-shadow, 0 40px 120px rgba(0,0,0,0.65))",
      }}
    >
      <div
        className="flex items-center gap-2 px-4 h-9 shrink-0"
        style={{ borderBottom: `1px solid ${LINE}` }}
      >
        {[ROSE, "#C9A46B", "#7FA38A"].map((c) => (
          <i key={c} className="block w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.8 }} />
        ))}
        <span className="ml-3 min-w-0 truncate text-[11px] tracking-[0.2em] uppercase" style={{ color: TAUPE }}>
          {title}
        </span>
      </div>
      <div className="relative flex-1 min-h-0">{children}</div>
    </div>
  );
}

/* ---------- WORK ---------- */
export function WorkMain({ build }: { build: V }) {
  const l1 = useRange(build, 0.05, 0.7);
  const l2 = useRange(build, 0.2, 0.9);
  const heat = useRange(build, 0.25, 0.75);
  const code = useRange(build, 0.3, 0.95);
  const cells = Array.from({ length: 48 }, (_, i) => 0.12 + ((i * 37) % 11) / 14);
  return (
    <Win title={projectTitle("ds3-park-smart")}>
      <div className="absolute inset-0 flex gap-4 p-4">
        <div className="hidden md:flex flex-col gap-3 w-[12%] pt-1">
          {[70, 52, 84, 46, 62, 38].map((w, i) => (
            <div key={i} className="h-2 rounded-full" style={{ width: `${w}%`, background: CREAM, opacity: 0.16 }} />
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <svg viewBox="0 0 400 170" preserveAspectRatio="none" className="w-full flex-1 min-h-0">
            {[34, 68, 102, 136].map((y) => (
              <line key={y} x1="0" x2="400" y1={y} y2={y} stroke={LINE} strokeWidth="1" />
            ))}
            <motion.path
              d="M0 140 C40 120 70 128 110 96 S180 70 220 84 S300 40 340 52 S390 24 400 20"
              fill="none" stroke={ROSE} strokeWidth="2.5" strokeLinecap="round"
              style={{ pathLength: l1 }}
            />
            <motion.path
              d="M0 150 C50 146 90 138 130 124 S210 118 250 100 S330 86 400 70"
              fill="none" stroke={CREAM} strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round"
              style={{ pathLength: l2 }}
            />
          </svg>
          <motion.div
            className="grid gap-1.5 h-[34%] shrink-0"
            style={{ gridTemplateColumns: "repeat(16, 1fr)", scaleY: heat, transformOrigin: "50% 100%", opacity: heat }}
          >
            {cells.map((o, i) => (
              <div key={i} className="rounded-[3px]" style={{ background: i % 5 === 0 ? ROSE : CREAM, opacity: o * (i % 5 === 0 ? 1 : 0.5) }} />
            ))}
          </motion.div>
        </div>
        <motion.div className="hidden md:flex flex-col gap-2.5 w-[28%] pt-1" style={{ scaleX: code, transformOrigin: "0% 50%", opacity: code }}>
          {[80, 56, 70, 40, 88, 62, 74, 48, 66, 34, 58].map((w, i) => (
            <div key={i} className="h-2 rounded-full" style={{ width: `${w}%`, background: [ROSE, CREAM, TAUPE][i % 3], opacity: 0.5, marginLeft: (i % 4) * 8 }} />
          ))}
        </motion.div>
      </div>
    </Win>
  );
}

/* ---------- Data Assessment Intern: dashboard wireframe (no numbers, no student data) ---------- */
export function DashboardMain({ build }: { build: V }) {
  const tiles = useRange(build, 0.05, 0.45);
  const tilesY = useTransform(tiles, [0, 1], [18, 0]);
  const bars = useRange(build, 0.2, 0.85);
  const ring = useRange(build, 0.35, 0.95);
  const ringA = useTransform(ring, (v) => v * 0.62);
  const ringB = useTransform(ring, (v) => v * 0.22);
  const heights = [46, 72, 58, 88, 64, 78, 52, 92, 68, 80, 60, 74];
  return (
    <Win title={projectTitle("tusd-data-assessment")}>
      <div className="absolute inset-0 flex flex-col gap-4 p-4">
        <motion.div className="grid grid-cols-3 gap-3 shrink-0" style={{ opacity: tiles, y: tilesY }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-md p-3 flex flex-col gap-2.5" style={{ background: "rgba(244,239,230,0.06)", border: `1px solid ${LINE}` }}>
              <span className="block h-1.5 w-1/2 rounded-full" style={{ background: CREAM, opacity: 0.3 }} />
              <span className="block h-3 w-2/3 rounded-full" style={{ background: i === 1 ? ROSE : CREAM, opacity: i === 1 ? 0.85 : 0.55 }} />
            </div>
          ))}
        </motion.div>
        <div className="flex-1 min-h-0 flex gap-5">
          <div className="flex-1 min-w-0 flex items-end gap-2 pb-1" style={{ borderBottom: `1px solid ${LINE}` }}>
            {heights.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t-[3px]"
                style={{ height: `${h}%`, background: i % 4 === 3 ? ROSE : CREAM, opacity: i % 4 === 3 ? 0.9 : 0.4, scaleY: bars, transformOrigin: "50% 100%" }}
              />
            ))}
          </div>
          <div className="hidden md:flex w-[28%] items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full max-h-full">
              <circle cx="50" cy="50" r="34" fill="none" stroke={LINE} strokeWidth="10" />
              <motion.circle cx="50" cy="50" r="34" fill="none" stroke={ROSE} strokeWidth="10" strokeLinecap="butt" transform="rotate(-90 50 50)" style={{ pathLength: ringA }} />
              <motion.circle cx="50" cy="50" r="34" fill="none" stroke={CREAM} strokeOpacity="0.5" strokeWidth="10" strokeLinecap="butt" transform="rotate(130 50 50)" style={{ pathLength: ringB }} />
            </svg>
          </div>
        </div>
      </div>
    </Win>
  );
}

export function WorkSide() {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden flex flex-col" style={{ background: CREAM, boxShadow: "var(--win-shadow, 0 30px 90px rgba(0,0,0,0.6))" }}>
      <div className="flex items-center justify-between px-3 h-7 shrink-0" style={{ borderBottom: "1px solid rgba(31,27,22,0.14)" }}>
        <span className="block w-8 h-1.5 rounded-full" style={{ background: "#1F1B16", opacity: 0.7 }} />
        <span className="flex gap-1.5">{[0, 1, 2].map((i) => <i key={i} className="block w-6 h-1 rounded-full" style={{ background: "#1F1B16", opacity: 0.25 }} />)}</span>
      </div>
      <div className="m-3 flex-1 rounded-md" style={{ background: "linear-gradient(135deg,#6B2D2D,#3a1818)" }} />
      <div className="px-3 pb-2 flex flex-col gap-1.5">
        <span className="block h-2 w-3/4 rounded-full" style={{ background: "#1F1B16", opacity: 0.75 }} />
        <span className="block h-1.5 w-1/2 rounded-full" style={{ background: "#1F1B16", opacity: 0.3 }} />
      </div>
      <div className="grid grid-cols-3 gap-2 px-3 pb-3">
        {[0, 1, 2].map((i) => <div key={i} className="aspect-[4/3] rounded" style={{ background: "#8A7B6A", opacity: 0.35 + i * 0.12 }} />)}
      </div>
      <div className="px-3 pb-2 text-[10px] tracking-[0.18em] uppercase" style={{ color: "#6B2D2D" }}>{projectTitle("n10-dance-studios")}</div>
    </div>
  );
}

/* ---------- CASE-STUDY ONLY: N10 website wireframe ---------- */
export function SiteMain({ build }: { build: V }) {
  const hero = useRange(build, 0.05, 0.6);
  const cards = useRange(build, 0.3, 0.9);
  const cardsY = useTransform(cards, [0, 1], [24, 0]);
  return (
    <Win title={projectTitle("n10-dance-studios")}>
      <div className="absolute inset-0 flex flex-col">
        <div className="flex items-center justify-between px-5 h-11 shrink-0" style={{ borderBottom: `1px solid ${LINE}` }}>
          <span className="block w-16 h-2.5 rounded-full" style={{ background: CREAM, opacity: 0.8 }} />
          <span className="flex gap-4">{[0, 1, 2, 3].map((i) => <i key={i} className="block w-10 h-1.5 rounded-full" style={{ background: CREAM, opacity: 0.28 }} />)}</span>
        </div>
        <motion.div
          className="relative flex-1 min-h-0 m-4 rounded-md overflow-hidden"
          style={{ background: "linear-gradient(120deg,#6B2D2D,#2a1512 70%)", scaleY: hero, opacity: hero, transformOrigin: "50% 0%" }}
        >
          <div className="absolute left-6 bottom-6 flex flex-col gap-2.5 w-1/2">
            <span className="block h-4 w-4/5 rounded-full" style={{ background: CREAM, opacity: 0.85 }} />
            <span className="block h-4 w-3/5 rounded-full" style={{ background: CREAM, opacity: 0.85 }} />
            <span className="block h-2 w-2/3 rounded-full mt-1" style={{ background: CREAM, opacity: 0.35 }} />
            <span className="block h-7 w-28 mt-2" style={{ background: ROSE }} />
          </div>
        </motion.div>
        <motion.div className="grid grid-cols-3 gap-3 px-4 pb-4 h-[28%] shrink-0" style={{ opacity: cards, y: cardsY }}>
          {[0, 1, 2].map((i) => <div key={i} className="rounded-md" style={{ background: i === 1 ? ROSE : CREAM, opacity: i === 1 ? 0.55 : 0.14 }} />)}
        </motion.div>
      </div>
    </Win>
  );
}

/* ---------- CONTENT ---------- */
export function ContentMain({ build }: { build: V }) {
  const head = useRange(build, 0.1, 0.95);
  const left = useTransform(head, (v) => `${6 + v * 86}%`);
  const clips = [
    [4, 22, ROSE], [28, 18, CREAM], [50, 30, ROSE], [84, 12, CREAM],
    [8, 30, CREAM], [42, 20, ROSE], [66, 26, CREAM],
    [2, 14, TAUPE], [20, 36, TAUPE], [62, 24, TAUPE],
  ] as const;
  return (
    <Win title="DaVinci Resolve · timeline">
      <div className="absolute inset-0 flex flex-col p-4 gap-3">
        <div className="relative flex-1 min-h-0 rounded-md overflow-hidden" style={{ background: "linear-gradient(120deg,#3a1818,#161310 60%,#2a2018)" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ border: `1px solid ${CREAM}`, opacity: 0.7 }}>
              <div style={{ width: 0, height: 0, borderLeft: `14px solid ${CREAM}`, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", marginLeft: 4 }} />
            </div>
          </div>
        </div>
        <div className="relative h-[38%] shrink-0 flex flex-col gap-2 justify-center">
          {[0, 1, 2].map((row) => (
            <div key={row} className="relative h-5">
              {clips.filter((_, i) => (i < 4 ? 0 : i < 7 ? 1 : 2) === row).map(([x, w, c], i) => (
                <div key={i} className="absolute top-0 h-full rounded-[3px]" style={{ left: `${x}%`, width: `${w}%`, background: c, opacity: c === TAUPE ? 0.3 : 0.5 }} />
              ))}
            </div>
          ))}
          <motion.div className="absolute -top-2 -bottom-2 w-px" style={{ left, background: ROSE, boxShadow: `0 0 12px ${ROSE}` }}>
            <span className="absolute -top-1 -left-[5px] block w-[11px] h-[11px]" style={{ background: ROSE, clipPath: "polygon(0 0,100% 0,50% 100%)" }} />
          </motion.div>
        </div>
      </div>
    </Win>
  );
}

export function ContentSide() {
  return (
    <div className="w-full h-full rounded-[22px] overflow-hidden relative" style={{ background: "linear-gradient(170deg,#6B2D2D,#1b1612 70%)", border: `1px solid ${LINE}`, boxShadow: "var(--win-shadow, 0 30px 90px rgba(0,0,0,0.6))" }}>
      <div className="absolute right-3 bottom-24 flex flex-col gap-3">
        {[0, 1, 2].map((i) => <i key={i} className="block w-6 h-6 rounded-full" style={{ background: CREAM, opacity: 0.35 }} />)}
      </div>
      <div className="absolute left-3 right-12 bottom-4 flex flex-col gap-1.5">
        <span className="block h-2 w-1/2 rounded-full" style={{ background: CREAM, opacity: 0.8 }} />
        <span className="block h-1.5 w-4/5 rounded-full" style={{ background: CREAM, opacity: 0.4 }} />
        <span className="block h-1.5 w-2/3 rounded-full" style={{ background: CREAM, opacity: 0.4 }} />
      </div>
      <div className="absolute top-3 left-3 text-[9px] tracking-[0.2em] uppercase" style={{ color: CREAM, opacity: 0.6 }}>9:16</div>
    </div>
  );
}

/* ---------- ABOUT ---------- */
export function AboutMain({ build }: { build: V }) {
  const reveal = useRange(build, 0.05, 0.85);
  const clip = useTransform(reveal, (v) => `inset(${(1 - v) * 100}% 0% 0% 0%)`);
  return (
    <motion.div
      className="w-full h-full flex items-end justify-center"
      style={{ clipPath: clip, WebkitClipPath: clip }}
    >
      <div
        className="relative h-full aspect-[3/4] overflow-hidden"
        style={{
          borderRadius: "999px 999px 14px 14px",
          background: "linear-gradient(180deg,#3a2a20 0%,#6B2D2D 55%,#2a1a14 100%)",
          border: `1px solid ${LINE}`,
          boxShadow: "var(--win-shadow, 0 40px 120px rgba(0,0,0,0.65))",
        }}
      >
        <img
          src={ABOUT_PROFILE.photo}
          alt={`Portrait of ${ABOUT_PROFILE.name}`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "50% 30%" }}
        />
        <div className="absolute inset-3 pointer-events-none" style={{ borderRadius: "999px 999px 8px 8px", border: `1px solid ${CREAM}`, opacity: 0.35 }} />
      </div>
    </motion.div>
  );
}

export function AboutSide() {
  return (
    <div className="w-full rounded-xl p-5 flex flex-col items-center text-center" style={{ background: CREAM, boxShadow: "var(--win-shadow, 0 30px 90px rgba(0,0,0,0.6))" }}>
      <span className="self-start text-[10px] tracking-[0.22em] uppercase" style={{ color: "#8A7B6A" }}>Education</span>
      <img
        src="/ucsd-seal.png"
        alt={`${ABOUT_PROFILE.institution} seal`}
        width={96}
        height={96}
        loading="lazy"
        decoding="async"
        className="mt-4 w-24 h-24 select-none"
      />
      <span className="mt-4 font-editorial-serif text-[1.1rem] leading-tight" style={{ color: "#1F1B16" }}>{EDUCATION[0].title}</span>
      <span className="mt-1.5 text-[10px] tracking-[0.18em] uppercase" style={{ color: "#8A7B6A" }}>{EDUCATION[0].dates}</span>
    </div>
  );
}

/* ---------- CONTACT ---------- */
export function ContactMain({ build }: { build: V }) {
  const body = useRange(build, 0.25, 0.95);
  return (
    <Win title="New message">
      <div className="absolute inset-0 p-5 flex flex-col gap-3">
        <div className="flex items-center gap-3 pb-3" style={{ borderBottom: `1px solid ${LINE}` }}>
          <span className="text-[11px] tracking-[0.2em] uppercase" style={{ color: TAUPE }}>To</span>
          <span className="text-[15px]" style={{ color: CREAM }}>{CONTACT_EMAIL}</span>
        </div>
        <div className="flex items-center gap-3 pb-3" style={{ borderBottom: `1px solid ${LINE}` }}>
          <span className="text-[11px] tracking-[0.2em] uppercase" style={{ color: TAUPE }}>Subject</span>
          <span className="block h-2 w-1/3 rounded-full" style={{ background: CREAM, opacity: 0.3 }} />
        </div>
        <motion.div className="flex flex-col gap-2.5 pt-1" style={{ scaleX: body, transformOrigin: "0% 50%", opacity: body }}>
          {[92, 84, 90, 60, 0, 78, 46].map((w, i) => (
            <div key={i} className="h-2 rounded-full" style={{ width: w ? `${w}%` : 0, height: w ? undefined : 10, background: CREAM, opacity: 0.22 }} />
          ))}
        </motion.div>
        <div className="mt-auto flex items-center gap-3">
          <div className="px-5 py-2 text-[11px] tracking-[0.2em] uppercase" style={{ background: ROSE, color: "#1b1612" }}>Send</div>
          <span className="block w-4 h-4 rounded-full" style={{ border: `1px solid ${LINE}` }} />
        </div>
      </div>
    </Win>
  );
}

/* ---------- shell ---------- */
type Layout = {
  Main: React.ComponentType<{ build: V }>;
  Side?: React.ComponentType;
  chips: string[];
  mainClass: string;
};

const LAYOUTS: Record<string, Layout> = {
  work: {
    Main: WorkMain,
    Side: WorkSide,
    // software only (skills like "Data Analysis" stay on the project card, not in the margin chips)
    chips: Array.from(new Set(WORK_PROJECTS.flatMap((p) => p.tools))).filter(
      (t) => !["Data Analysis", "Data Visualization", "Research Design", "Evaluation Metrics"].includes(t)
    ),
    mainClass: "h-[42vh] md:h-[48vh] md:w-[min(62vw,1100px)]",
  },
  content: {
    Main: ContentMain,
    Side: ContentSide,
    // editing tools plus every platform the content goes out on
    chips: [
      ...CONTENT_PROJECT.tools,
      "YouTube",
      "TikTok",
      "Instagram",
      "Facebook",
      "Snapchat",
      "YouTube Studio",
      "TikTok Studio",
      "Edits",
    ],
    mainClass: "h-[42vh] md:h-[48vh] md:w-[min(62vw,1100px)]",
  },
  about: {
    Main: AboutMain,
    Side: AboutSide,
    chips: [
      "Data Science",
      "UC San Diego",
      "Class of 2030",
      "Content Creator",
      "Storytelling",
      "Python",
      "Pandas",
      "scikit-learn",
      "FastAPI",
      "React",
      "Git",
      "GitHub",
      "HTML/CSS",
      "WordPress",
      "Power BI",
      "Excel",
      "Figma",
      "Data Visualization",
      "Dashboards",
      "Analytics",
      "SEO",
      "Web Development",
      "A/B Testing",
      "DaVinci Resolve",
      "Video Editing",
      "Color Grading",
      "Filmmaking",
      "Short-Form Video",
      "Day-in-the-Life Vlogs",
      "Personal Brand",
      "Canva",
      "Rock Climbing",
      "Bouldering",
      "Tennis",
      "Basketball",
      "Hiking",
      "Travel",
      "Japan",
      "Mandarin Chinese",
      "Mentoring",
      "Coaching",
      "Teaching",
      "Volunteering",
      "JV Tennis Captain",
      "Curious",
      "Builder",
      "Self-Starter",
      "Growth Mindset",
      "Entrepreneurship",
      "Consulting",
    ],
    mainClass: "h-[44vh] md:h-[56vh] md:w-[min(46vw,640px)]",
  },
  contact: {
    Main: ContactMain,
    chips: SOCIAL_LINKS.map((s) => s.platform),
    mainClass: "h-[40vh] md:h-[44vh] md:w-[min(52vw,860px)]",
  },
};

const CHIP_EXIT_VH = 48; // the orbit leaves at the same speed as the heading

/** Orbit geometry, shared by the dashed path and the labels so they can never drift apart. */
function orbitGeom(W: number, H: number) {
  // centre on the heading block, which sits right of the nav rail and above the middle
  const cx = W >= 768 ? (Math.min(224, W * 0.15) + W - 56) / 2 : W / 2;
  return { cx, cy: H * 0.38, rx: Math.min(W * 0.37, 620), ry: Math.min(H * 0.2, 190) };
}

/**
 * Tools orbiting the section heading like planets on a tilted ellipse. Each label's dot sits
 * exactly on the dashed path. The far side is smaller and dimmer, the near side bright, and a
 * label fades out while it would cross the heading or the tagline, so text never overlaps.
 * Positions are written straight to the DOM each frame, and the loop pauses when off screen.
 */
function Orbit({
  labels,
  build,
  exit,
  reduced,
  size = 1,
  dir = 1,
  tiltDeg = -9,
  lap = 70,
}: {
  labels: string[];
  build: V;
  exit: V;
  reduced: boolean;
  /** Ring size relative to the default orbit. */
  size?: number;
  /** 1 = clockwise, -1 = counter-clockwise. */
  dir?: number;
  tiltDeg?: number;
  /** Seconds per lap. */
  lap?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGEllipseElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prog = useRange(build, 0.3, 0.65);
  const y = useTransform(() => `${-exit.get() * CHIP_EXIT_VH}vh`);
  const TILT = (tiltDeg * Math.PI) / 180;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const scene = wrap.closest("[data-nav-theme]");
    const heading = scene?.querySelector("h2") ?? null;
    const tagline = scene?.querySelector("p") ?? null;
    let raf = 0;
    let visible = true;
    let sizes: { w: number; h: number }[] = [];
    const fade = labels.map(() => 1);
    const measure = () => {
      sizes = itemRefs.current.map((el) => ({ w: el?.offsetWidth ?? 0, h: el?.offsetHeight ?? 0 }));
    };
    const DOT = 3; // half the dot's width: the dot's centre is the point on the path
    const PAD = 2;
    // ranges over the actual text, so collisions use the letters' line boxes, not the element boxes
    const ranges = ([heading, tagline].filter(Boolean) as Element[]).map((el) => {
      const r = document.createRange();
      r.selectNodeContents(el);
      return r;
    });

    const place = (t: number, ease: number) => {
      // reads first (layout), then writes, so the browser lays out once per frame
      const box = wrap.getBoundingClientRect();
      const W = wrap.clientWidth;
      const H = wrap.clientHeight;
      const avoid = ranges.flatMap((rg) =>
        Array.from(rg.getClientRects())
          .filter((r) => r.width > 2)
          .map((r) => ({ l: r.left - box.left - PAD, r: r.right - box.left + PAD, t: r.top - box.top - PAD, b: r.bottom - box.top + PAD }))
      );
      const g = orbitGeom(W, H);
      const { cx, cy } = g;
      const rx = g.rx * size;
      const ry = g.ry * size;
      const p = pathRef.current;
      if (p) {
        p.setAttribute("cx", cx.toFixed(1));
        p.setAttribute("cy", cy.toFixed(1));
        p.setAttribute("rx", rx.toFixed(1));
        p.setAttribute("ry", ry.toFixed(1));
        p.setAttribute("transform", `rotate(${((TILT * 180) / Math.PI).toFixed(2)} ${cx.toFixed(1)} ${cy.toFixed(1)})`);
      }
      labels.forEach((_, i) => {
        const el = itemRefs.current[i];
        if (!el) return;
        const a = (i / labels.length) * Math.PI * 2 + dir * t * ((Math.PI * 2) / lap);
        const ex = Math.cos(a) * rx;
        const ey = Math.sin(a) * ry;
        const x = cx + ex * Math.cos(TILT) - ey * Math.sin(TILT);
        const yy = cy + ex * Math.sin(TILT) + ey * Math.cos(TILT);
        const depth = (Math.sin(a) + 1) / 2; // 0 = far side (top), 1 = near side (bottom)
        const s = 0.78 + 0.27 * depth;
        const { w, h } = sizes[i] ?? { w: 0, h: 0 };
        // keep the label on screen: near the right edge it slides left of its point on the path
        const L = Math.max(14, Math.min(x - DOT, W - 14 - w * s));
        const R = L + w * s;
        const T = yy - (h * s) / 2;
        const B = yy + (h * s) / 2;
        const hit = avoid.some((z) => L < z.r && R > z.l && T < z.b && B > z.t);
        // behind text: fade into the background, never fully away
        fade[i] += ((hit ? 0.22 : 1) - fade[i]) * ease;
        el.style.transform = `translate3d(${L.toFixed(1)}px, ${yy.toFixed(1)}px, 0) translateY(-50%) scale(${s.toFixed(3)})`;
        el.style.opacity = ((0.28 + 0.72 * depth) * fade[i]).toFixed(3);
        el.style.filter = depth < 0.35 ? `blur(${((0.35 - depth) * 3).toFixed(2)}px)` : "none";
      });
    };
    const loop = (now: number) => {
      place(now / 1000, 0.14);
      raf = visible ? requestAnimationFrame(loop) : 0;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf && !reduced) raf = requestAnimationFrame(loop);
    });
    io.observe(wrap);
    const ro = new ResizeObserver(() => {
      measure();
      place(performance.now() / 1000, 1);
    });
    ro.observe(wrap);
    measure();
    document.fonts?.ready.then(measure);
    if (reduced) place(0, 1);
    else raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [labels, reduced, TILT, size, dir, lap]);

  return (
    <motion.div ref={wrapRef} className="absolute inset-0 hidden lg:block" style={{ opacity: prog, y }}>
      {/* the orbit path itself: a faint tilted ellipse, positioned by the same geometry */}
      <svg className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
        <ellipse ref={pathRef} fill="none" stroke="rgba(244,239,230,0.12)" strokeWidth="1" strokeDasharray="2 6" />
      </svg>
      {labels.map((label, i) => (
        <div
          key={label}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          className="absolute left-0 top-0 flex items-center gap-2 whitespace-nowrap will-change-transform"
          style={{ transformOrigin: "3px 50%" }}
        >
          <span
            className="block w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: i % 3 === 0 ? "#E88080" : CREAM, boxShadow: `0 0 10px ${i % 3 === 0 ? "rgba(232,128,128,0.9)" : "rgba(244,239,230,0.8)"}` }}
          />
          <span className="text-[11px] uppercase tracking-[0.24em]" style={{ color: CREAM, textShadow: "0 1px 12px rgba(0,0,0,0.85)" }}>
            {label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

/**
 * Phones: no room for an orbit around the heading, so the same tools drift past in a slow
 * ticker under the tagline, with faded edges. Same dots and spaced capitals as the orbit.
 */
function ToolTicker({ labels, build, exit, reduced }: { labels: string[]; build: V; exit: V; reduced: boolean }) {
  const prog = useRange(build, 0.3, 0.65);
  const y = useTransform(() => `${-exit.get() * CHIP_EXIT_VH}vh`);
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center gap-7 pr-7">
      {labels.map((label, i) => (
        <span key={label} className="flex items-center gap-2 whitespace-nowrap">
          <span
            className="block w-1.5 h-1.5 rounded-full"
            style={{ background: i % 3 === 0 ? "#E88080" : CREAM, boxShadow: `0 0 8px ${i % 3 === 0 ? "rgba(232,128,128,0.9)" : "rgba(244,239,230,0.7)"}` }}
          />
          <span className="text-[10px] uppercase tracking-[0.24em]" style={{ color: CREAM, textShadow: "0 1px 10px rgba(0,0,0,0.85)" }}>
            {label}
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <motion.div
      className="absolute left-0 right-0 bottom-[19svh] lg:hidden overflow-hidden"
      style={{
        opacity: prog,
        y,
        WebkitMaskImage: "linear-gradient(to right, transparent, #000 14%, #000 86%, transparent)",
        maskImage: "linear-gradient(to right, transparent, #000 14%, #000 86%, transparent)",
      }}
    >
      <div className={`flex w-max ${reduced ? "" : "tool-ticker"}`}>
        {row("a")}
        {row("b")}
      </div>
    </motion.div>
  );
}

export default function SceneShowcase({
  kind,
  build,
  exit,
  reduced,
}: {
  kind: string;
  build: V;
  exit: V;
  reduced: boolean;
}) {
  const layout = LAYOUTS[kind];
  if (!layout) return null;
  const { chips } = layout;

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none select-none" style={{ zIndex: 22 }}>
      {/* tools around the heading: an orbit on desktop, a ticker on phones */}
      {chips.length > 12 ? (
        // lots of labels: concentric, counter-rotating rings (same tilt, so the paths never cross)
        (() => {
          const rings = chips.length > 24 ? 4 : 2;
          const sizes = rings === 4 ? [0.5, 0.72, 0.94, 1.16] : [0.64, 1];
          return sizes.map((sz, r) => (
            <Orbit
              key={r}
              labels={chips.filter((_, i) => i % rings === r)}
              build={reduced ? ONE : build}
              exit={reduced ? ZERO : exit}
              reduced={reduced}
              size={sz}
              dir={r % 2 ? -1 : 1}
              lap={70 + r * 22}
            />
          ));
        })()
      ) : (
        <Orbit labels={chips.slice(0, 12)} build={reduced ? ONE : build} exit={reduced ? ZERO : exit} reduced={reduced} />
      )}
      <ToolTicker labels={chips.slice(0, 24)} build={reduced ? ONE : build} exit={reduced ? ZERO : exit} reduced={reduced} />
    </div>
  );
}

// constant motion values for reduced-motion rendering
const ONE = motionValue(1);
const ZERO = motionValue(0);
