<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const activeItem: Ref<any> = ref(null)

const { t } = useI18n()

const guestItems = computed(() => [
  {
    title: t('navigation.home'),
    value: '/',
    props: {
      prependIcon: 'mdi-home',
    },
  },
  {
    title: t('navigation.login'),
    value: '/auth/login',
    props: {
      prependIcon: 'mdi-login',
    },
  },
  {
    title: t('navigation.register'),
    value: '/auth/register',
    props: {
      prependIcon: 'mdi-pen',
    },
  },
])

const userItems = computed(() => [
  {
    title: t('navigation.home'),
    value: '/user/',
    props: {
      prependIcon: 'mdi-home',
    },
  },
  {
    title: t('navigation.profile'),
    value: '/user/profile',
    props: {
      prependIcon: 'mdi-account-circle',
    },
  },
  {
    title: t('navigation.trainings'),
    value: '/user/gym-training',
    props: {
      prependIcon: 'mdi-dumbbell',
    },
  },
  {
    title: t('navigation.trainingHistory'),
    value: '/user/training-history',
    props: {
      prependIcon: 'mdi-history',
    },
  },
  {
    title: t('navigation.logout'),
    value: '/logout',
    props: {
      prependIcon: 'mdi-logout',
    },
  },
])

async function handleLogout() {
  await authStore.logout()
  router.push('/')
}

const drawer = ref(false)
function handleItemClick(value: string) {
  if (value === '/logout') {
    handleLogout()
  }
  else {
    router.push(value)
  }
  drawer.value = false
}
</script>

<template>
  <v-app-bar>
    <v-app-bar-nav-icon
      v-if="$vuetify.display.mdAndUp"
      @click.stop="drawer = !drawer"
    />

    <v-app-bar-title>{{ $t('app.title') }}</v-app-bar-title>
  </v-app-bar>

  <v-navigation-drawer
    v-if="$vuetify.display.mdAndUp"
    v-model="drawer"
    temporary
  >
    <v-list>
      <v-list-item
        v-for="item in (isAuthenticated
          ? userItems
          : guestItems)"
        :key="item.value"
        :prepend-icon="item.props.prependIcon"
        :title="item.title"
        @click="handleItemClick(item.value)"
      />
    </v-list>
  </v-navigation-drawer>

  <v-bottom-navigation
    v-if="$vuetify.display.smAndDown"
    v-model="activeItem"
    color="primary"
    grow
  >
    <v-btn
      v-for="item in (isAuthenticated
        ? userItems
        : guestItems)"
      :key="item.value"
      :value="item.value"
      @click="handleItemClick(item.value)"
    >
      <v-icon :icon="item.props.prependIcon" />
      {{ item.title }}
    </v-btn>
  </v-bottom-navigation>
</template>
