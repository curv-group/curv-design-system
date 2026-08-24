"use client";

import * as React from "react";
import { cn } from "../../lib/cn";
import { PageContainer } from "../shell/page-container";
import { StatGroup } from "../stat-card";
import { Tabs, type TabItem } from "../tabs";
import { capSlot } from "./slot-limit";

export interface DashboardPageProps {
  header: React.ReactNode;
  /**
   * Optional section tabs when the overview has more than one view. Extra
   * metrics go here — not as more KPI cards.
   */
  tabs?: TabItem[];
  value?: string;
  defaultTab?: string;
  onTabChange?: (value: string) => void;
  /** At most 5 StatCards. A 6th KPI belongs in a tab. Extra items are dropped. */
  kpis?: readonly React.ReactNode[];
  /** At most 2 ChartCards. A 3rd chart belongs in a tab. Extra items are dropped. */
  charts?: readonly React.ReactNode[];
  /** Optional supporting table. The full catalog is a ListPage, not this slot. */
  table?: React.ReactNode;
  /** Active-tab body when `tabs` is set. */
  children?: React.ReactNode | ((tab: string) => React.ReactNode);
  className?: string;
}

/**
 * DashboardPage — mixed overview. Centered. A few KPIs, at most two charts,
 * optional table. More numbers → tabs, never more cards.
 */
export function DashboardPage({
  header,
  tabs,
  value,
  defaultTab,
  onTabChange,
  kpis,
  charts,
  table,
  children,
  className,
}: DashboardPageProps) {
  const first = tabs?.[0]?.value ?? "";
  const [uncontrolled, setUncontrolled] = React.useState(defaultTab ?? first);
  const tab = value ?? uncontrolled;
  const setTab = (next: string) => {
    if (value == null) setUncontrolled(next);
    onTabChange?.(next);
  };
  const shownKpis = capSlot(
    "DashboardPage.kpis",
    kpis,
    5,
    "Put the extra KPI in a tab, not on the canvas.",
  );
  const shownCharts = capSlot(
    "DashboardPage.charts",
    charts,
    2,
    "Put the extra chart in a tab.",
  );
  const panel = typeof children === "function" ? children(tab) : children;
  const onOverview = !tabs?.length || tab === first;

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      {tabs && tabs.length > 0 && (
        <Tabs
          items={tabs}
          value={tab}
          onValueChange={setTab}
          aria-label="Dashboard views"
        />
      )}
      <PageContainer className="flex flex-1 flex-col gap-5">
        {header}
        {onOverview ? (
          <>
            {shownKpis.length > 0 && <StatGroup>{shownKpis}</StatGroup>}
            {shownCharts.length > 0 && (
              <div
                className={cn(
                  "grid gap-4",
                  shownCharts.length > 1 && "lg:grid-cols-2",
                )}
              >
                {shownCharts}
              </div>
            )}
            {table}
          </>
        ) : (
          panel
        )}
      </PageContainer>
    </div>
  );
}
