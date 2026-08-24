import { defineConfig } from "tsup";

// Ship compiled ESM + type declarations. React is a peer dep, never bundled.
// Banner: every export that uses state/overlays must run as a Client Component
// in Next.js app-router OS apps.
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  external: ["react", "react-dom"],
  esbuildOptions(options) {
    options.banner = { js: '"use client";' };
  },
});
