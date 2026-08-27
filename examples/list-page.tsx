/**
 * Copy this into an OS page. Swap the rows for real data. Do not add KPI cards
 * or charts — five StatCards fail this shell (use SummaryStrip, or pick
 * DashboardPage). A chart + performance table is ReportPage, not a list.
 */
import {
  Avatar,
  Button,
  DataTable,
  type DataTableColumn,
  ListPage,
  PageHeader,
  SummaryStrip,
  TableLink,
} from "@curvgroup/design-system";

type Row = { id: string; name: string; orders: number; revenue: number };

const columns: DataTableColumn<Row>[] = [
  {
    key: "name",
    header: "Customer",
    minWidth: 240,
    leading: (r) => <Avatar name={r.name} size="sm" className="rounded-[4px]" />,
    render: (r) => <TableLink href={`/customers/${r.id}`}>{r.name}</TableLink>,
    value: (r) => r.name,
  },
  { key: "orders", header: "Orders", width: 100, align: "right" },
  { key: "revenue", header: "Revenue", width: 120, align: "right" },
];

const rows: Row[] = [
  { id: "1", name: "Adventure Works", orders: 18, revenue: 184200 },
];

export function CustomersPage() {
  return (
    <ListPage
      header={<PageHeader title="Customers" count={String(rows.length)} actions={<Button>Add customer</Button>} />}
      summary={
        <SummaryStrip
          label="Revenue by status"
          total="$184K"
          items={[{ label: "Active", value: "$184K", share: 100, colorClassName: "bg-verdict-green" }]}
        />
      }
      table={
        <DataTable
          columns={columns}
          rows={rows}
          getRowId={(r) => r.id}
          getRowHref={(r) => `/customers/${r.id}`}
          searchable
          unit="customers"
        />
      }
    />
  );
}
