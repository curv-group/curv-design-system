# Consuming the design system in a Curv OS

`@curvgroup/design-system` is git-installed into each OS app. This is the one-time
**setup** that makes an OS look and behave like the others, plus the checklist to
verify it's wired correctly. Getting this right up front prevents the whole class
of "wrong background / raw colours / hand-rolled shell / it looks broken" drift —
every one of those is a missed step below.

## Quick checklist

- [ ] Dependency pinned to a **tag** (`#vX.Y.Z`) in `package.json` — not bare `main`
- [ ] `theme.css` imported in the app's global stylesheet (registers tokens **and** scans the built output)
- [ ] ESLint config imported (so the guards run — a `bg-neutral-100` must error)
- [ ] Pages use `AppFrame` + `PageContainer` — **no hand-rolled shell**
- [ ] Only semantic tokens in `className` — no raw Tailwind palette / hex

## 1. Install & pin

```bash
npm install github:jillesworks/curv-design-system#v0.3.0
```

It is **git-installed, not auto-updating** — npm locks the resolved commit in
`package-lock.json`, so nothing changes until you re-install. Pin to a **tag**
(not `main`) so builds are reproducible. To update later: bump the tag,
`npm install`, commit `package.json` + `package-lock.json`.

## 2. Import the theme (tokens **and** class scanning)

In your global stylesheet (e.g. `app/globals.css`), after Tailwind:

```css
@import "tailwindcss";
@import "@curvgroup/design-system/theme.css";
```

This one import does **two** things:

1. **Registers every token** — `bg-background`, `bg-card`, `bg-muted`,
   `text-foreground`, `border-border`, and the `verdict-*` / `chart-*` families.
   Without them those utilities don't exist, and you'll be tempted to reach for
   raw Tailwind colours (`bg-neutral-100`) — the drift.
2. **Points Tailwind at the design system's built output** — `theme.css` carries
   an `@source` for its own `dist/`, so the components' `className` utilities
   actually **generate**. (No separate `@source` line to add anymore.) Skip the
   theme import and the components render **unstyled** — the classic "why does it
   look broken?" symptom.

## 3. Wire the ESLint config (this is the enforcement)

```js
// eslint.config.js
import curv from "@curvgroup/design-system/eslint";

export default [
  ...curv,
  // …your app's framework rules (Next, React, import order)…
];
```

This is what catches raw palette colours (`bg-neutral-100`), raw hex, and
uppercase labels **in CI**, before they reach a screen. **Without this step, none
of the design-language guards run.** Verify: drop `bg-neutral-100` into any file
and run `npm run lint` — it must error (`curv/no-palette-utility`).

## 4. Use the shell — never hand-roll it

```tsx
import { AppFrame, TopBar, Sidebar, PageContainer } from "@curvgroup/design-system";

<AppFrame topBar={<TopBar … />} sidebar={<Sidebar>…</Sidebar>}>
  <PageContainer>            {/* or <PageContainer bleed> for a full-width table */}
    …page content…
  </PageContainer>
</AppFrame>
```

`AppFrame` owns the content background (`bg-background`), the dark cradle, the
sticky bar, and the sidebar. **Do not** wrap pages in your own
`min-h-screen bg-neutral-100 px-6 py-8` div — that re-implements `PageContainer`
with the wrong colour, and is the exact bug that this doc exists to prevent. If
`AppFrame`/`PageContainer` *almost* fit, improve them **in the design system** —
don't fork a local shell.

## 5. Style through tokens only

`bg-card`, `text-muted-foreground`, `border-border`,
`verdict-{green,amber,red}`, `chart-1…5` — **never** a raw Tailwind palette
utility (`bg-neutral-100`, `text-slate-500`) or a hex value. Step 3 enforces it;
step 2 makes it possible. (See `design-system.md` → *Surface hierarchy* and
*Semantic color* for which token means what.)

## 6. Point agents at the rules

Once, in the OS repo:

```bash
npx @curvgroup/design-system init-agent
```

That writes always-on Cursor / Claude / `AGENTS.md` rules so a prompt like “build the product screen” becomes a `DetailPage`. “Build the marketing overview” is a tabless `DashboardPage`. Two named jobs become two tabs. Humans do not name shells.

Copyable prompts: showcase **For AI** (`#/for-ai`). Copyable TSX: `examples/`.

Optional MCP in `.cursor/mcp.json`:

```json
{ "mcpServers": { "curv": { "command": "npx", "args": ["@curvgroup/design-system", "mcp"] } } }
```

Cheatsheet: `@curvgroup/design-system/docs/cheatsheet.md`.

## Updating an already-wired OS

```bash
npm install github:jillesworks/curv-design-system#vX.Y.Z   # bump the tag
git add package.json package-lock.json
git commit -m "chore: bump design-system to vX.Y.Z"
```

Then: *"the design system updated — re-run init-agent if the skill changed, and apply new shells/tokens to pages you touch."*

**What updates automatically vs. what needs a code change:** improvements baked
into a component you already use apply on install (e.g. a `PageHeader` size
change). *Applying a new rule to a page you already built* — setting a new prop,
restoring a dropped element, moving tabs — is a code change. The library can
ship a better `DataTable`; it can't decide *your* Name column should be 300px wide.
