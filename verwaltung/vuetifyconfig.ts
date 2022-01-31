import { createVuetify } from "vuetify";
import * as directives from "vuetify/lib/directives/index";
import { aliases, mdi } from "vuetify/lib/iconsets/mdi-svg";

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
  accent: "#583a70",
  secondary: "#282925",
  info: "#70b6d4",
  warning: "#ffd633",
  error: "#ea4c60",
  success: "#92c355",

  // Gradient
  "gradient-left": "#a3cf4b",
  "gradient-right": "#5da635",

  // Social
  facebook: "#1877f2",
  instagram: "#c32aa3",
  youtube: "#f00",
};

export const vuetify = createVuetify({
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
      color: "primary",
    },
  },
});
