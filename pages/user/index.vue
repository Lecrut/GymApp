<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore()
const userData = ref<typeof authStore.userData | null>(null)
const loading = ref(true)

async function handleLogout() {
  await authStore.logout()
  if (authStore.error) {
    console.error("Logout error:", authStore.error)
  } else {
    router.push('/')
  }
}

onMounted(async () => {
  loading.value = true
  userData.value = authStore.userData
  loading.value = false
})
</script>

<template>
  <span>
    <template v-if="!loading">
      <v-card-text>{{ userData?.email }}</v-card-text>
      <v-card-text>{{ userData?.nick }}</v-card-text>
      <v-card-text>{{ userData?.name }}</v-card-text>
      <v-card-text>{{ userData?.surname }}</v-card-text>
    </template>
    <template v-else>
      Loading...
    </template>
    <v-btn @click="handleLogout">
      {{ $t('auth.logout') }} </v-btn>
  </span>

</template>
