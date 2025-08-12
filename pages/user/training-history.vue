<script setup lang="ts">
import auth from '~/middleware/auth'

definePageMeta({
  middleware: [auth],
})
</script>

<template>
  <div />
</template>
