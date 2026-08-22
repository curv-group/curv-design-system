import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Linter } from "eslint";
import plugin from "./plugin.js";

function messages(code) {
  const linter = new Linter();
  return linter.verify(code, {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: { curv: plugin },
    rules: { "curv/no-local-data-table-primitive": "error" },
  });
}

describe("no-local-data-table-primitive", () => {
  it("rejects local imports and declarations", () => {
    assert.equal(messages('import { DataTable } from "./table";')[0]?.ruleId, "curv/no-local-data-table-primitive");
    assert.equal(messages("function StandardTable() {}")[0]?.ruleId, "curv/no-local-data-table-primitive");
  });

  it("accepts the shared package import", () => {
    assert.deepEqual(messages('import { DataTable } from "@curvgroup/design-system";'), []);
  });
});
