"use client";

import * as React from "react";
import { cn } from "../lib/cn";

/**
 * LineChart — the reporting trend primitive. One accent series, optional
 * muted/dashed comparison and dotted partial-period series (design-system.md →
 * Charts). The y-axis is capped to a few "nice-number" gridlines (the Shopify
 * rule) so it never clutters, whatever the data range. Responsive; no tooltip
 * layer yet (a follow-up).
 */
export interface ChartSeries {
  data: number[];
  label?: string;
  /** solid = current, dashed = comparison, dotted = partial/projected. */
  variant?: "solid" | "dashed" | "dotted";
  /**
   * Draw solid up to this index, then dashed after it — the "actual so far,
   * projected/partial rest" line (your Customs OS revenue chart). Overrides
   * `variant` for the split. The join index is drawn in both segments so the
   * line stays continuous.
   */
  partialFrom?: number;
  /**
   * Marks this as the comparison/baseline period (the prior window you measure
   * against). By convention it renders muted + dashed in the `chart-prev` hue
   * (override with `variant`/`className`), and it becomes the baseline for the
   * tooltip's signed "% from comparison" delta. Flag exactly one series.
   */
  comparison?: boolean;
  /**
   * Per-point labels for THIS series, shown in the tooltip row instead of the
   * shared x-axis label — so a comparison series can show its OWN dates (the
   * Shopify hover: current point "20 Jul 2026", comparison point "20 Jul 2025").
   * Length should match `data`. Only used by the `tooltipTitle` tooltip layout.
   */
  pointLabels?: string[];
  /**
   * Which Y-axis this series is measured against — "left" (default) or "right".
   * Use a right axis to overlay a different-unit metric (e.g. visitors on the
   * left count axis, conversion rate on the right % axis). Only two axes exist;
   * group all same-unit series onto the same side.
   */
  axis?: "left" | "right";
  /**
   * Per-series sentiment for the tooltip's "% from comparison" delta, overriding
   * the chart-level `deltaTone` — so an overlay can colour a rise in conversion
   * green while a rise in CPL reads red. Falls back to the chart's `deltaTone`.
   */
  deltaTone?: "up-positive" | "down-positive" | "neutral";
  /**
   * Groups a metric's current + comparison series (same `group` id) so the
   * `focusMode` hover can reveal a metric's comparison and fade the rest.
   * Also the unit key for the tooltip. Defaults to `label`.
   */
  group?: string;
  /** Line colour via a `text-*` class (defaults to the chart accent token). */
  className?: string;
}

export interface LineChartProps {
  series: ChartSeries[];
  /** X-axis category labels (e.g. months); length should match series data. */
  xLabels: string[];
  height?: number;
  /** Fill under the first series. */
  area?: boolean;
  /** Format y-axis tick values (e.g. compact currency). */
  formatY?: (n: number) => string;
  /** Format values in the hover tooltip (defaults to `formatY`). */
  formatTooltip?: (n: number) => string;
  /** Format the RIGHT y-axis ticks (when any series has `axis: "right"`). */
  formatYRight?: (n: number) => string;
  /** Format the right-axis series' tooltip values (defaults to `formatTooltip`). */
  formatTooltipRight?: (n: number) => string;
  /**
   * Overlay/focus mode for multi-metric charts. When true: comparison series
   * are hidden by default and only the current lines show; hovering focuses the
   * nearest metric — its line stays solid, the others fade, and that metric's
   * comparison line is revealed (dashed). The tooltip shows the focused metric.
   * When false (default), every series (including comparisons) is always drawn.
   */
  focusMode?: boolean;
  /**
   * Tooltip title (e.g. the metric name — "Conversion rate"). When set, the
   * tooltip renders the Shopify period-over-period layout: the title, then each
   * series as its own date (from `series.pointLabels`, falling back to the
   * x-label) + value chip, with the "% from comparison" delta under the current
   * series. When omitted, the tooltip keeps the compact label→value layout.
   */
  tooltipTitle?: string;
  /** Hover crosshair + per-series dots + shared tooltip (on by default). */
  interactive?: boolean;
  /**
   * Colour of the tooltip's "% from comparison" delta when a `comparison`
   * series is present. "up-positive" (default): a rise is green (conversion,
   * revenue). "down-positive": a fall is green (CPL, CPA, cost). "neutral": no
   * colour. The arrow always points the literal direction — only the sentiment
   * (colour) flips.
   */
  deltaTone?: "up-positive" | "down-positive" | "neutral";
  /**
   * Y-axis baseline. "zero" (default) is the honest baseline — use it when
   * magnitude matters or values approach zero. "auto" starts the axis just
   * below the data's minimum so variation in large, clustered values (revenue
   * that lives at $2M–$3M) is visible instead of squashed flat. Never use a
   * non-zero baseline on a BarChart — a truncated bar lies.
   */
  yBaseline?: "zero" | "auto";
  /**
   * Hard cap on y-axis gridlines. Design rule: NEVER more than 5. 5 is the
   * target; when a clean coarser step covers the range in 3–4 lines, we take
   * that (never pad to 5). Default 5.
   */
  maxGridlines?: number;
  className?: string;
}

/**
 * Y-axis ticks on "nice" 1/2/2.5/5×10ⁿ steps, GUARANTEED ≤ maxCount lines
 * (picks the smallest clean step whose floored/ceiled range fits the cap — so
 * a clean range yields 3–4, a tight one lands at exactly 5, never 6+).
 */
function niceTicks(min: number, max: number, maxCount: number): number[] {
  if (max <= min) return [min];
  const span = max - min;
  const mag = Math.pow(10, Math.floor(Math.log10(span / Math.max(1, maxCount))));
  const steps = [1, 2, 2.5, 5, 10, 20, 25, 50, 100].map((m) => m * mag);
  let step = steps[steps.length - 1];
  for (const s of steps) {
    const lo = Math.floor(min / s) * s;
    const hi = Math.ceil(max / s) * s;
    if (Math.round((hi - lo) / s) + 1 <= maxCount) {
      step = s;
      break;
    }
  }
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = lo; v <= hi + step * 0.5; v += step) ticks.push(Number(v.toFixed(6)));
  return ticks;
}

// Restrained categorical series colours (accent → distinct hue → neutral grays).
// NEVER verdict red/green for a category — a red segment reads as "bad".
// Consumers override per series via `className`.
const CATEGORICAL = ["text-chart", "text-chart-compare", "text-chart-3", "text-chart-4", "text-chart-5"];
const catColor = (s: ChartSeries, i: number) => cn(s.className ?? CATEGORICAL[i % CATEGORICAL.length]);

// Rectangle with only the top two corners rounded (bars: rounded top, flat base).
function topRoundedRect(x: number, yTop: number, w: number, h: number, r: number): string {
  const rr = Math.max(0, Math.min(r, w / 2, h));
  const b = (yTop + h).toFixed(1);
  return `M${x},${b} L${x},${(yTop + rr).toFixed(1)} Q${x},${yTop} ${x + rr},${yTop} L${(x + w - rr).toFixed(1)},${yTop} Q${x + w},${yTop} ${x + w},${(yTop + rr).toFixed(1)} L${x + w},${b} Z`;
}

function useWidth() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

const DASH: Record<NonNullable<ChartSeries["variant"]>, string | undefined> = {
  solid: undefined,
  dashed: "5 4",
  dotted: "1 5",
};

// A comparison series styles itself — dashed, in the muted `chart-prev` hue —
// so a page only has to flag it, not restyle it on every chart. Explicit
// variant/className still win.
const seriesClass = (s: ChartSeries) => cn(s.className ?? (s.comparison ? "text-chart-prev" : "text-chart"));
const seriesVariant = (s: ChartSeries): NonNullable<ChartSeries["variant"]> => s.variant ?? (s.comparison ? "dashed" : "solid");

/** The Shopify-style "↑ 22.4% from comparison" line under a tooltip value. */
function TooltipDelta({ cur, base, tone }: { cur: number; base: number; tone: NonNullable<LineChartProps["deltaTone"]> }) {
  if (tone === "neutral" || base === 0) return null;
  const dir = cur > base ? "up" : cur < base ? "down" : "flat";
  const pct = Math.abs((cur - base) / base) * 100;
  const positive = dir === "flat" ? null : tone === "down-positive" ? dir === "down" : dir === "up";
  const color = positive == null ? "text-muted-foreground" : positive ? "text-verdict-green" : "text-verdict-red";
  return (
    <div className="flex items-center gap-1 pl-3.5 text-[11px]">
      <span className={cn("inline-flex items-center gap-0.5 font-medium tabular-nums", color)}>
        {dir === "flat" ? (
          <svg width="8" height="8" viewBox="0 0 12 12" fill="currentColor" aria-hidden><rect x="1.5" y="5.25" width="9" height="1.5" rx="0.75" /></svg>
        ) : (
          <svg width="8" height="8" viewBox="0 0 12 12" fill="currentColor" aria-hidden className={cn(dir === "down" && "rotate-180")}><path d="M6 2.5 10.5 9.5H1.5z" /></svg>
        )}
        {pct.toFixed(pct < 10 ? 1 : 0)}%
      </span>
      <span className="text-muted-foreground">from comparison</span>
    </div>
  );
}

export function LineChart({
  series,
  xLabels,
  height = 240,
  area = false,
  formatY = (n) => String(n),
  formatTooltip,
  formatYRight,
  formatTooltipRight,
  tooltipTitle,
  interactive = true,
  yBaseline = "zero",
  maxGridlines = 5,
  deltaTone = "up-positive",
  focusMode = false,
  className,
}: LineChartProps) {
  const [ref, width] = useWidth();
  const [active, setActive] = React.useState<number | null>(null);
  const [activeY, setActiveY] = React.useState(0);
  const fmtTip = formatTooltip ?? formatY;
  const fmtY2 = formatYRight ?? formatY;
  const fmtTip2 = formatTooltipRight ?? formatYRight ?? fmtTip;

  const isRight = (s: ChartSeries) => s.axis === "right";
  const groupOf = (s: ChartSeries) => s.group ?? s.label ?? "";

  const padL = 44;
  const padB = 22;
  const padT = 8;
  const hasRight = series.some(isRight);
  const padR = hasRight ? 46 : 8; // room for right-axis labels

  const innerW = Math.max(0, width - padL - padR);
  const innerH = Math.max(0, height - padT - padB);

  // Independent left/right scales. Left drives the gridlines; the right axis
  // reuses the SAME gridline pixels (same band count) so both labels align.
  const leftVals = series.filter((s) => !isRight(s)).flatMap((s) => s.data).filter((v) => v != null);
  const rightVals = series.filter(isRight).flatMap((s) => s.data).filter((v) => v != null);
  const leftMax = leftVals.length ? Math.max(...leftVals, 0) : 0;
  const leftMin = leftVals.length ? Math.min(...leftVals) : 0;
  const ticks = niceTicks(yBaseline === "auto" ? leftMin : 0, leftMax, maxGridlines);
  const yMin = ticks[0];
  const yMax = ticks[ticks.length - 1] || 1;
  const ySpan = yMax - yMin || 1;
  const rMax = (() => {
    const nice = niceTicks(0, rightVals.length ? Math.max(...rightVals, 0) : 0, maxGridlines);
    return nice[nice.length - 1] || 1;
  })();
  const k = ticks.length;
  const rightTicks = Array.from({ length: k }, (_, i) => (i / (k - 1 || 1)) * rMax);

  const n = xLabels.length;
  const x = (i: number) => padL + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const yL = (v: number) => padT + innerH - ((v - yMin) / ySpan) * innerH;
  const yR = (v: number) => padT + innerH - (v / (rMax || 1)) * innerH;
  const yFor = (s: ChartSeries, v: number) => (isRight(s) ? yR(v) : yL(v));

  // Null-safe path along a series over [from..to]; a gap starts a new subpath.
  const pathFor = (s: ChartSeries, from = 0, to = s.data.length - 1) => {
    let d = "";
    let pen = false;
    for (let i = Math.max(0, from); i <= Math.min(s.data.length - 1, to); i++) {
      const v = s.data[i];
      if (v == null) { pen = false; continue; }
      d += `${pen ? "L" : "M"}${x(i).toFixed(1)},${yFor(s, v).toFixed(1)}`;
      pen = true;
    }
    return d;
  };

  // Thin x labels so they never collide (~64px apart minimum).
  const labelStep = Math.max(1, Math.ceil((n * 64) / Math.max(1, innerW)));

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactive || n < 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const i = n <= 1 ? 0 : Math.max(0, Math.min(n - 1, Math.round((mx - padL) / (innerW / (n - 1)))));
    setActive(i);
    setActiveY(e.clientY - rect.top);
  };

  // focusMode: the current (non-comparison) line nearest the cursor is focused;
  // its comparison is revealed and the other metrics fade.
  const currents = series.filter((s) => !s.comparison);
  const focusGroup =
    focusMode && active != null
      ? currents.reduce<{ g: string; d: number } | null>((best, s) => {
          const v = s.data[active];
          if (v == null) return best;
          const dist = Math.abs(activeY - yFor(s, v));
          return best == null || dist < best.d ? { g: groupOf(s), d: dist } : best;
        }, null)?.g ?? null
      : null;

  // Which series are drawn, and the tooltip rows.
  const visible = (s: ChartSeries) =>
    !focusMode ? true : s.comparison ? focusGroup != null && groupOf(s) === focusGroup : true;
  const tipRows =
    active == null
      ? []
      : focusMode
        ? series.filter((s) => groupOf(s) === focusGroup && s.data[active] != null)
        : series.filter((s) => s.data[active] != null);
  const tipX = active != null ? x(active) : 0;
  const fmtRow = (s: ChartSeries, v: number) => (isRight(s) ? fmtTip2(v) : fmtTip(v));

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      {width > 0 && (
        <svg
          width={width}
          height={height}
          role="img"
          className="overflow-visible"
          onMouseMove={onMove}
          onMouseLeave={() => setActive(null)}
        >
          {/* gridlines + left y labels */}
          {ticks.map((t) => {
            const gy = yL(t);
            return (
              <g key={t}>
                <line x1={padL} x2={width - padR} y1={gy} y2={gy} className="stroke-border" strokeWidth={1} />
                <text x={padL - 8} y={gy} textAnchor="end" dominantBaseline="middle" className="fill-muted-foreground text-[10px] tabular-nums">
                  {formatY(t)}
                </text>
              </g>
            );
          })}

          {/* right y labels — aligned to the same gridlines */}
          {hasRight &&
            ticks.map((t, i) => (
              <text key={`r${i}`} x={width - padR + 6} y={yL(t)} textAnchor="start" dominantBaseline="middle" className="fill-muted-foreground text-[10px] tabular-nums">
                {fmtY2(rightTicks[i])}
              </text>
            ))}

          {/* x labels */}
          {xLabels.map((lbl, i) =>
            i % labelStep === 0 ? (
              <text key={i} x={x(i)} y={height - 6} textAnchor="middle" className="fill-muted-foreground text-[10px]">
                {lbl}
              </text>
            ) : null,
          )}

          {/* area under the first series */}
          {area && !focusMode && series[0] && series[0].data.length > 1 && (
            <path
              d={`${pathFor(series[0])} L${x(n - 1).toFixed(1)},${(padT + innerH).toFixed(1)} L${x(0).toFixed(1)},${(padT + innerH).toFixed(1)} Z`}
              className={cn("opacity-[0.10]", series[0].className ?? "text-chart")}
              fill="currentColor"
              stroke="none"
            />
          )}

          {/* series lines (comparison/partial under the primary; focused on top) */}
          {[...series]
            .map((s, i) => ({ s, i }))
            .filter(({ s }) => visible(s) && s.data.length >= 2)
            .sort((a, b) => Number(focusGroup != null && groupOf(a.s) === focusGroup) - Number(focusGroup != null && groupOf(b.s) === focusGroup))
            .map(({ s, i: ri }) => {
              const faded = focusMode && focusGroup != null && groupOf(s) !== focusGroup;
              const stroke = {
                className: cn(seriesClass(s), "transition-opacity duration-150", faded && "opacity-25"),
                fill: "none",
                stroke: "currentColor",
                strokeWidth: 1.75,
                strokeLinecap: "round" as const,
                strokeLinejoin: "round" as const,
                vectorEffect: "non-scaling-stroke" as const,
              };
              // Solid → dashed split at partialFrom (the "actual then projected" line).
              if (s.partialFrom != null && s.partialFrom > 0 && s.partialFrom < s.data.length - 1) {
                return (
                  <g key={ri}>
                    <path d={pathFor(s, 0, s.partialFrom)} {...stroke} />
                    <path d={pathFor(s, s.partialFrom, s.data.length - 1)} {...stroke} strokeDasharray="5 4" />
                  </g>
                );
              }
              return <path key={ri} d={pathFor(s)} {...stroke} strokeDasharray={DASH[seriesVariant(s)]} />;
            })}

          {/* hover crosshair + per-series dots (focused group in focusMode) */}
          {active != null && tipRows.length > 0 && (
            <g pointerEvents="none">
              <line x1={tipX} x2={tipX} y1={padT} y2={padT + innerH} className="stroke-border" strokeWidth={1} />
              {tipRows.map((s, si) => (
                <circle
                  key={si}
                  cx={tipX}
                  cy={yFor(s, s.data[active]!)}
                  r={3.5}
                  className={seriesClass(s)}
                  fill={s.comparison ? "var(--card)" : "currentColor"}
                  stroke={s.comparison ? "currentColor" : "var(--card)"}
                  strokeWidth={2}
                />
              ))}
            </g>
          )}
        </svg>
      )}

      {/* shared tooltip: x-label + each series value */}
      {active != null && tipRows.length > 0 && (
        <div
          className="pointer-events-none absolute top-1 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-popover px-2.5 py-2 text-[12px] text-popover-foreground shadow-lg"
          style={{ left: Math.max(70, Math.min(width - 70, tipX)) }}
        >
          {tooltipTitle != null || focusMode ? (
            /* Shopify period-over-period layout: metric title, then each series
               as its own date + value chip, with the delta under the current.
               In focusMode the title is the focused metric's own label. */
            <>
              <div className="mb-1.5 font-medium text-foreground">
                {focusMode ? (tipRows.find((r) => !r.comparison)?.label ?? tooltipTitle) : tooltipTitle}
              </div>
              <div className="flex flex-col gap-2">
                {tipRows.map((s, si) => {
                  const cmp = tipRows.find((c) => c.comparison && c.data[active!] != null);
                  const showDelta = !s.comparison && cmp != null && cmp.data[active!] !== 0;
                  const dateLabel = s.pointLabels?.[active] ?? xLabels[active];
                  return (
                    <div key={si} className="flex flex-col gap-1">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span
                          className={cn(
                            "size-2 shrink-0 rounded-full",
                            s.comparison ? "border-[1.5px] border-current" : "bg-current",
                            seriesClass(s),
                          )}
                        />
                        {dateLabel}
                      </span>
                      <span className="w-fit rounded-md bg-muted px-1.5 py-0.5 font-medium tabular-nums text-foreground">
                        {fmtRow(s, s.data[active]!)}
                      </span>
                      {showDelta && <TooltipDelta cur={s.data[active]!} base={cmp!.data[active!]!} tone={s.deltaTone ?? deltaTone} />}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="mb-1 font-medium text-foreground">{xLabels[active]}</div>
              <div className="flex flex-col gap-1.5">
                {tipRows.map((s, si) => {
                  const cmp = tipRows.find((c) => c.comparison && c.data[active!] != null);
                  const showDelta = !s.comparison && cmp != null && cmp.data[active!] !== 0;
                  return (
                    <div key={si} className="flex flex-col gap-0.5">
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <span
                            className={cn(
                              "size-2 shrink-0 rounded-full",
                              s.comparison ? "border-[1.5px] border-current" : "bg-current",
                              seriesClass(s),
                            )}
                          />
                          {s.label ?? "Value"}
                        </span>
                        <span className="font-medium tabular-nums text-foreground">{fmtRow(s, s.data[active]!)}</span>
                      </div>
                      {showDelta && <TooltipDelta cur={s.data[active]!} base={cmp!.data[active!]!} tone={s.deltaTone ?? deltaTone} />}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * BarChart — stacked (default) or grouped vertical bars, same reporting language
 * as LineChart: nice-number y-axis cap, hover column highlight + shared tooltip
 * (per-series values + total). Colour each series with a `text-*` class.
 */
export interface BarChartProps {
  series: ChartSeries[];
  xLabels: string[];
  height?: number;
  formatY?: (n: number) => string;
  formatTooltip?: (n: number) => string;
  /** Stack series into one bar (default) or place them side by side. */
  stacked?: boolean;
  interactive?: boolean;
  maxGridlines?: number;
  className?: string;
}

export function BarChart({
  series,
  xLabels,
  height = 240,
  formatY = (n) => String(n),
  formatTooltip,
  stacked = true,
  interactive = true,
  maxGridlines = 5,
  className,
}: BarChartProps) {
  const [ref, width] = useWidth();
  const [active, setActive] = React.useState<number | null>(null);
  const fmtTip = formatTooltip ?? formatY;

  const padL = 44;
  const padB = 22;
  const padT = 8;
  const padR = 8;
  const innerW = Math.max(0, width - padL - padR);
  const innerH = Math.max(0, height - padT - padB);
  const n = xLabels.length;

  const totals = xLabels.map((_, i) => series.reduce((s, ser) => s + (ser.data[i] ?? 0), 0));
  const dataMax = stacked ? Math.max(0, ...totals) : Math.max(0, ...series.flatMap((s) => s.data));
  const ticks = niceTicks(0, dataMax, maxGridlines);
  const yMax = ticks[ticks.length - 1] || 1;
  const y = (v: number) => padT + innerH - (v / yMax) * innerH;

  const band = n > 0 ? innerW / n : innerW;
  const barW = Math.min(40, band * 0.62);
  const cx = (i: number) => padL + (i + 0.5) * band;
  const labelStep = Math.max(1, Math.ceil((n * 64) / Math.max(1, innerW)));

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactive || n < 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.max(0, Math.min(n - 1, Math.floor((e.clientX - rect.left - padL) / band)));
    setActive(i);
  };

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      {width > 0 && (
        <svg
          width={width}
          height={height}
          role="img"
          className="overflow-visible"
          onMouseMove={onMove}
          onMouseLeave={() => setActive(null)}
        >
          {ticks.map((t) => {
            const gy = y(t);
            return (
              <g key={t}>
                <line x1={padL} x2={width - padR} y1={gy} y2={gy} className="stroke-border" strokeWidth={1} />
                <text x={padL - 8} y={gy} textAnchor="end" dominantBaseline="middle" className="fill-muted-foreground text-[10px] tabular-nums">
                  {formatY(t)}
                </text>
              </g>
            );
          })}

          {active != null && (
            <rect x={cx(active) - band / 2} y={padT} width={band} height={innerH} className="fill-muted/60" pointerEvents="none" />
          )}

          {xLabels.map((lbl, i) =>
            i % labelStep === 0 ? (
              <text key={i} x={cx(i)} y={height - 6} textAnchor="middle" className="fill-muted-foreground text-[10px]">
                {lbl}
              </text>
            ) : null,
          )}

          {xLabels.map((_, i) => {
            if (stacked) {
              // The topmost non-zero segment gets the rounded top.
              let topIdx = -1;
              for (let si = 0; si < series.length; si++) if ((series[si].data[i] ?? 0) > 0) topIdx = si;
              let acc = 0;
              return (
                <g key={i}>
                  {series.map((s, si) => {
                    const v = s.data[i] ?? 0;
                    const y0 = y(acc);
                    const y1 = y(acc + v);
                    acc += v;
                    const h = Math.max(0, y0 - y1);
                    if (h <= 0) return null;
                    const bx = cx(i) - barW / 2;
                    return si === topIdx ? (
                      <path key={si} d={topRoundedRect(bx, y1, barW, h, 3)} className={catColor(s, si)} fill="currentColor" />
                    ) : (
                      <rect key={si} x={bx} y={y1} width={barW} height={h} className={catColor(s, si)} fill="currentColor" />
                    );
                  })}
                </g>
              );
            }
            const sub = barW / Math.max(1, series.length);
            return (
              <g key={i}>
                {series.map((s, si) => {
                  const v = s.data[i] ?? 0;
                  const y1 = y(v);
                  const h = Math.max(0, padT + innerH - y1);
                  return h > 0 ? (
                    <path key={si} d={topRoundedRect(cx(i) - barW / 2 + si * sub, y1, Math.max(1, sub - 1), h, 2)} className={catColor(s, si)} fill="currentColor" />
                  ) : null;
                })}
              </g>
            );
          })}
        </svg>
      )}

      {active != null && (
        <div
          className="pointer-events-none absolute top-1 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-popover px-2.5 py-2 text-[12px] text-popover-foreground shadow-lg"
          style={{ left: Math.max(70, Math.min(width - 70, cx(active))) }}
        >
          <div className="mb-1 font-medium text-foreground">{xLabels[active]}</div>
          <div className="flex flex-col gap-1">
            {series.map((s, si) => (
              <div key={si} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className={cn("size-2 shrink-0 rounded-[3px] bg-current", catColor(s, si))} />
                  {s.label ?? "Value"}
                </span>
                <span className="font-medium tabular-nums text-foreground">{fmtTip(s.data[active] ?? 0)}</span>
              </div>
            ))}
            {stacked && series.length > 1 && (
              <div className="mt-0.5 flex items-center justify-between gap-4 border-t border-border pt-1">
                <span className="text-muted-foreground">Total</span>
                <span className="font-medium tabular-nums text-foreground">{fmtTip(totals[active])}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
