import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // VITE_BASE=/rag-agent/ for GitHub Pages, ./ for a claude.ai Artifact.
  base: loadEnv(mode, process.cwd(), "").VITE_BASE || "/",
}));
