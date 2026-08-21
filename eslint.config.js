// This repo dogfoods its own shared config — the same guards every OS app gets.
import curv from "./eslint/index.js";

export default [
  { ignores: ["dist/**", "node_modules/**"] },
  ...curv,
  {
    files: ["src/components/data-table/**/*.{ts,tsx}", "site/registry.tsx"],
    rules: { "curv/no-local-data-table-primitive": "off" },
  },
];
