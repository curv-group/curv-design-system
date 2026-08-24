# Curv OS — Claude

This app uses `@curvgroup/design-system`. Follow the `curv-ui` skill for every UI change.

- Page shells only: `ListPage`, `DetailPage`, `DashboardPage`, `ReportPage`, `SettingsPage`.
- Copy `node_modules/@curvgroup/design-system/examples/<shell>.tsx` and wire data.
- Extra fields go in tabs / drawers / hovers. Never a data wall.
- Tokens only. Lint errors name the substitute — fix them. Taste review comments; it does not block merge.

Plain-language requests still map to a shell. Do not require the user to say `DetailPage`.
