<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const guestItems = computed(() => [
  {
    title: t('navigation.home'),
    value: 'home',
    props: {
      prependIcon: 'mdi-home',
    },
  },
  {
    title: t('navigation.login'),
    value: 'login',
    props: {
      prependIcon: 'mdi-login',
    },
  },
  {
    title: t('navigation.register'),
    value: 'register',
    props: {
      prependIcon: 'mdi-pen',
    },
  },
])

const userItems = computed(() => [
  {
    title: t('navigation.home'),
    value: 'user/home',
    props: {
      prependIcon: 'mdi-home',
    },
  },
  {
    title: t('navigation.profile'),
    value: 'user/profile',
    props: {
      prependIcon: 'mdi-account-circle',
    },
  },
  {
    title: t('navigation.trainings'),
    value: 'user/gym-training',
    props: {
      prependIcon: 'mdi-dumbbell',
    },
  },
  {
    title: t('navigation.trainingHistory'),
    value: 'user/training-history',
    props: {
      prependIcon: 'mdi-history',
    },
  },
  {
    title: t('navigation.logout'),
    value: 'logout',
    props: {
      prependIcon: 'mdi-logout',
    },
  },
])

const drawer = ref(false)
const isAuthenticated = ref(true)

function handleItemClick(value: string) {
  if (value === 'logout') {
    isAuthenticated.value = false
    router.push('/')
  }
  else {
    router.push(`/${value}`)
  }
  drawer.value = false
}
</script>

<template>
  <v-app-bar>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

    <!-- eslint-disable-next-line vue/no-bare-strings-in-template -->
    <v-app-bar-title>GymApp</v-app-bar-title>
  </v-app-bar>

  <v-navigation-drawer
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
</template>
