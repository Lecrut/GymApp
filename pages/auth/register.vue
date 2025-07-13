<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const selectedDate = ref<string | null>(null)
const dialog = ref(false)
const currentStep = ref(1)

const error = ref<string | null>(null)

function formatSelectedDate(date: string | null): string {
  if (!date)
    return ''
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}-${month}-${year}`
}

const steps = computed(() => [
  {
    label: t('auth.register.stepper.step1.label'),
    title: t('auth.register.stepper.step1.title'),
    text: t('auth.register.stepper.step1.text'),
  },
  {
    label: t('auth.register.stepper.step2.label'),
    title: t('auth.register.stepper.step2.title'),
    text: t('auth.register.stepper.step2.text'),
  },
  {
    label: t('auth.register.stepper.step3.label'),
    title: t('auth.register.stepper.step3.title'),
    text: t('auth.register.stepper.step3.text'),
  },
])

async function pushByGoogle() {
  try {
    await authStore.loginWithGoogle()
    if (authStore.error) {
      error.value = authStore.error
      console.log(error.value)
    }
    else {
      router.push('/user')
    }
  }
  catch (err: any) {
    error.value = err.message
  }
}
</script>

<template>
  <v-container
    min-width="100%"
    style="min-height: 85vh;"
    class="bg-blue-lighten-1 d-flex flex-column pt-7 pb-7 ga-10"
  >
    <v-row class="my-auto">
      <v-col class="d-flex justify-center " cols="12" md="6">
        <v-card color="secondary" class="pa-6 w-100 mx-auto" style="max-width: 700px; width: 100%;">
          <v-card-title class="text-h5 mb-4 text-center">
            {{ $t('auth.register.register').toUpperCase() }}
          </v-card-title>
          <v-btn
            color="primary"
            class="my-4"
            block
            prepend-icon="mdi-google"
            @click="pushByGoogle"
          >
            {{ $t('auth.register.google') }}
          </v-btn>
          <v-stepper
            v-model="currentStep"
            class="mx-auto"
            :items="steps.map((s) => s.label)"
            bg-color="secondary"
            hide-actions
          >
            <template #item.1>
              <v-stepper-content step="1">
                <v-card-text class="text-center mb-4">
                  {{ steps[0].text }}
                </v-card-text>
                <v-form class="mx-auto" style="max-width: 400px; width: 100%;">
                  <v-text-field
                    :label="$t('auth.register.email')"
                    type="email"
                    required
                    prepend-inner-icon="mdi-email"
                  />
                  <v-text-field
                    :label="$t('auth.register.password')"
                    type="password"
                    required
                    prepend-inner-icon="mdi-lock"
                  />
                  <v-text-field
                    :label="$t('auth.register.confirmPassword')"
                    type="password"
                    required
                    prepend-inner-icon="mdi-lock"
                  />
                  <v-btn
                    color="primary"
                    class="mt-4"
                    block
                    @click="currentStep++"
                  >
                    {{ $t('landingPage.next') }}
                  </v-btn>
                </v-form>
              </v-stepper-content>
            </template>

            <template #item.2>
              <v-stepper-content step="2">
                <v-card-text class="text-center mb-4">
                  {{ steps[1].text }}
                </v-card-text>
                <v-form class="mx-auto" style="max-width: 400px; width: 100%;">
                  <v-text-field
                    :label="$t('auth.register.name')"
                    type="text"
                    required
                    prepend-inner-icon="mdi-account-outline"
                  />
                  <v-text-field
                    :label="$t('auth.register.surname')"
                    type="text"
                    required
                    prepend-inner-icon="mdi-account-outline"
                  />
                  <v-text-field
                    :model-value="formatSelectedDate(selectedDate)"
                    :label="$t('auth.register.dateBirth')"
                    required
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    @click="dialog = true"
                  />
                  <v-dialog v-model="dialog" width="290">
                    <v-date-picker
                      v-model="selectedDate"
                      @update:model-value="dialog = false"
                    />
                  </v-dialog>
                  <v-btn
                    color="primary"
                    class="mt-4"
                    block
                    @click="currentStep++"
                  >
                    {{ $t('landingPage.next') }}
                  </v-btn>
                </v-form>
              </v-stepper-content>
            </template>

            <template #item.3>
              <v-stepper-content step="3">
                <v-card-title class="text-h5 mb-4 text-center ">
                  {{ steps[2].text }}
                </v-card-title>
                <v-form class="mx-auto" style="max-width: 400px; width: 100%;">
                  <v-text-field
                    :label="$t('auth.register.nickname')"
                    type="text"
                    required
                    prepend-inner-icon="mdi-weight-lifter"
                  />
                  <v-btn
                    color="primary"
                    class="mt-4"
                    block
                    @click=""
                  >
                    {{ $t('auth.register.register') }}
                  </v-btn>
                </v-form>
              </v-stepper-content>
            </template>
          </v-stepper>
        </v-card>
      </v-col>
      <v-col class="d-flex justify-center my-auto" cols="12" md="6">
        <v-img
          class="flex-grow-0"
          height="100%"
          width="100%"
          src="/images/register-phone.svg"
        >
          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular color="grey-lighten-4" indeterminate />
            </div>
          </template>
        </v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>

</style>