import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  mobileKeys,
  moveOptionalColumn,
  sanitizeOrderKeys,
  sanitizeVisibleKeys,
  visibleOrderedKeys,
} from "./columns.ts";

const columns = [
  { key: "name", locked: true, mobilePriority: "primary" as const },
  { key: "health", locked: true, mobilePriority: "primary" as const },
  { key: "sold", mobilePriority: "secondary" as const },
  { key: "value", mobilePriority: "secondary" as const },
];

describe("DataTable columns", () => {
  it("keeps locked columns visible and first", () => {
    assert.deepEqual(sanitizeVisibleKeys(columns, ["value", "bogus"]), ["name", "health", "value"]);
    assert.deepEqual(sanitizeVisibleKeys(columns, []), ["name", "health", "sold", "value"]);
    assert.deepEqual(sanitizeOrderKeys(columns, ["value", "name", "sold"]), ["name", "health", "value", "sold"]);
  });

  it("cannot move locked columns", () => {
    assert.deepEqual(moveOptionalColumn(columns, ["name", "health", "sold", "value"], "health", 1), [
      "name",
      "health",
      "sold",
      "value",
    ]);
    assert.deepEqual(moveOptionalColumn(columns, ["name", "health", "sold", "value"], "sold", 1), [
      "name",
      "health",
      "value",
      "sold",
    ]);
  });

  it("separates locked from mobile-primary", () => {
    const hiddenHealth = [
      { key: "name", locked: true, mobilePriority: "primary" as const },
      { key: "health", locked: true, mobilePriority: "hidden" as const },
      { key: "sold", mobilePriority: "secondary" as const },
    ];
    assert.deepEqual(mobileKeys(hiddenHealth, ["name", "health", "sold"]), {
      primary: ["name"],
      secondary: ["sold"],
    });
    assert.deepEqual(visibleOrderedKeys(columns, ["sold"], ["name", "health", "sold"]), ["name", "health", "sold"]);
  });
});
