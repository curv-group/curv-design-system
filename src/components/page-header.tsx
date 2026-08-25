import * as React from "react";
import { cn } from "../lib/cn";

/**
 * PageHeader — the top of every OS page.
 *
 * Default on a page shell: `title`, optional `count` / `badge`, optional
 * `actions`. No eyebrow, no description. The sidebar already says where you
 * are; a paragraph under the H1 is teaching copy, not a product header.
 * Linear Issues and Shopify Products are the reference — headline + actions.
 *
 * `eyebrow` and `description` stay on the type as a rare escape hatch. Do not
 * copy them into a page shell. If the title is unclear, rename the title.
 */
export interface PageHeaderProps {
  title: React.ReactNode;
  /**
   * Rare. Category above the title. Omit on page shells — it duplicates the
   * sidebar ("Finance" over "Profit and loss").
   */
  eyebrow?: React.ReactNode;
  /** A muted count after the title, e.g. "6". */
  count?: React.ReactNode;
  /** A status pill next to the title (pass a <Badge/>). */
  badge?: React.ReactNode;
  /**
   * Rare. A line under the title. Omit on page shells — scope belongs in the
   * title, a Banner, or a control, not a muted paragraph.
   */
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
