"use client";

import * as React from "react";
import { cn } from "../../lib/cn";
import { PageContainer } from "../shell/page-container";
import { Tabs, type TabItem } from "../tabs";

export interface ReportPageProps {
  /** PageHeader. Period / comparison / brand controls belong in `actions`. */
  header: React.ReactNode;
  /**
   * Optional page tabs when this report is more than one job (e.g. Landing
   * pages / Email). One job that fits (a P&L) needs no tabs. Count jobs — do
   * not default to three.
   */
  tabs?: TabItem[];
  value?: string;
  defaultTab?: string;
  onTabChange?: (value: string) => void;
  /** One ChartCard. Switching metric happens on the card, not via extra charts. */
  chart: React.ReactNode;
  /** ReportTable or a performance DataTable. */
  table: React.ReactNode;
  /** Active-tab body when `tabs` is set and the selection is not the first tab. */
  children?: React.ReactNode | ((tab: string) => React.ReactNode);
  /** Optional Drawer — peek at one row without leaving the report. */
  drawer?: React.ReactNode;
  className?: string;
}

/**
 * ReportPage — P&L / performance workbook. One period control (on the header),
 * one chart, one table. Comparison lives in the header. A row peek is a
 * Drawer, not a KPI strip or a second page. Do not add a KPI wall.
 */
export function ReportPage({
  header,
  tabs,
  value,
  defaultTab,
  onTabChange,
  chart,
  table,
  children,
  drawer,
  className,
}: ReportPageProps) {
  const first = tabs?.[0]?.value ?? "";
  const [uncontrolled, setUncontrolled] = React.useState(defaultTab ?? first);
  const tab = value ?? uncontrolled;
  const setTab = (next: string) => {
    if (value == null) setUncontrolled(next);
    onTabChange?.(next);
  };
  const panel = typeof children === "function" ? children(tab) : children;
  const onFirst = !tabs?.length || tab === first;

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      {tabs && tabs.length > 0 && (
        <Tabs
          items={tabs}
          value={tab}
          onValueChange={setTab}
          aria-label="Report views"
        />
      )}
      <PageContainer className="flex flex-1 flex-col gap-5">
        {header}
        {onFirst ? (
          <>
            {chart}
            {table}
          </>
        ) : (
          panel
        )}
      </PageContainer>
      {drawer}
    </div>
  );
}
