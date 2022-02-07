<script setup lang="ts">
import { useAuthData } from '@/composables/api';
import { ref, computed } from 'vue';

import NavAdmin from './NavAdmin.vue';
import NavFz from './NavFz.vue';
import NavLeiter from './NavLeiter.vue';
import NavHeader from './NavHeader.vue';

const build = __BUILD_ID__;

const { userData, internal, timeUntilExpire } = useAuthData();
const drawer = ref<boolean>();
</script>
<template lang="pug">
v-navigation-drawer(app v-model="drawer")
  NavHeader
  v-divider
  NavAdmin(v-if="userData.rechte === 'admin'")  
  NavLeiter(v-else-if="userData.rechte.type === 'leiter'")
  NavFz(v-else-if="userData.rechte.type === 'fzVerantwortlicher'")
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
