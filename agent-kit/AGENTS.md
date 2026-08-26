# Curv OS UI

This app uses `@curvgroup/design-system`. When building or editing any screen:

1. Pick one page shell — `ListPage` (lists), `DetailPage` (one record, not a section home), `DashboardPage` (overview), `ReportPage` (P&L / workbook), `SettingsPage` (forms).
2. Copy `node_modules/@curvgroup/design-system/examples/<shell>.tsx`. One fitting job: `dashboard-page.tsx` (no tabs). Two named jobs: `dashboard-page-tabs.tsx`. Chart + table + row peek: `report-page-performance.tsx`. A record peek: `drawer.tsx` (full surface — drop unused slots). Wire real data. Do not add sections.
3. Tabs only when there is more than one job or a slot overflows. Count jobs — do not default to three tabs. Extra data goes in a tab, a drawer, or a hover — never a wall of cards. Page titles are the headline only — no eyebrow, no subtitle.
4. Import from the package. Never hand-roll `AppFrame`, `DataTable`, or a page layout.

Humans may describe the job in plain language (“build the product screen”). You still pick the shell. Do not ask them to name components.
