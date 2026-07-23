import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The "OS Design System" showcase site. It imports the library straight from
// src/ and renders each component live — the site's own chrome (top bar,
// sidebar, content) IS the library, dogfooding itself.
export default defineConfig({
  root: "site",
  // GitHub Pages serves under /<repo>/; the Actions workflow sets PAGES_BASE.
  // Locally it stays "/". Hash routing means no server rewrites are needed.
  base: process.env.PAGES_BASE || "/",
  plugins: [react(), tailwindcss()],
  server: { port: 6006, open: false },
});
