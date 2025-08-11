export default function formValidation() {
  const form: Ref<null | {
    resetValidation: () => void
    reset: () => void
    validate: () => Promise<{ valid: boolean }>
  }> = ref(null)

  const valid = ref(false)

  const isValid = async () => {
    try {
      const tmp = (await form.value?.validate())?.valid || false
      valid.value = tmp

      return tmp
    }
    catch (e: any) {
      valid.value = false
      console.error('Validation error:', e)

      return false
    }
  }

  return {
    form,
    valid,
    isValid,
  }
}
