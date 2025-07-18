import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware(async () => {
    const { $firebaseAuth } = useNuxtApp();
    const auth = $firebaseAuth
    const authStore = useAuthStore()

    const loggedUser = computed(() => authStore.userData)
    await auth.authStateReady()
    if (!auth.currentUser) {
        return navigateTo('/auth/login')
    }
    console.log('Auth: ' + auth.currentUser + ', loggedUser: ' + loggedUser.value)
})