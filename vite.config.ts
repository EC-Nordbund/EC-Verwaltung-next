import { defineConfig } from 'vite';
import { resolve } from 'path';

import Inspect from 'vite-plugin-inspect';
import vue from '@vitejs/plugin-vue';
import Pages from 'vite-plugin-pages';

import { mdiIcons } from './vite-plugins/mdiIcons';
import Components from 'unplugin-vue-components/vite';
import { vuetifyResolver } from './vite-plugins/vuetify-resolver';

import serverCreator from './vite-plugins/server-router';

export default defineConfig({
  server: {
    // open: "/verwaltung/index.html",
  },
  define: {
    __API_BASE_URL__: JSON.stringify('http://localhost:8080'),
    __BUILD_ID__: JSON.stringify(
      new Date().toISOString().split('T')[0].replaceAll('-', '.') +
        '.' +
        Math.floor((new Date().getTime() % (24 * 60 * 60 * 1000)) / 1000)
    )
    // __VUE_OPTIONS_API__: "false",
  },
  plugins: [
    serverCreator(),
    Inspect(),
    vue(),
    Pages({
      dirs: 'verwaltung/pages'
    }),
    Components({
      dts: false,
      dirs: [],
      resolvers: [vuetifyResolver()]
    }),
    mdiIcons()
  ],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'verwaltung/index.html')
      },
      output: {
        manualChunks: undefined
      }
    }
    // minify: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'verwaltung'),
      '@types': resolve(__dirname, 'types')
    }
  }
});
