<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();

const steps = [
  {
    label: t("landingPage.step1.label"),
    title: t("landingPage.step1.title"),
    text: t("landingPage.step1.text"),
    icon: "mdi-account-plus",
  },
  {
    label: t("landingPage.step2.label"),
    title: t("landingPage.step2.title"),
    text: t("landingPage.step2.text"),
    icon: "mdi-dumbbell",
  },
  {
    label: t("landingPage.step3.label"),
    title: t("landingPage.step3.title"),
    text: t("landingPage.step3.text"),
    icon: "mdi-run",
  },
];

const value = ref([0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9]);
</script>

<template>
  <v-container
    min-width="100%"
    class="bg-blue-lighten-1 d-flex flex-column pt-7 pb-7 ga-10"
  >
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
            {{ $t("landingPage.subtitle") }}
          </p>
          <v-btn @click="router.push('auth/register')">{{ $t("landingPage.signUp") }}</v-btn>
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
        <v-stepper
          :items="steps.map((s) => s.label)"
          bg-color="secondary"
          :prev-text="$t('landingPage.previous')"
          :next-text="$t('landingPage.next')"
        >
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
    <v-row justify="center">
      <v-col cols="12" md="5">
        <v-sparkline
          line-width="2"
          :model-value="value"
          smooth="smooth"
          color="primary"
        />
      </v-col>
      <v-col
        class="d-flex flex-column justify-center font-weight-regular text-justify"
        cols="12"
        md="5"
        offset-md="1"
      >
        {{ $t("landingPage.slogan") }}
      </v-col>
    </v-row>
  </v-container>
</template>
