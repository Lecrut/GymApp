export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${day}.${month}.${year}`
}

export function formatDateForInput(date: Date | string | null): string {
  if (!date)
    return ''
  const d = new Date(date)
  if (Number.isNaN(d.getTime()))
    return ''

  return d.toISOString().split('T')[0]
}

export function calculateAge(birthDate: Date | string): number {
  if (!birthDate)
    return 0

  const birth = new Date(birthDate)
  if (Number.isNaN(birth.getTime()))
    return 0

  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()

  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}
