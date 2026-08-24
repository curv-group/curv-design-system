import * as React from "react";
import { cn } from "../../lib/cn";
import { PageContainer } from "../shell/page-container";

export interface ReportPageProps {
  /** PageHeader. Period / comparison / brand controls belong in `actions`. */
  header: React.ReactNode;
  /** One ChartCard. Switching metric happens on the card, not via extra charts. */
  chart: React.ReactNode;
  /** ReportTable (Summary / Monthly). */
  table: React.ReactNode;
  className?: string;
}

/**
 * ReportPage — P&L / matrix. One period control (on the header), one chart,
 * one statement table. Comparison lives in the header. Do not add a KPI strip.
 */
export function ReportPage({ header, chart, table, className }: ReportPageProps) {
  return (
    <PageContainer className={cn("flex flex-col gap-5", className)}>
      {header}
      {chart}
      {table}
    </PageContainer>
  );
}
