import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2022",
    cssCodeSplit: false,
    assetsInlineLimit: 0,
  },
  server: {
    // En développement, l'API est servie par `wrangler dev` (port 8787).
    proxy: { "/api": "http://localhost:8787" },
  },
});
