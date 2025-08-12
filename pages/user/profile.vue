<script lang="ts" setup>
import { mdiAccount, mdiAccountOutline, mdiAt, mdiEmail } from '@mdi/js'
import { onMounted, ref } from 'vue'
import EditProfileDialog from '~/components/dialogs/EditProfileDialog.vue'
import auth from '~/middleware/auth'
import { useAuthStore } from '../../stores/auth'

definePageMeta({
  middleware: [auth],
})

const authStore = useAuthStore()
const { userData } = storeToRefs(authStore)

const loading = ref(true)

const isShowEditDialog = ref(false)

function openEditDialog() {
  isShowEditDialog.value = true
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

            <v-card-actions class="pa-6">
              <v-row
                justify="center"
                align="center"
              >
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-btn
                    variant="elevated"
                    color="primary"
                    block
                    @click="openEditDialog"
                  >
                    {{ $t('auth.editProfile') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </template>
        </v-card>
      </v-col>
    </v-row>

    <EditProfileDialog
      v-model:is-show="isShowEditDialog"
    />
  </v-container>
</template>
