import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * TableLink — an entity link inside a table cell (Customer → profile,
 * Order # → the deal). Stops propagation so it never double-fires a clickable
 * row, and sits at z-[2]: above a `getRowHref` overlay (z-[1]) for clicks, but
 * BELOW sticky cells (z-10) so the frozen column still masks it on horizontal
 * scroll. design-system.md: row links go to the entity each cell represents —
 * never point two cells at the same place.
 */
export interface TableLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Muted treatment for secondary ids (order #) — foreground on hover. */
  subtle?: boolean;
}

export const TableLink = React.forwardRef<HTMLAnchorElement, TableLinkProps>(
  ({ subtle = false, className, onClick, children, ...props }, ref) => (
    <a
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      className={cn(
        "relative z-[2] truncate underline-offset-2 transition-colors hover:underline focus-visible:outline-none focus-visible:underline",
        subtle
          ? "text-muted-foreground tabular-nums hover:text-foreground"
          : "font-medium text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  ),
);
TableLink.displayName = "TableLink";
