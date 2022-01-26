import { defineConfig } from "vite";
import { resolve } from "path";

import Inspect from "vite-plugin-inspect";
import vue from "@vitejs/plugin-vue";
import Pages from "vite-plugin-pages";

import { mdiIcons } from "./vite-plugins/mdiIcons";
import Components from "unplugin-vue-components/vite";
import { vuetifyResolver } from "./vite-plugins/vuetify-resolver";

import serverCreator from "./vite-plugins/server-router";
import server from "vite-plugin-server";

export default defineConfig({
  server: {
    open: "/verwaltung/index.html",
  },
  plugins: [
    serverCreator(),
    Inspect(),
    vue(),
    Pages({
      dirs: "verwaltung/pages",
    }),
    Components({
      dts: false,
      dirs: [],
      resolvers: [vuetifyResolver()],
    }),
    mdiIcons(),
    server(),
  ],
  build: {
    rollupOptions: {
      input: {
        verwaltung: resolve(__dirname, "verwaltung/index.html"),
        server: resolve(__dirname, "api/mod.ts"),
      },
      output: {
        manualChunks: undefined,
      },
    },
    // minify: false,
  },
  resolve: {
    alias: {
      // "@api": resolve(__dirname, "api/routes"),
      "@": resolve(__dirname, "verwaltung"),
      "@ctx": resolve(__dirname, "api/ctx.ts"),
    },
  },
});
