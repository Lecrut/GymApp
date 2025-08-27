<script setup lang="ts">
import Snackbar from '~/components/Snackbar.vue'

</script>

<template>
  <v-app>
    <navigation />

    <v-main class="fill-height">
      <slot />
    </v-main>

    <footnote />

    <Snackbar />
  </v-app>
</template>
