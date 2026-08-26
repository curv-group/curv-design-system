"use client";

import * as React from "react";
import { Dialog as D } from "@base-ui/react/dialog";
import { cn } from "../lib/cn";

export type DrawerSide = "right" | "left";
export type DrawerSize = "sm" | "md" | "lg";

/**
 * Drawer — a side sheet that peeks at a record without leaving the list
 * (Linear issue panel, Shopify sheet). Built on base-ui Dialog: focus is
 * trapped, Escape / backdrop close it, focus returns to the trigger.
 *
 * The showcase and `examples/drawer.tsx` show the **full surface** — badge,
 * identifier, header actions, Banner, in-drawer Tabs, property rows, fields,
 * sticky footer. An OS copies that and drops what the job does not need.
 *
 * Uncontrolled via `trigger`, or controlled via `open` / `onOpenChange`.
 *
 * <Drawer
 *   trigger={<Button variant="outline">Open deal</Button>}
 *   title="Adventure Works"
 *   description="SO-1042"
 *   badge={<Badge variant="green">Confirmed</Badge>}
 *   footer={<><DrawerClose render={<Button variant="secondary">Close</Button>} /><Button>Save</Button></>}
 * >
 *   <DrawerSection title="Properties">…</DrawerSection>
 * </Drawer>
 */
export interface DrawerProps {
  /** Optional trigger for uncontrolled use. */
  trigger?: React.ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: DrawerSide;
  /** `md` (32rem) is the record peek. `sm` for filters; `lg` for denser forms. */
  size?: DrawerSize;
  title?: React.ReactNode;
  /** Quiet identifier under the title — order number, SKU, status line. */
  description?: React.ReactNode;
  /** Status chip next to the title. */
  badge?: React.ReactNode;
  /** Extra header controls — CopyButton, a ⋯ Menu. Keep to 1–2. */
  headerActions?: React.ReactNode;
  children?: React.ReactNode;
  /** Pinned footer. Full surface: secondary Close on the left, primary on the right (Shopify sheet). */
  footer?: React.ReactNode;
  /** Extra classes on the panel (escape hatch — prefer `size`). */
  className?: string;
}

const SIZE_CLASS: Record<DrawerSize, string> = {
  sm: "w-[26rem]",
  md: "w-[32rem]",
  lg: "w-[40rem]",
};

const PANEL_EASE = "ease-[cubic-bezier(0.32,0.72,0,1)]";

export function Drawer({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  side = "right",
  size = "md",
  title,
  description,
  badge,
  headerActions,
  children,
  footer,
  className,
}: DrawerProps) {
  const labelled = Boolean(title);
  return (
    <D.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <D.Trigger render={trigger} /> : null}
      <D.Portal>
        <D.Backdrop
          className={cn(
            "fixed inset-0 z-50 bg-overlay",
            "transition-opacity duration-200",
            PANEL_EASE,
            "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
            "data-[ending-style]:duration-150",
          )}
        />
        <D.Popup
          className={cn(
            "fixed inset-y-0 z-50 flex h-dvh max-w-[calc(100vw-3rem)] flex-col overflow-hidden bg-card shadow-card outline-none",
            SIZE_CLASS[size],
            side === "right" ? "right-0 border-l border-border" : "left-0 border-r border-border",
            "transition-[transform,opacity] duration-200",
            PANEL_EASE,
            "data-[ending-style]:duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
            side === "right"
              ? "motion-safe:data-[ending-style]:translate-x-full motion-safe:data-[starting-style]:translate-x-full"
              : "motion-safe:data-[ending-style]:-translate-x-full motion-safe:data-[starting-style]:-translate-x-full",
            className,
          )}
        >
          <header className="flex shrink-0 items-start gap-3 border-b border-border px-4 py-2.5">
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-2">
                {labelled ? (
                  <D.Title className="truncate text-[15px] font-semibold leading-6 text-foreground">
                    {title}
                  </D.Title>
                ) : (
                  <D.Title className="sr-only">Drawer</D.Title>
                )}
                {badge}
              </div>
              {description ? (
                <D.Description className="mt-0.5 truncate text-[13px] leading-5 text-muted-foreground">
                  {description}
                </D.Description>
              ) : (
                <D.Description className="sr-only">Drawer</D.Description>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-0.5 pt-0.5">
              {headerActions}
              <D.Close
                aria-label="Close"
                className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground/70 outline-none transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:ring-1 focus-visible:ring-foreground/20"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </D.Close>
            </div>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 text-[13px] text-foreground">{children}</div>
          {footer ? (
            <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-border bg-card px-4 py-2.5 [&:has(>:only-child)]:justify-end">
              {footer}
            </footer>
          ) : null}
        </D.Popup>
      </D.Portal>
    </D.Root>
  );
}

/** Close the drawer from inside (e.g. a Cancel button). */
export const DrawerClose = D.Close;

/** Labeled block inside a drawer body. Sentence-case title, not uppercase. */
export function DrawerSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-0.5", className)}>
      <h3 className="text-[12px] font-medium leading-4 text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}

/**
 * Linear / Attio property row: optional 16px icon, a short muted label, then
 * the value or control immediately after (left-aligned). Do not justify-between
 * — that opens a void across the middle of the sheet.
 */
export function DrawerRow({
  label,
  icon,
  children,
}: {
  label: string;
  /** 16px glyph — Linear/Attio scan rhythm. Omit on a subset. */
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid min-h-8 items-center gap-x-2 py-0.5",
        icon ? "grid-cols-[1rem_5.75rem_minmax(0,1fr)]" : "grid-cols-[6.75rem_minmax(0,1fr)]",
      )}
    >
      {icon ? <span className="grid size-4 place-items-center text-muted-foreground">{icon}</span> : null}
      <span className="truncate text-[13px] font-normal text-muted-foreground">{label}</span>
      <div className="min-w-0 text-[13px] font-medium text-foreground">{children}</div>
    </div>
  );
}
