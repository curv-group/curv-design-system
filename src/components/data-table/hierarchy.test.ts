import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  expandedForQuery,
  familyMatches,
  flattenHierarchy,
  sortParents,
  toggleExpanded,
} from "./hierarchy.ts";

type Family = { id: string; name: string; skus: string[] };

const families: Family[] = [
  { id: "tire", name: "TireHero", skus: ["TH-RED", "TH-BLK"] },
  { id: "mount", name: "HyperMount", skus: ["HM-1"] },
];

const getId = (row: Family) => row.id;
const getSubRows = (row: Family): Family[] =>
  row.skus.map((sku) => ({ id: sku, name: sku, skus: [] }));

describe("DataTable family hierarchy", () => {
  it("sorts parents only and keeps children under the parent", () => {
    const sorted = sortParents(families, (a, b) => a.name.localeCompare(b.name));
    const flat = flattenHierarchy(sorted, new Set(["tire"]), getId, getSubRows);
    assert.deepEqual(
      flat.map((row) => row.id),
      ["mount", "tire", "tire::TH-RED", "tire::TH-BLK"],
    );
    assert.equal(flat[2]?.parentId, "tire");
    assert.equal(flat[2]?.depth, 1);
  });

  it("keeps the whole family when a child matches search", () => {
    const matches = (row: Family) => row.name.toLowerCase().includes("th-red");
    assert.equal(familyMatches(families[0]!, "th-red", matches, getSubRows), true);
    assert.equal(familyMatches(families[1]!, "th-red", matches, getSubRows), false);
  });

  it("toggles expansion with stable parent ids", () => {
    assert.deepEqual(toggleExpanded([], "tire"), ["tire"]);
    assert.deepEqual(toggleExpanded(["tire"], "tire"), []);
  });

  it("reveals matching families while search is active without overwriting saved expansion", () => {
    const expanded = expandedForQuery(families, "th-red", ["saved-family"], getId);
    assert.deepEqual([...expanded], ["saved-family", "tire", "mount"]);
    assert.deepEqual([...expandedForQuery(families, "", ["tire"], getId)], ["tire"]);
  });
});
