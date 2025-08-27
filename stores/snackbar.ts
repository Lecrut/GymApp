import type { TranslateResult } from 'vue-i18n'

const TIMEOUT = 6000
const TIMEOUT_SHORT = 1500

export const useSnackbarStore = defineStore('snackbar', () => {
  const visible = ref(false)
  const color = ref('primary')
  const text = ref('works')
  const timeout = ref(TIMEOUT)

  const resetState = () => {
    visible.value = false
    color.value = 'primary'
    text.value = 'works'
    timeout.value = TIMEOUT
  }
  const showSnackbarSaveDefault = () => {
    color.value = 'primary'
    text.value = 'universal.saved'
    timeout.value = TIMEOUT
    visible.value = true
    setTimeout(() => {
      timeout.value = TIMEOUT
      visible.value = false
    }, TIMEOUT)
  }
  const showSnackbarCustom = (colorArg: string | null, textArg: string | TranslateResult, customTimeout = TIMEOUT) => {
    color.value = colorArg || 'primary'
    text.value = textArg || 'universal.saved'
    timeout.value = customTimeout
    visible.value = true
    setTimeout(() => {
      timeout.value = customTimeout
      visible.value = false
    }, customTimeout)
  }
  const showSnackbarErrorDefault = (errorArg: { code: string } | any) => {
    color.value = 'error'
    text.value = 'universal.error'
    timeout.value = TIMEOUT
    visible.value = true
    console.error(errorArg)
    setTimeout(() => {
      timeout.value = TIMEOUT
      visible.value = false
    }, TIMEOUT)
  }
  const showSnackbarInfinity = (colorArg: string, textArg: string | TranslateResult) => {
    color.value = colorArg || 'primary'
    text.value = textArg || 'universal.saved'
    timeout.value = -1
    visible.value = true
  }
  const showSnackbarDeleteDefault = () => {
    color.value = 'secondary'
    text.value = 'universal.deleteCompletedInfo'
    timeout.value = TIMEOUT
    visible.value = true
    setTimeout(() => {
      timeout.value = TIMEOUT
      visible.value = false
    }, TIMEOUT)
  }
  const showSnackbarCopy = () => {
    color.value = 'secondary'
    text.value = 'universal.copyClipboard'
    timeout.value = TIMEOUT_SHORT
    visible.value = true
    setTimeout(() => {
      timeout.value = TIMEOUT_SHORT
      visible.value = false
    }, TIMEOUT_SHORT)
  }
  const showSnackbarSaveWithMessage = (message: string) => {
    color.value = 'secondary'
    text.value = message
    timeout.value = TIMEOUT_SHORT
    visible.value = true
    setTimeout(() => {
      timeout.value = TIMEOUT_SHORT
      visible.value = false
    }, TIMEOUT_SHORT)
  }
  const showSnackbarErrorWithMessage = (message: string) => {
    color.value = 'error'
    text.value = message
    timeout.value = TIMEOUT
    visible.value = true
    setTimeout(() => {
      timeout.value = TIMEOUT
      visible.value = false
    }, TIMEOUT)
  }
  const hideSnackbar = () => {
    timeout.value = TIMEOUT
    visible.value = false
  }

  return {
    visible,
    color,
    text,
    timeout,
    resetState,
    showSnackbarSaveDefault,
    showSnackbarCustom,
    showSnackbarErrorDefault,
    showSnackbarInfinity,
    showSnackbarDeleteDefault,
    showSnackbarCopy,
    showSnackbarSaveWithMessage,
    showSnackbarErrorWithMessage,
    hideSnackbar,
  }
})

if ((import.meta as any).hot) {
  (import.meta as any).hot.accept(acceptHMRUpdate(
    useSnackbarStore,
    (import.meta as any).hot,
  ))
}
