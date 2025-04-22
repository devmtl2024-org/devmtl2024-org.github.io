import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "vite-plugin-svgr";
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/website/" : "/",
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  buildEnd() {
    const indexPath = resolve(__dirname, 'dist/index.html');
    const errorPath = resolve(__dirname, 'dist/404.html');
    if (fs.existsSync(indexPath)) {
      fs.copyFileSync(indexPath, errorPath);
      console.log('✅ Copied index.html to 404.html');
    }
  },
}));