import { createApp } from "vue";
import App from "./App.vue";

import "vuetify/lib/styles/main.sass";
import "./styles/global.sass";

import routes from "~pages";
import { createRouter, createWebHashHistory } from "vue-router";
import { vuetify } from "./vuetifyconfig";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const app = createApp(App).use(vuetify).use(router);

app.mount("#app");
