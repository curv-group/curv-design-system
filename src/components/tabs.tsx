"use client";

import * as React from "react";
import { Tabs as T } from "@base-ui/react/tabs";
import { cn } from "../lib/cn";

/**
 * View-navigation tabs — switching between distinct **jobs of a page**
 * (Inventory / Sales on a SKU; Overview / Campaigns when those two jobs were
 * named). Not a default of three, and not Overview / Reporting / Marketing
 * unless those jobs were named. Prefer the page-shell `tabs` prop over using
 * this primitive by hand. Chrome, the Clerk/GitHub pattern: a full-width
 * `bg-card` bar with `border-b border-border` directly under the top bar, the
 * active view marked by an underline. This bar is ALWAYS the top-most element of
 * the content area; the page/entity header sits BELOW it, inside the active
 * panel — never above. Not for filtering data in the current view — that's
 * <SegmentedControl>; and a table's status/row filter (Active / Cut / All) is
 * the DataTable `tabs` prop in the toolbar, NOT a page Tabs bar.
 * (design-system.md → Page tabs — when they exist, always at the top.)
 *
 * The bar's border is full-width; labels sit on the same column as
 * `PageContainer` (centered `max-w-[1200px]`, `px-6` gutter). Each tab already
 * has `px-3`, so the list adds `px-3` more. Pass `bar={false}` to drop the bar
 * chrome when embedding in a card header — then `-ml-3` keeps labels on the
 * card's content edge.
 *
 * <Tabs
 *   aria-label="Views"
 *   value={view}
 *   onValueChange={setView}
 *   items={[{ value: "overview", label: "Overview" }, { value: "all", label: "All deals" }]}
 * />
 */
export interface TabItem {
  value: string;
  label: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Render the full-width `bg-card` + `border-b` bar (default). */
  bar?: boolean;
  /**
   * `md` is the page bar (h-11). `sm` is the in-drawer / in-card bar (h-8) —
   * same underline, less air.
   */
  size?: "sm" | "md";
  /** Accessible name for the tablist. */
  "aria-label"?: string;
  className?: string;
  /** Optional TabPanel children. Page shells typically own panels instead. */
  children?: React.ReactNode;
}

export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  bar = true,
  size = "md",
  className,
  children,
  "aria-label": ariaLabel,
}: TabsProps) {
  const compact = size === "sm";
  return (
    <T.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange ? (v) => onValueChange(String(v)) : undefined}
      className={cn(bar && "border-b border-border bg-card", className)}
    >
      <T.List
        aria-label={ariaLabel}
        className={cn(
          "flex items-center",
          // Page shells render this bar *outside* PageContainer so the hairline
          // can span the content well. Match that column: list px-3 + tab px-3
          // = PageContainer px-6. `-ml-3` is only for bar={false} (card header).
          // Compact in-drawer tabs skip the negative inset — the parent pads.
          bar ? "mx-auto w-full max-w-[1200px] px-3" : compact ? "border-b border-border" : "-ml-3",
        )}
      >
        {items.map((it) => (
          <T.Tab
            key={it.value}
            value={it.value}
            className={cn(
              "relative inline-flex items-center rounded-t-md font-medium outline-none transition-colors",
              compact ? "h-8 px-2.5 text-[13px]" : "h-11 px-3 text-[13px]",
              // NB: base-ui Tabs.Tab marks the active tab with `data-active`
              // (Select/Menu items use `data-selected` — the attribute differs).
              "text-muted-foreground hover:text-foreground data-[active]:text-foreground",
              // Hover chip: a rounded gray container behind the label, inset
              // vertically so it never touches the bar's top/bottom.
              compact
                ? "before:absolute before:inset-x-1 before:inset-y-1 before:rounded-md before:bg-accent before:opacity-0 before:transition-opacity hover:before:opacity-100"
                : "before:absolute before:inset-x-1 before:inset-y-2 before:rounded-md before:bg-muted before:opacity-0 before:transition-opacity hover:before:opacity-100",
              // Underline marker, aligned under the label (inset by the tab padding).
              compact
                ? "after:absolute after:inset-x-2.5 after:-bottom-px after:h-0.5 after:rounded-full after:bg-foreground after:opacity-0 data-[active]:after:opacity-100"
                : "after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full after:bg-foreground after:opacity-0 data-[active]:after:opacity-100",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
            )}
          >
            <span className="relative">{it.label}</span>
          </T.Tab>
        ))}
      </T.List>
      {children}
    </T.Root>
  );
}

export interface TabPanelProps {
  value: string;
  children?: React.ReactNode;
  className?: string;
}

/** Panel for a Tabs item. Use when composing Tabs yourself; DetailPage owns this. */
export function TabPanel({ value, children, className }: TabPanelProps) {
  return (
    <T.Panel value={value} className={className}>
      {children}
    </T.Panel>
  );
}
