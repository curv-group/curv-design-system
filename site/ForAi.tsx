import * as React from "react";
import { PageContainer } from "../src";
import { DataWallDemo } from "./shell-demos";

function CopyBlock({ label, prompt }: { label: string; prompt: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(prompt).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  };
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-card">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[13px] font-medium text-foreground">{label}</p>
        <button
          type="button"
          onClick={copy}
          className="rounded-md px-2 py-1 text-[12px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="whitespace-pre-wrap text-[13px] leading-relaxed text-foreground/90">{prompt}</pre>
    </div>
  );
}

const INSTALL = `Install or update @curvgroup/design-system in this OS, follow its consuming-in-an-os setup (theme + ESLint + AppFrame), and run the package CLI init-agent so Cursor/Claude/Codex get the Curv rules. Then confirm the app builds.`;

const LIST = `Build the customers list. Search and filters on the table. Click a row to open the customer.`;
const DETAIL = `Build the product screen for a SKU. I need to know if we should reorder. Show stock, suppliers, and sales — but not all on one canvas.`;
const DASH = `Build the marketing overview. A few KPIs and one chart. The full table is a separate view.`;
const BAD = `Show all SKU fields, every warehouse, every supplier, MoM%, returns, and the full PO history on one page.`;
const GOOD = `Build the product screen. The first question is reorder or not. Warehouses and POs can live in tabs.`;

export function ForAiPage({ version }: { version: string }) {
  const install = INSTALL.replace("this OS", `this OS (pin github:jillesworks/curv-design-system#v${version})`);
  return (
    <PageContainer>
      <div className="mb-10 max-w-2xl">
        <div className="text-[12px] font-medium text-muted-foreground">For AI</div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">How to prompt</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          You do not need to name components. Describe the job: who opens the screen and what they
          need to decide. If the design system is installed in the repo, the agent picks the right
          page and puts extra data in tabs.
        </p>
      </div>

      <section className="mb-10 max-w-2xl">
        <h2 className="text-sm font-semibold text-foreground">Once: install</h2>
        <p className="mt-1.5 mb-3 text-[13px] text-muted-foreground">
          Paste this in Cursor or Claude inside your OS repo. You do not need to understand the
          technical pin — it is in the copied text.
        </p>
        <CopyBlock label="Set up this OS" prompt={install} />
      </section>

      <section className="mb-10 max-w-2xl space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Then: describe the screen</h2>
        <p className="text-[13px] text-muted-foreground">
          Say what the person is trying to do. Naming Button or DetailPage is optional.
        </p>
        <CopyBlock label="A list" prompt={LIST} />
        <p className="text-[12px] text-muted-foreground">Works because a list is one table, not a dashboard.</p>
        <CopyBlock label="One record" prompt={DETAIL} />
        <p className="text-[12px] text-muted-foreground">Works because it names the decision and asks for tabs, not a dump.</p>
        <CopyBlock label="An overview" prompt={DASH} />
        <p className="text-[12px] text-muted-foreground">Works because extra data is a separate view.</p>
      </section>

      <section className="mb-10 max-w-2xl space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Bad → good</h2>
        <CopyBlock label="Avoid — everything on one canvas" prompt={BAD} />
        <CopyBlock label="Use instead" prompt={GOOD} />
      </section>

      <section className="max-w-3xl">
        <h2 className="text-sm font-semibold text-foreground">What that looks like</h2>
        <p className="mt-1.5 mb-4 text-[13px] text-muted-foreground">
          Same SKU. Left is the data wall. Right is a verdict, a few vitals, and tabs.
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-[12px] font-medium text-muted-foreground">Don&rsquo;t</p>
            <div className="overflow-hidden rounded-lg border border-border bg-muted">
              <DataWallDemo />
            </div>
          </div>
          <div>
            <p className="mb-2 text-[12px] font-medium text-muted-foreground">Do</p>
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="flex gap-3 border-b border-border pb-2 text-[12px]">
                <span className="font-medium text-foreground">Overview</span>
                <span className="text-muted-foreground">Inventory</span>
                <span className="text-muted-foreground">Sales</span>
              </div>
              <p className="mt-3 text-[12px] font-medium text-verdict-amber">Reorder now — 27d cover</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {["Cover 27d", "On hand 412", "Velocity 14/wk", "Margin 41%"].map((t) => (
                  <div key={t} className="rounded-md bg-muted px-2 py-2 text-[12px] text-foreground">
                    {t}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[12px] text-muted-foreground">Warehouses live in Inventory. History lives in Sales.</p>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
