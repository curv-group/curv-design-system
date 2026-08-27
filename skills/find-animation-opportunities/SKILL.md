---
name: find-animation-opportunities
description: >-
  Search the Curv design system or an OS UI for places that don't animate but
  should, and reject everything that shouldn't. Read-only — proposes motion with
  exact values from motion-system, does not implement. Use when asked "what
  could be animated?", to find micro-interactions, or to "make this feel more
  alive". For reviewing existing motion use review-animations; for how to
  implement a suggestion use motion-system.
---

# Finding Animation Opportunities

A search skill. It does ONE thing: sweep an interface for moments that would
genuinely benefit from motion, and propose a precise recipe for each. It does
not review existing animations (that's `review-animations`) and it does not
write the implementation (that's a later pass using `motion-system`).

Judgment and values come from `motion-system` (the Curv adaptation of Emil
Kowalski's design-engineering bar). Do not invent a parallel easing or duration
scale.

## Operating posture

**Restraint is the product.** Curv OS is a dense, power-user tool. An opportunity
finder that suggests motion everywhere is worse than useless. Expect to reject
most candidates. A short list of high-conviction opportunities beats a long
wishlist.

## Hard rules

1. **Never modify source code.** This skill reports; it does not implement.
2. **Every suggestion must pass the full Gate below.** No exceptions for "it
   would look cool."
3. **Cap the output.** At most 5–7 suggestions for a whole surface, fewer for a
   single component. Ordered by leverage, not by how fun they'd be to build.
4. **Extend this repo's vocabulary.** Curves, durations, and reduced-motion
   handling come from `motion-system`. Tokens only (`bg-card`, not raw hex).
5. **Personality.** Crisp and fast. No bounce, no springs on data UI, no
   staggered table rows on every filter.

## The Gate

Every candidate must survive all four questions, in order. Record the answer —
it goes in the report.

### 1. Frequency — how often will a user see this?

| Frequency | Verdict |
| --- | --- |
| 100+ times/day (⌘K, keyboard shortcuts, table row keys) | **Reject. No animation. Ever.** |
| Tens of times/day (hover, list navigation, frequent toggles) | Reject, or near-imperceptible only |
| Occasional (modals, drawers, toasts, selects) | Eligible — standard animation |
| Rare / first-time (empty states, first-run) | Eligible — the only delight budget |

Keyboard-initiated actions are a disqualifier, not a judgment call. In this
product that includes: Command Palette open/close, keyboard-driven DataTable
row selection, and any shortcut.

### 2. Purpose — why does this animate?

Name one of these, explicitly:

- **Feedback** — the interface heard the user (press scale)
- **Spatial consistency** — where something came from or went (drawer from the
  trailing edge; toast in and out the same edge)
- **State indication** — a state change made legible (switch thumb, expanding
  section)
- **Preventing a jarring change** — content that would otherwise teleport
- **Delight** — allowed *only* at the rare/first-time tier

"It looks cool" is not on this list. Can't name it? Reject.

### 3. Speed — can it stay inside budget?

UI stays under 300ms. Pull exact bands from `motion-system`:

| Element | Duration |
| --- | --- |
| Press feedback | 100–160ms |
| Tooltips, small popovers | 125–200ms |
| Dropdowns, selects | 150–250ms |
| Modals, drawers | 200–300ms (exit faster than enter) |

If the moment only "works" as a slow show, it fails the gate.

### 4. Function — does motion help or hinder here?

Data the user is reading or acting on should not move for style. No decorative
mouse-tracking on a P&L, no line-drawing on a chart, no stagger on a filtered
deals table.

## Where to hunt

Sweep these seams — each is a known class of genuine opportunity:

**Feedback gaps**
- Pressable elements with no `:active` → `scale(0.97)`, `transform` 150–160ms,
  `--ease-out` (`cubic-bezier(0.23, 1, 0.32, 1)`). Buttons in this package
  already do this; icon buttons, table chrome, and ghost controls often don't.
- Destructive actions: our pattern is `ConfirmDialog`, not hold-to-confirm.
  Do not propose clip-path hold-to-delete.

**Teleporting state**
- Conditional renders with no bridge (`{open &&`, tab panels that pop) →
  `opacity` + `scale(0.95)`, never `scale(0)`; `@starting-style` where it fits.
- Accordions / collapses that snap — only if they aren't high-frequency.

**Missing spatial story**
- Menus, popovers, selects that don't scale from the trigger → Base UI
  `var(--transform-origin)`. Modals stay centered.
- Drawer / toast exit a different path than enter → same edge both ways;
  `--ease-drawer` for sheets.

**Group entrances**
- Occasional grids that pop in all at once → 30–80ms stagger, never blocking.
  Not on DataTable filter refreshes.

**Do not hunt these (pre-rejected in Curv OS)**
- Command Palette open/close
- Keyboard row move in DataTable
- Chart series "drawing on"
- AppFrame's `--curv-drawer-gutter-*` padding (the page-narrows with the
  drawer — a known layout exception; don't "fix" it to transform)

Useful greps: `{open &&`, `display: none`, `onClick` with no `active:scale`,
`bar={false}` tabs, empty-state components, `Drawer`, `Dialog`, `Toast`.

## Workflow

1. **Recon.** Stack is React + Base UI + this package's tokens. Personality is
   Linear-crisp. Build a frequency map of the surface.
2. **Sweep** the hunt list. Done when every seam class has either yielded
   `file:line` evidence or been explicitly cleared.
3. **Gate** every candidate. Be ruthless.
4. **Report** in the format below. If nothing survives, say so — that's a good
   result.

## Required output format

### Part 1 — Opportunities table

One row per surviving suggestion, ordered by leverage:

| # | Location | Today | Purpose | Frequency | Suggested motion |
| --- | --- | --- | --- | --- | --- |
| 1 | `src/components/switch.tsx` | Thumb already eases | — | — | (example only) |

Every "Suggested motion" cell carries exact values — curve, duration,
properties — from `motion-system`. Animate `transform` and `opacity` only.
Include reduced-motion (`motion-safe:` / keep fade, drop slide) and
`@media (hover: hover) and (pointer: fine)` when the suggestion involves hover.

### Part 2 — Rejected candidates (REQUIRED)

List 2–5 places you considered and deliberately did **not** suggest, each with
the gate question that killed it.

### Part 3 — Verdict

One short paragraph: how much motion this surface actually needs, whether it's
already close, and which single suggestion has the highest leverage. Handoff:
implement with `motion-system`; then run `review-animations` on the diff.

## Related skills

- `motion-system` — decision framework, curves, durations (source of values)
- `review-animations` — review motion that already exists
- `curv-ui` — which page shell; not a motion skill
