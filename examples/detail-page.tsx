/**
 * Copy this into an OS entity page. Lead with the decision. At most four
 * vitals. Warehouses, POs, and history live in tabs — not on the overview.
 */
import {
  Badge,
  Banner,
  BreakdownRow,
  Button,
  DetailPage,
  PageHeader,
  StatCard,
} from "@curvgroup/design-system";

export function ProductPage() {
  return (
    <DetailPage
      tabs={[
        { value: "overview", label: "Overview" },
        { value: "inventory", label: "Inventory" },
        { value: "sales", label: "Sales" },
      ]}
      header={
        <PageHeader
          eyebrow="Catalog"
          title="Trail Pack 22L"
          badge={<Badge variant="amber">Low cover</Badge>}
          actions={<Button>Create PO</Button>}
        />
      }
      verdict={
        <Banner variant="warning" title="Reorder now — 27d cover, no open PO">
          Elk Grove is the constraint.
        </Banner>
      }
      vitals={[
        <StatCard
          key="cover"
          label="Cover"
          value="27d"
          delta={{ value: "9d", direction: "down", sentiment: "negative" }}
          breakdown={<BreakdownRow label="Elk Grove" value="11d" />}
        />,
        <StatCard key="onhand" label="On hand" value="412" />,
        <StatCard key="velocity" label="Velocity" value="14 / wk" />,
        <StatCard key="margin" label="Margin" value="41%" />,
      ]}
    >
      {(tab) =>
        tab === "inventory" ? (
          <p>Warehouse rows and inbound POs.</p>
        ) : tab === "sales" ? (
          <p>Channel mix and recent orders.</p>
        ) : (
          <p>Hover a vital for the breakdown. Extra data is in the other tabs.</p>
        )
      }
    </DetailPage>
  );
}
