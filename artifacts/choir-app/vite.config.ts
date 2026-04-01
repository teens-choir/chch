import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// We are removing all the "throw new Error" checks so it works on Netlify
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
});
