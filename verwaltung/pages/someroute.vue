<script setup lang="ts">
import getData from "@api/test.post";
import { ref } from "vue";

import { onInvalidate } from "@/composables/api";

const data = ref<Awaited<ReturnType<typeof getData>>>();

async function loadData() {
  data.value = await getData({
    params: {},
    query: {
      limit: 10,
      offset: 20,
    },
    body: {},
  });
}

await loadData();

onInvalidate(["test:example:key"], loadData);
</script>
<template lang="pug">
p {{ data!.data }}
</template>
