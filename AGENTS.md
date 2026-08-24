# Curv OS UI

This app uses `@curvgroup/design-system`. When building or editing any screen:

1. Pick one page shell — `ListPage` (lists), `DetailPage` (one record), `DashboardPage` (overview), `ReportPage` (P&L), `SettingsPage` (forms).
2. Copy `node_modules/@curvgroup/design-system/examples/<shell>.tsx`. Wire real data. Do not add sections.
3. Extra data goes in a tab, a drawer, or a hover — never a wall of cards.
4. Import from the package. Never hand-roll `AppFrame`, `DataTable`, or a page layout.

Humans may describe the job in plain language (“build the product screen”). You still pick the shell. Do not ask them to name components.

See `.cursor/rules/curv.mdc` and the `curv-ui` skill.
