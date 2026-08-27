---
name: review-animations
description: >-
  Review animation and motion code against the Curv motion bar (motion-system /
  Emil Kowalski's craft rules). Default to flagging; approval is earned. Use
  when asked to review animations, transitions, micro-interactions, or a motion
  diff. Does not implement, and does not review non-motion code.
---

# Reviewing Animations

A specialized review skill. It does ONE thing: review animation and motion code
against the Curv craft bar. It does not write features, fix unrelated bugs, or
review non-motion code. If asked to review general UI, decline and point to
taste review / `curv-ui`.

Values (curves, durations, reduced-motion) live in `motion-system`. Cite those
instead of approximating. Do not invent a parallel scale.

## Operating posture

Bias toward **motion that feels right**, not motion that merely runs. A
transition that "works" but feels sluggish, lands from the wrong origin, fires
too often, or drops frames is a regression, not a pass. Default to flagging.
Approval is earned.

Personality: Curv OS is a professional ops tool — crisp and fast, never bouncy
or playful. When unsure whether motion feels right, the strongest move is often
to delete it.

## The ten non-negotiable standards

Every animation in the diff is measured against these. A violation is a finding.

1. **Justified motion.** Must answer why — spatial consistency, state
   indication, feedback, or preventing a jarring change. "It looks cool" on a
   frequently-seen element is a block.
2. **Frequency-appropriate.** Keyboard-initiated and 100+/day actions get **no**
   animation (⌘K, DataTable keyboard rows, shortcuts). Tens/day: near-zero.
   Occasional: standard. Rare: delight only.
3. **Responsive easing.** Enter/exit use `--ease-out`
   (`cubic-bezier(0.23, 1, 0.32, 1)`). Drawers use `--ease-drawer`
   (`cubic-bezier(0.32, 0.72, 0, 1)`). `ease-in` on UI is a block. Built-in CSS
   easings are too weak.
4. **Sub-300ms UI.** Exit faster than enter. Press 100–160ms; tooltips/popovers
   125–200ms; dropdowns 150–250ms; drawers/modals ~200ms enter, ~150ms exit.
5. **Origin & physical correctness.** Popovers/menus/selects/tooltips scale from
   the trigger (Base UI `var(--transform-origin)`), not center. Never
   `scale(0)` — start from `scale(0.95)` + opacity. Modals stay centered.
6. **Interruptibility.** Toasts, toggles, rapid adds: CSS transitions (or
   springs for gestures), not keyframes that restart from zero.
7. **GPU-only properties.** Animate `transform` and `opacity` only. Layout
   properties (`width`/`height`/`margin`/`padding`/`top`/`left`) are a
   performance finding — **except** AppFrame's `--curv-drawer-gutter-*` padding,
   which is the known page-narrows exception. Don't "fix" that to transform.
8. **Accessibility.** `prefers-reduced-motion` / `motion-safe:` — keep fade,
   drop movement. Hover motion gated behind `@media (hover: hover) and
   (pointer: fine)`.
9. **Asymmetric enter/exit.** Deliberate actions can be slower; system responses
   snap. Drawer/dialog already exit faster than they enter.
10. **Cohesion.** Match the rest of the product. Bounce, springs on charts, and
    staggered table filters are a personality mismatch.

## Aggressive escalation triggers

Flag these on sight, hard:

- `transition: all`
- `scale(0)` or pure-fade entrance with no initial transform (overlays)
- `ease-in` on any UI interaction; weak built-in easing on a deliberate animation
- Animation on ⌘K, a keyboard shortcut, or 100+/day action
- UI duration > 300ms with no stated reason
- `transform-origin: center` on a trigger-anchored popover/menu/tooltip
- Keyframes on toasts, toggles, or anything added rapidly
- Animating layout properties (see the AppFrame gutter exception above)
- Motion-library `x`/`y`/`scale` shorthands under load
- Updating a CSS variable on a parent to drive a child transform
- Missing reduced-motion handling on movement
- Ungated `:hover` motion
- Symmetric enter/exit on press-and-release
- Everything-at-once entrance where a 30–80ms stagger belongs (and only then on
  occasional surfaces — not DataTable refresh)

## Remedial preference hierarchy

When proposing fixes, prefer earlier moves:

1. **Delete** the animation (high-frequency / no purpose / keyboard).
2. **Reduce** it — shorter, smaller transform, fewer properties.
3. **Fix the easing** — `ease-out` / custom curve from `motion-system`.
4. **Fix origin/physicality** — trigger origin; `scale(0.95)` + opacity.
5. **Make it interruptible** — keyframes → transitions.
6. **Move it to the GPU** — layout props → `transform`/`opacity`.
7. **Asymmetric timing** — faster exit.
8. **Polish** — stagger only for occasional group entrances.
9. **Accessibility** — reduced-motion + hover gating.

## Required output format

Two parts, in this order.

### Part 1 — Findings table (REQUIRED)

A single markdown table. One row per issue. Never a "Before:/After:" list.

| Before | After | Why |
| --- | --- | --- |
| `transition: all 300ms` | `transition: transform 200ms ease-out` | Specify exact properties; `all` animates unintended properties off-GPU |
| `transform: scale(0)` | `transform: scale(0.95); opacity: 0` | Nothing appears from nothing |
| `ease-in` on dropdown | `--ease-out` (`cubic-bezier(0.23, 1, 0.32, 1)`) | `ease-in` delays the moment the user watches most |
| `transform-origin: center` on popover | `var(--transform-origin)` (Base UI) | Popovers scale from their trigger (modals exempt) |

If there are no findings, say so in one row: `— | — | No motion issues in this diff.`

### Part 2 — Verdict (REQUIRED)

Group remaining commentary by impact tier, highest first. Omit empty tiers.

1. **Feel-breaking regressions**
2. **Missed simplifications** (should be removed or reduced)
3. **Performance**
4. **Interruptibility & timing**
5. **Origin, physicality & cohesion**
6. **Accessibility**

Close with an explicit decision:

- **Block** — any feel-breaking regression, animation on keyboard/high-frequency
  actions, `scale(0)` / `ease-in` on UI, or a non-GPU animation with an easy
  GPU fix.
- **Approve** — no feel-breaking regressions, no obvious motion that should be
  deleted, durations and easing within bounds, interruptibility handled,
  reduced-motion respected.

Cite `file:line`. Pull exact curves and durations from `motion-system`.

## Related skills

- `motion-system` — source of curves, durations, and the decision framework
- `find-animation-opportunities` — hunt for missing motion (read-only, not this)
- `curv-ui` — page shells; not a motion review
