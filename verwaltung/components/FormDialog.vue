<script setup lang="ts">
import { ref } from "vue";
import { useAlert } from "@/composables/alerts";

const showDialog = ref(false);

const props = defineProps<{
  title: string;
}>();

const emit = defineEmits<{
  (event: "save"): void;
}>();

const valid = ref<boolean>(null!);

function save() {
  if (valid.value) {
    showDialog.value = false;
    emit("save");
  } else {
  }
}
</script>
<template lang="pug">
v-dialog(fullscreen v-model="showDialog")
  template(#activator="args")
    slot(name="activator" v-bind="args")
      v-btn(icon v-bind="args.props")
        v-icon mdi-plus
  v-card
    v-app-bar(color="primary")
      v-app-bar-title {{ props.title }}
      v-spacer
      v-btn(@click="save") Speichern
      v-btn(icon @click="showDialog = false")
        v-icon mdi-close
    //- Current workaround as v-toolbar currently doesn't exist!
    div(style="margin-top: 128px;")
    v-card-text
      v-form(@submit.prevent="save" v-model="valid")
        slot
</template>
