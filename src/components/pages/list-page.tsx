import * as React from "react";
import { cn } from "../../lib/cn";
import { PageContainer } from "../shell/page-container";

export interface ListPageProps {
  /** PageHeader (title, count, actions). */
  header: React.ReactNode;
  /**
   * Optional full-width SummaryStrip above the table — never a row of KPI
   * cards. Extra breakdowns belong on the detail page, not here.
   */
  summary?: React.ReactNode;
  /** DataTable (or a kanban). Filters live in the table toolbar. */
  table: React.ReactNode;
  className?: string;
}

/**
 * ListPage — catalogs, queues, deals, customers. Full-bleed: a table/board
 * does not degrade when stretched. No chart grid, no KPI wall. Row click
 * opens the detail route or a Drawer.
 *
 * Swap the demo rows for real data. Do not add sections.
 */
export function ListPage({ header, summary, table, className }: ListPageProps) {
  return (
    <PageContainer bleed className={cn("flex flex-col gap-5", className)}>
      {header}
      {summary}
      {table}
    </PageContainer>
  );
}
