<script setup lang="ts">
import { useAuthData, login } from "./composables/api";
import { ref } from 'vue'

const build = __BUILD_ID__

const {
  status,
  currentToken,
  tokenList,
  userData
} = useAuthData()

const username = ref('')
const password = ref('')

const loading = ref(false)

async function loginHandler() {
  try {
    loading.value = true
    await login(username.value, password.value)
    loading.value = false
    password.value = ''
  } catch (ex) {
    alert(ex)
    loading.value = false
  }
}

function logoutHandler() {
  currentToken.value = null
  tokenList.value = null
}

const accountDialog = ref(false)
const drawer = ref<boolean>(null!)
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
            v-text-field(label="Passwort" type="password" @keypress.enter="loginHandler" v-model="password" :disabled="loading")
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
            v-list-item(v-for="type in Object.keys(tokenList)" :key="type" @click="currentToken = type")
              v-list-item-header
                v-list-item-title {{ type }}
        v-card-actions
          v-spacer
          v-btn(icon @click="logoutHandler")
            v-icon mdi-logout

  template(v-if="status === 2")
    v-navigation-drawer(app v-model="drawer")
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
            v-btn(icon flat color="primary" @click="accountDialog = false; currentToken = null")
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
    v-main
      v-container(fluid)
        router-view
    v-footer(app)
      v-spacer
      span Build: {{ build }}
      v-spacer
</template>
