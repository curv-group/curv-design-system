# How consistency actually works

> The canonical answer to "if I change a component here, does it really update
> every OS?" and "do we need to keep running an agent to keep things consistent?"

Short version: **propagating a change is automatic; keeping *new* work on-system
is enforced in layers — and the top layer is a skill that loads itself, not a
person babysitting an agent.**

---

## Two different questions, two different answers

People conflate these. Separate them and it's clear.

### 1. "I changed a component. Do all the OS's get it?" → Automatic. No agent.

Once an OS **imports** a component (`import { Button } from "@curvgroup/design-system"`),
a change here flows out as plumbing:

1. Change the component, merge to `main`.
2. Bump the version (semver: patch/minor for restyles, major for breaking API).
3. Publish to the package registry.
4. **Renovate** (configured in each OS repo) sees the new version and opens a
   "bump `@curvgroup/design-system`" PR in every app.
5. CI runs; non-breaking bumps **auto-merge**, breaking ones wait for a human.

You changed it in **one place**. No agent is involved — an app that *uses* the
component gets the new version on install. A restyle here becomes a green
auto-merge PR everywhere within minutes.

> The nuance: semver is about the **API**, not the look. A pure restyle is
> "non-breaking" → it auto-merges and changes every app's appearance at once.
> That's the point — but it means restyle discipline matters (verify in-browser,
> review before publishing).

### 2. "Does *new* work actually build on the system?" → Enforced, not automatic.

A package **cannot force anyone to use it.** When someone builds a net-new page,
or a pattern that has no component yet, nothing structural stops them from
hand-rolling a button, dropping a raw hex, or inventing a second KPI style. This
is the half Jonas is really pointing at — and it's what the enforcement layers
below exist for.

---

## The four enforcement layers (strongest first)

| Layer | What it enforces | Needs an agent? |
|---|---|---|
| **1. Components** | `AppFrame` / `Sidebar` / `DataTable` — deviation is *structurally impossible*. Consuming apps never rebuild a cradle, so that whole class of mistake disappears. | No |
| **2. `@curvgroup/design-system/eslint`** | Mechanical, deterministic, **fails CI**: bans full uppercase / `tracking-wider`, over-round radii, raw hex in `className`. | No |
| **3. `curv-ui` skill** | "Read `design-system.md` first, reach for a shared component before hand-rolling." It **auto-loads** whenever UI is written. | It *is* the agent — but automatic |
| **4. `design-review` agent** | The taste layer lint can't see: clutter, weak hierarchy, hand-rolled copies of shared components. Runs **on the diff (at PR time)**. | Yes — but on diffs, not perpetually |

Layers 1–2 are machine-enforced. Layers 3–4 keep humans and agents honest for
the parts that *aren't* a shared component yet.

---

## Why "keep running an agent" is the wrong mental model

The design system **ships its own skills and docs** (`skills/`, `docs/`, `agents/`
are in the published package). So "reference this system" isn't a person nagging
an agent — it's a skill that **loads by default** the moment Claude Code touches
UI in an OS repo. Jonas's "just keep running an agent saying reference this
system" collapses into **"the skill is installed, so it always does."**
Set-and-forget, not babysit. And the design-review agent runs **on a PR's diff**,
not in a perpetual loop.

**One line for the exec conversation:**
> Propagating a *change* is automatic (versioning + Renovate — change it once).
> Keeping *new* work on-system is a skill that auto-loads + lint that fails CI +
> a review on PRs — not an agent anyone has to keep running.

---

## Honest caveat: what's not live yet

The structural half only pays off once (a) an OS actually **adopts** the shared
components, and (b) we've **published + wired the plumbing**. As of now:

- The package has **never been published** (still `0.0.0`).
- There's **no publish CI workflow**.
- **Renovate isn't configured** in the OS repos.
- The **skills aren't activated** in the OS repos (installed in `node_modules`
  ≠ active in `.claude/skills`).

So *today* it's still manual. The work that converts "keep running an agent"
into "it just happens" is exactly:

1. A **publish CI workflow** here (version tag → build → publish).
2. **Renovate config** in each OS repo (auto-merge minor/patch).
3. **Activate the skills** in each OS repo (symlink `node_modules/.../skills`
   into `.claude/skills`, or ship the system as a Claude Code plugin).

Once those three exist, Jonas's vision is real: change it once here, it flows
everywhere it's used, and every new page is built to spec by default.
