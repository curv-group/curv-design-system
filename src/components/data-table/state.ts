import type { FilterValues } from "./filter-bar";

export const DATA_TABLE_STATE_VERSION = 1 as const;
export const DATA_TABLE_WORKSPACE_VERSION = 1 as const;

export type DataTableSort = { key: string; order: "asc" | "desc" };

export type DataTableState = {
  version: typeof DATA_TABLE_STATE_VERSION;
  query: string;
  filters: FilterValues;
  tab: string;
  sort: DataTableSort | null;
  visible: string[];
  order: string[];
  expanded: string[];
};

export type DataTableView = {
  id: string;
  name: string;
  state: DataTableState;
};

export type DataTableLayout = Pick<DataTableState, "visible" | "order">;

export type DataTableWorkspace = {
  version: typeof DATA_TABLE_WORKSPACE_VERSION;
  lastViewId: string | null;
  layout: DataTableLayout | null;
  views: DataTableView[];
};

export type TablePersistenceAdapter = {
  load: () => Promise<unknown> | unknown;
  save: (workspace: DataTableWorkspace) => Promise<void> | void;
};

const MAX_VIEW_NAME_LENGTH = 64;

function normalizedViewName(name: string): string {
  return (name.trim() || "Untitled").slice(0, MAX_VIEW_NAME_LENGTH);
}

function availableViewName(
  views: DataTableView[],
  requested: string,
  exceptId?: string,
): string {
  const base = normalizedViewName(requested);
  const taken = new Set(
    views
      .filter((view) => view.id !== exceptId)
      .map((view) => view.name.toLocaleLowerCase()),
  );
  if (!taken.has(base.toLocaleLowerCase())) return base;
  let suffix = 2;
  while (true) {
    const ending = ` ${suffix}`;
    const candidate = `${base.slice(0, MAX_VIEW_NAME_LENGTH - ending.length)}${ending}`;
    if (!taken.has(candidate.toLocaleLowerCase())) return candidate;
    suffix += 1;
  }
}

export function emptyTableWorkspace(): DataTableWorkspace {
  return {
    version: DATA_TABLE_WORKSPACE_VERSION,
    lastViewId: null,
    layout: null,
    views: [],
  };
}

export function defaultTableState(partial?: Partial<DataTableState>): DataTableState {
  return {
    query: "",
    filters: {},
    tab: "",
    sort: null,
    visible: [],
    order: [],
    expanded: [],
    ...partial,
    version: DATA_TABLE_STATE_VERSION,
  };
}

export function sanitizeTableState(raw: unknown, fallback: DataTableState): DataTableState {
  if (!raw || typeof raw !== "object") return fallback;
  const value = raw as Partial<DataTableState>;
  const sort =
    value.sort && typeof value.sort.key === "string" && (value.sort.order === "asc" || value.sort.order === "desc")
      ? { key: value.sort.key, order: value.sort.order }
      : fallback.sort;
  return {
    version: DATA_TABLE_STATE_VERSION,
    query: typeof value.query === "string" ? value.query : fallback.query,
    filters: value.filters && typeof value.filters === "object" ? value.filters : fallback.filters,
    tab: typeof value.tab === "string" ? value.tab : fallback.tab,
    sort,
    visible: Array.isArray(value.visible) ? value.visible.filter((key) => typeof key === "string") : fallback.visible,
    order: Array.isArray(value.order) ? value.order.filter((key) => typeof key === "string") : fallback.order,
    expanded: Array.isArray(value.expanded) ? value.expanded.filter((key) => typeof key === "string") : fallback.expanded,
  };
}

export function sanitizeTableWorkspace(
  raw: unknown,
  fallbackState: DataTableState,
): DataTableWorkspace {
  if (!raw || typeof raw !== "object") return emptyTableWorkspace();
  const value = raw as Partial<DataTableWorkspace>;
  const source = Array.isArray(value.views) ? value.views : [];
  const seen = new Set<string>();
  const views: DataTableView[] = [];
  for (const candidate of source) {
    if (!candidate || typeof candidate !== "object") continue;
    const view = candidate as Partial<DataTableView>;
    if (typeof view.id !== "string" || !view.id || seen.has(view.id)) continue;
    if (typeof view.name !== "string" || !view.name.trim()) continue;
    seen.add(view.id);
    views.push({
      id: view.id,
      name: availableViewName(views, view.name),
      state: sanitizeTableState(view.state, fallbackState),
    });
  }
  const lastViewId =
    typeof value.lastViewId === "string" && seen.has(value.lastViewId)
      ? value.lastViewId
      : null;
  const candidateLayout = (value as { layout?: unknown }).layout;
  const layout =
    candidateLayout && typeof candidateLayout === "object"
      ? {
          visible: Array.isArray((candidateLayout as DataTableLayout).visible)
            ? (candidateLayout as DataTableLayout).visible.filter((key) => typeof key === "string")
            : fallbackState.visible,
          order: Array.isArray((candidateLayout as DataTableLayout).order)
            ? (candidateLayout as DataTableLayout).order.filter((key) => typeof key === "string")
            : fallbackState.order,
        }
      : null;
  return { version: DATA_TABLE_WORKSPACE_VERSION, lastViewId, layout, views };
}

export function createView(workspace: DataTableWorkspace, name: string, state: DataTableState): DataTableWorkspace {
  const view: DataTableView = {
    id: crypto.randomUUID(),
    name: availableViewName(workspace.views, name),
    state,
  };
  return { ...workspace, version: DATA_TABLE_WORKSPACE_VERSION, lastViewId: view.id, views: [...workspace.views, view] };
}

export function renameView(workspace: DataTableWorkspace, id: string, name: string): DataTableWorkspace {
  return {
    ...workspace,
    views: workspace.views.map((view) =>
      view.id === id
        ? { ...view, name: availableViewName(workspace.views, name || view.name, id) }
        : view,
    ),
  };
}

export function duplicateView(workspace: DataTableWorkspace, id: string): DataTableWorkspace {
  const source = workspace.views.find((view) => view.id === id);
  if (!source) return workspace;
  return createView(workspace, `${source.name} copy`, source.state);
}

export function deleteView(workspace: DataTableWorkspace, id: string): DataTableWorkspace {
  const views = workspace.views.filter((view) => view.id !== id);
  return {
    ...workspace,
    views,
    lastViewId: workspace.lastViewId === id ? (views[0]?.id ?? null) : workspace.lastViewId,
  };
}

export function updateViewState(
  workspace: DataTableWorkspace,
  id: string,
  state: DataTableState,
): DataTableWorkspace {
  const current = workspace.views.find((view) => view.id === id);
  if (!current || JSON.stringify(current.state) === JSON.stringify(state)) return workspace;
  return {
    ...workspace,
    views: workspace.views.map((view) => (view.id === id ? { ...view, state } : view)),
  };
}

export function applyView(workspace: DataTableWorkspace, id: string | null): DataTableWorkspace {
  if (id && !workspace.views.some((view) => view.id === id)) return workspace;
  return { ...workspace, lastViewId: id };
}

export function currentView(workspace: DataTableWorkspace): DataTableView | null {
  return workspace.views.find((view) => view.id === workspace.lastViewId) ?? null;
}
