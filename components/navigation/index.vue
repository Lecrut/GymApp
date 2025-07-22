<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const { t } = useI18n()

const guestItems = computed(() => [
  {
    title: t('navigation.home'),
    value: '',
    props: {
      prependIcon: 'mdi-home',
    },
  },
  {
    title: t('navigation.login'),
    value: 'auth/login',
    props: {
      prependIcon: 'mdi-login',
    },
  },
  {
    title: t('navigation.register'),
    value: 'auth/register',
    props: {
      prependIcon: 'mdi-pen',
    },
  },
])

const userItems = computed(() => [
  {
    title: t('navigation.home'),
    value: 'user',
    props: {
      prependIcon: 'mdi-home',
    },
  },
  {
    title: t('navigation.profile'),
    value: 'profile',
    props: {
      prependIcon: 'mdi-account-circle',
    },
  },
  {
    title: t('navigation.trainings'),
    value: 'trainings',
    props: {
      prependIcon: 'mdi-dumbbell',
    },
  },
  {
    title: t('navigation.trainingHistory'),
    value: 'training-history',
    props: {
      prependIcon: 'mdi-history',
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
  router.push('/')
}

const drawer = ref(false)
</script>

<template>
  <v-app-bar>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    <v-app-bar-title>
      <v-btn to="/" variant="text" prepend-icon="mdi-dumbbell" size="large">
        GymApp
      </v-btn>
    </v-app-bar-title>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary>
    <v-list :items="isAuthenticated ? userItems : guestItems" >
      <v-list-item
        v-for="item in (isAuthenticated ? userItems : guestItems)"
        :key="item.value"
        :to="`/${item.value}`"
        :prepend-icon="item.props.prependIcon"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
      <v-list-item v-if="isAuthenticated" @click="handleLogout" prepend-icon="mdi-logout">
        <v-list-item-title>{{ t('navigation.logout') }}</v-list-item-title></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
