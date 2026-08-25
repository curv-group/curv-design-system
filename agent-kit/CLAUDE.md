# Curv OS — Claude

This app uses `@curvgroup/design-system`. Follow the `curv-ui` skill for every UI change.

- Page shells only: `ListPage`, `DetailPage`, `DashboardPage`, `ReportPage`, `SettingsPage`.
- `DetailPage` is one record (SKU, customer). Section homes (Analytics, Marketing) are Dashboard or Report.
- Copy `node_modules/@curvgroup/design-system/examples/<shell>.tsx` and wire data.
  One job: `dashboard-page.tsx`. Two jobs: `dashboard-page-tabs.tsx`. Workbook
  with a row peek: `report-page-performance.tsx`.
- Tabs: one fitting job → none. Overflow or N named jobs → N tabs. Do not default to three.
- Extra fields go in tabs / drawers / hovers. Never a data wall.
- Tokens only. Sentence case; no CSS `uppercase`. Lint errors name the substitute — fix them. Taste review comments; it does not block merge.

Plain-language requests still map to a shell. Do not require the user to say `DetailPage`.
