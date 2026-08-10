# Diamond Filter Redesign — Interactive Case Study

A working React **concept redesign** of a complex diamond search filter — the problem I lived
in for four years as Senior Front-End Engineer / Team Lead at **Rapaport** (2021–2025), where
I drove accessibility, consistency and design-system work on the real thing. This demo is
where I'd take that filter today; it is **not a replica of the shipped product**.

**Live demo:** https://miriamrteller.github.io/diamond-filter-redesign/
**Full case study:** https://miriamrteller.com/portfolio

## What this demo shows

The app ships both versions behind a toggle, with an **annotation layer** you can switch on:

- **Before · legacy** — an illustrative composite of the class of problems the legacy
  filter had (not the actual RapNet UI): 8–9px type, ~2.4:1 contrast, 60+ flat checkboxes
  with 10px hit targets, a fixed 1120px layout, and results only after pressing Search.
  Red pins mark the audit findings.
- **After · concept** — the concept redesign: a 12px type floor on a tokenized scale,
  WCAG AA contrast, range-based grade selection that matches how traders actually think
  ("G or better"), progressive disclosure for specialist criteria, a live result count,
  applied-filter chips, and a mobile filter sheet with 44px targets. Green pins explain
  each decision.

## Key decisions

| Problem (legacy) | Decision (redesign) |
| --- | --- |
| 8–9px text, grey-on-grey (~2.4:1) | Tokenized type scale with a 12px floor; AA contrast throughout |
| 60+ checkboxes, all equal weight | Progressive disclosure: 5 core filters visible, finish + specialist criteria in accordions |
| "Color D–H" = 5 precise clicks | Contiguous range selector: pick two endpoints, selection reads back as a span |
| Result count only after Search | Live count + results as you filter; polite live region for screen readers |
| Fixed 1120px, desktop-only | Responsive: sticky sidebar → full-screen sheet with sticky "Show N diamonds" |
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

This is a **concept built for my portfolio**, not a replica of RapNet — no proprietary
Rapaport code, data, or assets are used, and neither view reproduces the actual shipped
interface. The "before" view illustrates the *category* of problems I audited in the real
product (sub-readable type, failing contrast, flat checkbox walls, no feedback loop); the
"after" view shows how I'd solve that problem space today. The accessibility, consistency
and design-system work I actually shipped at Rapaport is described in the accompanying
case study at miriamrteller.com. The 240 listings are deterministically generated
(seeded PRNG) so the demo is stable across loads.

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
