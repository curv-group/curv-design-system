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
| a P&L / statement / matrix | `ReportPage` |
| settings / a form / account | `SettingsPage` |

Chrome is `AppFrame` + `TopBar` + `Sidebar`. Never hand-roll those.

## The loop

1. Pick the shell. Copy `examples/<shell>.tsx` from this package (or the matching showcase page). Replace demo data. Do not add sections.
2. Import from `@curvgroup/design-system`. If a primitive almost fits, improve it in the design system — do not fork it.
3. If a field does not fit a slot, it goes in a **tab**, **drawer**, or **StatCard breakdown** — never a new card on the canvas.
4. Do not invent props. Read the component TSDoc or `docs/cheatsheet.md`.
5. Style through tokens (`bg-card`, `text-muted-foreground`, `verdict-*`). Never raw hex or `bg-neutral-100`.
6. Run `npm run lint` and fix token errors (they name the substitute). Taste review comments on the PR; it does not block merge.

## Slot limits (structural)

- `DetailPage.vitals` — max 4. Extra metrics → a tab or a hover breakdown.
- `DashboardPage.kpis` — max 5. `charts` — max 2. Extra → tabs.
- `ListPage` — header + optional `SummaryStrip` + one table. No KPI wall, no charts.
- `ReportPage` — header + one chart + `ReportTable`. No KPI strip.
- `SettingsPage` — narrow `Field`s. No dashboard chrome.

## Do not

- Dump every field on one canvas.
- Hand-roll a table, tab bar, or app shell.
- Name nothing: if they said “product screen,” that is `DetailPage` even if they never said the word.

Copyable examples live in the package at `examples/`. The north-star spec for humans is `docs/design-system.md` — grep a section when you need a recipe; do not load the whole file first.
