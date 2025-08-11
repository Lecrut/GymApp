<script setup lang="ts">
import type { IUser } from '~/models/user'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import formValidation from '~/composables/formValidation'
import { emailRule, lengthRule, lengthRuleShort, passwordRule, requiredRule, timestampPastRule } from '~/composables/rules'
import { useAuthStore } from '../../stores/auth'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const { form, valid, isValid } = formValidation()

const userEmail = ref('')
const userPassword = ref('')
const userConfirmPassword = ref('')
const userName = ref('')
const userSurname = ref('')
const userNickname = ref('')

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

const allowDates = computed(() => {
  const today = new Date()
  const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate())

  return maxDate.toISOString().substr(0, 10)
})

function checkPasswordsMatch(): boolean {
  return userPassword.value === userConfirmPassword.value
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
    }
    else {
      router.push('/user')
    }
  }
  catch (err: any) {
    error.value = err.message
  }
}

async function checkEmail(userEmailVariable: string) {
  try {
    if (!checkPasswordsMatch()) {
      error.value = 'Passwords do not match'

      return
    }
    if (await isValid()) {
      const isSuccess = await authStore.checkEmailAvailability(userEmailVariable)
      if (isSuccess) {
        currentStep.value++
        error.value = null
      }
      else {
        error.value = authStore.error || 'Email in use'
      }
    }
  }
  catch (err: any) {
    error.value = err.message
  }
}

async function checkNextStep() {
  if (await isValid()) {
    currentStep.value++
    error.value = null
  }
  else {
    error.value = 'Please fill in all required fields correctly.'
  }
}

async function handleRegistrationByPassword() {
  try {
    if (!checkPasswordsMatch()) {
      error.value = 'Passwords do not match'

      return
    }
    if (await isValid()) {
      const newUser: IUser = {
        email: userEmail.value,
        name: userName.value,
        surname: userSurname.value,
        nick: userNickname.value,
        dateOfBirth: new Date(selectedDate.value || ''),
        photo: '',
        role: 'user',
        created: new Date(),
      }
      await authStore.registerByPassword(newUser, userPassword.value)
      if (authStore.error) {
        error.value = authStore.error
      }
      else {
        router.push('/user')
      }
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
      <v-col
        class="d-flex justify-center"
        cols="12"
        md="6"
      >
        <v-card
          color="secondary"
          class="pa-6 w-100 mx-auto"
          style="max-width: 700px; width: 100%;"
        >
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

                <v-form
                  ref="form"
                  v-model="valid"
                  class="mx-auto"
                  style="max-width: 400px; width: 100%;"
                  @submit.prevent="checkEmail(userEmail)"
                >
                  <v-text-field
                    v-model="userEmail"
                    :label="$t('auth.register.email')"
                    type="email"
                    required
                    prepend-inner-icon="mdi-email"
                    :rules="[
                      emailRule(),
                      requiredRule(),
                    ]"
                  />

                  <v-text-field
                    v-model="userPassword"
                    :label="$t('auth.register.password')"
                    type="password"
                    required
                    prepend-inner-icon="mdi-lock"
                    :rules="[
                      passwordRule(),
                      lengthRuleShort(),
                    ]"
                  />

                  <v-text-field
                    v-model="userConfirmPassword"
                    :label="$t('auth.register.confirmPassword')"
                    type="password"
                    required
                    prepend-inner-icon="mdi-lock"
                    :rules="[
                      passwordRule(),
                      lengthRuleShort(),
                    ]"
                  />

                  <v-alert
                    v-if="error"
                    type="error"
                    class="my-2"
                  >
                    {{ error }}
                  </v-alert>

                  <v-btn
                    color="primary"
                    class="mt-4"
                    block
                    type="submit"
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

                <v-form
                  ref="form"
                  v-model="valid"
                  class="mx-auto"
                  style="max-width: 400px; width: 100%;"
                  @submit.prevent="checkNextStep()"
                >
                  <v-text-field
                    v-model="userName"
                    :label="$t('auth.register.name')"
                    type="text"
                    required
                    prepend-inner-icon="mdi-account-outline"
                    :rules="[
                      lengthRuleShort(),
                      lengthRule(),
                      requiredRule(),
                    ]"
                  />

                  <v-text-field
                    v-model="userSurname"
                    :label="$t('auth.register.surname')"
                    type="text"
                    required
                    prepend-inner-icon="mdi-account-outline"
                    :rules="[
                      lengthRuleShort(),
                      lengthRule(),
                      requiredRule(),
                    ]"
                  />

                  <v-text-field
                    :model-value="formatSelectedDate(selectedDate)"
                    :label="$t('auth.register.dateBirth')"
                    required
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    :rules="[
                      requiredRule(),
                      timestampPastRule(),
                    ]"
                    @click="dialog = true"
                  />

                  <v-dialog
                    v-model="dialog"
                    width="290"
                  >
                    <v-date-picker
                      v-model="selectedDate"
                      :max="allowDates"
                      @update:model-value="dialog = false"
                    />
                  </v-dialog>

                  <v-alert
                    v-if="error"
                    type="error"
                    class="my-2"
                  >
                    {{ error }}
                  </v-alert>

                  <v-btn
                    color="primary"
                    class="mt-4"
                    block
                    type="submit"
                  >
                    <!-- @click="currentStep++" -->
                    {{ $t('landingPage.next') }}
                  </v-btn>
                </v-form>
              </v-stepper-content>
            </template>

            <template #item.3>
              <v-stepper-content step="3">
                <v-card-title class="text-h5 mb-4 text-center">
                  {{ steps[2].text }}
                </v-card-title>

                <v-form
                  ref="form"
                  v-model="valid"
                  class="mx-auto"
                  style="max-width: 400px; width: 100%;"
                  @submit.prevent="handleRegistrationByPassword"
                >
                  <v-text-field
                    v-model="userNickname"
                    :label="$t('auth.register.nickname')"
                    type="text"
                    required
                    prepend-inner-icon="mdi-weight-lifter"
                    :rules="[
                      lengthRuleShort(),
                      lengthRule(),
                      requiredRule(),
                    ]"
                  />

                  <v-alert
                    v-if="error"
                    type="error"
                    class="my-2"
                  >
                    {{ error }}
                  </v-alert>

                  <v-btn
                    color="primary"
                    class="mt-4"
                    block
                    type="submit"
                  >
                    {{ $t('auth.register.register') }}
                  </v-btn>
                </v-form>
              </v-stepper-content>
            </template>
          </v-stepper>
        </v-card>
      </v-col>

      <v-col
        class="d-flex justify-center my-auto"
        cols="12"
        md="6"
      >
        <v-img
          class="flex-grow-0"
          height="100%"
          width="100%"
          src="/images/register-phone.svg"
        >
          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                color="grey-lighten-4"
                indeterminate
              />
            </div>
          </template>
        </v-img>
      </v-col>
    </v-row>
  </v-container>
</template>
