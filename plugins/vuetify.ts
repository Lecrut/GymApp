// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components: {},
    theme: {
      defaultTheme: 'dark',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#2196f3',
            secondary: '#0054db',
            error: '#FF0110',
          },
        },
        dark: {
          dark: true,
          colors: {
            primary: '#0054db',
            secondary: '#2196f3',
            error: '#FF0110',
          },
        },
      },
    },
    defaults: {
      VBtn: {
        rounded: 'm',
        color: 'primary',
        variant: 'elevated',
      },
      VTextField: {
        variant: 'underlined',
      },
      VCombobox: {
        variant: 'underlined',
      },
      VSelect: {
        variant: 'underlined',
      },
    },
  })
  app.vueApp.use(vuetify)
})
