<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import formValidation from '~/composables/formValidation'
import { emailRule, passwordRule, requiredRule } from '~/composables/rules'
import { useSharedStore } from '~/stores/shared'
import { useAuthStore } from '../../stores/auth'

const { valid } = formValidation()

const router = useRouter()
const authStore = useAuthStore()

const sharedStore = useSharedStore()
const { error, loading } = storeToRefs(sharedStore)

const userEmail = ref('')
const userPassword = ref('')
const showPassword = ref(false)

async function pushByGoogle() {
  await authStore.loginWithGoogle()
  if (!error.value) {
    router.push('/user')
  }
}

async function handleLoginByPassword() {
  await authStore.loginWithEmail(userEmail.value, userPassword.value)
  if (!error.value) {
    router.push('/user')
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
        class="justify-center"
        cols="12"
        md="6"
      >
        <v-card
          :loading="loading"
          :disabled="loading"
          color="secondary"
          class="pa-6 mx-auto"
          style="max-width: 700px; width: 100%;"
        >
          <v-card-title class="text-h5 mb-4 text-center">
            {{ $t('auth.login.title') }}
          </v-card-title>

          <v-btn
            color="primary"
            class="my-4"
            block
            prepend-icon="mdi-google"
            @click="pushByGoogle"
          >
            {{ $t('auth.login.google') }}
          </v-btn>

          <v-divider
            :thickness="4"
            class="border-opacity-75 py-1"
            color="primary"
          />

          <v-form
            v-model="valid"
            class="mx-auto my-5"
            style="max-width: 500px; width: 100%;"
            @submit.prevent="handleLoginByPassword"
          >
            <v-text-field
              v-model="userEmail"
              :label="$t('auth.register.email')"
              type="email"
              autocomplete="email"
              required
              prepend-inner-icon="mdi-email"
              :rules="[
                requiredRule(),
                emailRule(),
              ]"
            />

            <v-text-field
              v-model="userPassword"
              :label="$t('auth.register.password')"
              :type="showPassword
                ? 'text'
                : 'password'"
              autocomplete="current-password"
              required
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showPassword
                ? 'mdi-eye-off'
                : 'mdi-eye'"
              :rules="[
                requiredRule(),
                passwordRule(),
              ]"
              @click:append-inner="showPassword = !showPassword"
            />

            <v-alert
              v-if="error"
              type="error"
              class="mt-4"
              dismissible
            />

            <v-btn
              color="primary"
              class="mt-4"
              block
              type="submit"
            >
              {{ $t('navigation.login') }}
            </v-btn>
          </v-form>
        </v-card>
      </v-col>

      <v-col
        class="justify-center"
        style="max-height: 450px"
        cols="12"
        md="6"
      >
        <v-img
          class="flex-grow-0"
          height="100%"
          width="100%"
          src="/images/training-time.svg"
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
