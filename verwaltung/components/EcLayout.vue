<script setup lang="ts">
import { useAuthData } from '@/composables/api';
import { ref, computed } from 'vue';
import pwdUpdate from '@api/auth/pwdchange.post';

const build = __BUILD_ID__;

const { currentToken, tokenList, userData, internal, timeUntilExpire } =
  useAuthData();
const tokenNames = computed(() => Object.keys(tokenList.value ?? {}));
const singleUser = computed(() => tokenNames.value.length === 0);
const showDialog = ref(false);
const drawer = ref<boolean>();

function logoutHandler() {
  currentToken.value = null;
  tokenList.value = null;
}
const oldPWD = ref('');
const newPWDA = ref('');
const newPWDB = ref('');

function changePwd() {
  if (newPWDA.value !== newPWDB.value) return;
  if (newPWDA.value.length < 8) return;

  pwdUpdate({
    body: {
      password: newPWDA.value,
      oldPassword: oldPWD.value
    }
  });
}
</script>
<template lang="pug">
v-navigation-drawer(app v-model="drawer")
  v-system-bar
    span {{Math.floor(timeUntilExpire / 3600000)}}:{{Math.floor(timeUntilExpire / 60000) % 60 }}
  v-list
    v-list-item(:title="userData.name" :subtitle="currentToken || ''")
      template(#append)
        v-list-item-avatar(right)
          v-dialog(fullscreen v-model="showDialog")
            template(#activator="{props}")
              v-btn(icon v-bind="props" variant="text")
                v-icon mdi-menu-down
            v-card
              v-app-bar(color="primary")
                v-app-bar-title Benutzer Einstellungen
                v-spacer
                // v-btn(@click="save") Speichern
                v-btn(icon @click="showDialog = false;logoutHandler()")
                  v-icon mdi-logout
                v-btn(icon @click="showDialog = false; currentToken = null" v-if="!singleUser")
                  v-icon mdi-account-convert
                v-btn(icon @click="showDialog = false")
                  v-icon mdi-close
              //- Current workaround as v-toolbar currently doesn't exist!
              div(style="margin-top: 128px;")
              v-card-text
                v-form(@submit.prevent="changePwd")
                  v-text-field(label="Aktuelles Passwort" v-model="oldPWD")
                  v-text-field(label="Neues Passwort" v-model="newPWDA")
                  v-text-field(label="Neues Passwort" v-model="newPWDB")
                v-btn(@click="changePwd") Neues PWD setzen
  v-divider
  v-list(v-if="userData.rechte === 'admin'")
    v-list-subheader Personen
    v-list-item(to="/personen/liste")
      v-list-item-avatar(left)
        v-icon mdi-account-filter
      v-list-item-title Liste
    v-list-item(to="/personen/search")
      v-list-item-avatar(left)
        v-icon mdi-account-search
      v-list-item-title Suche
    v-list-item(to="/personen/merge")
      v-list-item-avatar(left)
        v-icon mdi-merge 
      v-list-item-title Mergen
    v-list-item(to="/adresse/merge")
      v-list-item-avatar(left)
        v-icon mdi-home-assistant
      v-list-item-title Adressen mergen
    v-list-subheader Führungszeugnisse
    v-list-item(to="/fz/antraege")
      v-list-item-avatar(left)
        v-icon mdi-file-sign
      v-list-item-title Anträge
    v-list-item(to="/fz/liste")
      v-list-item-avatar(left)
        v-icon mdi-account-multiple
      v-list-item-title Mitarbeiterliste
    v-list-subheader Veranstaltungen
    v-list-item(to="/veranstaltungen/liste")
      v-list-item-avatar(left)
        v-icon mdi-calendar-multiple
      v-list-item-title Liste
    v-list-item(to="/anmeldungen/suche")
      v-list-item-avatar(left)
        v-icon mdi-badge-account
      v-list-item-title Anmeldungen
    v-list-item(to="/veranstaltungsorte/liste")
      v-list-item-avatar(left)
        v-icon mdi-home-group
      v-list-item-title Orte
    v-list-subheader Sonstiges
    v-list-item(to="/ak")
      v-list-item-avatar(left)
        v-icon mdi-account-group
      v-list-item-title Arbeitskreise
    v-list-item(to="/user")
      v-list-item-avatar(left)
        v-icon mdi-account-cog
      v-list-item-title Benutzer
  v-list(v-else-if="userData.rechte.type === 'leiter'")
    v-list-item(to="/leiter/ma")
      v-list-item-avatar(left)
        v-icon mdi-account 
      v-list-item-title Mitarbeiter
    v-list-item(to="/leiter/tn")
      v-list-item-avatar(left)
        v-icon mdi-human-child
      v-list-item-title Teilnehmer
    v-list-item(to="/leiter/sonstiges")
      v-list-item-avatar(left)
        v-icon mdi-file-export
      v-list-item-title Sonstiges
  v-list(v-else-if="userData.rechte.type === 'fzVerantwortlicher'")
    v-list-item(to="/fz-ort/antraege")
      v-list-item-avatar(left)
        v-icon mdi-text-box-check
      v-list-item-title Eingesehen eintragen
    v-list-item(to="/fz-ort/antraege")
      v-list-item-avatar(left)
        v-icon mdi-folder-account
      v-list-item-title Anträge
    v-list-item(to="/fz-ort/antrag-create")
      v-list-item-avatar(left)
        v-icon mdi-file-sign
      v-list-item-title Antrag erstellen
    v-list-item(to="/fz-ort/liste")
      v-list-item-avatar(left)
        v-icon mdi-account-multiple
      v-list-item-title Mitarbeiterliste

v-app-bar(app class="bg-primary") 
  v-app-bar-nav-icon(@click="drawer = !drawer" class="bg-primary text-white")
  v-spacer
  v-app-bar-title EC-Nordbund Verwaltung
  v-spacer
v-main(style="min-height: calc(100vh - 40px)")
  // v-container(fluid style="height: 100%")
  | {{ internal }}
  | {{timeUntilExpire}}
  router-view(style="height: 100%; overflow: auto;")
v-footer(app class="bg-primary")
  v-spacer
  span Build: {{ build }}
  v-spacer
</template>
