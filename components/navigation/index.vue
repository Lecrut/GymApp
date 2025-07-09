<script setup>
import { ref } from "vue";

const guestItems = [
  {
    title: "Home",
    value: "home",
    props: {
      prependIcon: "mdi-home",
    },
  },
  {
    title: "Login",
    value: "login",
    props: {
      prependIcon: "mdi-login",
    },
  },
  {
    title: "Register",
    value: "register",
    props: {
      prependIcon: "mdi-pen",
    },
  },
];

const userItems = [
  {
    title: "Home",
    value: "home",
  },
  {
    title: "Profile",
    value: "profile",
  },
  {
    title: "Training history",
    value: "training-history",
  },
  {
    title: "Trainings",
    value: "trainings",
  },
];

const drawer = ref(false);
const isAuthenticated = ref(false);
</script>

<template>
  <v-app-bar>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-app-bar-title>GymApp</v-app-bar-title>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary>
    <v-list :items="isAuthenticated ? userItems : guestItems" />
  </v-navigation-drawer>
</template>
