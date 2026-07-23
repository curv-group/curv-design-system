"use client";

import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * The left nav sidebar — recessed gray, sticky under the top bar, rounding its
 * top-left corner to meet the bar's cradle (see design-system.md → App shell).
 * Pure nav: logo, search and profile live in the <TopBar>. Compose it from
 * <SidebarSection> + <SidebarItem>. `sticky top-14` + `h-[calc(100vh-3.5rem)]`
 * keep it pinned and its rounded corner visible as the page scrolls.
 */
export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  /** Optional footer pinned to the bottom (e.g. a collapse toggle). */
  footer?: React.ReactNode;
}

export function Sidebar({ className, children, footer, ...props }: SidebarProps) {
  return (
    <aside
      className={cn(
        "sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 flex-col rounded-tl-[12px] border-r border-sidebar-border bg-sidebar md:flex",
        className,
      )}
      {...props}
    >
      <nav className="flex-1 overflow-y-auto px-3 py-3">{children}</nav>
      {footer ? (
        <div className="shrink-0 border-t border-sidebar-border p-2">{footer}</div>
      ) : null}
    </aside>
  );
}

/** Small inline chevron — avoids forcing an icon-library dependency on consumers. */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn(
        "ml-auto shrink-0 text-muted-foreground/50 transition-transform duration-150 group-hover:text-muted-foreground",
        open && "rotate-90",
      )}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export interface SidebarSectionProps {
  /** Sentence-case label. Omit for a pinned group (e.g. Home / Overview) with no header. */
  label?: string;
  /** Make the header a toggle with a chevron (the revenue-os pattern). */
  collapsible?: boolean;
  /** Initial open state when collapsible. */
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function SidebarSection({
  label,
  collapsible = false,
  defaultOpen = true,
  children,
}: SidebarSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  // No label → a pinned group (Home / Overview): items only, tighter bottom gap.
  if (!label) {
    return <ul className="mb-2 space-y-0.5">{children}</ul>;
  }

  if (!collapsible) {
    return (
      <div className="mb-3">
        <div className="px-2 py-1 text-[12px] font-medium text-foreground/70">{label}</div>
        <ul className="mt-0.5 space-y-0.5">{children}</ul>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group flex w-full items-center rounded-md px-2 py-1 text-[12px] font-medium text-foreground/70 transition hover:bg-sidebar-accent hover:text-foreground"
      >
        <span>{label}</span>
        <Chevron open={open} />
      </button>
      {open ? <ul className="mt-0.5 space-y-0.5">{children}</ul> : null}
    </div>
  );
}

type IconType = React.ComponentType<{ size?: number | string; className?: string }>;

export interface SidebarItemProps {
  icon?: IconType;
  label: string;
  active?: boolean;
  /** Right-aligned slot — a badge, count, or status pill. */
  trailing?: React.ReactNode;
  /** Indent as a sub-item — the hierarchy cue when there's no icon to carry it. */
  indent?: boolean;
  /**
   * Not shipped yet: renders muted and non-interactive with a "Soon" tag, so a
   * planned page can sit in the nav without pretending to be clickable. Ignores
   * `href`/`onClick`/`active`.
   */
  comingSoon?: boolean;
  /** Render as a link when provided; otherwise a button (pass onClick). */
  href?: string;
  onClick?: () => void;
}

export function SidebarItem({
  icon: Icon,
  label,
  active = false,
  trailing,
  indent = false,
  comingSoon = false,
  href,
  onClick,
}: SidebarItemProps) {
  const cls = cn(
    "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-[13px] transition",
    indent && "pl-7",
    active
      ? "bg-sidebar-active font-medium text-foreground"
      : "text-foreground/80 hover:bg-sidebar-accent hover:text-foreground",
  );
  const inner = (
    <>
      {Icon ? <Icon size={15} className="shrink-0" /> : null}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {trailing ? <span className="shrink-0 pl-2">{trailing}</span> : null}
    </>
  );
  if (comingSoon) {
    return (
      <li>
        <div className={cn("flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] text-muted-foreground/60", indent && "pl-7")}>
          {Icon ? <Icon size={15} className="shrink-0" /> : null}
          <span className="min-w-0 flex-1 truncate">{label}</span>
          <span className="shrink-0 pl-2 text-[11px] text-muted-foreground/50">Soon</span>
        </div>
      </li>
    );
  }
  return (
    <li>
      {href ? (
        <a href={href} className={cls}>
          {inner}
        </a>
      ) : (
        <button type="button" onClick={onClick} className={cls}>
          {inner}
        </button>
      )}
    </li>
  );
}
