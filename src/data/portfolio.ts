/**
 * Authoritative data for Dylan Wang's portfolio.
 * Edit text, tools, email, and placeholders here directly.
 */

export const CONTACT_EMAIL = "dylanzhwang@gmail.com";

export interface NavigationItem {
  numeral: string;
  label: string;
  id: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { numeral: "I", label: "Work", id: "work" },
  { numeral: "II", label: "Content", id: "content" },
  { numeral: "III", label: "About", id: "about" },
  { numeral: "IV", label: "Contact", id: "contact" },
];

export interface SceneLayer {
  imagePath?: string;
  parallaxSpeed: number; // e.g. 0.15 (slow), 0.45 (mid), 0.85 (foreground)
  opacity: number; // 0 to 1
  scale: number; // e.g. 1.0, 1.02, 1.05
  blendMode?: string; // "normal", "multiply", "overlay", "soft-light", etc.
  gradientFallback: string; // warm gradient fallback class
  motifId?: string; // "radial-glow", "vignette-grain", or a line-art drawing in components/ArchitecturalMotif.tsx
  label?: string;
}

export interface SceneData {
  id: string;
  numeral?: string;
  kicker?: string;
  heading: string;
  tagline: string;
  subtitle?: string;
  /** Real screenshots for the blurred, drifting background collage. */
  montage?: string[];
  /** Columns in the montage (more columns = narrower tiles, good for 9:16 clips). */
  montageColumns?: number;
  /** Full-bleed background photo (blurred and darkened behind the text). */
  backgroundImage?: string;
  /** Blur on the background photo, in px (lower keeps objects recognisable). */
  backgroundBlur?: number;
  theme: "dark" | "light"; // "dark" = dark scene (light-on-dark nav), "light" = light scene
  layers: SceneLayer[];
}

/** Real work screenshots, reused for the blurred scene backgrounds. */
const WORK_SHOTS = ["/tusd-overview.png", "/n10-homepage.jpg", "/parksmart-app.jpg", "/n10-search-console.png", "/tusd-student-detail.png"];

export const HERO_SCENE: SceneData = {
  id: "hero",
  heading: "Dylan Wang",
  tagline: "Data science student at UC San Diego and content creator.",
  backgroundImage: "/work-flatlay.jpg",
  backgroundBlur: 3,
  theme: "dark",
  layers: [
    {
      imagePath: "",
      parallaxSpeed: 0.15,
      opacity: 1,
      scale: 1.0,
      motifId: "radial-glow",
      blendMode: "normal",
      gradientFallback:
        "bg-gradient-to-b from-[#161310] via-[#1E1915] to-[#161310]",
      label: "Layer 1 (Background): Soft warm radial glow & dark ink parchment",
    },
    {
      imagePath: "",
      parallaxSpeed: 0.45,
      opacity: 0.85,
      scale: 1.02,
      motifId: "hero-arch",
      blendMode: "normal",
      gradientFallback:
        "bg-gradient-to-tr from-transparent via-[#6B2D2D]/25 to-[#8A7B6A]/20",
      label: "Layer 2 (Midground): Classical Triumphal Arch & Corinthian columns in line art",
    },
    {
      imagePath: "",
      parallaxSpeed: 0.85,
      opacity: 0.7,
      scale: 1.05,
      motifId: "vignette-grain",
      blendMode: "normal",
      gradientFallback:
        "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/12 via-transparent to-black/35",
      label: "Layer 3 (Foreground): Subtle film grain & gentle vignette overlay",
    },
  ],
};

export const SECTION_SCENES: Record<"work" | "content" | "about" | "contact", SceneData> = {
  work: {
    id: "work",
    numeral: "I",
    kicker: "Work",
    heading: "Work",
    tagline:
      "Analytics, data science, web development, and SEO.",
    backgroundImage: "/hero-night-desk.jpg",
    backgroundBlur: 6,
    theme: "dark",
    layers: [
      {
        imagePath: "",
        parallaxSpeed: 0.15,
        opacity: 1,
        scale: 1.0,
        motifId: "radial-glow",
        blendMode: "normal",
        gradientFallback:
          "bg-gradient-to-b from-[#161310] via-[#1C1814] to-[#161310]",
        label: "Layer 1 (Background): Soft warm radial glow field",
      },
      {
        imagePath: "",
        parallaxSpeed: 0.45,
        opacity: 0.85,
        scale: 1.02,
        motifId: "work-colonnade",
        blendMode: "normal",
        gradientFallback:
          "bg-gradient-to-br from-transparent via-[#8A7B6A]/20 to-[#6B2D2D]/15",
        label: "Layer 2 (Midground): Classical Roman 5-bay colonnade in thin line art",
      },
      {
        imagePath: "",
        parallaxSpeed: 0.85,
        opacity: 0.7,
        scale: 1.05,
        motifId: "vignette-grain",
        blendMode: "normal",
        gradientFallback:
          "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/12 via-transparent to-black/25",
        label: "Layer 3 (Foreground): Film grain & vignette framing",
      },
    ],
  },
  content: {
    id: "content",
    numeral: "II",
    kicker: "Content Creation",
    heading: "Content",
    tagline:
      "Short-form content, growth analytics, and audience building.",
    // stand-in 9:16 reel frames; swap for real reel covers or .mp4 clips any time
    montage: Array.from({ length: 8 }, (_, k) => `/reels/reel-${k + 1}.jpg`),
    montageColumns: 6,
    theme: "dark",
    layers: [
      {
        imagePath: "",
        parallaxSpeed: 0.15,
        opacity: 1,
        scale: 1.0,
        motifId: "radial-glow",
        blendMode: "normal",
        gradientFallback:
          "bg-gradient-to-b from-[#151210] via-[#201815] to-[#151210]",
        label: "Layer 1 (Background): Warm dusk radial wash",
      },
      {
        imagePath: "",
        parallaxSpeed: 0.45,
        opacity: 0.85,
        scale: 1.02,
        motifId: "content-vault",
        blendMode: "normal",
        gradientFallback:
          "bg-gradient-to-tl from-[#6B2D2D]/25 via-transparent to-[#8A7B6A]/15",
        label: "Layer 2 (Midground): Twin soaring vaulted proscenium arches in line art",
      },
      {
        imagePath: "",
        parallaxSpeed: 0.85,
        opacity: 0.7,
        scale: 1.05,
        motifId: "vignette-grain",
        blendMode: "normal",
        gradientFallback:
          "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-white/12 via-transparent to-black/30",
        label: "Layer 3 (Foreground): Subtle film grain & aperture vignette",
      },
    ],
  },
  about: {
    id: "about",
    numeral: "III",
    kicker: "About",
    heading: "About",
    tagline:
      "Data science student at UC San Diego, expected class of 2030.",
    montage: ["/dylan-wang-headshot.jpg", "/ucsd-seal.png", "/parksmart-app.jpg", "/tusd-overview.png"],
    theme: "dark",
    layers: [
      {
        imagePath: "",
        parallaxSpeed: 0.15,
        opacity: 1,
        scale: 1.0,
        motifId: "radial-glow",
        blendMode: "normal",
        gradientFallback:
          "bg-gradient-to-b from-[#171411] via-[#1E1915] to-[#171411]",
        label: "Layer 1 (Background): Warm archival glow parchment",
      },
      {
        imagePath: "",
        parallaxSpeed: 0.45,
        opacity: 0.85,
        scale: 1.02,
        motifId: "about-portico",
        blendMode: "normal",
        gradientFallback:
          "bg-gradient-to-r from-transparent via-[#8A7B6A]/20 to-[#6B2D2D]/15",
        label: "Layer 2 (Midground): Classical rotunda dome and peristyle columns in line art",
      },
      {
        imagePath: "",
        parallaxSpeed: 0.85,
        opacity: 0.7,
        scale: 1.05,
        motifId: "vignette-grain",
        blendMode: "normal",
        gradientFallback:
          "bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/30",
        label: "Layer 3 (Foreground): Archival film grain & paper texture vignette",
      },
    ],
  },
  contact: {
    id: "contact",
    numeral: "IV",
    kicker: "Contact",
    heading: "Contact",
    tagline:
      "Direct correspondence for student organizations, recruitment, and partnerships.",
    montage: [...WORK_SHOTS, "/dylan-wang-headshot.jpg"],
    theme: "dark",
    layers: [
      {
        imagePath: "",
        parallaxSpeed: 0.15,
        opacity: 1,
        scale: 1.0,
        motifId: "radial-glow",
        blendMode: "normal",
        gradientFallback:
          "bg-gradient-to-b from-[#161310] via-[#1F1715] to-[#161310]",
        label: "Layer 1 (Background): Deep warm parchment with oxblood warmth",
      },
      {
        imagePath: "",
        parallaxSpeed: 0.45,
        opacity: 0.85,
        scale: 1.02,
        motifId: "contact-rotunda",
        blendMode: "normal",
        gradientFallback:
          "bg-gradient-to-br from-[#6B2D2D]/25 via-transparent to-[#8A7B6A]/20",
        label: "Layer 2 (Midground): Roman temple portico with tall fluted columns & pediment",
      },
      {
        imagePath: "",
        parallaxSpeed: 0.85,
        opacity: 0.7,
        scale: 1.05,
        motifId: "vignette-grain",
        blendMode: "normal",
        gradientFallback:
          "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/12 via-transparent to-black/25",
        label: "Layer 3 (Foreground): Gentle vignette & optical grain frame",
      },
    ],
  },
};

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  /** Optional one-line context under the title (organization, type, place, dates) */
  meta?: string;
  /** Headline results, straight from the resume. Real numbers only. */
  stats?: { value: string; label: string }[];
  /** Optional links to the live project, repo or docs (shown under the title). */
  links?: { label: string; url: string }[];
  /** Render the slot cards as text-only cards (no image tile). */
  slotsTextOnly?: boolean;
  /** Show the stats row after the image slots, centered, instead of under the overview. */
  statsAtBottom?: boolean;
  /** Optional centered line of text under the bottom stats row. */
  statsNote?: string;
  tools: string[];
  /** What each tool was used for, one short line. Turns the tool chips into margin notes. */
  toolNotes?: Record<string, string>;
  slots?: {
    label: string;
    prompt: string;
    /** Real image for the tile (a path under /public). */
    image?: string;
    /** Up to 4 short floating labels beside the image (lg and up). Real work only. */
    popups?: string[];
    /** One short line per popup label; turns the popups into margin notes with wax seals. */
    popupNotes?: Record<string, string>;
    /** Where in the image (0 = top, 1 = bottom) each popup note points. */
    popupTargets?: Record<string, number>;
    /** Cap the image width (px), for tall phone screenshots. */
    tileMaxWidth?: number;
    /** Tile aspect ratio when popups are shown, e.g. "16/10". */
    aspect?: string;
  }[];
  /** Top-performing short-form posts, shown as phone cards in place of a wireframe demo. */
  reels?: { cover: string; url: string; views: string; likes: string; engagement: string; vsMedian: string }[];
  /** Content pillars: what the posts are about, now and before. */
  pillars?: { title: string; when: string; note: string }[];
  /** Short viewer quotes (anonymised). */
  quotes?: string[];
  /** Cropped DM screenshots (message bubble only, no names or photos), as two balanced columns. */
  dmShots?: string[][];
  /** Real screenshot shown inside the browser walkthrough (a path under /public). */
  screenshot?: string;
  /** Aspect ratio of the screenshot (width/height), e.g. "1375/762". */
  screenshotAspect?: string;
  /** Label in the browser bar above the screenshot (defaults to the title). */
  screenshotTitle?: string;
  /** Optional browser walkthrough with pulsing hotspots (x, y in % of the page). */
  hotspots?: { x: number; y: number; label: string; detail: string }[];
  imagePlaceholder: {
    label: string;
    aspectRatio: string;
    recommendedSize: string;
  };
}

export const WORK_PROJECTS: ProjectData[] = [
  {
    id: "tusd-data-assessment",
    title: "Data Assessment Intern",
    category: "Data Analysis",
    year: "Jun to Jul 2025",
    description:
      "Built Power BI dashboards on student assessment and CTE data across 30+ schools, giving district administrators a clearer view of enrollment, performance, and program trends.",
    meta: "Tustin Unified School District · Internship · Jun to Jul 2025",
    stats: [
      { value: "2", label: "Power BI dashboards" },
      { value: "30+", label: "schools covered" },
      { value: "~40%", label: "fewer reporting errors" },
      { value: "6", label: "administrators, 3 departments" },
    ],
    statsAtBottom: true,
    tools: ["Power BI", "Python", "Excel"],
    links: [
      {
        label: "Open live dashboard",
        url: "https://app.powerbi.com/view?r=eyJrIjoiYjNhZjA3Y2QtZGQxOS00ZWQyLTliNDQtN2VjNGMwYWIwMGJiIiwidCI6IjhhMTk4ODczLTRmZWMtNGU3Ni04MTgyLWNhNDc5ZWRiYmQ2MCIsImMiOjZ9",
      },
    ],
    screenshot: "/tusd-overview.png",
    screenshotAspect: "1375/762",
    screenshotTitle: "CTE Dashboard · School Overview",
    hotspots: [
      { x: 23, y: 17, label: "Completer breakdowns", detail: "Splits completers by race/ethnicity, school and course, so gaps between groups show at a glance." },
      { x: 67, y: 50, label: "Headline numbers", detail: "Completers, non-completers and completion rate update instantly with every filter." },
      { x: 67, y: 80, label: "Student group filters", detail: "English Learner, Foster Youth, Free or Reduced Lunch and Homeless filters show how each group is doing." },
      { x: 94, y: 19, label: "Student search", detail: "Type any student ID to jump to that student's full course history on the detail page." },
    ],
    slots: [
      {
        label: "Student detail view",
        prompt: "Search one student ID to see every CTE course, term and grade, and whether they completed their pathway. All student data shown is fake sample data.",
        image: "/tusd-student-detail.png",
        popups: ["Power BI", "Python", "Excel"],
        popupNotes: {
          "Power BI": "dashboards for 30+ schools",
          Python: "cleaning and shaping the data",
          Excel: "source tables and quick checks",
        },
        aspect: "16/11",
      },
    ],
    imagePlaceholder: {
      label: "DASHBOARD: Power BI assessment overview (no student data)",
      aspectRatio: "16/10",
      recommendedSize: "1600 × 1000",
    },
  },
  {
    id: "n10-dance-studios",
    title: "N10 Dance Studios Website",
    category: "Web Development & SEO",
    year: "Jun 2024 to Jul 2025",
    description:
      "Built and ran the studio's website, with ongoing SEO: keyword targeting, site structure improvements, content updates, and mobile optimization.",
    meta: "N10 Dance Studios · Web Developer · Jun 2024 to Jul 2025",
    stats: [
      { value: "5.8K+", label: "organic Google clicks" },
      { value: "90K+", label: "search impressions" },
      { value: "6.4%", label: "click-through rate" },
    ],
    links: [{ label: "Visit live site", url: "https://www.n10dancestudios.com/" }],
    statsAtBottom: true,
    statsNote: "About 1 in 16 people who saw the site in Google search clicked through (Google Search Console, Jul 2025 to Oct 2026).",
    tools: ["WordPress", "HTML", "CSS"],
    screenshot: "/n10-homepage.jpg",
    hotspots: [
      { x: 37, y: 8, label: "Navigation", detail: "Dropdowns for Classes, Competitive Programs and Resources group the site into clear sections." },
      { x: 50, y: 63, label: "Hero message", detail: "A first-time visitor knows in one line that classes and teams are here for them, right before the buttons." },
      { x: 50, y: 74, label: "Paths to enroll", detail: "Register Now sits front and center, so a ready visitor can sign up without hunting for the next step." },
      { x: 2.7, y: 95, label: "Accessibility", detail: "Keeps the site usable for every visitor, so no family drops off before they can enroll." },
    ],
    slots: [
      {
        label: "Outcome",
        prompt: "5.8K+ organic clicks and 90K+ impressions at a 6.4% CTR (Google Search Console, Jul 2025 to Oct 2026).",
        image: "/n10-search-console.png",
        popups: ["Keyword targeting", "Site structure", "Content updates", "Mobile optimization"],
        popupNotes: {
          "Keyword targeting": "pages built around what families search",
          "Site structure": "clear paths to classes and enrollment",
          "Content updates": "class info kept fresh each season",
          "Mobile optimization": "fast and readable on phones",
        },
      },
    ],
    imagePlaceholder: {
      label: "WEBSITE INTERFACE: N10 responsive desktop & mobile screens",
      aspectRatio: "16/10",
      recommendedSize: "1600 × 1000",
    },
  },
  {
    id: "ds3-park-smart",
    title: "ParkSmart",
    category: "Data Science",
    year: "2026",
    description:
      "A UCSD parking planner that recommends a first-choice lot and a backup for your permit, arrival time and destination, built on eight years of cleaned campus parking surveys.",
    meta: "DS3 · Data Science Student Society at UCSD · Team project · 2026",
    links: [
      { label: "Visit live site", url: "https://parksmart-parking.ai.studio" },
      { label: "View on GitHub", url: "https://github.com/yraclimaco/parksmart" },
      { label: "Domain research", url: "https://docs.google.com/document/d/1lpHyE9cTH0iqYw4kmnmXNTDh7sUk0BO9z0p9bkKmwno/edit?tab=t.0" },
      { label: "Project plan", url: "https://docs.google.com/document/d/1dDSm6jZc5wwOC4xdRUlwhj_73jfV3E_pX_eT0p6c6JA/edit?tab=t.0" },
    ],
    screenshot: "/parksmart-app.jpg",
    screenshotAspect: "1910/970",
    screenshotTitle: "ParkSmart · UCSD parking planner",
    hotspots: [
      { x: 12, y: 40, label: "Trip inputs", detail: "Pick a destination, arrival time and permit. Lots your permit can't use are filtered out before anything is ranked." },
      { x: 12, y: 74, label: "First choice", detail: "Expected availability, walking time and a plain reason it beat the backup, so the pick is easy to trust." },
      { x: 61.7, y: 41, label: "Campus map", detail: "First choice and backup are pinned beside your destination on a satellite map of campus." },
    ],
    stats: [
      { value: "76K+", label: "parking survey readings" },
      { value: "86", label: "campus parking facilities" },
      { value: "8 yrs", label: "of data, 2018 to 2026" },
      { value: "86%", label: "readings matched to a verified capacity" },
    ],
    statsAtBottom: true,
    tools: ["Python", "Pandas", "scikit-learn", "FastAPI", "React", "Git", "GitHub"],
    slotsTextOnly: true,
    slots: [
      {
        label: "The problem",
        prompt: "Parking at UCSD is guesswork. ParkSmart turns past parking surveys into a clear first choice and a backup, so you know where to go before you leave.",
      },
      {
        label: "Data pipeline",
        prompt: "Cleaned UCSD's public QPASS parking surveys, standardized lot labels and matched each reading to a capacity, flagging uncertain cases instead of guessing.",
      },
      {
        label: "Model and app",
        prompt: "Benchmarked historical averages against linear regression on a time-based holdout, then served recommendations through a FastAPI backend and a React map.",
      },
    ],
    imagePlaceholder: {
      label: "DATA VISUALIZATION: parking analysis notebook & workflow",
      aspectRatio: "16/10",
      recommendedSize: "1600 × 1000",
    },
  },
];

export const CONTENT_PROJECT: ProjectData = {
  id: "personal-brand",
  title: "Personal Brand & Content Creation",
  category: "Content Creation",
  year: "Jan 2025 to present",
  description:
    "Short-form content on Instagram: ideation, editing, testing formats, and trend-based experiments, then using performance data to double down on what reaches people.",
  meta: "Instagram · Growth analytics · Jan 2025 to present",
  stats: [
    { value: "3M+", label: "organic views" },
    { value: "42", label: "short-form posts" },
    { value: "~48K", label: "average views per post" },
    { value: "~2.1K", label: "average likes per post" },
  ],
  statsAtBottom: true,
  links: [{ label: "View on Instagram", url: "https://www.instagram.com/dylanwang.main/" }],
  reels: [
    { cover: "/content/reel-top-1.jpg", url: "https://www.instagram.com/dylanwang.main/reel/DOkmc-5DmJX/", views: "1.1M", likes: "60.3K", engagement: "5.5%", vsMedian: "271×" },
    { cover: "/content/reel-top-2.jpg", url: "https://www.instagram.com/dylanwang.main/reel/DYq9Iq5tZCa/", views: "776K", likes: "33.2K", engagement: "4.3%", vsMedian: "192×" },
    { cover: "/content/reel-top-3.jpg", url: "https://www.instagram.com/dylanwang.main/reel/DX3gglwNAi4/", views: "160K", likes: "8.9K", engagement: "5.6%", vsMedian: "40×" },
  ],
  // all bubbles share one width; columns are balanced by height (1+3 ~ 2+6+4+5)
  dmShots: [
    ["/content/dms/dm-1.png", "/content/dms/dm-3.png"],
    ["/content/dms/dm-2.png", "/content/dms/dm-6.png", "/content/dms/dm-4.png", "/content/dms/dm-5.png"],
  ],
  tools: ["DaVinci Resolve", "Buffer", "Canva"],
  toolNotes: {
    "DaVinci Resolve": "cuts, pacing and color",
    Buffer: "scheduling and posting rhythm",
    Canva: "covers and on-screen text",
  },
  slots: [
    {
      label: "Reel insights",
      prompt: "One reel's first stretch, straight from Instagram: almost every view came from people who didn't follow yet.",
      image: "/content/reel-insights.png",
      tileMaxWidth: 340,
      popups: ["Non-followers", "Reels tab", "Watch time", "Interactions"],
      // rows in the screenshot each note points at
      popupTargets: { "Non-followers": 0.76, "Reels tab": 0.945, "Watch time": 0.37, Interactions: 0.42 },
      popupNotes: {
        "Non-followers": "99.7% of views from people not following yet",
        "Reels tab": "85.8% of views came from the Reels tab",
        "Watch time": "over 24 days of total watch time",
        Interactions: "8,930 likes, comments, shares and saves",
      },
    },
  ],
  imagePlaceholder: {
    label: "CONTENT SHOWCASE: short-form video stills & production timeline",
    aspectRatio: "16/9",
    recommendedSize: "1920 × 1080",
  },
};

export interface SocialLink {
  platform: string;
  url: string;
  handleLabel: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: "LinkedIn", url: "https://www.linkedin.com/in/dylanzhwang", handleLabel: "in/dylanzhwang" },
  { platform: "GitHub", url: "https://github.com/dylanwang-main", handleLabel: "@dylanwang-main" },
  { platform: "Instagram", url: "https://www.instagram.com/dylanwang.main/", handleLabel: "@dylanwang.main" },
];

/** Public resume (phone number left out on purpose). Lives in /public. */
export const RESUME_LINK = {
  label: "Resume",
  url: "/Dylan_Wang_Resume.pdf",
};

/** Graduation year shown in the nav monogram ("UCSD '30"). */
export const GRAD_YEAR_SHORT = "'30";

/** Resume sections for the About index panel. Facts only, as written on the resume. */
export interface IndexEntry {
  title: string;
  org: string;
  dates: string;
  note?: string;
}

export const EXPERIENCE: IndexEntry[] = [
  { title: "Data Assessment Intern", org: "Tustin Unified School District", dates: "Jun to Jul 2025", note: "Power BI dashboards across 30+ schools" },
  { title: "Web Developer", org: "N10 Dance Studios", dates: "Jun 2024 to Jul 2025", note: "SEO and site management, 5.8K+ organic clicks" },
  { title: "Coding Instructor", org: "Coding Creativity", dates: "Jun to Jul 2025", note: "Taught Python and Scratch to 20 to 25 students" },
];

export const EDUCATION: IndexEntry[] = [
  { title: "B.S. Data Science", org: "University of California San Diego", dates: "Expected June 2030" },
  { title: "Generative AI for Business Application", org: "UCI · Certification", dates: "" },
  { title: "AI Fluency: Framework & Foundations", org: "Anthropic · Certification", dates: "" },
];

export const LEADERSHIP: IndexEntry[] = [
  { title: "Mentor", org: "Mentorship & Leadership Cohort", dates: "Sep 2023 to May 2026", note: "Mentored 5 high school students over 2+ years" },
  { title: "Volunteer", org: "Discovery Cube Orange County", dates: "Apr 2024 to Sep 2025", note: "60+ hours, STEM events for 1,000+ visitors" },
];

export const SKILLS: { group: string; items: string[] }[] = [
  { group: "Technical", items: ["Python", "Power BI", "Excel", "HTML/CSS", "GitHub", "Vercel", "WordPress", "Figma"] },
  { group: "Tools", items: ["Notion", "Miro", "Google AI Studio", "DaVinci Resolve Studio"] },
  { group: "AI", items: ["ChatGPT", "Claude", "Claude Code"] },
  { group: "Languages", items: ["Mandarin Chinese"] },
];

export const ABOUT_PROFILE = {
  name: "Dylan Wang",
  summary: "Data science student at UC San Diego with experience in analytics, web development, SEO, and content.",
  institution: "University of California, San Diego",
  photo: "/dylan-wang-headshot.jpg",
};
