/**
 * Live page-shell demos for the showcase. These are the pages agents should
 * clone: swap the demo data, do not add sections.
 */
import * as React from "react";
import {
  AppFrame,
  Badge,
  Banner,
  BreakdownRow,
  Button,
  ChartCard,
  DataTable,
  type DataTableColumn,
  DateRangePicker,
  type DateRangeValue,
  DetailPage,
  DashboardPage,
  Drawer,
  Field,
  Input,
  LineChart,
  ListPage,
  PageHeader,
  ReportPage,
  ReportTable,
  Select,
  SettingsPage,
  Sidebar,
  SidebarItem,
  SidebarSection,
  StatCard,
  SummaryStrip,
  Switch,
  TableLink,
  TopBar,
} from "../src";

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="grid h-9 w-9 place-items-center rounded-md text-white/70 transition hover:bg-white/10 hover:text-white">
      {children}
    </button>
  );
}

const demoLogo = (
  <span className="pl-1 text-[15px] font-semibold lowercase text-white">
    curv<span className="align-super text-[8px] font-normal text-white/60">os</span>
  </span>
);

function ShellChrome({ children }: { children: React.ReactNode }) {
  return (
    <AppFrame
      topBar={
        <TopBar
          logo={demoLogo}
          center={
            <div className="flex w-full max-w-xl items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-[13px] text-white/55">
              Search
              <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[11px]">⌘K</span>
            </div>
          }
          actions={
            <>
              <IconBtn>
                <span className="text-[13px]">?</span>
              </IconBtn>
              <div className="ml-1 flex items-center gap-2 rounded-md px-2 py-1">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-[12px] font-semibold text-accent-foreground">
                  J
                </span>
                <span className="text-[13px] text-white">Jordan</span>
              </div>
            </>
          }
        />
      }
      sidebar={
        <Sidebar>
          <SidebarSection>
            <SidebarItem label="Home" />
          </SidebarSection>
          <SidebarSection label="Catalog" collapsible defaultOpen>
            <SidebarItem label="Products" active />
            <SidebarItem label="Customers" />
            <SidebarItem label="P&L" />
            <SidebarItem label="Settings" />
          </SidebarSection>
        </Sidebar>
      }
    >
      {children}
    </AppFrame>
  );
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

type CustomerRow = { id: string; name: string; orders: number; revenue: number; status: "Active" | "Paused" };

const CUSTOMERS: CustomerRow[] = [
  { id: "1", name: "Adventure Works", orders: 18, revenue: 184200, status: "Active" },
  { id: "2", name: "Wingtip Toys", orders: 9, revenue: 91200, status: "Active" },
  { id: "3", name: "Wide World Importers", orders: 14, revenue: 128400, status: "Paused" },
  { id: "4", name: "Proseware", orders: 6, revenue: 44100, status: "Active" },
  { id: "5", name: "Litware", orders: 11, revenue: 77600, status: "Active" },
  { id: "6", name: "Fourth Coffee", orders: 4, revenue: 22800, status: "Paused" },
];

const CUSTOMER_COLUMNS: DataTableColumn<CustomerRow>[] = [
  {
    key: "name",
    header: "Customer",
    minWidth: 240,
    render: (r) => <TableLink href={`#/customer-${r.id}`}>{r.name}</TableLink>,
    value: (r) => r.name,
  },
  { key: "orders", header: "Orders", width: 100, align: "right" },
  {
    key: "revenue",
    header: "Revenue",
    width: 120,
    align: "right",
    render: (r) => usd.format(r.revenue),
    value: (r) => r.revenue,
  },
  {
    key: "status",
    header: "Status",
    width: 120,
    render: (r) => <Badge variant={r.status === "Active" ? "green" : "neutral"}>{r.status}</Badge>,
    value: (r) => r.status,
  },
];

export function ListPageDemo() {
  return (
    <ShellChrome>
      <ListPage
        header={
          <PageHeader
            title="Customers"
            count="6"
            actions={<Button>Add customer</Button>}
          />
        }
        summary={
          <SummaryStrip
            label="Revenue by status"
            total="$548K"
            items={[
              { label: "Active", value: "$397K", share: 72, colorClassName: "bg-verdict-green" },
              { label: "Paused", value: "$151K", share: 28 },
            ]}
          />
        }
        table={
          <DataTable
            columns={CUSTOMER_COLUMNS}
            rows={CUSTOMERS}
            getRowId={(r) => r.id}
            getRowHref={(r) => `#/customer-${r.id}`}
            searchable
            searchPlaceholder="Search customers"
            exportFilename="customers"
            unit="customers"
            maxHeight={360}
          />
        }
      />
    </ShellChrome>
  );
}

export function DetailPageDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <ShellChrome>
      <DetailPage
        tabs={[
          { value: "overview", label: "Overview" },
          { value: "inventory", label: "Inventory" },
          { value: "sales", label: "Sales" },
        ]}
        header={
          <PageHeader
            title="Trail Pack 22L"
            badge={<Badge variant="amber">Low cover</Badge>}
            actions={<Button onClick={() => setOpen(true)}>Create PO</Button>}
          />
        }
        verdict={
          <Banner variant="warning" title="Reorder now — 27d cover, no open PO">
            Elk Grove is the constraint. Raise a PO or the listing will stock out this month.
          </Banner>
        }
        vitals={[
          <StatCard
            key="cover"
            label="Cover"
            value="27d"
            delta={{ value: "9d", direction: "down", sentiment: "negative" }}
            caption="vs last month"
            hint="Days of demand the current on-hand covers."
            breakdown={
              <>
                <BreakdownRow label="Elk Grove" value="11d" />
                <BreakdownRow label="Rotterdam" value="48d" />
              </>
            }
          />,
          <StatCard
            key="onhand"
            label="On hand"
            value="412"
            caption="across 2 warehouses"
            sparkline={[520, 498, 470, 451, 430, 412]}
          />,
          <StatCard
            key="velocity"
            label="Velocity"
            value="14 / wk"
            delta={{ value: "8%", direction: "up" }}
            caption="units"
          />,
          <StatCard
            key="margin"
            label="Margin"
            value="41%"
            delta={{ value: "1.2pt", direction: "up" }}
          />,
        ]}
        drawer={
          <Drawer open={open} onOpenChange={setOpen} title="Create purchase order" footer={<Button onClick={() => setOpen(false)}>Submit</Button>}>
            <p className="text-[13px] text-muted-foreground">
              Suggested 600 units to Elk Grove — enough for 8 weeks at current velocity.
            </p>
          </Drawer>
        }
      >
        {(tab) =>
          tab === "inventory" ? (
            <p className="text-[13px] text-muted-foreground">
              Warehouse rows, inbound POs, and transfers live in this tab — not on the overview.
            </p>
          ) : tab === "sales" ? (
            <p className="text-[13px] text-muted-foreground">
              Channel mix and the last 12 weeks of orders. Open a row to peek at a deal.
            </p>
          ) : (
            <p className="text-[13px] text-muted-foreground">
              Overview holds the decision. Hover a vital for the breakdown; inventory and sales are tabs.
            </p>
          )
        }
      </DetailPage>
    </ShellChrome>
  );
}

export function DashboardPageDemo() {
  const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  return (
    <ShellChrome>
      <DashboardPage
        header={
          <PageHeader title="Marketing overview" />
        }
        kpis={[
          <StatCard key="spend" label="Spend" value="$84K" delta={{ value: "6%", direction: "up", sentiment: "negative" }} caption="vs last period" />,
          <StatCard key="rev" label="Attributed revenue" value="$312K" delta={{ value: "11%", direction: "up" }} />,
          <StatCard key="roas" label="ROAS" value="3.7×" delta={{ value: "0.2×", direction: "up" }} />,
          <StatCard key="cpa" label="CPA" value="$18" delta={{ value: "4%", direction: "down", sentiment: "positive" }} />,
        ]}
        charts={[
          <ChartCard key="rev" title="Attributed revenue" value="$312K" delta={{ value: "11%", direction: "up" }}>
            <LineChart
              height={220}
              area
              xLabels={months}
              formatY={(n) => `$${Math.round(n / 1000)}K`}
              series={[{ data: [38, 42, 40, 51, 48, 62], label: "Revenue", className: "text-chart" }]}
            />
          </ChartCard>,
        ]}
      />
    </ShellChrome>
  );
}

type CampaignRow = { id: string; name: string; spend: string; roas: string };

const CAMPAIGNS: CampaignRow[] = [
  { id: "1", name: "Evergreen search", spend: "$18.4K", roas: "4.1×" },
  { id: "2", name: "Spring prospecting", spend: "$12.2K", roas: "2.8×" },
  { id: "3", name: "Retargeting — packs", spend: "$9.1K", roas: "5.2×" },
  { id: "4", name: "Brand exact", spend: "$6.8K", roas: "6.0×" },
];

const CAMPAIGN_COLUMNS: DataTableColumn<CampaignRow>[] = [
  { key: "name", header: "Campaign", minWidth: 220 },
  { key: "spend", header: "Spend", width: 100, align: "right" },
  { key: "roas", header: "ROAS", width: 80, align: "right" },
];

/** Two named jobs → two tabs. Not a default of three. */
export function DashboardPageTabsDemo() {
  const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  return (
    <ShellChrome>
      <DashboardPage
        header={
          <PageHeader title="Marketing" />
        }
        tabs={[
          { value: "overview", label: "Overview" },
          { value: "campaigns", label: "Campaigns" },
        ]}
        kpis={[
          <StatCard key="spend" label="Spend" value="$84K" delta={{ value: "6%", direction: "up", sentiment: "negative" }} caption="vs last period" />,
          <StatCard key="rev" label="Attributed revenue" value="$312K" delta={{ value: "11%", direction: "up" }} />,
          <StatCard key="roas" label="ROAS" value="3.7×" delta={{ value: "0.2×", direction: "up" }} />,
          <StatCard key="cpa" label="CPA" value="$18" delta={{ value: "4%", direction: "down", sentiment: "positive" }} />,
        ]}
        charts={[
          <ChartCard key="rev" title="Attributed revenue" value="$312K" delta={{ value: "11%", direction: "up" }}>
            <LineChart
              height={220}
              area
              xLabels={months}
              formatY={(n) => `$${Math.round(n / 1000)}K`}
              series={[{ data: [38, 42, 40, 51, 48, 62], label: "Revenue", className: "text-chart" }]}
            />
          </ChartCard>,
        ]}
      >
        {(tab) =>
          tab === "campaigns" ? (
            <DataTable
              columns={CAMPAIGN_COLUMNS}
              rows={CAMPAIGNS}
              getRowId={(r) => r.id}
              searchable
              searchPlaceholder="Search campaigns"
              unit="campaigns"
              maxHeight={280}
            />
          ) : null
        }
      </DashboardPage>
    </ShellChrome>
  );
}

const PL_PERIODS = [
  { key: "jan", label: "Jan" },
  { key: "feb", label: "Feb" },
  { key: "mar", label: "Mar" },
  { key: "apr", label: "Apr" },
  { key: "may", label: "May" },
  { key: "jun", label: "Jun", partial: true },
];

export function ReportPageDemo() {
  const [range, setRange] = React.useState<DateRangeValue | undefined>(undefined);
  return (
    <ShellChrome>
      <ReportPage
        header={
          <PageHeader
            title="Profit and loss"
            actions={
              <DateRangePicker value={range} onValueChange={setRange} align="end" today={new Date(2026, 6, 19)} />
            }
          />
        }
        chart={
          <ChartCard title="Gross profit" value="$14.3M" delta={{ value: "8%", direction: "up" }}>
            <LineChart
              height={200}
              area
              xLabels={PL_PERIODS.map((p) => p.label)}
              formatY={(n) => `$${(n / 1e6).toFixed(1)}M`}
              series={[{ data: [2.1, 1.9, 2.4, 2.8, 2.3, 2.9], label: "GP", className: "text-chart" }]}
            />
          </ChartCard>
        }
        table={
          <ReportTable
            metricLabel="Statement"
            periods={PL_PERIODS}
            sections={[
              {
                key: "rev",
                label: "Revenue",
                collapsible: true,
                rows: [
                  {
                    key: "rev",
                    label: "Revenue",
                    subtotal: true,
                    values: { jan: 3.3, feb: 2.9, mar: 3.7, apr: 4.4, may: 3.5, jun: 4.5 },
                    total: 22.3,
                    data: { fc: -4 },
                  },
                ],
              },
              {
                key: "gp",
                rows: [
                  {
                    key: "gp",
                    label: "Gross profit",
                    subtotal: true,
                    values: { jan: 2.1, feb: 1.9, mar: 2.4, apr: 2.8, may: 2.3, jun: 2.9 },
                    total: 14.4,
                    data: { fc: 2 },
                  },
                ],
              },
            ]}
            summaryColumns={[
              {
                key: "amount",
                label: "Amount",
                render: (r) => (r.total != null ? `$${r.total.toFixed(1)}M` : "—"),
              },
            ]}
            formatValue={(n) => `$${n.toFixed(1)}M`}
            maxHeight={280}
          />
        }
      />
    </ShellChrome>
  );
}

export function SettingsPageDemo() {
  const [digest, setDigest] = React.useState(true);
  return (
    <ShellChrome>
      <SettingsPage
        header={
          <PageHeader title="Notifications" />
        }
      >
        <Field label="Reply-to email" htmlFor="reply" hint="Used on customer-facing mail.">
          <Input id="reply" defaultValue="ops@curvgroup.com" />
        </Field>
        <Field label="Weekly digest" htmlFor="digest">
          <div className="flex h-9 items-center gap-3">
            <Switch id="digest" checked={digest} onCheckedChange={setDigest} />
            <span className="text-[13px] text-muted-foreground">Monday morning summary</span>
          </div>
        </Field>
        <div>
          <Button>Save</Button>
        </div>
      </SettingsPage>
    </ShellChrome>
  );
}

/** Teaching visual for the For AI page — what not to ship. */
export function DataWallDemo() {
  const tiles = [
    "Revenue", "MoM%", "Cover", "On hand", "Inbound", "Returns",
    "AOV", "Sessions", "ROAS", "CPA", "Refunds", "Open POs",
  ];
  return (
    <div className="grid grid-cols-3 gap-2 p-3">
      {tiles.map((label) => (
        <div key={label} className="rounded-lg border border-border bg-card px-3 py-2.5 shadow-card">
          <div className="text-[11px] text-muted-foreground">{label}</div>
          <div className="mt-1 text-[15px] font-semibold tabular-nums">—</div>
        </div>
      ))}
    </div>
  );
}
