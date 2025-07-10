<template>
  <v-container
    min-width="100%"
    style="min-height: 85vh;"
    class="bg-blue-lighten-1 d-flex flex-column pt-7 pb-7 ga-10"
  >
    <v-row class="my-auto">
      <v-col class="justify-center" cols="12" md="6">
        <v-card color="secondary" class="pa-6 mx-auto" style="max-width: 700px; width: 100%;">
          <v-card-title class="text-h5 mb-4 text-center">{{ $t('auth.login.title') }}</v-card-title>
          <v-btn
            color="primary"
            class="my-4"
            block
            @click="pushByGoogle"
            prepend-icon="mdi-google"
          >
            {{ $t('auth.login.google') }}
          </v-btn>

          <v-divider :thickness="4" class="border-opacity-75 py-1" color="primary"></v-divider>

          <!-- <v-card-title class="text-center mb-4">
            {{ $t('navigation.login').toUpperCase() }}
          </v-card-title> -->
          <v-form class="mx-auto my-5" style="max-width: 500px; width: 100%;">
            <v-text-field
              :label="$t('auth.register.email')"
              type="email"
              required 
              prepend-inner-icon="mdi-email"
            ></v-text-field>
            <v-text-field
              :label="$t('auth.register.password')"
              type="password"
              required
              prepend-inner-icon="mdi-lock"
            ></v-text-field>

            <v-btn
              color="primary"
              class="mt-4"
              block
              @click="pushByGoogle"
            >
              {{ $t('navigation.login') }}
            </v-btn>
          </v-form>       
        </v-card>
      </v-col>
      <v-col class="justify-center" style="max-height: 450px" cols="12" md="6">
        <v-img
          class="flex-grow-0"
          height="100%"
          width="100%"
          src="/images/training-time.svg"
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

<script lang="ts" setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useAuthStore } from '../../stores/auth';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

const error = ref<string | null>(null);

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
  } catch (err: any) {
    error.value = err.message
  }
}
</script>

<style>

</style>