---
name: motion-system
description: Motion, interaction, and component-polish rules for Customs OS. Consult this whenever writing or reviewing animation, transitions, hover/press states, drag interactions, or any interactive micro-detail. This is the detailed implementation layer for the motion rules in DESIGN_SYSTEM.md — DESIGN_SYSTEM.md's duration/easing values are the floor; this file is the decision framework for applying them correctly to a specific component.
---

# Motion System — Interaction & Animation Detail

This file governs *how* to implement the motion principles in DESIGN_SYSTEM.md,
not whether to use them. DESIGN_SYSTEM.md says "120–300ms, ease-out on enter,
never decorative" — this file is the reasoning process for applying that
correctly to a specific button, popover, toast, or drag interaction.

## Core Philosophy

Most polish is invisible. Users never consciously notice correct easing or a
correct transform-origin — they just feel like the software "works right."
That aggregate of invisible correctness is the goal, not individual flourishes
users will consciously admire. When in doubt, remove the animation rather than
add one — restraint is the default in a dense, power-user product like this.

## Required Review Format

When reviewing UI code for polish issues, output a single markdown table —
**never** a list with "Before:" / "After:" on separate lines:

| Before | After | Why |
| --- | --- | --- |
| `transition: all 300ms` | `transition: transform 200ms ease-out` | Specify exact properties; avoid `all` |
| `transform: scale(0)` | `transform: scale(0.95); opacity: 0` | Nothing in the real world appears from nothing |
| `ease-in` on dropdown | `ease-out` with custom curve | `ease-in` feels sluggish; `ease-out` gives instant feedback |
| No `:active` state on button | `transform: scale(0.97)` on `:active` | Buttons must feel responsive to press |
| `transform-origin: center` on popover | `var(--radix-popover-content-transform-origin)` | Popovers scale from their trigger, not center (modals are the exception — stay centered) |

## The Animation Decision Framework

Answer these in order before writing any animation:

### 1. Should this animate at all?

| Frequency | Decision |
| --- | --- |
| 100+ times/day (keyboard shortcuts, ⌘K palette) | No animation. Ever. |
| Tens of times/day (hover, list navigation) | Remove or drastically reduce |
| Occasional (modals, drawers, toasts) | Standard animation |
| Rare/first-time (onboarding, empty-state illustrations) | Can add delight |

**Never animate keyboard-initiated actions.** In Customs OS this means: the ⌘K
command palette open/close, keyboard-driven row selection in the Pipeline/Deals
table, and keyboard shortcuts anywhere — these fire hundreds of times a day per
AE, and animation makes them feel laggy, not polished.

### 2. What is the purpose?

Every animation needs a real answer to "why does this animate?" — spatial
consistency, state indication, feedback, or preventing a jarring pop-in/out.
If the honest answer is "it looks cool" and it's seen often, don't animate.

### 3. What easing?

- Entering/exiting → `ease-out`
- Moving/morphing on screen → `ease-in-out`
- Hover/color change → `ease`
- Constant motion (progress bar, marquee) → `linear`
- Default when unsure → `ease-out`

**Never use `ease-in`** on UI elements — it delays the initial movement exactly
when the user is watching most closely, making identical durations feel slower.

Use custom cubic-bezier curves, not default CSS easings (which are too weak):

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);      /* strong ease-out, UI interactions */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* on-screen movement */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);   /* drawer / sheet curve */
```

### 4. How fast?

| Element | Duration |
| --- | --- |
| Button press feedback | 100–160ms |
| Tooltips, small popovers | 125–200ms |
| Dropdowns, selects | 150–250ms |
| Modals, drawers | 200–500ms |

Stay under 300ms for anything functional — a 180ms dropdown feels more
responsive than a 400ms one at the same interaction. A faster-spinning spinner
makes load *feel* faster even at identical load time.

## Springs

Use spring physics (not fixed duration) for: drag with momentum, elements that
should feel "alive," gestures interruptible mid-motion, decorative
mouse-tracking. Don't use springs for functional data UI (e.g. a P&L chart) —
decoration helps in some contexts, hinders in others.

- Simple config (easier to reason about): `{ type: "spring", duration: 0.5, bounce: 0.2 }`
- Full physics control: `{ type: "spring", mass: 1, stiffness: 100, damping: 10 }`
- Keep bounce subtle (0.1–0.3); avoid bounce in dense/professional UI entirely — Customs OS is a financial/ops tool, motion should read as crisp and fast, never bouncy or playful
- Springs maintain velocity when interrupted (CSS keyframes restart from zero) — use springs for anything a user might reverse mid-animation (e.g. quickly pressing Escape on an expanding row)

## Component-Level Rules

**Buttons must feel pressed.** `transform: scale(0.97)` on `:active`,
`transition: transform 160ms ease-out`. Subtle range: 0.95–0.98.

**Never animate entry from `scale(0)`.** Start at `scale(0.95)` + `opacity: 0`
— nothing in the real world pops from nothing.

**Popovers are origin-aware; modals are not.** Popovers/dropdowns scale in from
their trigger point (`transform-origin: var(--radix-popover-content-transform-origin)`
or equivalent). Modals stay `transform-origin: center` since they're not
anchored to a trigger.

**Tooltips skip delay after the first.** Initial hover delay prevents
accidental triggers, but once one tooltip is open, adjacent tooltips (e.g.
scanning a row of icon buttons) should open instantly with `transition-duration: 0ms`.

**Use CSS transitions, not keyframes, for rapidly-triggered UI** (toasts,
row-add, badge updates). Keyframes restart from zero on interruption;
transitions retarget smoothly mid-flight — critical for anything in the Deals
table that updates on poll/refresh.

**Blur can mask an imperfect crossfade.** If two states swapping (e.g. a
metric updating) looks like two overlapping objects rather than one smooth
change, add `filter: blur(2px)` during the transition, paired with the
opacity dip. Keep blur ≤20px — expensive, especially in Safari.

**Prefer `@starting-style` over the `useEffect` mount-flag pattern** for
entry animations, where browser support allows; fall back to a `data-mounted`
attribute otherwise.

## CSS Transform & clip-path Notes

- `translateY(100%)` moves an element by its own height regardless of actual size — prefer percentage transforms over hardcoded px for drawers/toasts.
- `scale()` scales children too (font, icons) — this is usually what you want for a pressed button.
- `clip-path: inset(...)` is a powerful, hardware-accelerated animation primitive — useful for reveal-on-scroll, hold-to-press patterns, and comparison sliders, not just static shapes.
- **Asymmetric press/release timing:** slow + linear while a user is deciding (e.g. hold-to-delete, 2s), fast + ease-out on release/completion (200ms) — deliberate actions should feel deliberate, system responses should feel instant.

## Gesture & Drag (relevant if/when CS Board or any drag UI ships)

- Dismiss on velocity, not just distance: if `Math.abs(dragDistance) / elapsedTime > ~0.11`, dismiss even if the drag distance was short — a quick flick should register.
- Apply damping at drag boundaries (diminishing movement past a natural limit) rather than a hard stop — nothing in real life stops instantly.
- Capture pointer events once a drag starts; ignore additional touch points after the drag begins (prevents finger-swap jumps).

## Performance Rules

- **Only animate `transform` and `opacity`** — these skip layout/paint and run on the GPU. Animating `padding`, `margin`, `width`, `height` triggers full layout recalculation and will visibly stutter in a dense table.
- **Pause looping / ambient animations when they're off-screen or the tab is hidden** (`IntersectionObserver` + `visibilitychange`). A spinner or marquee scrolled out of view or in a background tab burns CPU and battery for nothing.
- **CSS animations beat JS under load.** CSS runs off the main thread; JS-driven animation (via `requestAnimationFrame`) drops frames when the browser is busy (e.g. navigating between Pipeline and Deals). Use CSS for predetermined animations, JS/springs only for dynamic/interruptible ones.
- **Motion library shorthand props (`x`/`y`/`scale`) are NOT hardware-accelerated** in some libraries — they run on the main thread. Use the full `transform` string (`transform: "translateX(100px)"`) for anything that must stay smooth during heavy loads.
- CSS variables inherit and recalculate style on all children when changed on a parent — for anything with many child rows (a table), update `transform` directly on the moving element, not a shared CSS variable on the container.

## Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  .element { animation: fade 0.2s ease; } /* keep opacity/color, drop transform-based motion */
}
```

```css
@media (hover: hover) and (pointer: fine) {
  .element:hover { transform: scale(1.05); } /* gate hover animation — touch devices false-trigger hover on tap */
}
```

## Stagger

When multiple elements enter together (e.g. a freshly filtered table's rows,
a Leaderboard reshuffling), stagger entry with 30–80ms between items — longer
delays read as slow. Stagger is decorative: never block interaction while it plays.

## Principles for Building Reusable Components

When building any shared interactive component (toast/notification system,
custom dropdown, drawer):

1. Good defaults matter more than options — most consumers of the component never customize; the shipped default must already be right.
2. Handle edge cases invisibly (pause a toast timer on a hidden tab, capture pointer events mid-drag) — the person using it should never notice the edge case was handled, that's the point.
3. Use transitions, not keyframes, for anything added rapidly (toast stacks, live-updating rows).
4. Match motion personality to the product: Customs OS is a professional financial/ops tool — motion should read as crisp and fast, never bouncy or playful. Reserve spring bounce for genuinely decorative, non-data contexts only.
5. Review animations the next day with fresh eyes, and in slow motion / frame-by-frame (Chrome DevTools Animation panel) — timing issues are often invisible at full speed.

## Related skills (keep separate)

Do not merge these into this file. Load the one that matches the job:

- `find-animation-opportunities` — sweep for missing motion; also lists what
  not to animate. Read-only.
- `review-animations` — review motion that already exists in a diff or component.

## Review Checklist

| Issue | Fix |
| --- | --- |
| `transition: all` | Specify exact properties: `transition: transform 200ms ease-out` |
| `scale(0)` entry animation | Start from `scale(0.95)` with `opacity: 0` |
| `ease-in` on a UI element | Switch to `ease-out` or a custom curve |
| `transform-origin: center` on a popover | Set to trigger location / Radix variable (modals are exempt) |
| Animation on a keyboard-triggered action | Remove entirely |
| Duration > 300ms on a functional element | Reduce to 150–250ms |
| Hover animation with no media query | Add `@media (hover: hover) and (pointer: fine)` |
| Keyframes on a rapidly-triggered element | Switch to CSS transitions |
| Motion library `x`/`y`/`scale` shorthand under load | Use `transform: "translateX()"` string form |
| Enter and exit using the same speed | Make exit faster than enter |
| Multiple elements appearing at once | Add 30–80ms stagger |
