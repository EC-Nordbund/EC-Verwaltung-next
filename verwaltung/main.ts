import * as directives from "vuetify/directives";

import { createApp } from "vue";
import App from "./App.vue";

import "vuetify/lib/styles/main.sass";
import './styles/global.sass'

import { createVuetify } from "vuetify";
import { mdi, aliases } from "vuetify/lib/iconsets/mdi-svg";

import routes from "~pages";
import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const vuetifyTheme = {
  primary: "#92c355",
  dunkelGrau: "#282925",
  neonOrange: "#fac189",
  offWihte: "#f8f5f4",
  lila: "#583a70",
  dunkelRot: "#903557",
  dunkelGruen: "#1f5533",
  ocker: "#bc946d",
  koralle: "#ea4c60",
  hellBlau: "#70b6d4",
  hellGrau: "#5d5d5c",
  ecOrange: "#ea571d",
  dunkelBlau: "#445d9d",
  gelb: "#ffd633",
  flieder: "#9184be",

  up: "#4eb3d8",
  out: "#fac189",
  with: "#9c8aa8",
  in: "#92c355",

  vgRot: "#c30a1e",
  vgBlau: "#0f3d8c",

  // Standard colors
  accent: "#583a70", // lila
  secondary: "#282925", // dunkelGrau
  info: "#70b6d4", // hellBlau
  warning: "#ffd633", // gelb
  error: "#ea4c60", // koralle
  success: "#92c355", // grün (primary)

  // Gradient
  "gradient-left": "#a3cf4b",
  "gradient-right": "#5da635",

  // Social
  facebook: "#1877f2",
  instagram: "#c32aa3",
  youtube: "#f00",
};

const vuetify = createVuetify({
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        dark: false,
        colors: vuetifyTheme,
      },
    },
  },
  defaults: {
    global: {},
    VBtn: {
      color: 'primary'
    }
  }
});

const app = createApp(App).use(vuetify).use(router);

app.mount("#app");
