import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyView,
  createView,
  currentView,
  defaultTableState,
  deleteView,
  duplicateView,
  emptyTableWorkspace,
  renameView,
  sanitizeTableState,
  sanitizeTableWorkspace,
  updateViewState,
} from "./state.ts";

describe("DataTable views", () => {
  it("versions and sanitizes saved state", () => {
    const fallback = defaultTableState({ visible: ["name"], order: ["name", "sold"] });
    const next = sanitizeTableState(
      { version: 99, query: "mount", visible: ["sold", 12], sort: { key: "value", order: "desc" } },
      fallback,
    );
    assert.equal(next.version, 1);
    assert.equal(next.query, "mount");
    assert.deepEqual(next.visible, ["sold"]);
    assert.deepEqual(next.sort, { key: "value", order: "desc" });
  });

  it("creates, renames, duplicates, deletes, and restores last-used", () => {
    const state = defaultTableState({ query: "mount", visible: ["name", "health"] });
    let workspace = createView(emptyTableWorkspace(), "Attention", state);
    assert.equal(currentView(workspace)?.name, "Attention");
    workspace = renameView(workspace, workspace.lastViewId!, "At risk");
    workspace = duplicateView(workspace, workspace.lastViewId!);
    assert.deepEqual(
      workspace.views.map((view) => view.name),
      ["At risk", "At risk copy"],
    );
    const first = workspace.views[0]!.id;
    workspace = applyView(workspace, first);
    workspace = deleteView(workspace, workspace.lastViewId!);
    assert.equal(workspace.views.length, 1);
    assert.equal(workspace.lastViewId, workspace.views[0]!.id);
  });

  it("sanitizes corrupt workspaces and rejects an invalid last-used view", () => {
    const fallback = defaultTableState({ visible: ["name"], order: ["name"] });
    const workspace = sanitizeTableWorkspace(
      {
        version: 99,
        lastViewId: "missing",
        layout: { visible: ["name", 7], order: ["name"] },
        views: [
          { id: "view-1", name: "  My view  ", state: { query: "sku" } },
          { id: "view-1", name: "Duplicate", state: {} },
          { id: "", name: "Invalid", state: {} },
        ],
      },
      fallback,
    );
    assert.equal(workspace.version, 1);
    assert.equal(workspace.lastViewId, null);
    assert.deepEqual(workspace.layout, { visible: ["name"], order: ["name"] });
    assert.equal(workspace.views.length, 1);
    assert.equal(workspace.views[0]!.name, "My view");
    assert.equal(workspace.views[0]!.state.query, "sku");
  });

  it("updates the active saved view without changing its identity", () => {
    const initial = defaultTableState({ query: "before" });
    const created = createView(emptyTableWorkspace(), "Working", initial);
    const nextState = defaultTableState({ query: "after" });
    const updated = updateViewState(created, created.lastViewId!, nextState);
    assert.equal(updated.views[0]!.id, created.views[0]!.id);
    assert.equal(updated.views[0]!.state.query, "after");
  });

  it("keeps view names unique and bounded", () => {
    const state = defaultTableState();
    const first = createView(emptyTableWorkspace(), "My view", state);
    const second = createView(first, "my view", state);
    const third = duplicateView(second, first.views[0]!.id);
    assert.deepEqual(second.views.map((view) => view.name), ["My view", "my view 2"]);
    assert.equal(third.views[2]!.name, "My view copy");
    assert.ok(createView(third, "x".repeat(100), state).views.at(-1)!.name.length <= 64);
  });
});
