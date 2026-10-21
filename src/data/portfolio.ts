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
  theme: "dark" | "light"; // "dark" = dark scene (light-on-dark nav), "light" = light scene
  layers: SceneLayer[];
}

export const HERO_SCENE: SceneData = {
  id: "hero",
  kicker: "Portfolio · Monograph",
  heading: "Dylan Wang",
  tagline: "Data science student at UC San Diego and content creator.",
  subtitle: "UC San Diego",
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
      "Analytics, web development, SEO, and research.",
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
  tools: string[];
  slots?: { label: string; prompt: string }[];
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
    tools: ["Power BI", "Python", "Excel"],
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
      { value: "86K+", label: "search impressions" },
      { value: "6.8%", label: "click-through rate" },
    ],
    tools: ["WordPress", "HTML", "CSS"],
    hotspots: [
      { x: 22, y: 6, label: "Site structure", detail: "Site structure improvements, part of the ongoing SEO work." },
      { x: 30, y: 52, label: "Keyword targeting", detail: "Keyword targeting and content updates across the site." },
      { x: 76, y: 86, label: "Mobile optimization", detail: "Mobile optimization as part of on-page SEO." },
    ],
    slots: [
      {
        label: "Client Objective",
        prompt: "Grow the studio's organic visibility on Google.",
      },
      {
        label: "What I Did",
        prompt: "On-page SEO, site structure, content updates, and ongoing site management.",
      },
      {
        label: "Outcome",
        prompt: "5.8K+ organic clicks and 86K+ impressions at a 6.8% CTR.",
      },
    ],
    imagePlaceholder: {
      label: "WEBSITE INTERFACE: N10 responsive desktop & mobile screens",
      aspectRatio: "16/10",
      recommendedSize: "1600 × 1000",
    },
  },
  {
    id: "rl-research-proposal",
    title: "Reinforcement Learning Research Proposal",
    category: "AI Research",
    year: "Jun to Aug 2024",
    description:
      "Wrote a research proposal for evaluating agent performance in simulated environments, synthesizing prior work into the evaluation framework, methodology, and performance metrics.",
    meta: "Remote · Jun to Aug 2024 · Framework approved by a Caltech mentor",
    tools: ["Reinforcement Learning", "Research Design", "Evaluation Metrics"],
    imagePlaceholder: {
      label: "PROPOSAL: framework, methodology and metrics",
      aspectRatio: "16/10",
      recommendedSize: "1600 × 1000",
    },
  },
  {
    id: "ds3-park-smart",
    title: "DS3 Park Smart",
    category: "Data Science",
    year: "Project",
    description:
      "A collaborative data science project to clean, analyze, and improve parking data using version control and team workflows.",
    tools: ["Python", "Pandas", "Git", "GitHub", "VS Code"],
    slots: [
      {
        label: "Problem Context",
        prompt: "[Add: what problem this solved]",
      },
      {
        label: "Methods & Implementation",
        prompt: "[Add: approach, data cleaning methods, and team workflow]",
      },
      {
        label: "Impact & Learnings",
        prompt: "[Add: key outcomes and learnings]",
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
  tools: ["DaVinci Resolve", "Buffer", "Canva"],
  slots: [
    {
      label: "Content Pillars & Themes",
      prompt: "[Add: content strategy, formats, and topics covered]",
    },
    {
      label: "Workflow & Distribution",
      prompt: "Ideation, editing, iterative testing, and trend-based experimentation, guided by post performance.",
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
