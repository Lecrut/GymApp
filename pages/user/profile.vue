<script lang="ts" setup>
import { mdiAccount, mdiAccountOutline, mdiAt, mdiEmail, mdiLogout, mdiPencil } from '@mdi/js'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import auth from '~/middleware/auth'
import { useAuthStore } from '../../stores/auth'

definePageMeta({
  middleware: [auth],
})

const router = useRouter()
const authStore = useAuthStore()
const userData = ref<typeof authStore.userData | null>(null)
const loading = ref(true)

async function handleLogout() {
  await authStore.logout()
  if (authStore.error)
    console.error('Logout error:', authStore.error)
  else
    router.push('/')
}

onMounted(() => {
  loading.value = true
  userData.value = authStore.userData
  loading.value = false
})
</script>

<template>
  <v-container class="pa-4">
    <v-row justify="center">
      <v-col
        cols="12"
        sm="10"
        md="8"
        lg="6"
      >
        <v-card
          elevation="3"
          class="mx-auto"
        >
          <template v-if="loading">
            <!-- Loading skeleton -->
            <v-card-text class="text-center pa-6">
              <v-skeleton-loader
                type="avatar"
                class="mx-auto mb-4"
              />

              <v-skeleton-loader
                type="text"
                width="60%"
                class="mx-auto mb-2"
              />

              <v-skeleton-loader
                type="text"
                width="40%"
                class="mx-auto"
              />
            </v-card-text>
          </template>

          <template v-else>
            <!-- Profile Header -->
            <v-card-text class="text-center pa-6">
              <v-avatar
                size="120"
                color="primary"
                class="mb-4"
              >
                <v-icon
                  size="60"
                  color="white"
                >
                  {{ mdiAccount }}
                </v-icon>
              </v-avatar>

              <h2 class="text-h4 font-weight-medium mb-2">
                {{ userData?.name }} {{ userData?.surname }}
              </h2>

              <p class="text-subtitle-1 text-medium-emphasis">
                {{ userData?.nick }}
              </p>
            </v-card-text>

            <v-divider />

            <!-- Profile Information -->
            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12">
                  <div class="d-flex align-center mb-4">
                    <v-icon
                      color="primary"
                      class="me-3"
                    >
                      {{ mdiEmail }}
                    </v-icon>

                    <div>
                      <p class="text-caption text-medium-emphasis mb-1">
                        {{ $t('auth.email') }}
                      </p>

                      <p class="text-body-1 font-weight-medium">
                        {{ userData?.email }}
                      </p>
                    </div>
                  </div>
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
                >
                  <div class="d-flex align-center mb-4">
                    <v-icon
                      color="primary"
                      class="me-3"
                    >
                      {{ mdiAccount }}
                    </v-icon>

                    <div>
                      <p class="text-caption text-medium-emphasis mb-1">
                        {{ $t('auth.firstName') }}
                      </p>

                      <p class="text-body-1 font-weight-medium">
                        {{ userData?.name }}
                      </p>
                    </div>
                  </div>
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
                >
                  <div class="d-flex align-center mb-4">
                    <v-icon
                      color="primary"
                      class="me-3"
                    >
                      {{ mdiAccountOutline }}
                    </v-icon>

                    <div>
                      <p class="text-caption text-medium-emphasis mb-1">
                        {{ $t('auth.lastName') }}
                      </p>

                      <p class="text-body-1 font-weight-medium">
                        {{ userData?.surname }}
                      </p>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12">
                  <div class="d-flex align-center">
                    <v-icon
                      color="primary"
                      class="me-3"
                    >
                      {{ mdiAt }}
                    </v-icon>

                    <div>
                      <p class="text-caption text-medium-emphasis mb-1">
                        {{ $t('auth.nickname') }}
                      </p>

                      <p class="text-body-1 font-weight-medium">
                        {{ userData?.nick }}
                      </p>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>

            <v-divider />

            <!-- Actions -->
            <v-card-actions class="pa-6">
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-btn
                    variant="outlined"
                    color="primary"
                    block
                    :prepend-icon="mdiPencil"
                  >
                    {{ $t('auth.editProfile') }}
                  </v-btn>
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-btn
                    variant="flat"
                    color="error"
                    block
                    :prepend-icon="mdiLogout"
                    @click="handleLogout"
                  >
                    {{ $t('auth.logout') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
