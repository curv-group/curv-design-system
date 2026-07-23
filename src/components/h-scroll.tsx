"use client";

import * as React from "react";
import { cn } from "../lib/cn";

/**
 * HScroll — a horizontal scroll region with soft edge-fades that appear only
 * when there's more to scroll that way (the Linear board pattern), so a partial
 * item at the edge reads as "scroll for more", not "cut off". Pass
 * `containerClassName` for full-bleed (e.g. `-mx-6`) and `className` for the
 * inner scroll padding (e.g. `px-6`), so content scrolls edge-to-edge but never
 * touches the edges. Powers KanbanBoard; useful for any wide row.
 */
export interface HScrollProps {
  children: React.ReactNode;
  /** Inner scroll padding (e.g. `px-6 pb-1`). */
  className?: string;
  /** Full-bleed offset on the wrapper (e.g. `-mx-6`). */
  containerClassName?: string;
  /** Tailwind gradient origin matching the surface behind the content. */
  fade?: string;
}

export function HScroll({ children, className, containerClassName, fade = "from-background" }: HScrollProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [edges, setEdges] = React.useState({ left: false, right: false });

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setEdges({
        left: el.scrollLeft > 4,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
      });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  return (
    <div className={cn("relative", containerClassName)}>
      <div ref={ref} className={cn("overflow-x-auto", className)}>
        {children}
      </div>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r to-transparent transition-opacity duration-200",
          fade,
          edges.left ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l to-transparent transition-opacity duration-200",
          fade,
          edges.right ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
