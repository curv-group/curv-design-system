# @curvgroup/design-system

The shared **npm package** for every Curv OS (Revenue OS, Product OS, Marketing OS, …). One install, one visual language. We do **not** copy components into each app (the shadcn/ReUI model) — a restyle here updates every OS that depends on this package.

It ships four layers:

1. **Theme tokens** (`theme.css`) — color, type, elevation, verdict/chart vocabulary.
2. **Primitives** — `AppFrame`, `DataTable`, `StatCard`, `Tabs`, …
3. **Page shells** — `ListPage`, `DetailPage`, `DashboardPage`, `ReportPage`, `SettingsPage`. They encode IA: extra data has no canvas slot except a tab, a drawer, or a hover. Tabs are optional — one fitting job has none; N named jobs become N tabs. Never invent Overview / Reporting / Marketing.
4. **Agent kit** — a short always-on skill, an installer, and an MCP server so Cursor / Claude / Codex pick a shell from a plain-language prompt.

> Parts make everyone use the same UI. Shells make everyone use the same page. Skills tell the agent which shell. Humans never have to say `DetailPage`.

---

## Consuming it in an OS app

**1. Install** (git pin until GitHub Packages publish is live):

```bash
npm install github:curv-group/curv-design-system#v0.3.0
```

**2. Import the theme** after Tailwind:

```css
@import "tailwindcss";
@import "@curvgroup/design-system/theme.css";
```

**3. Wire ESLint** (token errors fail CI; density is warn-only and will not trap a PR):

```js
import curv from "@curvgroup/design-system/eslint";
export default [...curv];
```

**4. Use a page shell**, not a pile of primitives:

```tsx
import { DetailPage, PageHeader, Banner, StatCard } from "@curvgroup/design-system";
```

**5. Point agents at the rules** (once per OS repo):

```bash
npx @curvgroup/design-system init-agent
```

That writes `.cursor/rules/curv.mdc`, `.claude/skills/curv-ui`, `AGENTS.md`, and `CLAUDE.md`. Optional MCP:

```json
{ "mcpServers": { "curv": { "command": "npx", "args": ["@curvgroup/design-system", "mcp"] } } }
```

Copyable examples live in `examples/`. How to prompt (plain language, no shell names) is on the showcase **For AI** page (`npm run dev` → `#/for-ai`).

---

## Page shells (pick one)

| Screen | Shell | What does not fit |
| --- | --- | --- |
| List / queue / catalog | `ListPage` | KPI walls, charts |
| One record (SKU, deal, customer) | `DetailPage` | A 5th vital; a section home (Analytics) |
| Overview / home | `DashboardPage` | A 6th KPI or 3rd chart; a default of three tabs |
| P&L / landing pages / workbook | `ReportPage` | A KPI strip |
| Settings / form | `SettingsPage` | Dashboard chrome |

Tabs are optional. One job that fits → no page tabs. N named jobs → N tabs.
Never invent Overview / Reporting / Marketing unless they named those jobs.
Copy `examples/dashboard-page.tsx` (one job) or `examples/dashboard-page-tabs.tsx`
(two jobs). A row peek is a Drawer (`examples/drawer.tsx` for the full surface;
`examples/report-page-performance.tsx` for a peek on a report). Showcase demos
show every slot; OS apps drop what they do not need.

---

## Staying up to date

Versioned package. Change a component here, bump, OS apps pull the new version. Restyles are patches; API breaks are majors.

---

## Enforcement

1. **Shells + primitives** — structurally hard to rebuild the cradle or dump 20 cards into `vitals`.
2. **ESLint errors** — no hex, no `bg-neutral-100`, no uppercase. One-line fixes. These fail CI.
3. **ESLint warnings** — missing page shell / StatCard wall. They do **not** fail CI.
4. **`curv-ui` skill** — maps “product screen” → `DetailPage`. Always on after `init-agent`.
5. **design-review** — PR **comments**. Not a required GitHub check.

## What lives here

```
src/components/pages/   ListPage, DetailPage, DashboardPage, ReportPage, SettingsPage
examples/               copyable TSX agents clone
agent-kit/              AGENTS.md, CLAUDE.md, Cursor rule
bin/cli.mjs             init-agent + mcp
mcp/                    search, compose_page, get_component, validate_usage
skills/curv-ui/         short always-on skill (OS apps)
skills/motion-system/   how to apply the motion scale
skills/find-animation-opportunities/  hunt for missing motion (read-only)
skills/review-animations/             review existing motion
site/                   showcase (For AI + live shells) — npm run dev → :6006
docs/                   design-system.md (human spec), cheatsheet.md, llms.txt
```

Owned by design (Jilles); consumed by every OS team.
