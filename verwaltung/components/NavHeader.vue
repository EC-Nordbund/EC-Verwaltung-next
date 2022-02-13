<script setup lang="ts">
import { useAuthData } from '@/composables/auth';
import { ref, computed } from 'vue';
import pwdUpdate from '@api/auth/pwdchange.post';

const { currentToken, tokenList, userData, timeUntilExpire } = useAuthData();
const tokenNames = computed(() => Object.keys(tokenList.value ?? {}));
const singleUser = computed(() => tokenNames.value.length === 0);
const showDialog = ref(false);

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
</template>
