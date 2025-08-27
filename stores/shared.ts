import { useSnackbarStore } from '~/stores/snackbar'

export interface IError {
  code: string
}

export const useSharedStore = defineStore('shared', () => {
  const loading = ref(false)
  const error: Ref<IError | null> = ref(null)

  const snackbarStore = useSnackbarStore()

  const init = () => {
    error.value = null
    loading.value = true
  }

  const success = () => {
    loading.value = false
  }

  const failure = (errorArg: IError) => {
    error.value = errorArg
    loading.value = false
  }

  const successSnackbar = () => {
    snackbarStore.showSnackbarSaveDefault()
    loading.value = false
  }

  const failureSnackbar = (errorArg: IError) => {
    snackbarStore.showSnackbarErrorDefault(errorArg)
    error.value = errorArg
    loading.value = false
  }

  const successRemovalSnackbar = () => {
    snackbarStore.showSnackbarDeleteDefault()
    loading.value = false
  }

  const successCopyingSnackbar = () => {
    snackbarStore.showSnackbarCopy()
    loading.value = false
  }

  const successSnackbarWithMessage = (message: string) => {
    snackbarStore.showSnackbarSaveWithMessage(message)
    loading.value = false
  }

  const failureSnackbarWithMessage = (errorArg: IError, message: string) => {
    snackbarStore.showSnackbarErrorWithMessage(message)
    error.value = errorArg
    loading.value = false
  }

  const copyCodeToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    successCopyingSnackbar()
  }

  return {
    loading,
    error,
    init,
    success,
    failure,
    successSnackbar,
    failureSnackbar,
    successRemovalSnackbar,
    successCopyingSnackbar,
    successSnackbarWithMessage,
    failureSnackbarWithMessage,
    copyCodeToClipboard,
  }
})

if ((import.meta as any).hot) {
  (import.meta as any).hot.accept(acceptHMRUpdate(
    useSharedStore,
    (import.meta as any).hot,
  ))
}
