<template lang="pug">
v-list
  v-list-subheader Personen
  v-list-item(to="/personen/liste")
    v-list-item-avatar(left)
      v-icon mdi-account-filter
    v-list-item-title Liste
  v-list-item(to="/personen/search")
    v-list-item-avatar(left)
      v-icon mdi-account-search
    v-list-item-title Suche
  v-list-item(to="/personen/merge")
    v-list-item-avatar(left)
      v-icon mdi-merge 
    v-list-item-title Mergen
  v-list-item(to="/adresse/merge")
    v-list-item-avatar(left)
      v-icon mdi-home-assistant
    v-list-item-title Adressen mergen
  v-list-subheader Führungszeugnisse
  v-list-item(to="/fz/antraege")
    v-list-item-avatar(left)
      v-icon mdi-file-sign
    v-list-item-title Anträge
  v-list-item(to="/fz/liste")
    v-list-item-avatar(left)
      v-icon mdi-account-multiple
    v-list-item-title Mitarbeiterliste
  v-list-subheader Veranstaltungen
  v-list-item(to="/veranstaltungen/liste")
    v-list-item-avatar(left)
      v-icon mdi-calendar-multiple
    v-list-item-title Liste
  v-list-item(to="/anmeldungen/suche")
    v-list-item-avatar(left)
      v-icon mdi-badge-account
    v-list-item-title Anmeldungen
  v-list-item(to="/veranstaltungsorte/liste")
    v-list-item-avatar(left)
      v-icon mdi-home-group
    v-list-item-title Orte
  v-list-subheader Sonstiges
  v-list-item(to="/ak")
    v-list-item-avatar(left)
      v-icon mdi-account-group
    v-list-item-title Arbeitskreise
  v-list-item(to="/user")
    v-list-item-avatar(left)
      v-icon mdi-account-cog
    v-list-item-title Benutzer
</template>
