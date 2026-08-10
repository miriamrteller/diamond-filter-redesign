# Diamond Filter Redesign — Interactive Case Study

A working React **concept redesign** of a complex diamond search filter — the problem I lived
in for four years as Senior Front-End Engineer / Team Lead at **Rapaport** (2021–2025), where
I drove accessibility, consistency and design-system work on the real thing. This demo is
where I'd take that filter today; it is **not a replica of the shipped product**.

**Live demo:** https://miriamrteller.github.io/diamond-filter-redesign/
**Full case study:** https://miriamrteller.com/portfolio

## What this demo shows

The app ships both versions behind a toggle, with an **annotation layer** you can switch on:

- **Before · legacy** — a from-memory reconstruction of the classic tile-based filter
  pattern: grey ~2-inch tiles, each with a white scrollable checklist (navy mini scrollbar,
  navy selection highlights) and a ~30px pill box of selected values above it, plus an
  expandable Advanced Options section. It preserves the audited problems: 8–9px type,
  failing contrast, scroll-within-scroll lists, enumeration clicks, ~10px hit targets,
  a fixed-width layout, and results only after pressing Search. Red pins mark the audit
  findings. Details are approximate.
- **After · concept** — the concept redesign: a 12px type floor on a tokenized scale,
  WCAG AA contrast, range-based grade selection that matches how traders actually think
  ("G or better"), progressive disclosure for specialist criteria, a live result count,
  applied-filter chips, and a mobile filter sheet with 44px targets. Green pins explain
  each decision.

## Key decisions

| Problem (legacy) | Decision (concept) |
| --- | --- |
| 8–9px text, grey-on-grey contrast | Tokenized type scale with a 12px floor; AA contrast throughout |
| Checklists scrolling inside 2-inch tiles, inside a scrolling page | Everything visible at its natural size; specialist criteria in accordions, not buried in scroll |
| "Color D–H" = 5 precise clicks in a scrolling list | Contiguous range selector: pick two endpoints, selection reads back as a span |
| Selected state as overflowing pills in a 30px box | Removable filter chips in the results header — the full query always visible |
| Result count only after Search | Live count + results as you filter; polite live region for screen readers |
| Fixed-width, desktop-only | Responsive: sticky sidebar → full-screen sheet with sticky "Show N diamonds" |
| No focus states, no structure | Fieldsets/legends, `aria-pressed`/`aria-sort`, visible focus on every control, full keyboard support |

## Accessibility checklist

- Minimum text size 12px; body 14px
- WCAG 2.1 AA contrast on all text and interactive states
- Visible `:focus-visible` outline on every control
- Touch targets ≥ 44px on primary controls
- Semantic fieldsets/legends; sortable columns announce `aria-sort`
- Result count announced via `aria-live="polite"`
- `prefers-reduced-motion` respected
- Fully operable by keyboard, including the annotation layer (Esc closes)

## Notes on authenticity

This is a **concept built for my portfolio** — no proprietary Rapaport code, data, or
assets are used. The "before" view is reconstructed from memory of the classic tile-based
filter pattern and is approximate, not pixel-faithful. The "after" view is my own concept
of where I'd take the problem space today — the redesign that actually shipped at Rapaport
took a different direction (the same grey cards restructured as full-width horizontal
blocks) and is described, along with the accessibility and design-system work I led, in
the accompanying case study at miriamrteller.com. The 240 listings are deterministically
generated (seeded PRNG) so the demo is stable across loads.

## Running locally

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
```

Stack: React 18, TypeScript, Vite. No component library — the point is the
hand-built interaction and accessibility work. Deployed to GitHub Pages via
Actions on every push to `main`.

Built with [Claude Code](https://claude.ai/code) as an AI pair — part of how I work.

© Miriam R Teller. Code MIT-licensed; case-study text and design all rights reserved.
