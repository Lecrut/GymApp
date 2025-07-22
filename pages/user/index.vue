<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import auth from '~/middleware/auth'

definePageMeta({
  middleware: [auth]
})

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const userData = ref<typeof authStore.userData | null>(null)
const loading = ref(true)

const userItems = computed(() => [
  {
    title: t('navigation.statistics'),
    value: 'statistics',
    props: {
      prependIcon: 'mdi-chart-scatter-plot',
      image: '/images/user-statistics.svg'
    },
  },
  {
    title: t('navigation.profile'),
    value: 'profile',
    props: {
      prependIcon: 'mdi-account-circle',
      image: '/images/user-profile.svg'
    },
  },
  {
    title: t('navigation.trainings'),
    value: 'trainings',
    props: {
      prependIcon: 'mdi-dumbbell',
      image: '/images/training-time.svg'
    },
  },
  {
    title: t('navigation.trainingHistory'),
    value: 'training-history',
    props: {
      prependIcon: 'mdi-history',
      image: '/images/training-history.svg'
    },
  },
  // {
  //   title: t('navigation.logout'),
  //   value: 'logout',
  //   props: {
  //     prependIcon: 'mdi-logout',
  //   },
  // },
])


async function handleLogout() {
  await authStore.logout()
  if (authStore.error)
    console.error('Logout error:', authStore.error)
  else
    router.push('/')
}

onMounted(async () => {
  loading.value = true
  userData.value = authStore.userData
  loading.value = false
})
</script>

<template>
  <v-container
    min-width="100%"
    style="min-height: 85vh;"
    class="bg-blue-lighten-1 d-flex flex-column ">
    <v-row justify="center" align="center" style="max-height: 60px;">
      <v-col cols="12">
      <v-card-title class="text-h5 text-center font-weight-bold py-2">
        Hej {{ userData?.name || 'Użytkowniku' }}, co dzisiaj robimy?
      </v-card-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="item in userItems" :key="item.value" cols="6" md="3">
         <v-hover
          v-slot="{ isHovering, props }"
          open-delay="200"
        >
            <v-card class="pa-4 d-flex flex-column justify-space-between" @click="router.push(item.value)"
            style="min-height: 60vh;"
            :elevation="isHovering ? 16 : 2" v-bind="props" :color="isHovering ? 'white' : 'primary'">
            <v-card-title class="text-h5 font-weight-bold text-center">{{ item.title.toUpperCase() }}</v-card-title>
            <div class="d-flex justify-center align-center flex-grow-1" style="width: 100%;">
              <v-img
              :src="item.props.image"
              class="mb-4"
              style="max-height: 45vh; max-width: 100%; object-fit: contain;"
              cover
              />
            </div>
            </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>
