<template lang="pug">
v-list
  v-list-item(to="/fz-ort/antraege")
    v-list-item-avatar(left)
      v-icon mdi-text-box-check
    v-list-item-title Eingesehen eintragen
  v-list-item(to="/fz-ort/antraege")
    v-list-item-avatar(left)
      v-icon mdi-folder-account
    v-list-item-title Anträge
  v-list-item(to="/fz-ort/antrag-create")
    v-list-item-avatar(left)
      v-icon mdi-file-sign
    v-list-item-title Antrag erstellen
  v-list-item(to="/fz-ort/liste")
    v-list-item-avatar(left)
      v-icon mdi-account-multiple
    v-list-item-title Mitarbeiterliste
</template>
