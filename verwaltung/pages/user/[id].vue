<script setup lang="ts">
import loadUserApi from '@api/admin/user/_id.get';
import { onInvalidate } from '@/composables/api';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import { useDataReload } from '@/composables/reloadableData';
import EcLoader from '@/components/EcLoader.vue';
import { toDateFormat } from '@/composables/date';

const route = useRoute();

const {
  data: user,
  reload,
  loading,
  error,
  nav
} = useDataReload(() =>
  loadUserApi({
    params: { id: route.params.id as string }
  })
);

onInvalidate([`user:${route.params.id}`], () => reload());
onBeforeRouteUpdate(nav);
</script>
<template lang="pug">
v-container(fluid)
  template(v-if="loading")
    EcLoader(size="50px")
  template(v-else-if="error")
    p Ein fehler beim laden ist aufgetreten: {{error}}
    v-btn(@click="reload") Nochmal versuchen
  template(v-else)
    h2 Benutzerverwaltung {{ user.user.username }} ({{ user.user.name }})
    p Benutzer freigeschaltet bis: {{ toDateFormat(user.user.valid_until) }}
    p Benutzer ist {{ user.user.is_admin ? '' : 'kein' }} Administrator
    p E-Mail: {{user.user.email}}
    //- p {{ user }}
    v-list
      v-list-item(v-for="recht in user.rechte" :key="recht.user_rechte_id" @click="")
        v-list-item-title {{ recht.recht }} für {{ recht.recht_object_name }} (ID: {{ recht.recht_object_id }})
</template>
