"use client";

import * as React from "react";
import { Checkbox } from "../checkbox";
import { Popover } from "../popover";
import { lockedKeys, moveOptionalColumn, reorderOptionalColumn, type ColumnLayout } from "./columns";
import { dataTableToolbarButton } from "./toolbar-button";

export function CustomizeColumns({
  columns,
  labels,
  visible,
  order,
  onVisibleChange,
  onOrderChange,
  onReset,
}: {
  columns: readonly ColumnLayout[];
  labels: Record<string, string>;
  visible: readonly string[];
  order: readonly string[];
  onVisibleChange: (next: string[]) => void;
  onOrderChange: (next: string[]) => void;
  onReset: () => void;
}) {
  const locked = lockedKeys(columns);
  const ordered = order.length ? [...order] : columns.map((column) => column.key);
  const [dragging, setDragging] = React.useState<string | null>(null);
  const hidden = columns.filter((column) => !column.locked && !visible.includes(column.key)).length;

  return (
    <Popover
      align="end"
      className="w-72 max-w-none p-1"
      trigger={
        <button
          type="button"
          className={dataTableToolbarButton}
          aria-label={hidden > 0 ? `Customize columns, ${hidden} hidden` : "Customize columns"}
        >
          Customize columns
          {hidden > 0 ? <span className="tabular-nums text-muted-foreground">{hidden}</span> : null}
        </button>
      }
    >
      <p className="px-2 py-1.5 text-[12px] text-muted-foreground">
        Show, hide, and reorder. Required columns stay first.
      </p>
      {ordered.map((key) => {
        const column = columns.find((item) => item.key === key);
        if (!column) return null;
        const isLocked = Boolean(column.locked);
        const checked = isLocked || visible.includes(column.key);
        const label = labels[column.key] ?? column.key;
        const index = ordered.indexOf(column.key);
        const firstOptionalIndex = locked.length;
        const canMoveUp = !isLocked && index > firstOptionalIndex;
        const canMoveDown = !isLocked && index >= firstOptionalIndex && index < ordered.length - 1;
        return (
          <div
            key={column.key}
            draggable={!isLocked}
            onDragStart={(event) => {
              setDragging(column.key);
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", column.key);
            }}
            onDragEnd={() => setDragging(null)}
            onDragOver={(event) => {
              if (isLocked || !dragging) return;
              event.preventDefault();
            }}
            onDrop={() => {
              if (!dragging || isLocked) return;
              onOrderChange(reorderOptionalColumn(columns, ordered, dragging, column.key));
              setDragging(null);
            }}
            className="flex items-center gap-2 rounded px-2 py-1.5 text-[13px] hover:bg-accent"
          >
            <span
              aria-hidden
              className={isLocked ? "w-3 text-muted-foreground/35" : "w-3 cursor-grab text-muted-foreground active:cursor-grabbing"}
            >
              {isLocked ? "•" : "⋮⋮"}
            </span>
            <Checkbox
              checked={checked}
              disabled={isLocked}
              onCheckedChange={(next) => {
                if (isLocked) return;
                onVisibleChange(next ? [...visible, column.key] : visible.filter((item) => item !== column.key));
              }}
              aria-label={isLocked ? `${label}, required` : label}
            />
            <span className="min-w-0 flex-1">
              {label}
              {isLocked ? <span className="ml-1 text-[12px] text-muted-foreground">Required</span> : null}
            </span>
            {isLocked || locked.includes(column.key) ? null : (
              <span className="flex shrink-0 gap-1">
                <button
                  type="button"
                  disabled={!canMoveUp}
                  aria-label={`Move ${label} up`}
                  title={`Move ${label} up`}
                  className="rounded px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-35"
                  onClick={() => onOrderChange(moveOptionalColumn(columns, ordered, column.key, -1))}
                >
                  Move up
                </button>
                <button
                  type="button"
                  disabled={!canMoveDown}
                  aria-label={`Move ${label} down`}
                  title={`Move ${label} down`}
                  className="rounded px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-35"
                  onClick={() => onOrderChange(moveOptionalColumn(columns, ordered, column.key, 1))}
                >
                  Move down
                </button>
              </span>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={onReset}
        className="mt-1 w-full rounded px-2 py-1.5 text-left text-[12px] text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        Reset to default
      </button>
    </Popover>
  );
}
