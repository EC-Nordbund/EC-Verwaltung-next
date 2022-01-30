<script setup lang="ts">
import { useAuthData, login } from "./composables/api";
import { ref } from 'vue'

const {
  status,
  currentToken,
  tokenList
} = useAuthData()

const username = ref('')
const password = ref('')

const loading = ref(false)

async function loginHandler() {
  try {
    loading.value = true
    await login(username.value, password.value)
    loading.value = false
  } catch (ex) {
    alert(ex)
    loading.value = false
  }
}

function logoutHandler() {
  currentToken.value = null
  tokenList.value = null
}

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
          v-text-field(label="Benutzername" v-model="username" :disabled="loading")
          v-text-field(label="Passwort" type="password" v-model="password" :disabled="loading")
        v-card-actions
          v-spacer
          v-btn(class="bg-primary" @click="loginHandler" :disabled="loading") Login
  template(v-if="status === 1") SELECT
  template(v-if="status === 2")
    v-navigation-drawer(app v-model="drawer")
    v-app-bar(app class="bg-primary")
      v-app-bar-nav-icon(@click="drawer = !drawer" class="bg-primary text-white")
      v-spacer
      v-app-bar-title EC-Nordbund Verwaltung
      v-spacer
      v-btn(icon class="bg-primary" @click="logoutHandler")
        v-icon(color="white") mdi-logout
    v-main
      v-container(fluid)
        router-view
    v-footer(app)
</template>
