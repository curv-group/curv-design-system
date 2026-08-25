/**
 * Copy this when the prompt named **two jobs** (glance + a campaigns table).
 * Two jobs → two tabs. Do not invent a third (Overview / Reporting / Marketing)
 * unless they named it. One job that fits still uses dashboard-page.tsx — no tabs.
 */
import {
  ChartCard,
  DashboardPage,
  DataTable,
  type DataTableColumn,
  LineChart,
  PageHeader,
  StatCard,
} from "@curvgroup/design-system";

const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];

type Campaign = { id: string; name: string; spend: number; roas: number };

const columns: DataTableColumn<Campaign>[] = [
  { key: "name", header: "Campaign", minWidth: 200 },
  { key: "spend", header: "Spend", width: 100, align: "right" },
  { key: "roas", header: "ROAS", width: 80, align: "right" },
];

const campaigns: Campaign[] = [
  { id: "1", name: "Evergreen search", spend: 18400, roas: 4.1 },
  { id: "2", name: "Spring prospecting", spend: 12200, roas: 2.8 },
];

export function MarketingGlanceAndCampaignsPage() {
  return (
    <DashboardPage
      header={<PageHeader title="Marketing" />}
      tabs={[
        { value: "overview", label: "Overview" },
        { value: "campaigns", label: "Campaigns" },
      ]}
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
    >
      {(tab) =>
        tab === "campaigns" ? (
          <DataTable
            columns={columns}
            rows={campaigns}
            getRowId={(r) => r.id}
            searchable
            unit="campaigns"
          />
        ) : null
      }
    </DashboardPage>
  );
}
