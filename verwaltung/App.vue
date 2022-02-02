<script setup lang="ts">
import { useAuthData, login } from './composables/api';
import { ref, computed } from 'vue';
import { useStorage } from '@vueuse/core';

const build = __BUILD_ID__;

const { status, currentToken, tokenList, userData } = useAuthData();
const tokenNames = computed(() => Object.keys(tokenList.value ?? {}));
const singleUser = computed(() => tokenNames.value.length === 0);
const username = useStorage('username', '');
const password = ref('');
const loading = ref(false);
const showPWD = ref(false);
const accountDialog = ref(false);
const drawer = ref<boolean>();

async function loginHandler() {
  try {
    loading.value = true;
    await login(username.value, password.value);
    loading.value = false;
    password.value = '';
  } catch (ex) {
    alert(ex);
    loading.value = false;
  }
}

function logoutHandler() {
  currentToken.value = null;
  tokenList.value = null;
}
</script>
<template lang="pug">
v-app
  v-main(v-if="status === 0")
    v-container
      v-card(max-width="500px" style="margin: auto; margin-top: 10%;")
        v-card-title
          h1(class="text-primary") Login
        v-card-text
          p Bitte Logge dich mit deinem Benutzernamen und Passwort ein!
          v-form(@submit.prevent="loginHandler")
            v-text-field(label="Benutzername" v-model="username" :disabled="loading")
            //- v-text-field(label="Passwort" :type="showPWD ? 'text' : 'password'" @keypress.enter="loginHandler" v-model="password" :disabled="loading", :append-icon="showPWD ? 'mdi-eye-off' : 'mdi-eye'" @click:append="showPWD.value = !showPWD.value")
            //- This semes to not working as expected. (event bubble problem)
            v-text-field(label="Passwort" :type="showPWD ? 'text' : 'password'" @keypress.enter="loginHandler" v-model="password" :disabled="loading",  @click:append="showPWD = !showPWD")
        v-card-actions
          v-spacer
          v-btn(class="bg-primary" @click="loginHandler" :disabled="loading || !username || !password") Login
  v-main(v-if="status === 1")
    v-container
      v-card(max-width="500px" style="margin: auto; margin-top: 10%;")
        v-card-title
          h1(class="text-primary") Wähle einen Nutzer aus!
        v-card-text
          v-list
            v-list-item(v-for="type in tokenNames" :key="type" @click="currentToken = type")
              v-list-item-header
                v-list-item-title {{ type }}
        v-card-actions
          v-spacer
          v-btn(icon @click="logoutHandler")
            v-icon mdi-logout

  template(v-if="status === 2")
    v-navigation-drawer(app v-model="drawer")
      v-list(v-if="userData.rechte === 'admin'")
        v-list-subheader Personen
        v-list-item(to="/personen/liste")
          v-list-item-avatar(left)
            v-icon mdi-svg
          v-list-item-title Liste
        v-list-item(to="/personen/search")
          v-list-item-avatar(left)
            v-icon mdi-svg
          v-list-item-title Suche
        v-list-item(to="/personen/merge")
          v-list-item-avatar(left)
            v-icon mdi-svg
          v-list-item-title Mergen
        v-list-item(to="/adresse/merge")
          v-list-item-avatar(left)
            v-icon mdi-svg
          v-list-item-title Adressen mergen
        v-list-subheader Veranstaltungen
        v-list-item(to="/veranstaltungen/liste")
          v-list-item-avatar(left)
            v-icon mdi-svg
          v-list-item-title Liste
        v-list-item(to="/anmeldungen/suche")
          v-list-item-avatar(left)
            v-icon mdi-svg
          v-list-item-title Anmeldungen
        v-list-item(to="/veranstaltungsorte/liste")
          v-list-item-avatar(left)
            v-icon mdi-svg
          v-list-item-title Orte
        v-list-subheader Sonstiges
        v-list-item(to="/ak")
          v-list-item-avatar(left)
            v-icon mdi-svg
          v-list-item-title Arbeitskreise
        v-list-item(to="/user")
          v-list-item-avatar(left)
            v-icon mdi-svg
          v-list-item-title Benutzer
      v-list(v-else-if="userData.rechte.type === 'leiter'")
        v-list-item(to="/leiter/ma")
          v-list-item-avatar(left)
            v-icon mdi-svg
          v-list-item-title Mitarbeiter
        v-list-item(to="/leiter/tn")
          v-list-item-avatar(left)
            v-icon mdi-svg
          v-list-item-title Teilnehmer
      v-list(v-else-if="userData.rechte.type === 'fzVerantwortlicher'")
        v-list-item(to="/fz-ort/antraege")
          v-list-item-avatar(left)
            v-icon mdi-svg
          v-list-item-title Eingesehen eintragen
        v-list-item(to="/fz-ort/antraege")
          v-list-item-avatar(left)
            v-icon mdi-svg
          v-list-item-title Anträge
        v-list-item(to="/fz-ort/antrag-create")
          v-list-item-avatar(left)
            v-icon mdi-svg
          v-list-item-title Antrag erstellen
        v-list-item(to="/fz-ort/liste")
          v-list-item-avatar(left)
            v-icon mdi-svg
          v-list-item-title Mitarbeiterliste

    v-app-bar(app class="bg-primary") 
      v-app-bar-nav-icon(@click="drawer = !drawer" class="bg-primary text-white")
      v-spacer
      v-app-bar-title EC-Nordbund Verwaltung
      v-spacer
      span {{ currentToken }} - {{ userData.name }}
      v-dialog(
        v-model="accountDialog" 
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition")
        template(v-slot:activator="{ props }")
          v-btn(icon class="bg-primary" v-bind="props")
            v-icon(color="white") mdi-account
        v-card
          v-card-actions
            v-btn(icon flat color="primary" @click="accountDialog = false; logoutHandler()")
              v-icon(color="white") mdi-logout
            v-btn(icon flat color="primary" @click="accountDialog = false; currentToken = null" v-if="!singleUser")
              v-icon(color="white") mdi-svg
          // TODO: rewrite with toolbar!
          // v-app-bar(color="primary")
          //   v-btn(icon @click="accountDialog = false" color="primary")
          //     v-icon(color="white") mdi-close
          //   v-spacer
          //   v-app-bar-title Nutzereinstellungen
          //   v-spacer
          //   v-btn(icon @click="accountDialog = false; logoutHandler()" color="primary")
          //     v-icon(color="white") mdi-logout
          // v-list(three-line subheader)
          //   v-subheader Testing 
          //   v-list-item
          //     v-list-content
          //       v-list-item-title Hello
          //       v-list-item-subtitle World
          //   v-list-item
          //     v-list-content
          //       v-list-item-title Hello
          //       v-list-item-subtitle World
    v-main(style="min-height: calc(100vh - 40px)")
      // v-container(fluid style="height: 100%")
      // | {{ userData }}
      router-view(style="height: 100%; overflow: auto;")
    v-footer(app class="bg-primary")
      v-spacer
      span Build: {{ build }}
      v-spacer
</template>
