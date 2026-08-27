/**
 * Origin-aware overlay enter/exit — the one recipe for menus, selects,
 * popovers, and tooltips. 150ms in / 100ms out, scale(0.95)+opacity, the
 * motion-system ease-out curve. `motion-safe:` keeps the fade and drops the
 * scale when the user prefers reduced motion. Never `scale(0)`.
 *
 * Chrome (radius, padding, shadow) stays on the component. This is motion only.
 */
export const overlayPopupMotion =
  "origin-[var(--transform-origin)] transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-[ending-style]:duration-100 motion-safe:data-[starting-style]:scale-95 motion-safe:data-[ending-style]:scale-95";
