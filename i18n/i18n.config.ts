import en from '~/locales/en.json'
import pl from '~/locales/pl.json'

export default defineI18nConfig(() => ({
  useCookie: true,
  legacy: false,
  locale: 'pl',
  locales: ['pl', 'en'],
  defaultLocale: 'pl',
  fallbackLocale: 'en',
  messages: {
    pl,
    en,
  },
}))
