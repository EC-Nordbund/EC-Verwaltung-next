<script setup lang="ts">
import getData from '@api/test.post'

const data = await getData({
  params: {},
  query: {
    limit: 10,
    offset: 20
  },
  body: {}
})

</script>
<template lang="pug">
p {{ data.data }}
</template>
