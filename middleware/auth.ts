export default defineNuxtRouteMiddleware(async () => {
  const { $firebaseAuth } = useNuxtApp()
  const auth = $firebaseAuth

  await auth.authStateReady()
  if (!auth.currentUser) {
    return navigateTo('/auth/login')
  }

  return true
})
