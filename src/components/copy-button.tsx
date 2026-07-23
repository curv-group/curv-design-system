"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { Tooltip } from "./tooltip";

/**
 * CopyButton — copy-to-clipboard with ✓ feedback. For IDENTIFIERS and shareable
 * artifacts only (order/quote #s, SKUs, links) — never names, money, statuses,
 * or free text (design-system.md → copy affordance rule). Usually paired with
 * `group/copy` on the parent so it reveals on hover and stays out of the way.
 */
export interface CopyButtonProps {
  /** The text copied to the clipboard. */
  value: string;
  /** Accessible name; defaults to "Copy". */
  label?: string;
  /** Reveal on parent hover: requires `group/copy` on the parent element. */
  revealOnHover?: boolean;
  className?: string;
}

export function CopyButton({ value, label = "Copy", revealOnHover = false, className }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — silently no-op */
    }
  };

  return (
    <Tooltip content={copied ? "Copied" : label}>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : label}
        className={cn(
          // relative z-[2]: above a table row's stretched link (z-[1]) for
          // clicks, below sticky cells (z-10) so the frozen column masks it.
          "relative z-[2] inline-flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground/70 transition-[color,opacity] hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20",
          revealOnHover &&
            "opacity-0 focus-visible:opacity-100 group-hover/copy:opacity-100",
          copied && "text-verdict-green hover:text-verdict-green opacity-100",
          className,
        )}
      >
        {copied ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        )}
      </button>
    </Tooltip>
  );
}
