import * as React from "react";
import { cn } from "../lib/cn";

/**
 * BarBreakdown — a ranked distribution (spend by channel, refunds by cause). The
 * proportion is a subtle fill BEHIND each row (the Vercel/Plausible top-list
 * pattern), so bar length, label, and value read as one line — clearer at a
 * glance than a thin bar stranded from its numbers. One neutral fill by default;
 * override a single row's `fillClassName` to flag a real exception (colour marks
 * meaning, not category — design-system.md).
 *
 * When a row is an *entity* (YouTube, a vendor, a person), pass `leading` — a
 * 16px favicon, logo, or avatar. Named causes stay text. The package does not
 * detect brands; the OS passes the mark.
 */
export interface BreakdownItem {
  label: React.ReactNode;
  value: number;
  /** 16px identity — favicon, logo, avatar. Omit on named causes. */
  leading?: React.ReactNode;
  /** Row-fill tint for a flagged exception, e.g. "bg-verdict-red/10". */
  fillClassName?: string;
  /** Optional trailing meta after the value (e.g. "$15K"). */
  meta?: React.ReactNode;
}

export interface BarBreakdownProps {
  items: BreakdownItem[];
  formatValue?: (n: number) => string;
  /** Show each row's share of the total as a %. */
  showPercent?: boolean;
  /** Fill-scale reference; defaults to the largest item's value. */
  max?: number;
  /** Column headers — label the numbers ("Refunds", "$"). Renders a header row
   *  when `valueLabel` is set; the % column header defaults to "Share". */
  valueLabel?: string;
  percentLabel?: string;
  metaLabel?: string;
  className?: string;
}

export function BarBreakdown({
  items,
  formatValue = (n) => String(n),
  showPercent = true,
  max,
  valueLabel,
  percentLabel = "Share",
  metaLabel,
  className,
}: BarBreakdownProps) {
  const scaleMax = max ?? Math.max(1, ...items.map((i) => i.value));
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  const hasMeta = metaLabel != null || items.some((i) => i.meta != null);
  const hasLeading = items.some((i) => i.leading != null);

  return (
    <div className={cn("flex flex-col", className)}>
      {valueLabel != null && (
        <div className="flex items-center gap-3 border-b border-border px-2.5 pb-1.5 text-[11px] font-medium text-muted-foreground">
          <span className="min-w-0 flex-1" />
          <span className="w-16 shrink-0 text-right">{valueLabel}</span>
          {showPercent && <span className="w-12 shrink-0 text-right">{percentLabel}</span>}
          {hasMeta && <span className="w-16 shrink-0 text-right">{metaLabel}</span>}
        </div>
      )}
      {items.map((item, i) => (
        <div key={i} className="relative flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px]">
          {/* proportional fill behind the whole row */}
          <div
            aria-hidden
            className={cn("pointer-events-none absolute inset-y-0.5 left-0 rounded-md", item.fillClassName ?? "bg-foreground/[0.07]")}
            style={{ width: `${Math.max(2, Math.min(100, (item.value / scaleMax) * 100))}%` }}
          />
          <span className="relative z-[1] flex min-w-0 flex-1 items-center gap-2">
            {hasLeading ? (
              <span className="grid size-4 shrink-0 place-items-center">{item.leading}</span>
            ) : null}
            <span className="min-w-0 truncate text-foreground">{item.label}</span>
          </span>
          <span className="relative z-[1] w-16 shrink-0 text-right font-medium tabular-nums text-foreground">{formatValue(item.value)}</span>
          {showPercent && (
            <span className="relative z-[1] w-12 shrink-0 text-right tabular-nums text-muted-foreground">
              {Math.round((item.value / total) * 100)}%
            </span>
          )}
          {hasMeta ? <span className="relative z-[1] w-16 shrink-0 text-right tabular-nums text-muted-foreground">{item.meta}</span> : null}
        </div>
      ))}
    </div>
  );
}
