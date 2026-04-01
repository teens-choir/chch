import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // This is the line we need!
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // This "compiles" your Soprano Red styles
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  }
});
