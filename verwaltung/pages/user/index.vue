<script setup lang="ts">
import loadUserList from '@api/admin/user.get'
import type { User } from '@api/admin/user.get'
import { ref } from 'vue'
import { onInvalidate } from '@/composables/api'
import { required } from '@/rules/requires'

import FormDialog from '@/components/FormDialog.vue'

const users = ref<User[]>([])

async function loadData() {
  users.value = await loadUserList({ query: {}, body: {}, params: {} })
}
loadData()

const showAddUserDalog = ref(false)

onInvalidate(['user'], () => loadData())
</script>
<template lang="pug">
v-container
  h2 Benutzerverwaltung
  v-list
    v-list-item(v-for="user in users" :key="user.user_id" :to="'/user/' + user.user_id")
      v-list-item-title {{ user.name }} ({{ user.username }})
        template(v-if="user.is_admin") &nbsp;- ADMIN
  FormDialog(title="Benutzer hinzufügen")
    template(v-slot:activator="{ props }")
      v-btn(icon v-bind="props")
        v-icon mdi-plus
    p Der angelegte Benutzer bekommt automatisch eine E-Mail!
    v-text-field(label="Username" :rules="[required('Username')]")
    v-text-field(label="Name" :rules="[required('Name')]")
    v-text-field(label="E-Mail" :rules="[required('E-Mail')]")
    v-checkbox(label="Administrator")
</template>