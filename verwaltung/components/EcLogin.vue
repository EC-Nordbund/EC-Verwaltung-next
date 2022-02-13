<script setup lang="ts">
import { login } from '@/composables/api';
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';
import { useAlert } from '@/composables/alerts';

const username = useStorage('username', '');
const password = ref('');
const loading = ref(false);
const showPWD = ref(false);

const { alert } = useAlert();

async function loginHandler() {
  try {
    loading.value = true;
    await login(username.value, password.value);
    loading.value = false;
    password.value = '';
  } catch (ex) {
    await alert(ex as string);
    loading.value = false;
  }
}
</script>
<template lang="pug">
v-main
  v-container
    v-card(max-width="500px" style="margin: auto; margin-top: 10%;")
      v-card-title
        h1(class="text-primary") Login
      v-card-text
        p Bitte Logge dich mit deinem Benutzernamen und Passwort ein!
        v-form(@submit.prevent="loginHandler")
          v-text-field(label="Benutzername" v-model="username" :disabled="loading")
          v-text-field(
            label="Passwort" 
            :type="showPWD ? 'text' : 'password'" 
            @keypress.enter="loginHandler" 
            v-model="password" 
            :disabled="loading"
            :append-inner-icon="showPWD ? 'mdi-eye-off' : 'mdi-eye'" 
            @click:append-inner="showPWD = !showPWD"
          )
      v-card-actions
        v-spacer
        v-btn.bg-primary(
          @click="loginHandler" 
          :disabled="loading || !username || !password"
        ) Login
</template>
