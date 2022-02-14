<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

import { useDataReload } from '@/composables/reloadableData';
import { toDateFormat } from '@/composables/date';

import FormDialog from '@/components/FormDialog.vue';
import EcLoader from '@/components/EcLoader.vue';
import extendUserValid from '@api/admin/user/_id/extend.post';
import deleteRechtAPI from '@api/admin/user/_id/rechte/_rechtid.delete';
import addRechtAPI from '@api/admin/user/_id/rechte/add.post';
import loadUser from '@api/admin/user/_id.get';

const route = useRoute();

const args = computed(() => ({
  params: { id: route.params.id as string }
}));

const invalidations = computed(() => [`user:${route.params.id}`]);

const { data, error, reload, loading } = useDataReload(loadUser, args, {
  invalidations
});

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

const addRechtName = ref('');
const addRechtId = ref(0);
const addRechtType = ref('');

function addRecht() {
  addRechtAPI({
    params: {
      id: route.params.id as string
    },
    body: {
      id: addRechtId.value,
      name: addRechtName.value,
      recht: addRechtType.value
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
    h2 Benutzerverwaltung {{ data.user.username }} ({{ data.user.name }})
    p Benutzer freigeschaltet bis: {{ toDateFormat(data.user.valid_until) }}
    p Benutzer ist {{ data.user.is_admin ? '' : 'kein' }} Administrator
    p E-Mail: {{data.user.email}}

    FormDialog(title="Benutzer hinzufügen" @save="extend")
      template(v-slot:activator="{ props }")
        v-btn(icon v-bind="props")
          v-icon mdi-clock-check-outline
      p Gibst du kein Datum an wird automatisch auf 100 Tage von jetzt gesetzt. Bitte Format YYYY-MM-DD benutzen!
      v-text-field(label="Datum" v-model="valid_until_date")

    FormDialog(title="Recht hinzufügen" @save="addRecht")
      template(v-slot:activator="{ props }")
        v-btn(icon v-bind="props")
          v-icon mdi-plus
      v-text-field(label="name" v-model="addRechtName")
      v-text-field(label="id" type="number" v-model="addRechtId")
      select(v-model="addRechtType")
        option(value="leiter") Veranstaltungsleiter
        option(value="fzVerantwortlicher") FZ-Verantwortlicher Ort

    v-btn(icon @click="deleteUser")
      v-icon mdi-delete
      

    v-list
      v-list-item(v-for="recht in data.rechte" :key="recht.user_rechte_id" @click="")
        v-list-item-title {{ recht.recht }} für {{ recht.recht_object_name }} (ID: {{ recht.recht_object_id }})
        template(v-slot:append)
          v-list-item-avatar(right)
            v-btn(icon variant="text" @click="deleteRecht(recht.user_rechte_id)")
              v-icon mdi-delete
</template>
