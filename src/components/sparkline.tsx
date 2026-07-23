import * as React from "react";
import { cn } from "../lib/cn";

/**
 * Sparkline — a tiny trend line, no axes, one color (inherits `currentColor`).
 * Per design-system.md: line-only, neutral by default, never red/green — it
 * shows direction at a glance, not a verdict. Set color with a `text-*` class.
 *
 * <Sparkline data={[3,5,4,8,7,9]} className="text-chart" />
 */
export interface SparklineProps {
  data: number[];
  variant?: "line" | "area";
  /** Intrinsic drawing size; the SVG scales to its box via width/height 100%. */
  width?: number;
  height?: number;
  strokeWidth?: number;
  className?: string;
}

export function Sparkline({
  data,
  variant = "line",
  width = 100,
  height = 32,
  strokeWidth = 1.5,
  className,
}: SparklineProps) {
  const path = React.useMemo(() => {
    if (data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;
    // Inset by half the stroke so the line never clips at the top/bottom edge.
    const pad = strokeWidth;
    const innerH = height - pad * 2;
    const stepX = width / (data.length - 1);
    const pts = data.map((v, i) => {
      const x = i * stepX;
      const y = pad + innerH - ((v - min) / span) * innerH;
      return [x, y] as const;
    });
    const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
    const area = `${line} L${width},${height} L0,${height} Z`;
    return { line, area, first: pts[0], last: pts[pts.length - 1] };
  }, [data, width, height, strokeWidth]);

  if (!path) return null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("h-8 w-full text-muted-foreground", className)}
      aria-hidden
    >
      {variant === "area" && (
        <path d={path.area} fill="currentColor" className="opacity-[0.12]" stroke="none" />
      )}
      <path
        d={path.line}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
