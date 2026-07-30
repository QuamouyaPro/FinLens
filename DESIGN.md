---
name: FinLens
description: Le copilote d'analyse financière des investisseurs — chaque réponse cite sa page exacte.
colors:
  bg: "#090A0A"
  surface: "#131516"
  surface-2: "#1A1D1E"
  surface-3: "#232627"
  border: "rgba(255,255,255,.085)"
  border-strong: "rgba(255,255,255,.18)"
  text: "#F2F4F2"
  text-soft: "#9AA29D"
  text-faint: "#858C82"
  accent: "#43D48D"
  accent-strong: "#2CB975"
  accent-tint: "rgba(67,212,141,.15)"
  accent-wash: "rgba(67,212,141,.07)"
  accent-ink: "#04140C"
  danger: "#FF7C68"
  danger-tint: "rgba(255,124,104,.14)"
  signal: "#F0B65E"
  signal-tint: "rgba(240,182,94,.14)"
  info: "#6FB3E8"
  info-tint: "rgba(111,179,232,.14)"
  ink-bg: "#08090A"
  ink-bg-2: "#0E1211"
  ink-line: "rgba(255,255,255,.09)"
  ink-text: "#F3F5F3"
  ink-text-soft: "#97A19A"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2.5rem, 4.6vw, 3.625rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.022em"
  body:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.16em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "11.5px"
    fontWeight: 500
rounded:
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "18px"
  xl: "24px"
  pill: "100px"
spacing:
  xs: "8px"
  sm: "13px"
  md: "19px"
  lg: "24px"
  xl: "28px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "42px"
  button-primary-hover:
    backgroundColor: "{colors.accent-strong}"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "42px"
  cite-pill:
    backgroundColor: "{colors.accent-tint}"
    textColor: "{colors.accent}"
    typography: "{typography.mono}"
    rounded: "{rounded.xs}"
    padding: "1.5px 7px"
  cite-pill-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "24px"
  kpi-value:
    typography: "{typography.mono}"
    textColor: "{colors.text}"
---

# Design System: FinLens

## Overview

**Creative North Star: "The Quiet Auditor"**

FinLens looks like the work of someone who has already checked twice. The
system is restrained everywhere except the one place that matters: the exact
page a fact came from. A tempered serif (Fraunces) carries the authority of
a printed report; a plain, humanist sans (Instrument Sans) carries the actual
work of reading and deciding; a monospace (JetBrains Mono) marks anything
that is data, a number, or a source — so the eye learns to trust mono text as
"this has been verified." The emerald accent is rare on purpose: it marks the
one action, the one flagged number, the one citation pill per fact, never a
whole surface. Dark "ink" panels (sidebar, hero, CTA bands) are a fixed
signature that does not follow the light/dark theme toggle — the auditor's
notebook stays the same color regardless of what time you're reading it.

Rejected explicitly: no purple-to-blue SaaS gradient, no rounded-square icon
tile above every heading, no cards nested inside cards, no bright color used
for anything but the rare, deliberate flag.

**Key Characteristics:**
- Two-register typography: serif for authority, mono for anything sourced or numeric.
- One accent color, spent almost exclusively on the citation pill and the primary action.
- Fixed dark "ink" panels as a brand signature independent of theme.
- Flat surfaces lifted only by soft, low-contrast shadows — never a hard drop shadow.
- Pills (100px radius) for anything the user scans as a tag: badges, chips, citations, quick-search suggestions.

## Colors

Two live themes (dark by default, light via `html[data-theme="light"]`) share the same role names but different exact values, except the ink panels, which stay fixed in both.

### Primary
- **Verified Emerald** (`#43D48D` dark / `#146B45` light): the one accent. Primary buttons, the citation pill, positive KPI deltas, the hero pill's pulsing dot. Never used as a background fill beyond a soft tint/wash.

### Neutral
- **Near-Black Canvas** (`#090A0A` dark / `#F6F7F5` light): page background. Tinted, never pure black or pure white.
- **Card Surface** (`#131516` / `#FFFFFF`) and **Surface 2/3** (`#1A1D1E`/`#232627` dark, `#FAFBF9`/`#F0F2ED` light): layered surfaces for cards, inputs, and hover states.
- **Text** (`#F2F4F2` / `#0F130E`), **Text Soft** (`#9AA29D` / `#59615A`), **Text Faint** (`#858C82` / `#6E766D`, tuned to clear 4.5:1 AA against surface/surface-2): primary copy, secondary labels, and placeholder/meta text.
- **Border** (`rgba(255,255,255,.085)` / `#E3E6E0`): the only line-work; no borders above 1px.

### Fixed Ink (signature, identical in both themes)
- **Ink Background** (`#08090A` → `#0E1211` gradient) and **Ink Text** (`#F3F5F3` / soft `#97A19A`): the sidebar, the public hero, and the closing CTA band. These three surfaces are always dark, regardless of the user's theme choice — this is the one deliberate theme exception in the system.

### Status
- **Danger** (`#FF7C68` / `#A63A2E`): contradictions, critical signals, destructive actions.
- **Signal** (`#F0B65E` / `#A9741A`): warnings, "à vérifier" states.
- **Info** (`#6FB3E8` / `#2E6B99`): neutral informational states (e.g. screening stage).

### Named Rules
**The Rare Accent Rule.** Verified Emerald appears on at most one primary action and the citation pills per view — never as a section background or a decorative sweep. If more than a handful of elements are emerald on one screen, something is over-marked.

**The Fixed Ink Rule.** Sidebar, public hero, and CTA bands stay on the dark ink palette in both light and dark theme. They are brand furniture, not theme-aware content.

## Typography

**Display Font:** Fraunces (with Georgia, serif fallback)
**Body Font:** Instrument Sans (with system-ui, sans-serif fallback)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, monospace fallback)

**Character:** An old-report serif for weight and trust, a quiet grotesk-adjacent sans for actual reading, and a mono face that visually tags anything sourced or numeric — the pairing itself teaches the user which text has been verified.

### Hierarchy
- **Display** (400, `clamp(40px, 4.6vw, 58px)`, line-height 1.05, letter-spacing -0.022em): hero headline only; italic sub-clause in the accent color marks the thesis line.
- **Body** (400, 15px base, line-height 1.55): all reading copy, `.lead` variants cap at `29em` measure.
- **Label / Eyebrow** (600, 12px, letter-spacing 0.16em, uppercase): section eyebrows, field labels, source-list headers.
- **Mono / Data** (500, 11–14px, tabular numerals, letter-spacing -0.01em to -0.03em): KPI values, citation pills, page/document references, financial figures. Anything in mono is implicitly "this number came from a document."

### Named Rules
**The Mono-Means-Sourced Rule.** If a number or short reference is set in JetBrains Mono, it must be traceable to a document or a live computation — never used decoratively for numerals that aren't backed by something.

## Layout

Public pages center content in a 1200px `.wrap` (28px side padding); the app shell uses a wider 1400px content column, since financial tables need the room. The public hero is a two-column grid (roughly 55/45 text-to-demo split above 1080px), collapsing to one column at ≤1080px. Grids for cards/steps/pricing step down from 3–4 columns to 2 at ≤1080px and to 1 at ≤780px. Below 780px the app sidebar becomes an off-canvas drawer.

## Elevation & Depth

Flat by default: most surfaces sit at the same visual plane with only a 1px border for separation. Depth is conveyed by three soft, low-contrast ambient shadow tokens, never a hard drop shadow, and shadows lighten by roughly two-thirds in the light theme rather than disappearing.

### Shadow Vocabulary
- **Ambient small** (`0 1px 2px rgba(0,0,0,.4)` dark / `rgba(15,19,14,.05)` light): resting cards, KPI tiles, inputs.
- **Ambient standard** (`inset 0 1px 0 rgba(255,255,255,.03), 0 16px 36px -18px rgba(0,0,0,.65)` dark): modals, dropdowns, the hero demo card.
- **Ambient large** (`0 32px 84px -26px rgba(0,0,0,.78)` dark): the highest-elevation surfaces — command palette, full-screen note reader.

### Named Rules
**The No Hard Shadow Rule.** Every shadow is soft, wide-spread, and low-opacity. A crisp, close, high-contrast shadow anywhere in the UI is a bug, not a variant.

## Shapes

A restrained four-step radius scale: 6 / 8 / 12 / 18 / 24px, plus a 100px pill for anything scanned as a tag (badges, chips, the citation pill, quick-search suggestions, buttons at their smallest). Borders are always exactly 1px and low-contrast; nothing is clipped or cut at an angle.

## Components

### Buttons
- **Shape:** 8px radius (`--r-sm`); pill-shaped in no case except tags.
- **Primary:** Verified Emerald fill, ink-dark text, subtle inset highlight + accent-tinted glow shadow; hovers to the darker emerald and lifts 1px.
- **Ghost:** surface-colored fill with a 1px border, ambient-small shadow; hover only strengthens the border.
- **Ink variant:** used exclusively inside ink panels (hero, CTA band) — same emerald fill but composed against the dark ink palette.
- **Sizes:** sm (35px), default (42px), lg (48px); `--block` for full-width.

### Badges & Chips
- **Style:** pill radius (100px), 23–34px height, tinted background + solid-color text drawn from the matching status token (ok/warn/crit/info/muted/ink).
- **State:** chips (search suggestions, filters) use the same pill shape with a full 1px border instead of a tint fill.

### Cards / KPI tiles
- **Corner Style:** 12px radius.
- **Background:** surface color, 1px border, ambient-small shadow.
- **Internal Padding:** 19–24px.
- **KPI tile specific:** value in mono at 29px/600, secondary text mono-adjacent; a `.spark` sparkline sits absolutely positioned bottom-right when a real or plausible trend exists.

### Inputs / Fields
- **Style:** 45px height, 8px radius, 1px border, surface background.
- **Focus:** border turns accent, plus a 3.5px accent-wash glow ring (no default browser outline).

### Navigation (sidebar)
- Fixed ink panel (dark gradient `ink-bg-2` → `ink-bg`), soft ink-toned text, becomes an off-canvas drawer with a slide transition below 780px.

### The Citation Pill (signature component)
The product's one recognizable visual mark: a small mono pill (`.cite`) — accent-tinted, holding a lens icon and a page number (`p.148`) — inserted inline wherever a generated sentence uses a sourced fact. On hover it inverts to solid accent. Its larger sibling, the source card (`.src-card`), pairs the page number with the document filename in list form under an answer. Every other component in the system exists to let this one be trusted.

## Do's and Don'ts

### Do:
- **Do** put a citation pill or source card next to every generated number or claim — this is the product's core promise, not decoration.
- **Do** keep the sidebar, public hero, and CTA bands on the fixed ink palette in both themes.
- **Do** use mono type only for numbers, dates, and references that are actually sourced or computed.
- **Do** use soft, wide, low-opacity shadows for any elevation; scale shadow strength down (not off) in the light theme.

### Don't:
- **Don't** use the emerald accent as a section background, gradient, or decorative sweep — it marks one action or one fact at a time.
- **Don't** nest cards inside cards; use a border or a subtle background shift instead of a second card shell.
- **Don't** apply a hard, close, high-contrast drop shadow anywhere.
- **Don't** use JetBrains Mono decoratively for numerals that aren't traceable to a document or a live computation.
