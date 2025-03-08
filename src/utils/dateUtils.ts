export const formatDate = (dateString: string | null): string => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

export const toDateString = (date: Date | null): string => {
  if (!date) return ''
  return new Date(date).toISOString().split('T')[0]
}
