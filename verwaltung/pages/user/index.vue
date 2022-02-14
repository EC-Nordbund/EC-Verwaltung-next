<script setup lang="ts">
import { reactive, toRaw, ref } from 'vue';

import { useDataReload } from '@/composables/reloadableData';
import { required } from '@/rules/requires';

import FormDialog from '@/components/FormDialog.vue';
import EcLoader from '@/components/EcLoader.vue';

import addUser from '@api/admin/user/add.post';
import loadUserList from '@api/admin/user.get';

const {
  data: users,
  reload,
  loading,
  error
} = useDataReload(loadUserList, null, {
  invalidations: ['user']
});

const newUserData = reactive({
  username: '',
  name: '',
  email: '',
  is_admin: false
});

function saveNewUser() {
  addUser({
    body: toRaw(newUserData)
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
    h2 Benutzerverwaltung
    v-list
      v-list-item(v-for="user in users" :key="user.user_id" :to="'/user/' + user.user_id")
        v-list-item-title {{ user.name }} ({{ user.username }})
          template(v-if="user.is_admin") &nbsp;- ADMIN
    FormDialog(title="Benutzer hinzufügen" @save="saveNewUser")
      template(v-slot:activator="{ props }")
        v-btn(icon v-bind="props")
          v-icon mdi-plus
      p Der angelegte Benutzer bekommt automatisch eine E-Mail!
      v-text-field(label="Username" :rules="[required('Username')]" v-model="newUserData.username")
      v-text-field(label="Name" :rules="[required('Name')]" v-model="newUserData.name")
      v-text-field(label="E-Mail" :rules="[required('E-Mail')]" v-model="newUserData.email")
      v-checkbox(label="Administrator" v-model="newUserData.is_admin")
</template>
