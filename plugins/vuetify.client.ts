import { nextTick } from 'vue'

export default defineNuxtPlugin({
  name: 'vuetify-hydration-fix',
  setup() {
    const nuxtApp = useNuxtApp()
    if (nuxtApp.isClient) {
      nextTick(() => {
        window.dispatchEvent(new Event('resize'))
      })
    }
  },
})
