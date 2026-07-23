import * as React from "react";
import { cn } from "../lib/cn";

/**
 * PageHeader — the top of every OS page: an optional eyebrow, the title with an
 * optional count + status badge, a description, and right-aligned controls
 * (date range, filters, export, a primary action). Stacks on narrow screens.
 */
export interface PageHeaderProps {
  title: React.ReactNode;
  /** Small category/context above the title, e.g. "Reporting" or "Finance / Refunds". */
  eyebrow?: React.ReactNode;
  /** A muted count after the title, e.g. "2,369". */
  count?: React.ReactNode;
  /** A status pill next to the title (pass a <Badge/>). */
  badge?: React.ReactNode;
  description?: React.ReactNode;
  /** Right-aligned controls/actions. */
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, eyebrow, count, badge, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && <div className="mb-1 text-[12px] font-medium text-muted-foreground">{eyebrow}</div>}
        <div className="flex items-center gap-2.5">
          <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground text-balance">{title}</h1>
          {count != null && <span className="shrink-0 text-base font-medium tabular-nums text-muted-foreground">{count}</span>}
          {badge}
        </div>
        {description && <p className="mt-1 max-w-2xl text-[13px] text-muted-foreground text-pretty">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
