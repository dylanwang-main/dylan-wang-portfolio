# Dylan Wang — Editorial Portfolio Implementation Plan (Final Revision)

An editorial, quiet-luxury portfolio website for Dylan Wang, incoming data science student at UC San Diego and content creator, built for recruiters, UCSD student organizations, brand partners, and consulting clients.

> [!IMPORTANT]
> **Approved Adjustments & Inclusions:**
> - **Single Email Constant**: The contact email is stored in a single export `CONTACT_EMAIL = "dylanzhwang@gmail.com"` inside `src/data/portfolio.ts`.
> - **Placeholder Social & Resume Links**: All social channels (LinkedIn, GitHub, Instagram, TikTok, YouTube) and the Resume link use `"#"`, accompanied by clean editorial "(coming soon)" indicators. No external URLs guessed.
> - **Section Openers**: Full-screen opener scenes with huge Cormorant Garamond headings, serif italic taglines with a swash initial letter, and warm neutral gradient backgrounds. Zero added filler content.
> - **About Section Content**: Grounded exclusively in Dylan's background as an incoming UC San Diego data science student and content creator, featuring explicit labeled slots `[Add: short bio]` and `[Add: leadership and mentoring]`.
> - **Compact Mobile Bar**: A clean, compact fixed mobile bar that houses the brand mark, Roman numeral tracker, and Resume link.
> - **Motion Profile (Phase 1)**: Lenis smooth scroll, pinned hero reveal, scrollspy Roman numerals (I to IV), 800ms ease-out reveals, and a slow ambient float on the hero monogram.

---

## 1. Overview & Core Concept

- **What It Does**: A single-page, scroll-driven editorial portfolio that presents Dylan Wang's background, projects, content work, and contact details with confident typography, generous whitespace, and butter-smooth scrolling.
- **Target Audience**: UC San Diego data and tech organizations, tech recruiters, brand partners, and future consulting clients.
- **Key Value**: Delivers an immediate impression of poise, craft, and technical rigor without loud gimmicks or unverified metric claims.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Pinned Hero Entry**:
   - The hero section opens with Dylan Wang's name in commanding Cormorant Garamond display serif, a serif italic tagline with a swash initial letter, an ambient floating monogram seal, a resume link (coming soon), and an editorial scroll invitation.
   - Pinned hero animation: as the user scrolls, the hero pins momentarily before transitioning into Section I.
2. **Responsive Roman Navigation**:
   - **Desktop**: Fixed left vertical rail displaying Roman numerals (**I. Work**, **II. Content**, **III. About**, **IV. Contact**). The active section is bold and highlighted in oxblood (`#6B2D2D`), with inactive sections muted. Clicking any numeral smooth-scrolls directly to the section via Lenis.
   - **Mobile**: Compact fixed header bar displaying the brand mark, Roman numeral segment indicators, and Resume link.
3. **Section Architecture**:
   - **I. Work**: Full-screen opener scene, followed by:
     - *DS3 Park Smart*: collaborative data science project to clean, analyze, and improve parking data using version control and team workflows. Tools: Python, Pandas, Git, GitHub, VS Code. Bracketed editorial slots for `[Add: what problem this solved]` and `[Add: key outcomes and learnings]`.
     - *N10 Dance Studios Website*: responsive website developed and customized for N10 Dance Studios to improve their online presence and user experience. Tools: WordPress, HTML, CSS. Bracketed slot for `[Add: client objectives and site improvements]`.
   - **II. Content**: Full-screen opener scene, followed by:
     - *Personal Brand and Content Creation*: short-form content documenting experiences, sharing insights, and building an engaged audience across social media. Tools: DaVinci Resolve, TikTok Studio, YouTube Studio, Buffer, Canva. Bracketed slot for `[Add: content strategy and audience themes]`. Editorial photo/video frame placeholders.
   - **III. About**: Full-screen opener scene, followed by:
     - Dylan's verified background: incoming data science student at UC San Diego, content creator, and student org / recruiter audiences.
     - Labeled expansion slots: `[Add: short bio]` and `[Add: leadership and mentoring]`.
     - Labeled `PHOTO: headshot` placeholder.
   - **IV. Contact**: Full-screen opener scene, followed by:
     - Direct `mailto:` action button referencing `CONTACT_EMAIL`.
     - Social channel links (LinkedIn, GitHub, Instagram, TikTok, YouTube) set to `"#"` with "(coming soon)" status.

### Visual Identity & Theme
- **Color Variables (`src/index.css`)**:
  - `--bg-cream`: `#F4EFE6`
  - `--text-ink`: `#1F1B16`
  - `--taupe-subtle`: `#8A7B6A`
  - `--accent-oxblood`: `#6B2D2D`
  - `--border-hairline`: `rgba(31, 27, 22, 0.12)`
- **Typography**:
  - Display & Headings: `Cormorant Garamond` (Google Fonts), italicized swash drop-caps, tight tracking, balanced line wrapping.
  - Body & UI: `Inter` (sans-serif), 15px to 16px with 1.6 line height.
- **Anti-Slop Discipline**:
  - Zero pill enclosures or candy tags. Metadata and tools rendered as unboxed typography separated by `·`.
  - No decorative pulsing dots or code comments in titles.
  - Hairline borders and ample whitespace rather than nested cards.

### Motion & Interaction (Phase 1)
- **Lenis Smooth Scroll**: Inertial, momentum-based scrolling with immediate user interruptibility.
- **Scrollspy**: IntersectionObserver-backed section tracker keeping sidebar Roman numerals in sync.
- **800ms Fade-and-Rise Reveals**: Framer Motion entry reveals using compositor-only properties (`transform`, `opacity`) with an 800ms ease-out curve.
- **Slow Ambient Float**: Gentle, subtle floating animation applied to the monogram seal element in the hero.
- **Reduced Motion Support**: Full compliance with `@media (prefers-reduced-motion: reduce)`.

---

## 3. Key Product Decisions & Trade-Offs

- **Exact Content & Bracket Placeholders**:
  - *Decision*: Strictly use Dylan's original project summaries and tools. Supplement with bracketed editorial prompts (`[Add: ...]`) where Dylan can insert further details later.
  - *Why*: Eliminates hallucinated facts while providing an editorial structure ready for expansion.
- **Single Email Constant & Coming Soon Social Links**:
  - *Decision*: Centralize `CONTACT_EMAIL` in `src/data/portfolio.ts` and set all social links to `"#"` with a subtle "(coming soon)" note.
  - *Why*: Guarantees zero broken or guessed URLs and makes future updates trivial.
- **Mobile First Navigation**:
  - *Decision*: Compact top bar on mobile (< 768px), fixed left sidebar on desktop (>= 768px).
  - *Why*: Leaves maximum screen space for content on mobile while preserving the editorial left rail on desktop.

---

## 4. Technical Architecture & Component Hierarchy

```
┌────────────────────────────────────────────────────────┐
│                        App.tsx                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Lenis Smooth Scroll Provider           │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │     Desktop Left Sidebar / Mobile Top Bar        │  │
│  │     Roman Numerals (I to IV) + Resume link       │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Pinned Hero Scene (Dylan Wang + Italic Tagline)  │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Section I: Work (DS3 Park Smart & N10 Dance)     │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Section II: Content (Personal Brand & Media)     │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Section III: About (UCSD Data Science & Slots)   │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Section IV: Contact (Direct Mailto & Socials)    │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Quiet Editorial Monograph Footer                 │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### Modular Structure
- `src/data/portfolio.ts`: Authoritative project descriptions, exact tools, single `CONTACT_EMAIL` constant, `"#"` links, and bracketed placeholder markers.
- `src/components/Navigation.tsx`: Responsive navigation (fixed left Roman rail on desktop, sleek top bar on mobile).
- `src/components/HeroSection.tsx`: Pinned hero opener with Cormorant Garamond display typography, swash italic tagline, and ambient monogram float.
- `src/components/SectionOpener.tsx`: Full-screen section opener scene for each Roman numeral with warm gradient background and swash tagline.
- `src/components/ProjectItem.tsx`: Editorial project layout with hairline borders, exact tools, and bracketed placeholder expansion slots.
- `src/components/PlaceholderImage.tsx`: Styled warm neutral gradient frame with label and dimensions.
- `src/components/ContactSection.tsx`: Direct mailto trigger and coming soon social links.
