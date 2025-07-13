<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
    value: 'home',
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
</script>

<template>
  <v-app-bar>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    <v-app-bar-title>GymApp</v-app-bar-title>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary>
    <v-list :items="isAuthenticated ? userItems : guestItems" />
  </v-navigation-drawer>
</template>
