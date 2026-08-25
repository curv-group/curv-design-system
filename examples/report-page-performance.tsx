/**
 * Copy this into a landing-pages / performance workbook. One chart, one table,
 * a Drawer to peek at a row — not a new route, not a KPI wall, not ListPage
 * (no chart slot) and not DashboardPage (a long table is not a side table).
 * A P&L with no peek still uses report-page.tsx (no tabs, no drawer).
 */
import * as React from "react";
import {
  ChartCard,
  DataTable,
  type DataTableColumn,
  Drawer,
  LineChart,
  PageHeader,
  ReportPage,
} from "@curvgroup/design-system";

type PageRow = { id: string; path: string; sessions: number; conv: string };

const columns: DataTableColumn<PageRow>[] = [
  { key: "path", header: "Landing page", minWidth: 220 },
  { key: "sessions", header: "Sessions", width: 110, align: "right" },
  { key: "conv", header: "Conv.", width: 90, align: "right" },
];

const rows: PageRow[] = [
  { id: "1", path: "/packs/trail-22l", sessions: 18420, conv: "3.1%" },
  { id: "2", path: "/packs/day-18l", sessions: 12110, conv: "2.4%" },
];

export function LandingPagesReport() {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<PageRow | null>(null);

  return (
    <ReportPage
      header={<PageHeader title="Landing pages" description="One chart, one table. Click a row to peek." />}
      chart={
        <ChartCard title="Sessions" value="30.5K">
          <LineChart
            height={200}
            area
            xLabels={["Mar", "Apr", "May", "Jun"]}
            series={[{ data: [6.2, 7.1, 8.4, 8.8], label: "Sessions" }]}
          />
        </ChartCard>
      }
      table={
        <DataTable
          columns={columns}
          rows={rows}
          getRowId={(r) => r.id}
          onRowClick={(r) => {
            setSelected(r);
            setOpen(true);
          }}
          searchable
          unit="pages"
        />
      }
      drawer={
        <Drawer
          open={open}
          onOpenChange={setOpen}
          title={selected?.path ?? "Landing page"}
        >
          <p className="text-[13px] text-muted-foreground">
            {selected
              ? `${selected.sessions.toLocaleString()} sessions · ${selected.conv} conversion. Stay on the report — this is a peek, not a new page.`
              : null}
          </p>
        </Drawer>
      }
    />
  );
}
