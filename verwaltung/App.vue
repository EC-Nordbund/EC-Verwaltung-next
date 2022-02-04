<script setup lang="ts">
import { useAuthData } from '@/composables/api';
import EcLogin from '@/components/EcLogin.vue';
import EcChooseUser from '@/components/EcChooseUser.vue';
import EcLayout from '@/components/EcLayout.vue';

const { status } = useAuthData();
</script>
<template lang="pug">
v-app
  EcLogin(v-if="status === 0")
  EcChooseUser(v-if="status === 1")
  EcLayout(v-if="status === 2")
</template>
