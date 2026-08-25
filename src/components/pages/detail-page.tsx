"use client";

import * as React from "react";
import { cn } from "../../lib/cn";
import { PageContainer } from "../shell/page-container";
import { StatGroup } from "../stat-card";
import { Tabs, type TabItem } from "../tabs";
import { capSlot } from "./slot-limit";

export interface DetailPageTab extends TabItem {}

export interface DetailPageProps {
  /**
   * View-navigation tabs. The bar is the top-most chrome; header / verdict /
   * vitals sit below it. Extra data that does not fit a vital goes in a tab —
   * there is no canvas dump slot.
   */
  tabs: DetailPageTab[];
  value?: string;
  defaultTab?: string;
  onTabChange?: (value: string) => void;
  /** Entity header (title, ids, status). Lives below the tab bar. */
  header: React.ReactNode;
  /** One verdict line/banner. Omit when the entity is healthy and the vitals suffice. */
  verdict?: React.ReactNode;
  /**
   * At most 4 StatCards on the **headline strip** — not a cap on the whole
   * screen. Tables, history, and warehouses live in tabs / drawer / hover.
   * A 5th vital is dropped at runtime. This shell is one record (SKU, deal,
   * customer), not a section overview like Analytics.
   */
  vitals?: readonly React.ReactNode[];
  /**
   * Tab values whose panel is a full-bleed table/board (level 1). All other
   * tabs use the centered container.
   */
  bleedTabs?: readonly string[];
  /** Active-tab body. Extra metrics, tables, and history live here. */
  children: React.ReactNode | ((tab: string) => React.ReactNode);
  /** Optional Drawer (peek / drill-in). Controlled by the caller. */
  drawer?: React.ReactNode;
  className?: string;
}

/**
 * DetailPage — one entity (SKU, deal, customer), not an Analytics home.
 * Anti-overload: a verdict, at most four vitals on the strip, and tabs for
 * everything else. Do not pass a sibling wall of cards.
 */
export function DetailPage({
  tabs,
  value,
  defaultTab,
  onTabChange,
  header,
  verdict,
  vitals,
  bleedTabs,
  children,
  drawer,
  className,
}: DetailPageProps) {
  const first = tabs[0]?.value ?? "";
  const [uncontrolled, setUncontrolled] = React.useState(defaultTab ?? first);
  const tab = value ?? uncontrolled;
  const setTab = (next: string) => {
    if (value == null) setUncontrolled(next);
    onTabChange?.(next);
  };
  const shown = capSlot(
    "DetailPage.vitals",
    vitals,
    4,
    "Put the extra metric in a tab or a StatCard breakdown.",
  );
  const bleed = bleedTabs?.includes(tab) ?? false;
  const panel = typeof children === "function" ? children(tab) : children;

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      {tabs.length > 0 && (
        <Tabs
          items={tabs}
          value={tab}
          onValueChange={setTab}
          aria-label="Page sections"
        />
      )}
      <PageContainer
        bleed={bleed}
        className="flex flex-1 flex-col gap-5"
      >
        {header}
        {verdict}
        {shown.length > 0 && <StatGroup>{shown}</StatGroup>}
        {panel}
      </PageContainer>
      {drawer}
    </div>
  );
}
