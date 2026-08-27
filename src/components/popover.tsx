"use client";

import * as React from "react";
import { Popover as P } from "@base-ui/react/popover";
import { cn } from "../lib/cn";
import { overlayPopupMotion } from "../lib/overlay";

/**
 * Popover (base-ui) — a click-triggered floating panel for richer content than a
 * tooltip and freer than a menu (a form, a filter, a detail peek). Same surface
 * as our menus: origin-aware, `rounded-lg` popover, soft shadow.
 *
 * <Popover trigger={<Button variant="outline">Filter</Button>}>…</Popover>
 */
export interface PopoverProps {
  /**
   * The trigger — a single focusable element. Optional when `anchor` is given
   * (a controlled, externally-anchored popover, e.g. the StatCard hover card).
   */
  trigger?: React.ReactElement;
  /** Anchor the popup to an element instead of a trigger (controlled use). */
  anchor?: React.RefObject<Element | null>;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  /** Controlled open state (with `onOpenChange`); omit for uncontrolled. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Extra classes on the popup panel. The panel ships opinionated padding
   * (`p-3`) and a `max-w` for the common small-form case; a menu-style content
   * that brings its own padding can neutralize them (`p-0 max-w-none w-auto`).
   */
  className?: string;
}

export function Popover({ trigger, anchor, children, side = "bottom", align = "center", sideOffset = 6, open, defaultOpen, onOpenChange, className }: PopoverProps) {
  return (
    <P.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <P.Trigger render={trigger} /> : null}
      <P.Portal>
        <P.Positioner side={side} align={align} sideOffset={sideOffset} anchor={anchor} className="z-50">
          <P.Popup
            className={cn(
              "max-w-[min(24rem,var(--available-width))] rounded-lg border border-border bg-popover p-3 text-[13px] text-popover-foreground shadow-lg outline-none",
              overlayPopupMotion,
              className,
            )}
          >
            {children}
          </P.Popup>
        </P.Positioner>
      </P.Portal>
    </P.Root>
  );
}

/** Close the popover from inside (e.g. an "Apply" button). */
export const PopoverClose = P.Close;
