/* eslint-disable node/prefer-global/process */
// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  vite: {
    optimizeDeps: {
      include: ['vuetify', 'firebase/auth', 'firebase/firestore'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vuetify'],
            firebase: ['firebase/auth', 'firebase/firestore'],
          },
        },
      },
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  devtools: { enabled: false },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error - Vuetify plugin type definitions are incompatible with Vite's plugin array
        config.plugins.push(vuetify({
          autoImport: true,
        }))
      })
    },
  ],
  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'pl',
    vueI18n: './i18n.config.ts',
    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
    },
  },
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: false,
    viewTransition: false,
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  ssr: process.env.NODE_ENV !== 'development',

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    storage: {
      data: { driver: 'fs', base: './data' },
    },
    experimental: {
      wasm: false,
    },
    devProxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  typescript: {
    typeCheck: false,
  },
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },

  css: [
  ],
  router: {
    options: {
      hashMode: false,
    },
  },
})
