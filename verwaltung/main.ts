import { createApp } from "vue";
import App from "./App.vue";

import { createVuetify } from "vuetify";
import { mdi, aliases } from "vuetify/lib/iconsets/mdi-svg";

import routes from "~pages";
import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});

const app = createApp(App).use(vuetify).use(router);

app.mount("#app");
