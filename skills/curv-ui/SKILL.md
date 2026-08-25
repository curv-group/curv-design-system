---
name: curv-ui
description: >-
  Build or edit any Curv OS screen (Revenue OS, Product OS, Marketing OS, …).
  Maps a plain-language page request to a page shell from @curvgroup/design-system.
  Use whenever a task adds or changes a page, layout, table, card, nav, or
  visual component.
---

# Building UI in a Curv OS

Every screen is one page shell from `@curvgroup/design-system`. Humans describe
the job in plain language; you pick the shell. Do not invent a layout.

## Pick one shell

| They say | You use |
| --- | --- |
| a list / queue / catalog / table of records | `ListPage` |
| a product / deal / customer / SKU / one record | `DetailPage` |
| an overview / home / dashboard | `DashboardPage` |
| a P&L / statement / landing-page performance / workbook | `ReportPage` |
| settings / a form / account | `SettingsPage` |

Chrome is `AppFrame` + `TopBar` + `Sidebar`. Never hand-roll those.

**Page titles are the headline only.** `PageHeader` is `title`, optional
`count` / `badge`, optional `actions`. No eyebrow, no subtitle — the sidebar
already locates you. If the title is unclear, rename it.

**DetailPage is one record**, not a section home. “Analytics” / “Marketing” in
the sidebar is a Dashboard or Report, never Detail — the four vitals cap is the
headline strip on a SKU, not a cap on the whole product.

## Tabs — only when there is more than one job

Do **not** default to three tabs (or any fixed set). Count **jobs**, then tab.

- **One job that fits the shell** → no page tabs. A customers list, a settings
  form, a P&L, a marketing overview with ≤5 KPIs and ≤2 charts.
- **One job that overflows** (6th KPI, 3rd chart, another table) → add a tab
  for the extra job. Do not add cards. Do not make a super-long scroll.
- **N named jobs in the prompt** (“glance and a monthly workbook”, “overview
  and landing pages”) → **N tabs**. Each tab is still one shell. Copy
  `examples/dashboard-page.tsx` (no tabs) or `examples/dashboard-page-tabs.tsx`
  (two jobs) — never invent Overview / Reporting / Marketing unless they named
  those jobs. Chart + long table + row peek is
  `examples/report-page-performance.tsx`, not a Dashboard and not a List.

Page tabs are the top-most bar under the app chrome (`DashboardPage` / `DetailPage`
/ `ReportPage` `tabs` prop). Table chips (All / Confirmed) stay on `DataTable`.
A peek at one row is a `Drawer`, not a new tab.

## The loop

1. Count jobs. Pick the shell. Copy `examples/<shell>.tsx`. Replace demo data.
   Do not add sections.
2. Import from `@curvgroup/design-system`. If a primitive almost fits, improve
   it in the design system — do not fork it.
3. If a field does not fit a slot, it goes in a **tab**, **drawer**, or
   **StatCard breakdown** — never a new card on the canvas.
4. Do not invent props. Read the component TSDoc or `docs/cheatsheet.md`.
5. Style through tokens (`bg-card`, `text-muted-foreground`, `verdict-*`).
   Sentence case. Never raw hex, `bg-neutral-100`, or CSS `uppercase`.
6. Run `npm run lint` and fix token errors (they name the substitute). Taste
   review comments on the PR; it does not block merge.

## Slot limits (structural)

- `DetailPage.vitals` — max 4 on the strip. The rest of that record is tabs /
  drawer / hover, not a fifth card.
- `DashboardPage.kpis` — max 5. `charts` — max 2. Extra → a tab, not card 6–17.
- `ListPage` — header + optional `SummaryStrip` + one table. No KPI wall.
- `ReportPage` — header + one chart + table. Optional `drawer` for a row peek
  (`examples/report-page-performance.tsx`). No KPI strip.
- `SettingsPage` — narrow `Field`s. No dashboard chrome.

## Do not

- Dump every field on one canvas.
- Hand-roll a table, tab bar, or app shell.
- Always emit Overview / Reporting / Marketing tabs.
- Use `DetailPage` for a section overview (Analytics, Marketing home).
- Name nothing: if they said “product screen,” that is `DetailPage` even if
  they never said the word.

Copyable examples live in the package at `examples/`. The north-star spec for
humans is `docs/design-system.md` — grep a section when you need a recipe; do
not load the whole file first.
