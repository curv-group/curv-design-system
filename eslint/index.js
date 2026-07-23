import tseslint from "typescript-eslint";
import curvPlugin from "./plugin.js";

/**
 * Shared ESLint flat config for every Curv OS app + this repo.
 *
 * Consume it from an app's eslint.config.js:
 *   import curv from "@curvgroup/design-system/eslint";
 *   export default [ ...curv, /* your app rules *​/ ];
 *
 * It only carries the design-language guards (see ./plugin.js). Framework rules
 * (React, Next, import order) stay in each app so this never fights their setup.
 */
export default [
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true }, sourceType: "module" },
    },
    plugins: { curv: curvPlugin },
    rules: {
      "curv/no-uppercase-utility": "error",
      "curv/no-raw-hex": "error",
      "curv/no-palette-utility": "error",
      // Radius is a *concentric* (relational) rule now, not a fixed one — a linter
      // can't compute concentricity, so it's enforced by curv-ui + design-review.
    },
  },
];
