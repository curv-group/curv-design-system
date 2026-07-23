"use client";

import * as React from "react";
import { SegmentedControl } from "../segmented-control";

// Inline glyphs — the shell never forces an icon-library dependency on consumers.
function Sun() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}
function Moon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/**
 * ThemeToggle — the Light/Dark segmented toggle every OS puts in its account
 * menu. Deliberately controlled + callback-driven (`value` + `onValueChange`)
 * so it stays decoupled from any theme library — the app wires it to
 * next-themes (or whatever it uses); the design system owns only the look.
 */
export interface ThemeToggleProps {
  value: "light" | "dark";
  onValueChange: (value: "light" | "dark") => void;
  /** `sm` (32px, card/menu) — default here — or `default` (36px toolbar). */
  size?: "sm" | "default";
  className?: string;
}

export function ThemeToggle({ value, onValueChange, size = "sm", className }: ThemeToggleProps) {
  return (
    <SegmentedControl
      aria-label="Theme"
      size={size}
      value={value}
      onValueChange={(v) => onValueChange(v as "light" | "dark")}
      className={className}
      items={[
        { value: "light", label: (<><Sun /> Light</>) },
        { value: "dark", label: (<><Moon /> Dark</>) },
      ]}
    />
  );
}
