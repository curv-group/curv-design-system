/**
 * Copy this into a P&L / statement page. Period control on the header. One
 * chart. One table. No KPI strip, no page tabs — one job that fits.
 * A row peek is `drawer` (see report-page-performance.tsx). Extra report jobs
 * become `tabs`, never a second chart on this canvas.
 */
import {
  ChartCard,
  DateRangePicker,
  LineChart,
  PageHeader,
  ReportPage,
  ReportTable,
} from "@curvgroup/design-system";

const periods = [
  { key: "jan", label: "Jan" },
  { key: "feb", label: "Feb" },
  { key: "mar", label: "Mar" },
];

export function ProfitAndLossPage() {
  return (
    <ReportPage
      header={
        <PageHeader
          title="Profit and loss"
          eyebrow="Finance"
          actions={<DateRangePicker />}
        />
      }
      chart={
        <ChartCard title="Gross profit" value="$6.4M">
          <LineChart
            height={200}
            area
            xLabels={periods.map((p) => p.label)}
            series={[{ data: [2.1, 1.9, 2.4], label: "GP" }]}
          />
        </ChartCard>
      }
      table={
        <ReportTable
          metricLabel="Statement"
          periods={periods}
          sections={[
            {
              key: "gp",
              rows: [
                {
                  key: "gp",
                  label: "Gross profit",
                  subtotal: true,
                  values: { jan: 2.1, feb: 1.9, mar: 2.4 },
                  total: 6.4,
                },
              ],
            },
          ]}
        />
      }
    />
  );
}
