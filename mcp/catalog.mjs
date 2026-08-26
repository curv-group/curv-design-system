/**
 * Static catalog the Curv MCP answers against. Keep in sync with src/index.ts
 * and examples/. Agents search this instead of guessing APIs.
 */
export const SHELLS = [
  {
    name: "ListPage",
    intent: ["list", "table", "queue", "catalog", "customers", "deals", "orders", "sku list"],
    summary: "Header + optional SummaryStrip + one DataTable. Full bleed. No KPI wall, no chart. A chart + performance table is ReportPage.",
    import: "import { ListPage, PageHeader, DataTable } from \"@curvgroup/design-system\"",
    example: "examples/list-page.tsx",
    slots: ["header", "summary?", "table"],
    props: ["header", "summary", "table", "className"],
  },
  {
    name: "DetailPage",
    intent: ["detail", "product", "sku", "deal", "customer", "record", "entity"],
    summary: "One record (SKU, deal, customer) — not a section home. Verdict + max 4 vitals on the strip. Extra data in a tab, drawer, or hover.",
    import: "import { DetailPage, PageHeader, Banner, StatCard } from \"@curvgroup/design-system\"",
    example: "examples/detail-page.tsx",
    slots: ["tabs", "header", "verdict?", "vitals? (max 4)", "children", "drawer?"],
    props: ["tabs", "value", "defaultTab", "onTabChange", "header", "verdict", "vitals", "bleedTabs", "children", "drawer", "className"],
  },
  {
    name: "DashboardPage",
    intent: ["dashboard", "overview", "home", "marketing overview", "kpis", "analytics"],
    summary: "Centered glance. Max 5 KPIs, max 2 charts, optional table. Tabs only when there is more than one job — never a default of three. Extra metrics → a tab, not card 6–17.",
    import: "import { DashboardPage, PageHeader, StatCard, ChartCard } from \"@curvgroup/design-system\"",
    example: "examples/dashboard-page.tsx",
    examples: ["examples/dashboard-page.tsx", "examples/dashboard-page-tabs.tsx"],
    slots: ["header", "tabs?", "kpis? (max 5)", "charts? (max 2)", "table?"],
    props: ["header", "tabs", "value", "defaultTab", "onTabChange", "kpis", "charts", "table", "children", "className"],
  },
  {
    name: "ReportPage",
    intent: ["pnl", "p&l", "report", "statement", "finance", "matrix", "landing pages", "workbook", "performance"],
    summary: "Header + one chart + one table. Optional drawer for a row peek. Optional tabs when there is more than one report job. No KPI strip.",
    import: "import { ReportPage, PageHeader, ChartCard, ReportTable } from \"@curvgroup/design-system\"",
    example: "examples/report-page.tsx",
    examples: ["examples/report-page.tsx", "examples/report-page-performance.tsx"],
    slots: ["header", "tabs?", "chart", "table", "children?", "drawer?"],
    props: ["header", "tabs", "value", "defaultTab", "onTabChange", "chart", "table", "children", "drawer", "className"],
  },
  {
    name: "SettingsPage",
    intent: ["settings", "form", "account", "preferences"],
    summary: "Narrow form. Field around every control. No dashboard chrome.",
    import: "import { SettingsPage, PageHeader, Field, Input } from \"@curvgroup/design-system\"",
    example: "examples/settings-page.tsx",
    slots: ["header", "children"],
    props: ["header", "children", "className"],
  },
];

export const COMPONENTS = [
  { name: "AppFrame", group: "shell", summary: "Dark cradle + top bar + sidebar. Every OS.", props: ["topBar", "sidebar", "children"] },
  { name: "TopBar", group: "shell", summary: "Global dark bar.", props: ["logo", "center", "actions", "className"] },
  { name: "Sidebar", group: "shell", summary: "Left nav.", props: ["children", "className"] },
  { name: "PageContainer", group: "shell", summary: "Width: size or bleed. Prefer a page shell.", props: ["size", "bleed", "className", "children"] },
  { name: "PageHeader", group: "shell", summary: "Title + optional count/badge/actions. Omit eyebrow and description on a page shell.", props: ["title", "eyebrow", "count", "badge", "description", "actions", "className"] },
  { name: "Button", group: "forms", summary: "The one button.", props: ["variant", "size", "loading", "className", "children"] },
  { name: "Input", group: "forms", summary: "h-9 text field.", props: ["className"] },
  { name: "Field", group: "forms", summary: "Label + hint/error wrapper.", props: ["label", "hint", "error", "htmlFor", "children", "className"] },
  { name: "Select", group: "forms", summary: "Styled dropdown.", props: ["items", "value", "defaultValue", "onValueChange", "placeholder", "className"] },
  { name: "DataTable", group: "data", summary: "The one table. Filters in the toolbar.", props: ["columns", "rows", "searchable", "filters", "tabs", "getRowHref", "exportFilename", "loading"] },
  { name: "StatCard", group: "data", summary: "One hero number. Compose with StatGroup via a shell.", props: ["label", "value", "delta", "caption", "sparkline", "hint", "href", "breakdown", "loading"] },
  { name: "SummaryStrip", group: "data", summary: "Full-width breakdown above a list table.", props: ["label", "total", "caption", "items", "hideBar"] },
  { name: "ChartCard", group: "data", summary: "Chart chrome. Chart stays a dumb primitive.", props: ["title", "value", "delta", "controls", "legend", "loading", "children"] },
  { name: "LineChart", group: "data", summary: "Trend primitive. Must be hoverable at chart size.", props: ["series", "xLabels", "height", "area", "formatY"] },
  { name: "ReportTable", group: "data", summary: "P&L / matrix grid.", props: ["sections", "periods", "summaryColumns", "view", "formatValue"] },
  { name: "Banner", group: "feedback", summary: "Rare page-level callout. Max one per view.", props: ["variant", "title", "children", "actions", "onDismiss"] },
  { name: "Drawer", group: "feedback", summary: "Right-edge record peek (Linear / Shopify sheet). Showcase is the full surface — OS apps may use a subset. Copy examples/drawer.tsx.", example: "examples/drawer.tsx", props: ["trigger", "open", "defaultOpen", "onOpenChange", "side", "size", "title", "description", "badge", "headerActions", "children", "footer"] },
  { name: "DrawerSection", group: "feedback", summary: "Sentence-case block label inside a drawer.", props: ["title", "children", "className"] },
  { name: "DrawerRow", group: "feedback", summary: "Property row: muted label left, value or control right.", props: ["label", "children"] },
  { name: "Tabs", group: "nav", summary: "Page-level view bar. Prefer DetailPage which owns this.", props: ["items", "value", "defaultValue", "onValueChange", "bar"] },
];

export function search(query) {
  const q = String(query || "").toLowerCase().trim();
  const words = q.split(/\s+/).filter(Boolean);
  const matches = (hay) => {
    const h = hay.toLowerCase();
    if (!q) return true;
    if (h.includes(q)) return true;
    return words.every((w) => h.includes(w));
  };
  const hits = [];
  for (const s of SHELLS) {
    const hay = [s.name, s.summary, ...(s.intent || [])].join(" ");
    if (matches(hay) || s.intent.some((i) => q.includes(i))) {
      hits.push({ type: "shell", score: s.intent.some((i) => q.includes(i)) ? 10 : 4, ...s });
    }
  }
  for (const c of COMPONENTS) {
    const hay = [c.name, c.summary, c.group].join(" ");
    if (matches(hay) || q.includes(c.name.toLowerCase())) {
      hits.push({ type: "component", score: matches(c.name) ? 8 : 2, ...c });
    }
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, 12);
}

export function composePage(intent) {
  const q = String(intent || "").toLowerCase();
  const ranked = SHELLS.map((s) => ({
    ...s,
    score: s.intent.reduce((n, i) => n + (q.includes(i) ? i.length : 0), 0),
  })).sort((a, b) => b.score - a.score);
  const best = ranked[0].score > 0 ? ranked[0] : SHELLS.find((s) => s.name === "DetailPage");
  return {
    shell: best.name,
    reason: best.summary,
    import: best.import,
    example: best.example,
    examples: best.examples || [best.example],
    slots: best.slots,
    rule: "Count jobs. Copy the matching example. One fitting job → no page tabs (examples/dashboard-page.tsx). N named jobs → N tabs (examples/dashboard-page-tabs.tsx). Never invent Overview / Reporting / Marketing. Chart + long table + row peek → ReportPage (examples/report-page-performance.tsx). Extra fields go in a tab, drawer, or hover — never a new card.",
  };
}

export function getComponent(name) {
  const key = String(name || "");
  const shell = SHELLS.find((s) => s.name.toLowerCase() === key.toLowerCase());
  if (shell) return { found: true, type: "shell", ...shell };
  const comp = COMPONENTS.find((c) => c.name.toLowerCase() === key.toLowerCase());
  if (comp) return { found: true, type: "component", ...comp };
  return { found: false, name: key, suggestions: search(key).map((h) => h.name) };
}

export function validateUsage({ component, props }) {
  const info = getComponent(component);
  if (!info.found) return { ok: false, ...info };
  const allowed = new Set(info.props || []);
  const planned = Array.isArray(props) ? props : Object.keys(props || {});
  const documented = [];
  const notDocumented = [];
  for (const p of planned) {
    if (allowed.has(p) || p === "className" || p === "children") documented.push(p);
    else notDocumented.push(p);
  }
  return {
    ok: notDocumented.length === 0,
    component: info.name,
    documented,
    notDocumented,
    hint: notDocumented.length
      ? `Unknown props: ${notDocumented.join(", ")}. Allowed: ${[...allowed].join(", ")}.`
      : "All props are documented.",
  };
}
