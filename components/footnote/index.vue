<template>
  <v-footer>
    <v-container
      class="pt-5 pb-5"
      min-width="100%"
    >
      <v-row
        justify="center"
        align="center"
      >
        <v-col cols="auto">
          {{ new Date().getFullYear() }} <strong>{{ $t('app.title') }}</strong> {{ $t('app.rights') }}
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>
