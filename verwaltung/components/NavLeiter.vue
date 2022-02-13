<template lang="pug">
v-list
  v-list-item(to="/leiter/ma")
    v-list-item-avatar(left)
      v-icon mdi-account 
    v-list-item-title Mitarbeiter
  v-list-item(to="/leiter/tn")
    v-list-item-avatar(left)
      v-icon mdi-human-child
    v-list-item-title Teilnehmer
  v-list-item(to="/leiter/sonstiges")
    v-list-item-avatar(left)
      v-icon mdi-file-export
    v-list-item-title Sonstiges
</template>
