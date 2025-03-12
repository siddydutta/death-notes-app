/**
 * Formats a date string to a localized date representation
 * @param dateString - ISO date string to format or null
 * @returns Formatted date string or empty string if input is null
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

/**
 * Converts a Date object to YYYY-MM-DD string format
 * @param date - Date object to convert or null
 * @returns Date in YYYY-MM-DD format or empty string if input is null
 */
export const toDateString = (date: Date | null): string => {
  if (!date) return ''
  return new Date(date).toISOString().split('T')[0]
}

/**
 * Formats a date string to a localized date and time representation
 * @param date - ISO date string to format or null/undefined
 * @returns Formatted date and time string or empty string if input is null/undefined
 */
export const toDateTimeString = (date?: string | null): string => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}
