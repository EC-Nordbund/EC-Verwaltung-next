import { defineConfig } from "vite";
import { resolve } from "path";

console.log("test");

export default defineConfig({
  server: {
    open: "/verwaltung/index.html",
  },
  plugins: [],
  build: {
    rollupOptions: {
      input: {
        verwaltung: resolve(__dirname, "verwaltung/index.html"),
        server: resolve(__dirname, "api/mod.ts"),
      },
    },
  },
  resolve: {
    alias: {
      "@api": resolve(__dirname, "api/routes"),
      "@": resolve(__dirname, "verwaltung"),
    },
  },
});
