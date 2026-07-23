---
name: redesign-brief
description: >-
  Run BEFORE redesigning or building any data-dense page in a Curv OS — a detail
  page, dashboard, report, or table. It forces the product-thinking pass (whose
  job is this page, what decisions does it serve, what is the least that serves
  them) and produces a written brief with a cut-list BEFORE a single component is
  placed. Use for any "redesign / rebuild / make this page better" task, and for
  any new page that shows data. Pairs with curv-ui (how it should look) and the
  design-review agent (the after-check).
---

# Redesign brief — decide what the page is FOR before you build it

Most page redesigns fail the same way: they take the existing page and *move the
boxes around*. The giveaway sentence is **"same information, reorganized."** That
is a **redesign** (relayout) when the job needed a **rethink** (decide what the
page is for, then earn every element back from zero). Reorganizing a page that
shows the wrong things — or buries its own answer — just yields a tidier version
of the same problem.

This skill is the **product pre-flight**. It runs *before* `curv-ui`'s
how-it-looks rules, and its only output is a written brief that the build must
conform to.

## When to run this

- **Run it for:** "redesign / rebuild / improve this page", and any new page that
  shows data (detail page, dashboard, report, table, overview).
- **Skip it for:** a copy fix, a single-component swap, a bug fix, a spacing
  tweak — go straight to `curv-ui`.

## The one rule

**Start from the decision, not the existing page.** An element earns a place on
the page *only* if it changes what the user does next. Default to deletion; every
metric, chart, and label must justify why it survives.

> Don't preserve the page — start over. Someone opens this screen. What 1–3
> decisions are they trying to make? What is the *least* information that lets
> them decide, and the single clearest way to show it? You may delete metrics,
> merge them, or change how they're drawn. **Justify anything you keep — if it
> doesn't drive a decision, it's cut.**

## Produce the brief first — write it down, don't skip to building

Post this (in the PR description or the task) *before placing a single
component*, so a human can veto it before any code exists:

1. **Who opens this page, and why now?** The trigger is usually an alert, a
   review, or a task — not idle browsing. Design for the question that *brought
   them here*.
2. **The 1–3 decisions.** Concrete verbs: reorder before stockout, cut a dying
   SKU, chase a margin drop, escalate a lead. Not "understand the product."
3. **The minimum signal per decision.** The fewest numbers that resolve it.
4. **The verdict that leads.** The one thing the page says the instant it loads.
5. **The cut-list.** Every element on the old page → mapped to a decision, *or*
   struck out with a reason ("cut: MoM% — noise on a single SKU"). Anything that
   maps to nothing is cut.

## The anti-patterns this kills (Curv has shipped every one of these)

- **Vanity metrics.** Numbers on the page because the data exists, not because
  anyone acts on them. (A product page once rendered **"▲ 223,636% MoM"** — a
  division blow-up on a new SKU that helps no one. Revenue-as-hero on a
  single-SKU page is the same disease: revenue is a *result* of the levers, not
  a lever.)
- **Data-first instead of answer-first.** The page's own conclusion —
  *"Low cover, no open PO — reorder now"* — sat buried beneath twelve tiles. Lead
  with the **verdict**; the numbers are evidence you expand *only if the verdict
  says to look*.
- **Relocation masquerading as redesign.** Moving a field into a tab, adding an
  eyebrow, stacking a caption — all "same information, reorganized." Subtract,
  don't relocate.
- **Rendering instead of interpreting.** A metric the page refuses to judge —
  "Elk Grove **−1** on hand" shown in calm gray as if it's fine; "**9.1%**
  returns" in plain black (fine, or a fire?). Flag anomalies; state whether a
  value is healthy or a problem. The page should tell you what's *true* and what
  to *do*, not just what the number is.
- **Everything at one weight.** If your eye doesn't land on one thing first, the
  hierarchy failed.
- **Distilling away signal.** "Subtract" means cut *noise* — controls, labels,
  metrics that drive no decision. It is NOT license to replace a
  high-information element with a lower-information generic one. If an element
  answers a real decision question ("where is my catalog value locked up?"), you
  *preserve or rebuild* it with design-system primitives — you never downgrade it
  to standard tiles to satisfy a consistency rule. Deleting signal to look
  uniform is the failure, not the goal.

## The shape most Curv data pages want: lead with the verdict

1. **Verdict + the one action.** Big, at the top. "Reorder now — 27d cover, no
   open PO", with the action attached. If healthy, say so in a line and let them
   leave in two seconds — that's a win, not a wasted page.
2. **The 3–4 vital signs** that drive the decision — each with *direction* and a
   *judgment* (good/bad), never a bare number.
3. **Trends as evidence** — the sparklines / charts that explain the vitals.
4. **Composition & detail** — everything else, behind tabs / progressive
   disclosure. Reachable, not front-and-centre.

## Then hand off

Once the brief is agreed: build with **`curv-ui`** (tokens, shared components,
concentric radius, taste) and close with the **design-review agent**. Division of
labour — **this skill decides WHAT earns a place; `curv-ui` decides HOW it looks;
design-review checks both.**
