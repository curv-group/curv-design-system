/**
 * Copy this into an OS overview. One job that fits: at most five KPIs, two
 * charts, **no page tabs**. Two named jobs → dashboard-page-tabs.tsx. Do not
 * invent Overview / Reporting / Marketing. The full table is a ListPage or a
 * second tab — not card 6–17.
 */
import {
  ChartCard,
  DashboardPage,
  LineChart,
  PageHeader,
  StatCard,
} from "@curvgroup/design-system";

const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];

export function MarketingOverviewPage() {
  return (
    <DashboardPage
      header={<PageHeader title="Marketing overview" />}
      kpis={[
        <StatCard key="spend" label="Spend" value="$84K" />,
        <StatCard key="rev" label="Attributed revenue" value="$312K" />,
        <StatCard key="roas" label="ROAS" value="3.7×" />,
        <StatCard key="cpa" label="CPA" value="$18" />,
      ]}
      charts={[
        <ChartCard key="rev" title="Attributed revenue" value="$312K">
          <LineChart
            height={220}
            area
            xLabels={months}
            series={[{ data: [38, 42, 40, 51, 48, 62], label: "Revenue" }]}
          />
        </ChartCard>,
      ]}
    />
  );
}
