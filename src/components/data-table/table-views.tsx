"use client";

import * as React from "react";
import { Button } from "../button";
import { Menu, MenuItem, MenuSeparator } from "../menu";
import { Popover } from "../popover";
import type { DataTableWorkspace } from "./state";
import { dataTableToolbarButton } from "./toolbar-button";

export function TableViewsMenu({
  workspace,
  onSelect,
  onCreate,
  onRename,
  onDuplicate,
  onDelete,
  onRetry,
  persistenceStatus = "idle",
}: {
  workspace: DataTableWorkspace;
  onSelect: (id: string | null) => void;
  onCreate: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onRetry?: () => void;
  persistenceStatus?: "idle" | "loading" | "saving" | "saved" | "error";
}) {
  const current = workspace.views.find((view) => view.id === workspace.lastViewId) ?? null;
  const [newName, setNewName] = React.useState("");
  const [renameName, setRenameName] = React.useState("");
  const [renaming, setRenaming] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const disabled = persistenceStatus === "loading" || persistenceStatus === "error";

  const statusLabel =
    persistenceStatus === "loading"
      ? "Loading views…"
      : persistenceStatus === "saving"
        ? "Saving…"
        : persistenceStatus === "error"
          ? "Couldn’t sync changes"
          : null;

  return (
    <Popover
      align="end"
      className="w-72 max-w-none p-1"
      trigger={
        <button
          type="button"
          className={dataTableToolbarButton}
          aria-label={`Views, current view: ${current?.name ?? "Default"}`}
        >
          {current?.name ?? "Default"}
          {persistenceStatus === "error" ? (
            <span className="size-1.5 rounded-full bg-destructive" aria-hidden />
          ) : null}
        </button>
      }
    >
      <p className="px-2 py-1.5 text-[12px] text-muted-foreground">
        A view keeps search, filters, sort, and columns.
      </p>
      {statusLabel ? (
        <div className="flex items-center justify-between gap-2 px-2 pb-1">
          <p
            role={persistenceStatus === "error" ? "alert" : "status"}
            className={persistenceStatus === "error" ? "text-[12px] text-destructive" : "text-[12px] text-muted-foreground"}
          >
            {statusLabel}
          </p>
          {persistenceStatus === "error" && onRetry ? (
            <Button size="sm" variant="ghost" onClick={onRetry}>Retry</Button>
          ) : null}
        </div>
      ) : null}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelect(null)}
        className={`flex w-full rounded px-2 py-1.5 text-left text-[13px] hover:bg-accent disabled:pointer-events-none disabled:opacity-50 ${current ? "" : "font-medium"}`}
      >
        <span className="min-w-4" aria-hidden>{current ? "" : "✓"}</span>
        Default
      </button>
      {workspace.views.map((view) => (
        <div key={view.id} className="rounded px-1 py-1">
          {renaming === view.id ? (
            <form
              className="flex gap-1"
              onSubmit={(event) => {
                event.preventDefault();
                onRename(view.id, renameName);
                setRenaming(null);
              }}
            >
              <input
                autoFocus
                disabled={disabled}
                maxLength={64}
                value={renameName}
                onChange={(event) => setRenameName(event.target.value)}
                aria-label="View name"
                className="h-8 min-w-0 flex-1 rounded-md border border-border bg-card px-2 text-[13px]"
              />
              <Button type="submit" size="sm" disabled={disabled || !renameName.trim()}>
                Save
              </Button>
            </form>
          ) : deleting === view.id ? (
            <div className="flex items-center gap-2 px-1 py-1">
              <span className="min-w-0 flex-1 truncate text-[12px] text-muted-foreground">
                Delete “{view.name}”?
              </span>
              <Button size="sm" variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={disabled}
                onClick={() => {
                  onDelete(view.id);
                  setDeleting(null);
                }}
              >
                Delete
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelect(view.id)}
                className={`flex min-w-0 flex-1 items-center gap-1 rounded px-2 py-1.5 text-left text-[13px] hover:bg-accent disabled:pointer-events-none disabled:opacity-50 ${view.id === current?.id ? "font-medium" : ""}`}
              >
                <span className="min-w-4" aria-hidden>{view.id === current?.id ? "✓" : ""}</span>
                <span className="truncate">{view.name}</span>
              </button>
              <Menu
                align="end"
                trigger={
                  <button
                    type="button"
                    disabled={disabled}
                    aria-label={`Actions for ${view.name}`}
                    className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                  >
                    <span aria-hidden>•••</span>
                  </button>
                }
              >
                <MenuItem onClick={() => {
                  setRenaming(view.id);
                  setRenameName(view.name);
                }}>Rename</MenuItem>
                <MenuItem onClick={() => onDuplicate(view.id)}>Duplicate</MenuItem>
                <MenuSeparator />
                <MenuItem destructive onClick={() => setDeleting(view.id)}>Delete</MenuItem>
              </Menu>
            </div>
          )}
        </div>
      ))}
      <form
        className="mt-1 flex gap-1 px-1"
        onSubmit={(event) => {
          event.preventDefault();
          onCreate(newName.trim() || "Untitled");
          setNewName("");
        }}
      >
        <input
          disabled={disabled}
          maxLength={64}
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder="Name this view"
          aria-label="New view name"
          className="h-8 min-w-0 flex-1 rounded-md border border-border bg-card px-2 text-[13px]"
        />
        <Button type="submit" size="sm" disabled={disabled || !newName.trim()}>
          Save
        </Button>
      </form>
    </Popover>
  );
}
