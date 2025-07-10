<script setup>
const steps = [
  {
    label: "Step 1",
    title: "Create account",
    text: "Sign up on our website.",
    icon: "mdi-account-plus",
  },
  {
    label: "Step 2",
    title: "Workout plan",
    text: "Choose one of many workout plans which fits you the most.",
    icon: "mdi-dumbbell",
  },
  {
    label: "Step 3",
    title: "Train",
    text: "Start training with choosen workout plan and achieve your goals.",
    icon: "mdi-run",
  },
];
</script>

<template>
  <v-container min-width="100%" class="bg-blue-lighten-1 pt-7 pb-7">
    <v-row>
      <v-col class="d-flex align-center justify-center" cols="12" md="6">
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
      </v-col>
      <v-col class="d-flex justify-center" cols="12" md="6">
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
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-stepper :items="steps.map((s) => s.label)" bg-color="secondary">
          <template
            v-for="(step, idx) in steps"
            :key="step.label"
            #[`item.${idx+1}`]
          >
            <v-card
              :title="step.title"
              :text="step.text"
              :prepend-icon="step.icon"
              color="secondary"
            />
          </template>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>
