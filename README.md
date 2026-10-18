# Dylan Wang · Editorial Portfolio

React + TypeScript + Tailwind v4 + Motion + Lenis, built with Vite. Structure and motion follow
Shopify Editions (Winter 2026): a pinned intro, chapters that open on a full-screen scene, and
cream pages with torn edges that scroll up over each scene.

```
bun install      # or npm install
bun run dev      # local dev server on :3000
bun run build    # production build into dist/
bun run lint     # type-check
```

## Where things live

```
src/
  App.tsx                 page assembly: intro + one <Chapter> per section + footer
  data/portfolio.ts       ALL content: scenes, projects, links, about. Edit text here.
  lib/                    small shared helpers (no React UI)
    math.ts               clamp01, seg (scroll timelines), easings, seeded random
    motion.ts             EASE curve and fadeUp() reveal preset
    scroll.ts             Lenis access, scrollToId, scrollToTop
    timeline.ts           INTRO_VH / SCENE_DWELL_VH scroll lengths
    layout.ts             PAGE_X / PAGE_COLUMN page padding (clears the nav rail)
    noise.ts              cached noise tiles (film grain, paper grain)
    paperEdges.ts         registry of torn edges, used by the nav for contrast
    useReducedMotion.ts   reduced-motion hook + one-off check
  components/
    layout/   Navigation, LenisProvider, Footer, Chapter, SectionContentWrapper,
              PaperEdge (torn edge), PaperDecor (cream page detail)
    intro/    IntroBurst (pinned intro), BlackHole (WebGL), GravityField, SuckText
    scenes/   SectionOpener (full-screen scene), SceneShowcase (scene windows),
              ArchitecturalMotif (line-art drawings)
    blocks/   FeatureBlock (project), SubBlock, ProofStage (window + skill chips),
              MediaSlots (animated tiles, prompt bar), CardFan, PlaceholderImage, FloatingWords
    sections/ AboutSection, ContactSection
```

## Common changes

- **Edit text, projects, tools or links:** `src/data/portfolio.ts` only.
- **Add a Work project:** add an entry to `WORK_PROJECTS`. To give it its own demo window, add a
  wireframe in `scenes/SceneShowcase.tsx` and map its id in `PROOFS` in `blocks/FeatureBlock.tsx`.
- **Add a block to a chapter:** drop a `<SubBlock>` into that chapter in `App.tsx`, with a
  `TileGrid`, `PromptBar` or `CardFan` as its media.
- **Add a chapter:** add a scene to `SECTION_SCENES`, a nav item to `NAVIGATION_ITEMS`, and a
  `<Chapter>` in `App.tsx` (bump `zClass` so it stacks above the previous one).
- **Swap a placeholder for a real image:** replace the `AnimatedTile` / `PlaceholderImage` in that
  spot with an `<img>`; keep the same aspect ratio so the layout doesn't move.

## Rules of the road

- Every animation is scroll-driven or plays once on view; nothing blocks or slows scrolling.
- Respect reduced motion via `useReducedMotion()`.
- No invented metrics: wireframes stay unlabeled until real numbers exist.
- Heavy effects (black hole, torn edges) only run while on screen and adapt their quality.
