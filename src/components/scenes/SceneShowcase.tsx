import { motion, useTransform, motionValue, MotionValue } from "motion/react";
import {
  WORK_PROJECTS,
  CONTENT_PROJECT,
  SOCIAL_LINKS,
  CONTACT_EMAIL,
  ABOUT_PROFILE,
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

/* ---------- RL research proposal: paper + learning-curve wireframe (no numbers) ---------- */
export function ResearchMain({ build }: { build: V }) {
  const doc = useRange(build, 0.05, 0.5);
  const docY = useTransform(doc, [0, 1], [16, 0]);
  const c1 = useRange(build, 0.2, 0.85);
  const c2 = useRange(build, 0.3, 0.92);
  const c3 = useRange(build, 0.4, 1);
  return (
    <Win title={projectTitle("rl-research-proposal")}>
      <div className="absolute inset-0 flex gap-5 p-4">
        <motion.div className="hidden md:flex w-[38%] flex-col gap-2.5 pt-1" style={{ opacity: doc, y: docY }}>
          <span className="block h-3 w-4/5 rounded-full" style={{ background: CREAM, opacity: 0.75 }} />
          <span className="block h-1.5 w-1/3 rounded-full mb-2" style={{ background: ROSE, opacity: 0.8 }} />
          {[92, 86, 90, 70, 0, 40, 88, 82, 64, 0, 36, 90, 76].map((w, i) =>
            w ? (
              <span key={i} className="block h-1.5 rounded-full" style={{ width: `${w}%`, background: CREAM, opacity: w < 50 ? 0.45 : 0.18 }} />
            ) : (
              <span key={i} className="block h-2" />
            )
          )}
        </motion.div>
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <svg viewBox="0 0 400 220" preserveAspectRatio="none" className="w-full flex-1 min-h-0">
            {[44, 88, 132, 176].map((y) => (
              <line key={y} x1="0" x2="400" y1={y} y2={y} stroke={LINE} strokeWidth="1" />
            ))}
            <motion.path d="M0 200 C60 196 90 170 140 140 S230 70 290 56 S370 40 400 38" fill="none" stroke={ROSE} strokeWidth="2.5" strokeLinecap="round" style={{ pathLength: c1 }} />
            <motion.path d="M0 204 C70 200 110 186 160 168 S250 120 310 104 S380 92 400 90" fill="none" stroke={CREAM} strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" style={{ pathLength: c2 }} />
            <motion.path d="M0 206 C80 204 130 198 190 188 S290 160 340 152 S390 146 400 145" fill="none" stroke={TAUPE} strokeWidth="2" strokeLinecap="round" strokeDasharray="5 5" style={{ pathLength: c3 }} />
          </svg>
          <div className="flex gap-4 shrink-0">
            {[ROSE, CREAM, TAUPE].map((c, i) => (
              <span key={i} className="flex items-center gap-2">
                <i className="block w-4 h-[3px] rounded-full" style={{ background: c, opacity: i === 1 ? 0.55 : 1 }} />
                <span className="block h-1.5 w-12 rounded-full" style={{ background: CREAM, opacity: 0.2 }} />
              </span>
            ))}
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
        className="relative h-full aspect-[3/4] flex items-end justify-center"
        style={{
          borderRadius: "999px 999px 14px 14px",
          background: "linear-gradient(180deg,#3a2a20 0%,#6B2D2D 55%,#2a1a14 100%)",
          border: `1px solid ${LINE}`,
          boxShadow: "var(--win-shadow, 0 40px 120px rgba(0,0,0,0.65))",
        }}
      >
        <div className="absolute inset-3 pointer-events-none" style={{ borderRadius: "999px 999px 8px 8px", border: `1px solid ${CREAM}`, opacity: 0.18 }} />
        <div className="pb-6 text-center text-[11px] tracking-[0.22em] uppercase" style={{ color: CREAM, opacity: 0.8 }}>
          {ABOUT_PROFILE.photoPlaceholder.label}
          <div className="mt-1 text-[10px] tracking-[0.18em]" style={{ opacity: 0.6 }}>{ABOUT_PROFILE.photoPlaceholder.dimensions}</div>
        </div>
      </div>
    </motion.div>
  );
}

export function AboutSide() {
  return (
    <div className="w-full h-full rounded-xl p-4 flex flex-col justify-between" style={{ background: CREAM, boxShadow: "var(--win-shadow, 0 30px 90px rgba(0,0,0,0.6))" }}>
      <span className="font-editorial-serif italic text-[1.15rem] leading-tight" style={{ color: "#6B2D2D" }}>{ABOUT_PROFILE.institution}</span>
      <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "#1F1B16", opacity: 0.7 }}>Data Science · Content</span>
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
    chips: CONTENT_PROJECT.tools,
    mainClass: "h-[42vh] md:h-[48vh] md:w-[min(62vw,1100px)]",
  },
  about: {
    Main: AboutMain,
    Side: AboutSide,
    chips: ["Data Science", "Content Creator", "UC San Diego"],
    mainClass: "h-[44vh] md:h-[56vh] md:w-[min(46vw,640px)]",
  },
  contact: {
    Main: ContactMain,
    chips: SOCIAL_LINKS.map((s) => s.platform),
    mainClass: "h-[40vh] md:h-[44vh] md:w-[min(52vw,860px)]",
  },
};

/**
 * Tool labels sit in two tidy columns in the margins either side of the title (never over it),
 * evenly spaced, with a small zigzag so it feels designed rather than stacked. Left and right
 * alternate, and they enter one after another with identical motion.
 */
const COL_TOP = 18; // % of scene height
const COL_BOTTOM = 54;
const LEFT_X: [number, number] = [19, 22.5]; // zigzag, % of scene width (centres)
const RIGHT_X: [number, number] = [90, 93.5];
const CHIP_EXIT_VH = 48; // every label leaves at the same speed, so spacing stays even

function rowY(row: number, rows: number) {
  return rows <= 1 ? (COL_TOP + COL_BOTTOM) / 2 : COL_TOP + (row * (COL_BOTTOM - COL_TOP)) / (rows - 1);
}

function chipSlot(i: number, n: number): [number, number] {
  const left = i % 2 === 0;
  const row = Math.floor(i / 2);
  const rows = left ? Math.ceil(n / 2) : Math.floor(n / 2);
  const xs = left ? LEFT_X : RIGHT_X;
  return [xs[row % 2], rowY(row, rows)];
}

function Chip({ label, index, total, build, exit }: { label: string; index: number; total: number; build: V; exit: V }) {
  const [l, t] = chipSlot(index, total);
  const start = 0.3 + index * 0.035;
  const prog = useRange(build, start, start + 0.3);
  const y = useTransform(() => `${(1 - prog.get()) * 5 - exit.get() * CHIP_EXIT_VH}vh`);
  return (
    <motion.div className="absolute hidden xl:block" style={{ left: `${l}%`, top: `${t}%`, x: "-50%", y, opacity: prog }}>
      <span
        className="block px-3 py-1.5 text-[12px] tracking-[0.12em] whitespace-nowrap"
        style={{ color: CREAM, border: `1px solid rgba(244,239,230,0.3)`, background: "rgba(22,19,16,0.55)", backdropFilter: "blur(6px)" }}
      >
        {label}
      </span>
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
  const mainY = useTransform(() => `${(1 - build.get()) * 16 - exit.get() * 14}vh`);
  const mainRot = useTransform(() => 16 - 12 * build.get() + 8 * exit.get());
  const mainScale = useTransform(() => 0.92 + 0.08 * build.get());
  const sideY = useTransform(() => `${(1 - build.get()) * 28 - exit.get() * 30}vh`);
  const sideOpacity = useRange(build, 0.2, 0.7);

  if (!layout) return null;
  const { Main, Side, chips, mainClass } = layout;
  const still = reduced ? { y: 0, rotateX: 0, scale: 1 } : undefined;

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none select-none" style={{ zIndex: 22 }}>
      {/* hero window */}
      <div className="absolute left-0 right-0 md:left-[190px] md:pr-[9vw] bottom-[-10vh] flex justify-center px-4 md:px-0" style={{ perspective: 1600 }}>
        <motion.div
          className={`w-full ${mainClass}`}
          style={still ?? { y: mainY, rotateX: mainRot, scale: mainScale, transformOrigin: "50% 100%" }}
        >
          <Main build={reduced ? ONE : build} />
        </motion.div>
      </div>

      {/* companion card */}
      {Side && (
        <motion.div
          className="absolute hidden md:block right-[3vw] bottom-[7vh] w-[15vw] min-w-[200px] max-w-[300px] h-[34vh]"
          style={reduced ? { rotate: 3 } : { y: sideY, rotate: 3, opacity: sideOpacity }}
        >
          <Side />
        </motion.div>
      )}

      {/* floating labels, each at its own depth */}
      {chips.slice(0, 9).map((c, i, all) => (
        <Chip key={c} label={c} index={i} total={all.length} build={reduced ? ONE : build} exit={reduced ? ZERO : exit} />
      ))}
    </div>
  );
}

// constant motion values for reduced-motion rendering
const ONE = motionValue(1);
const ZERO = motionValue(0);
