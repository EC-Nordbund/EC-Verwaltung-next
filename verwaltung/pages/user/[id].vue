<script setup lang="ts">
import loadUser from '@api/admin/user/_id.get'
import { ref, computed } from 'vue'
import { onInvalidate } from '@/composables/api'
import { useRoute } from 'vue-router';

const user = ref<Awaited<ReturnType<typeof loadUser>>>({} as any)
const route = useRoute()

const loaded = computed(() => 'user' in user.value)

async function loadData() {
  user.value = await loadUser({ query: {}, body: {}, params: { id: route.params.id.toString() } })
}
loadData()

onInvalidate([`user:${route.params.id}`], () => loadData())
</script>
<template lang="pug">
v-container
  template(v-if="loaded")
    h2 Benutzerverwaltung {{ user.user.username }} ({{ user.user.name }})
    p Benutzer freigeschaltet bis: {{ user.user.valid_until }}
    p Benutzer ist {{ user.user.is_admin ? '' : 'kein' }} Administrator
    p {{ user }}
    v-list
      v-list-item(v-for="recht in user.rechte" :key="recht.user_rechte_id" @click="")
        v-list-item-title {{ recht.recht }} für {{ recht.recht_object_name }} ({{ recht.recht_object_id }})
  template(v-else)
    p Loading...
</template>