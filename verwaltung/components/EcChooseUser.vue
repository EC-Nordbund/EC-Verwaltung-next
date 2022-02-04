<script setup lang="ts">
import { useAuthData } from '@/composables/api';
import { computed } from 'vue';

const { currentToken, tokenList } = useAuthData();
const tokenNames = computed(() => Object.keys(tokenList.value ?? {}));

function logoutHandler() {
  currentToken.value = null;
  tokenList.value = null;
}
</script>
<template lang="pug">
v-main
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
        v-btn(icon @click="logoutHandler" variant="text")
          v-icon mdi-logout
</template>
