import * as React from "react";

export interface AppFrameProps {
  /** The <TopBar /> (or any top chrome). */
  topBar: React.ReactNode;
  /** The left sidebar. */
  sidebar: React.ReactNode;
  /** Page content — render a <PageContainer> inside for the max-width level. */
  children: React.ReactNode;
}

/**
 * The app shell: a full-height dark frame (#1b1b1b shows through the rounded
 * top corners), a sticky top bar, then the sidebar + content row. The content
 * <main> is the FULL-WIDTH level (level 1); wrap page content in <PageContainer>
 * for the centered max-width level (level 2). Shopify-style "cradled" frame.
 *
 * The cradle (see design-system.md → App shell): the wrapper is the bar colour,
 * so it shows through two 12px rounded top corners. The *sidebar* rounds its own
 * top-left (`rounded-tl-[12px]`); the content's top-right is rounded here by a
 * sticky, zero-height concave mask pinned under the bar — `main` scrolls, so its
 * own corner wouldn't stay pinned, but the mask does. `main` itself is NOT
 * rounded.
 *
 * When a Drawer is open it sets `--curv-drawer-gutter-right` (or `-left`) on
 * `:root`. Main yields that space so the list narrows and the peek sits on the
 * same canvas — Linear / Shopify inline, not an overlay slab.
 */
export function AppFrame({ topBar, sidebar, children }: AppFrameProps) {
  return (
    <div className="flex min-h-screen flex-col bg-topbar text-foreground">
      {topBar}
      <div className="flex min-w-0 flex-1">
        {sidebar}
        <div className="relative flex min-w-0 flex-1 flex-col">
          <div
            aria-hidden
            className="pointer-events-none sticky top-14 z-30 flex h-0 justify-end"
          >
            <div
              className="h-3 w-3"
              style={{
                background:
                  "radial-gradient(circle 12px at 0 100%, transparent 11.5px, var(--topbar) 12px)",
              }}
            />
          </div>
          <main className="min-w-0 flex-1 overflow-x-clip bg-background pr-[var(--curv-drawer-gutter-right,0px)] pl-[var(--curv-drawer-gutter-left,0px)] transition-[padding] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
