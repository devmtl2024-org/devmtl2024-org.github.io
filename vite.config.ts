import react from "@vitejs/plugin-react";
import fs from "fs";
import path, { resolve } from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => ({
  base: "/",
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
  buildEnd() {
    const indexPath = resolve(__dirname, "dist/index.html");
    const errorPath = resolve(__dirname, "dist/404.html");
    if (fs.existsSync(indexPath)) {
      fs.copyFileSync(indexPath, errorPath);
      console.log("✅ Copied index.html to 404.html");
    }
  },
}));
