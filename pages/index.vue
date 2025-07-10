<template>
  <div
    class="bg-blue-lighten-1 d-flex flex-column flex-md-row justify-center ga-5 pt-7 pb-7"
  >
    <div class="w-100 d-flex align-center justify-center">
      <div class="d-flex flex-column ga-3">
        <h3 class="text-h3 font-weight-bold">
          {{ $t("landingPage.header1") }}
        </h3>
        <h3 class="text-h3 font-weight-bold text-primary">
          {{ $t("landingPage.header2") }}
        </h3>
        <p class="text-subtitle-1">
          Start your fitness journey right now, right here
        </p>
        <v-btn>Sign up</v-btn>
      </div>
    </div>
    <div class="w-100 d-flex justify-center">
      <v-img
        class="flex-grow-0"
        height="400"
        width="400"
        src="/images/personal-trainer.svg"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular color="grey-lighten-4" indeterminate />
          </div>
        </template>
      </v-img>
    </div>
  </div>
</template>
