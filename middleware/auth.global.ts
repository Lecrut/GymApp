export default defineNuxtRouteMiddleware(async (to) => {
  const { $firebaseAuth } = useNuxtApp()
  const auth = $firebaseAuth

  await auth.authStateReady()
  if (auth.currentUser && to.path.startsWith('/auth')) {
    return navigateTo('/user')
  }

  return true
})
