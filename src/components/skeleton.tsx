import * as React from "react";
import { cn } from "../lib/cn";

/**
 * Skeleton — a pulsing placeholder for content that is loading. A recessed
 * `bg-muted` shape on the raised surface. Prefer skeletons over spinners for
 * layout-shaped content (cards, tables, charts) so the page keeps its geometry
 * while data arrives — see StatCard/ChartCard/DataTable `loading`.
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  height?: number | string;
  circle?: boolean;
}

export function Skeleton({ width, height, circle, className, style, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse bg-muted", circle ? "rounded-full" : "rounded", className)}
      style={{ width, height, ...style }}
      {...props}
    />
  );
}
