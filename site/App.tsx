import * as React from "react";
import { createPortal } from "react-dom";
import {
  AppFrame,
  CommandPalette,
  type CommandItem,
  Dialog,
  DialogClose,
  PageContainer,
  Sidebar,
  SidebarItem,
  SidebarSection,
  TopBar,
  cn,
} from "../src";
import { Logo } from "./logo";
import { ForAiPage } from "./ForAi";
import { COMPONENTS, GROUP_ORDER, PREVIEWS, type Demo, type Entry } from "./registry";
import pkg from "../package.json";

/* ---------- routing (hash) ---------- */

function useRoute() {
  const read = () => window.location.hash.replace(/^#\/?/, "") || "overview";
  const [route, setRoute] = React.useState(read);
  React.useEffect(() => {
    const onHash = () => setRoute(read());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const navigate = React.useCallback((slug: string) => {
    window.location.hash = slug === "overview" ? "" : `/${slug}`;
    window.scrollTo({ top: 0 });
  }, []);
  return { route, navigate };
}

/* ---------- chrome ---------- */

function TopSearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden>
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function SiteTopBar({
  onHome,
  onOpenCmd,
  onInstall,
  version,
}: {
  onHome: () => void;
  onOpenCmd: () => void;
  onInstall: () => void;
  version: string;
}) {
  return (
    <TopBar
      logo={
        <button onClick={onHome} aria-label="Home" className="flex items-center pl-1">
          <Logo className="h-[18px] w-auto" />
        </button>
      }
      center={
        // A search-field-shaped button that opens the ⌘K palette (dogfoods
        // CommandPalette instead of an inline filter).
        <button
          onClick={onOpenCmd}
          className="flex h-9 w-full max-w-xl items-center gap-2 rounded-md bg-white/10 px-3 text-[13px] text-white/45 transition hover:bg-white/15"
        >
          <span className="text-white/50">
            <TopSearchIcon />
          </span>
          <span className="flex-1 text-left">Search components</span>
          <span className="rounded border border-white/15 px-1.5 py-0.5 text-[11px] font-medium text-white/55">
            ⌘K
          </span>
        </button>
      }
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={onInstall}
            className="flex h-7 items-center rounded-md bg-white px-3 text-[12px] font-semibold text-topbar transition hover:bg-white/90"
          >
            Install
          </button>
          <span className="rounded-md bg-white/10 px-2 py-1 text-[11px] font-medium text-white/70">
            v{version}
          </span>
        </div>
      }
    />
  );
}

function SiteSidebar({
  route,
  onNavigate,
}: {
  route: string;
  onNavigate: (slug: string) => void;
}) {
  const categories = GROUP_ORDER.map((label) => ({
    label,
    items: COMPONENTS.filter((c) => c.group === label),
  })).filter((cat) => cat.items.length > 0);
  return (
    <Sidebar>
      {/* Overview — pinned at the top, no header (the Home pattern). */}
      <SidebarSection>
        <SidebarItem
          label="Overview"
          active={route === "overview"}
          onClick={() => onNavigate("overview")}
        />
        <SidebarItem
          label="For AI"
          active={route === "for-ai"}
          onClick={() => onNavigate("for-ai")}
        />
      </SidebarSection>

      {/* Each category is a collapsible section; the one holding the active
          component opens by default. Search lives in the ⌘K palette. */}
      {categories.map((cat) => (
        <SidebarSection
          key={cat.label}
          label={cat.label}
          collapsible
          defaultOpen={cat.items.some((c) => c.slug === route)}
        >
          {cat.items.map((c) => (
            <SidebarItem
              key={c.slug}
              label={c.name}
              active={route === c.slug}
              onClick={() => onNavigate(c.slug)}
              indent
            />
          ))}
        </SidebarSection>
      ))}
    </Sidebar>
  );
}

/* ---------- canvas ---------- */

/**
 * Renders a full-app demo inside an <iframe> so viewport units (`100vh`) and
 * sticky positioning resolve against a real viewport — the only faithful way to
 * preview the shell's cradle + sticky sidebar. Parent stylesheets are cloned in
 * so the frame is themed identically.
 */
function FramePreview({ children, height = 560 }: { children: React.ReactNode; height?: number }) {
  const [body, setBody] = React.useState<HTMLElement | null>(null);
  const onRef = React.useCallback((iframe: HTMLIFrameElement | null) => {
    if (!iframe) {
      setBody(null);
      return;
    }
    const doc = iframe.contentDocument;
    if (!doc) return;
    const mount = () => {
      doc.head.innerHTML = "";
      document
        .querySelectorAll('style, link[rel="stylesheet"]')
        .forEach((node) => doc.head.appendChild(node.cloneNode(true)));
      doc.documentElement.style.height = "100%";
      doc.body.style.height = "100%";
      doc.body.style.margin = "0";
      setBody(doc.body);
    };
    if (doc.readyState === "complete") mount();
    else iframe.addEventListener("load", mount, { once: true });
  }, []);
  return (
    <iframe
      ref={onRef}
      title="App frame preview"
      className="block w-full rounded-lg border border-border bg-background"
      style={{ height }}
    >
      {body ? createPortal(children, body) : null}
    </iframe>
  );
}

// One consistent "stage" behind every demo — a dotted, muted canvas — so every
// component is showcased the same way.
const STAGE = "rounded-lg border border-border bg-muted";
const DOTS: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(color-mix(in srgb, var(--foreground) 9%, transparent) 1px, transparent 1px)",
  backgroundSize: "16px 16px",
};

function Canvas({ demo }: { demo: Demo }) {
  if (demo.canvas === "frame") {
    return (
      <div className={cn(STAGE, "p-6")} style={DOTS}>
        <FramePreview height={demo.height ?? 640}>{demo.render()}</FramePreview>
      </div>
    );
  }
  if (demo.canvas === "center") {
    return (
      <div className={cn(STAGE, "flex min-h-[300px] items-center justify-center p-10")} style={DOTS}>
        {demo.render()}
      </div>
    );
  }
  // fill / surface — the component sits full-width on the stage.
  return (
    <div className={cn(STAGE, "p-6")} style={DOTS}>
      {demo.render()}
    </div>
  );
}

/* ---------- pages ---------- */

function UsageBlock({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <div className="mt-10">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Usage</h2>
        <button
          onClick={copy}
          className="rounded-md px-2 py-1 text-[12px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto rounded-lg border border-border bg-card p-4 text-[12.5px] leading-relaxed text-foreground/90">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}

function ComponentPage({ entry }: { entry: Entry }) {
  return (
    <PageContainer>
      <div className="mb-8">
        <div className="text-[12px] font-medium text-muted-foreground">{entry.group}</div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
          {entry.name}
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          {entry.summary}
        </p>
      </div>
      <div className="space-y-6">
        {entry.demos.map((demo, i) => (
          <section key={i}>
            {/* Only label demos when a component shows more than one variant. */}
            {entry.demos.length > 1 && demo.title && (
              <h2 className="mb-3 text-sm font-medium text-foreground">{demo.title}</h2>
            )}
            <Canvas demo={demo} />
          </section>
        ))}
      </div>
      <UsageBlock code={entry.usage} />
    </PageContainer>
  );
}

function OverviewPage({ onNavigate }: { onNavigate: (slug: string) => void }) {
  const groups = GROUP_ORDER.map((label) => ({
    label,
    items: COMPONENTS.filter((c) => c.group === label),
  }));
  return (
    <PageContainer>
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">OS Design System</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          The shared components every Curv OS is built from — one source of truth for how they look
          and behave, so consistency is structural rather than hand-enforced. Pick a component to see
          it live and interact with it.
        </p>
      </div>
      <div className="space-y-10">
        {groups.map((g) => (
          <section key={g.label}>
            <h2 className="mb-4 text-[13px] font-medium text-muted-foreground">{g.label}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => onNavigate(c.slug)}
                  className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card text-left shadow-card transition hover:border-border-strong hover:shadow-card-hover"
                >
                  <div
                    className="pointer-events-none flex h-32 items-center justify-center overflow-hidden border-b border-border bg-muted p-5"
                    style={DOTS}
                  >
                    {PREVIEWS[c.slug]?.()}
                  </div>
                  <div className="p-4">
                    <div className="text-[14px] font-medium text-foreground">{c.name}</div>
                    <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-muted-foreground">
                      {c.summary}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageContainer>
  );
}

/* ---------- install modal ---------- */

function CopyablePrompt({ n, label, prompt }: { n: number; label: string; prompt: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(prompt).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  };
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-foreground text-[11px] font-semibold text-background">
          {n}
        </span>
        <span className="text-[13px] font-medium text-foreground">{label}</span>
      </div>
      <div className="rounded-lg border border-border bg-muted p-3">
        <p className="text-[13px] leading-relaxed text-foreground">{prompt}</p>
        <button
          onClick={copy}
          className="mt-2.5 inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-[12px] font-medium text-muted-foreground shadow-card transition hover:text-foreground"
        >
          {copied ? "Copied ✓" : "Copy prompt"}
        </button>
      </div>
    </div>
  );
}

function InstallDialog({
  open,
  onOpenChange,
  version,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  version: string;
}) {
  const setupPrompt = `Install or update the Curv design system to github:jillesworks/curv-design-system#v${version}. Follow docs/consuming-in-an-os.md (theme, Tailwind, ESLint, AppFrame). Run: npx @curvgroup/design-system init-agent. Confirm the app builds.`;
  const usePrompt = `Build the product screen. I need to know if we should reorder. Show stock, suppliers, and sales — but not all on one canvas.`;
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add or update Curv"
      description="Paste a prompt in Cursor or Claude inside your OS repo. Re-run the first one when we ship a new version. For more examples, open For AI in the sidebar."
      footer={
        <>
          <a
            href="https://github.com/jillesworks/curv-design-system/blob/main/docs/consuming-in-an-os.md"
            target="_blank"
            rel="noreferrer"
            className="text-[13px] font-medium text-muted-foreground underline underline-offset-2 transition hover:text-foreground"
          >
            Full guide ↗
          </a>
          <DialogClose>Done</DialogClose>
        </>
      }
    >
      <div className="space-y-4">
        <CopyablePrompt n={1} label="Set up — or pull the latest update" prompt={setupPrompt} />
        <CopyablePrompt n={2} label="Then improve any page the same way" prompt={usePrompt} />
      </div>
    </Dialog>
  );
}

/* ---------- app ---------- */

export function App() {
  const { route, navigate } = useRoute();
  const [cmdOpen, setCmdOpen] = React.useState(false);
  const [installOpen, setInstallOpen] = React.useState(false);
  const entry = COMPONENTS.find((c) => c.slug === route);

  const cmdItems = React.useMemo<CommandItem[]>(
    () => [
      { id: "overview", label: "Overview", group: "General", onSelect: () => navigate("overview") },
      { id: "for-ai", label: "For AI — how to prompt", group: "General", onSelect: () => navigate("for-ai") },
      ...COMPONENTS.map((c) => ({
        id: c.slug,
        label: c.name,
        group: c.group,
        keywords: c.summary,
        hint: c.group,
        onSelect: () => navigate(c.slug),
      })),
    ],
    [navigate],
  );

  return (
    <>
      <AppFrame
        topBar={
          <SiteTopBar
            onHome={() => navigate("overview")}
            onOpenCmd={() => setCmdOpen(true)}
            onInstall={() => setInstallOpen(true)}
            version={pkg.version}
          />
        }
        sidebar={<SiteSidebar route={route} onNavigate={navigate} />}
      >
        {entry ? (
          <ComponentPage entry={entry} />
        ) : route === "for-ai" ? (
          <ForAiPage version={pkg.version} />
        ) : (
          <OverviewPage onNavigate={navigate} />
        )}
      </AppFrame>
      <CommandPalette
        open={cmdOpen}
        onOpenChange={setCmdOpen}
        items={cmdItems}
        placeholder="Search components…"
        emptyLabel="No components found."
      />
      <InstallDialog open={installOpen} onOpenChange={setInstallOpen} version={pkg.version} />
    </>
  );
}
