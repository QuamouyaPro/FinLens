---
target: landing page (web/src/app/page.tsx)
total_score: 20
max_score: 28
na_heuristics: 7,9,10
p0_count: 0
p1_count: 2
timestamp: 2026-07-30T18-10-55Z
slug: web-src-app-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Demo typing indicator, live ROI recalculation, instant pricing toggle |
| 2 | Match System / Real World | 4 | Vocabulary matches PRODUCT.md's mandated terms exactly |
| 3 | User Control and Freedom | 3 | No traps, but no "back to top", pricing toggle doesn't persist |
| 4 | Consistency and Standards | 2 | Focus-ring styling inconsistent across interactive controls |
| 5 | Error Prevention | 3 | ROI calculator has a floor-guard against nonsensical negative results |
| 6 | Recognition Rather Than Recall | 3 | Sticky nav, side-by-side pricing/comparison |
| 7 | Flexibility and Efficiency | n/a | No power-user workflow on a Persuade-mode page |
| 8 | Aesthetic and Minimalist Design | 2 | Same 3 claims restated across 5 visual formats before pricing |
| 9 | Error Recovery | n/a | No error states exist on this page |
| 10 | Help and Documentation | n/a | Not applicable pre-signup |
| **Total** | | **20/28** | **71% — Good** |

## Design Specificity Verdict
Genuinely split. The citation pill, ambient floating page-number chips, due-diligence-specific comparison table, and ROI calculator floor-guard are authored specifically for FinLens. The six-module icon-tile section and four-step section are the most generic B2B SaaS shape available, and DESIGN.md explicitly rejects that exact icon-tile pattern.

## Priority Issues

[P1] Icon tiles are the exact anti-pattern DESIGN.md names and rejects (.feat .ic, .trust .t .ic — confirmed by both design review and detector's icon-tile-stack rule). Fix: drop the tile, use inline icon or the existing numbered eyebrow. Command: /impeccable quieter

[P1] Rare Accent Rule diluted by volume (~123 accent-colored DOM nodes; detector separately flagged dark-glow, radial-spotlight-glow, 7x kicker-above-heading). Fix: reserve emerald for citation pill + one primary CTA + comparison table's FinLens column. Command: /impeccable quieter

[P2] Contrast failures on faint text: --text-faint ~3.3-3.7:1 vs 4.5:1 AA floor (.faint, .sub, .foot, .lbl). One detector contrast flag on div.n step numerals is a confirmed false positive (hollow text-stroke effect). Fix: lighten --text-faint in dark theme. Command: /impeccable harden

[P2] Focus-visible gaps on .demo__chips button, .bill-toggle button (not covered by shared focus rule), and the 3 ROI range sliders (outline:none, no replacement). Command: /impeccable harden

[P2] Typography/spacing debt (detector only): 10.5px labels below 11px floor, uppercase body-style labels, .sub paragraphs ~94 chars/line, 0px vertical padding on large CTA buttons. Command: /impeccable typeset

## Persona Red Flags
Jordan: two equal-weight CTAs compete with the demo card before the lead paragraph is read.
Riley: ROI sliders at extremes (60x40x250€) produce an uncapped ~420,000€/month result with no sanity flag.
Casey: mobile topbar shows hamburger + both CTAs simultaneously (3 tap targets in a small header).

## Minor Observations
- Footer mixes anchor-scroll and real-route links with no visual distinction.
- Fonds plan's mailto: link not visually distinguished from in-app signup buttons.
- .plan--feat stacks an accent ring + accent-tinted wash (tied to the accent-overuse issue).
- Comparison table's mobile horizontal scroll works (contained) but has no visual affordance hint.

Note: prefers-reduced-motion IS correctly handled globally (finlens.css:1115); an earlier sub-agent claim to the contrary was incorrect and is not an issue.
