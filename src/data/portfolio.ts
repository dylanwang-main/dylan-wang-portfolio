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
  motifId?: string; // architectural motif identifier ("hero", "work", "content", "about", "contact", etc.)
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
  tagline: "Incoming data science student at UC San Diego and content creator.",
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
      "Collaborative data science pipelines and responsive web development.",
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
      "Short-form media production, visual storytelling, and audience building.",
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
      "Data science student at UC San Diego with a passion for creative communication.",
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
        motifId: "about-rotunda",
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
        motifId: "contact-portico",
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
  tools: string[];
  slots?: { label: string; prompt: string }[];
  imagePlaceholder: {
    label: string;
    aspectRatio: string;
    recommendedSize: string;
  };
}

export const WORK_PROJECTS: ProjectData[] = [
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
  {
    id: "n10-dance-studios",
    title: "N10 Dance Studios Website",
    category: "Web Development",
    year: "Project",
    description:
      "A responsive website I developed and customized for N10 Dance Studios to improve their online presence and user experience.",
    tools: ["WordPress", "HTML", "CSS"],
    slots: [
      {
        label: "Client Objective",
        prompt: "[Add: what problem this solved]",
      },
      {
        label: "Site Architecture & Customization",
        prompt: "[Add: responsive design approach and UX enhancements]",
      },
      {
        label: "Outcome",
        prompt: "[Add: key outcomes and learnings]",
      },
    ],
    imagePlaceholder: {
      label: "WEBSITE INTERFACE: N10 responsive desktop & mobile screens",
      aspectRatio: "16/10",
      recommendedSize: "1600 × 1000",
    },
  },
];

export const CONTENT_PROJECT: ProjectData = {
  id: "personal-brand",
  title: "Personal Brand & Content Creation",
  category: "Content Creation",
  year: "Active",
  description:
    "Short-form content documenting my experiences, sharing insights, and building an engaged audience across social media.",
  tools: [
    "DaVinci Resolve",
    "TikTok Studio",
    "YouTube Studio",
    "Buffer",
    "Canva",
  ],
  slots: [
    {
      label: "Content Pillars & Themes",
      prompt: "[Add: content strategy, formats, and topics covered]",
    },
    {
      label: "Workflow & Distribution",
      prompt: "[Add: ideation, filming, editing cadence, and distribution workflow]",
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
  isComingSoon: boolean;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "LinkedIn",
    url: "#",
    handleLabel: "Dylan Wang",
    isComingSoon: true,
  },
  {
    platform: "GitHub",
    url: "#",
    handleLabel: "@dylanzhwang",
    isComingSoon: true,
  },
  {
    platform: "Instagram",
    url: "#",
    handleLabel: "@dylan",
    isComingSoon: true,
  },
  {
    platform: "TikTok",
    url: "#",
    handleLabel: "@dylan",
    isComingSoon: true,
  },
  {
    platform: "YouTube",
    url: "#",
    handleLabel: "@dylan",
    isComingSoon: true,
  },
];

export const RESUME_LINK = {
  label: "Resume",
  url: "#",
  isComingSoon: true,
};

export const ABOUT_PROFILE = {
  name: "Dylan Wang",
  roleHeadline: "Incoming Data Science Student at UC San Diego · Content Creator",
  institution: "University of California, San Diego",
  audiences: [
    "UCSD data and tech orgs",
    "Recruiters",
    "Brand partners",
    "Future consulting clients",
  ],
  slots: [
    {
      title: "Bio & Background",
      placeholder: "[Add: short bio]",
    },
    {
      title: "Leadership & Community",
      placeholder: "[Add: leadership and mentoring]",
    },
  ],
  photoPlaceholder: {
    label: "PHOTO: headshot",
    dimensions: "Portrait (3:4) · 1200 × 1600",
  },
};
