import { motion, useTransform, motionValue, MotionValue } from "motion/react";
import {
  WORK_PROJECTS,
  CONTENT_PROJECT,
  SOCIAL_LINKS,
  CONTACT_EMAIL,
  ABOUT_PROFILE,
} from "../data/portfolio";

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

function useRange(v: V, a: number, b: number) {
  return useTransform(v, [a, b], [0, 1], { clamp: true });
}

function Win({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="w-full h-full rounded-xl overflow-hidden flex flex-col"
      style={{
        background: PANEL,
        border: `1px solid ${LINE}`,
        boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
      }}
    >
      <div
        className="flex items-center gap-2 px-4 h-9 shrink-0"
        style={{ borderBottom: `1px solid ${LINE}` }}
      >
        {[ROSE, "#C9A46B", "#7FA38A"].map((c) => (
          <i key={c} className="block w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.8 }} />
        ))}
        <span className="ml-3 text-[11px] tracking-[0.2em] uppercase" style={{ color: TAUPE }}>
          {title}
        </span>
      </div>
      <div className="relative flex-1 min-h-0">{children}</div>
    </div>
  );
}

/* ---------- WORK ---------- */
function WorkMain({ build }: { build: V }) {
  const l1 = useRange(build, 0.05, 0.7);
  const l2 = useRange(build, 0.2, 0.9);
  const heat = useRange(build, 0.25, 0.75);
  const code = useRange(build, 0.3, 0.95);
  const cells = Array.from({ length: 48 }, (_, i) => 0.12 + ((i * 37) % 11) / 14);
  return (
    <Win title={WORK_PROJECTS[0].title}>
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

function WorkSide() {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden flex flex-col" style={{ background: CREAM, boxShadow: "0 30px 90px rgba(0,0,0,0.6)" }}>
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
      <div className="px-3 pb-2 text-[10px] tracking-[0.18em] uppercase" style={{ color: "#6B2D2D" }}>{WORK_PROJECTS[1].title}</div>
    </div>
  );
}

/* ---------- CONTENT ---------- */
function ContentMain({ build }: { build: V }) {
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

function ContentSide() {
  return (
    <div className="w-full h-full rounded-[22px] overflow-hidden relative" style={{ background: "linear-gradient(170deg,#6B2D2D,#1b1612 70%)", border: `1px solid ${LINE}`, boxShadow: "0 30px 90px rgba(0,0,0,0.6)" }}>
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
function AboutMain({ build }: { build: V }) {
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
          boxShadow: "0 40px 120px rgba(0,0,0,0.65)",
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

function AboutSide() {
  return (
    <div className="w-full h-full rounded-xl p-4 flex flex-col justify-between" style={{ background: CREAM, boxShadow: "0 30px 90px rgba(0,0,0,0.6)" }}>
      <span className="font-editorial-serif italic text-[1.15rem] leading-tight" style={{ color: "#6B2D2D" }}>{ABOUT_PROFILE.institution}</span>
      <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "#1F1B16", opacity: 0.7 }}>Data Science · Content</span>
    </div>
  );
}

/* ---------- CONTACT ---------- */
function ContactMain({ build }: { build: V }) {
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
    chips: Array.from(new Set(WORK_PROJECTS.flatMap((p) => p.tools))),
    mainClass: "h-[42vh] md:h-[52vh] md:w-[min(60vw,1060px)]",
  },
  content: {
    Main: ContentMain,
    Side: ContentSide,
    chips: CONTENT_PROJECT.tools,
    mainClass: "h-[42vh] md:h-[52vh] md:w-[min(60vw,1060px)]",
  },
  about: {
    Main: AboutMain,
    Side: AboutSide,
    chips: ["Data Science", "Content Creator", "UC San Diego"],
    mainClass: "h-[44vh] md:h-[58vh] md:w-[min(46vw,640px)]",
  },
  contact: {
    Main: ContactMain,
    chips: SOCIAL_LINKS.map((s) => s.platform),
    mainClass: "h-[40vh] md:h-[46vh] md:w-[min(52vw,860px)]",
  },
};

// left %, top %, exit speed (vh), delay (s)
const CHIP_SLOTS: Array<[number, number, number, number]> = [
  [66, 5, 46, 0], [80, 9, 62, 1.2], [42, 6, 38, 2.1], [88, 22, 52, 0.6],
  [91, 36, 70, 1.7], [74, 15, 34, 2.6], [90, 48, 58, 0.3], [30, 12, 44, 1.1],
];

function Chip({ label, slot, build, exit }: { label: string; slot: (typeof CHIP_SLOTS)[number]; build: V; exit: V }) {
  const [l, t, speed, delay] = slot;
  const y = useTransform(() => `${(1 - build.get()) * 10 - exit.get() * speed}vh`);
  const opacity = useRange(build, 0.35, 0.8);
  return (
    <motion.div className="absolute hidden md:block" style={{ left: `${l}%`, top: `${t}%`, y, opacity }}>
      <div className="animate-ambient-float" style={{ animationDelay: `${delay}s` }}>
        <span
          className="block px-3 py-1.5 text-[12px] tracking-[0.12em] whitespace-nowrap"
          style={{ color: CREAM, border: `1px solid rgba(244,239,230,0.3)`, background: "rgba(22,19,16,0.55)", backdropFilter: "blur(6px)" }}
        >
          {label}
        </span>
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
      <div className="absolute left-0 right-0 md:left-[190px] md:pr-[9vw] bottom-[-8vh] flex justify-center px-4 md:px-0" style={{ perspective: 1600 }}>
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
      {chips.slice(0, CHIP_SLOTS.length).map((c, i) => (
        <Chip key={c} label={c} slot={CHIP_SLOTS[i]} build={reduced ? ONE : build} exit={reduced ? ZERO : exit} />
      ))}
    </div>
  );
}

// constant motion values for reduced-motion rendering
const ONE = motionValue(1);
const ZERO = motionValue(0);
