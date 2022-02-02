<script setup lang="ts">
import FormDialog from '@/components/FormDialog.vue';
import loadUser from '@api/admin/user/_id.get';
import { onInvalidate } from '@/composables/api';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import { useDataReload } from '@/composables/reloadableData';
import EcLoader from '@/components/EcLoader.vue';
import { toDateFormat } from '@/composables/date';
import { ref } from 'vue';
import extendUserValid from '@api/admin/user/_id/extend.post';
import deleteRechtAPI from '@api/admin/user/_id/rechte/_rechtid.delete';

const route = useRoute();

const {
  data: user,
  reload,
  loading,
  error,
  nav
} = useDataReload(() =>
  loadUser({
    params: { id: route.params.id as string }
  })
);

onInvalidate([`user:${route.params.id}`], () => reload());
onBeforeRouteUpdate(nav);

const valid_until_date = ref<string>();
function extend() {
  return extendUserValid({
    params: { id: route.params.id as string },
    body: valid_until_date.value ? { valid: valid_until_date.value } : {}
  });
}

function deleteUser() {
  valid_until_date.value = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  extend();
}

function deleteRecht(id: number) {
  deleteRechtAPI({
    params: {
      id: route.params.id as string,
      rechtid: id.toString()
    }
  });
}
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

    FormDialog(title="Benutzer hinzufügen" @save="extend")
      template(v-slot:activator="{ props }")
        v-btn(icon v-bind="props")
          v-icon mdi-clock-check-outline
      p Gibst du kein Datum an wird automatisch auf 100 Tage von jetzt gesetzt. Bitte Format YYYY-MM-DD benutzen!
      v-text-field(label="Datum" v-model="valid_until_date")

    v-btn(icon @click="deleteUser")
      v-icon mdi-delete
      

    v-list
      v-list-item(v-for="recht in user.rechte" :key="recht.user_rechte_id" @click="")
        v-list-item-title {{ recht.recht }} für {{ recht.recht_object_name }} (ID: {{ recht.recht_object_id }})
        template(v-slot:append)
          v-list-item-avatar(right)
            v-btn(icon variant="text" @click="deleteRecht(recht.user_rechte_id)")
              v-icon mdi-delete
</template>
