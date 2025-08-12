export const emailPattern
    = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i

// eslint-disable-next-line regexp/optimal-lookaround-quantifier
export const patternPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.{8,})/

export const registerPattern = /^[A-Z]$/i

// todo: haslo zmienic na 12 liter i koniec

export function requiredRule() {
  return (value: string | number | null, textError = 'Pole jest wymagane') => {
    return Boolean(value) || textError
  }
}

export function emailRule() {
  return (value: string, textError = 'Niepoprawny format email') => {
    return emailPattern.test(value) || textError
  }
}

export function passwordRule() {
  return (value: string, textError = 'Min 8 znaków i 1 wielka litera') => {
    return patternPassword.test(value) || textError
  }
}

export function lengthRuleShort() {
  return (value: string | string[], textError = 'Nazwa jest za krótka.') => {
    return Boolean(value?.length > 3) || textError
  }
}

export function lengthRule() {
  return (value: string | string[], textError = 'Nazwa jest za długa') => {
    return Boolean(value?.length <= 15) || textError
  }
}

export function surnameLengthRule() {
  return (value: string | string[], textError = 'Nazwisko za długie') => {
    return Boolean(value?.length <= 25) || textError
  }
}

export function leagueNameLengthRule() {
  return (value: string | string[], textError = 'Nazwa jest za długa') => {
    return Boolean(value?.length <= 25) || textError
  }
}

export function descriptionLengthRule() {
  return (value: string | string[], textError = 'Opis jest za długi') => {
    return Boolean(value?.length <= 100) || textError
  }
}

export function timestampPastRule() {
  return (value: string, textError = 'Data musi być z przeszłości') => {
    const [day, month, year] = value.split('-').map(Number)
    const inputDate = new Date(year, month - 1, day)

    return inputDate.getTime() < Date.now() || textError
  }
}
