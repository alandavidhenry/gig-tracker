export const formatDateForInput = (date: Date | string | null): string => {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  return d.toISOString().split('T')[0]
}

export const formatDateForDisplay = (date: Date | string | null): string => {
  if (!date) return 'N/A'
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString()
}
