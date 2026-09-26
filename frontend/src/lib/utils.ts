/**
 * Join CSS class names, filtering out falsy values.
 * Lightweight alternative to clsx.
 */
export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Smart typographic replacements for dashes and quotes.
 */
export function typeSet(text: string): string {
  if (!text) return ''
  return text
    .replace(/ -- /g, ' — ')
    .replace(/ - /g, ' – ')
}

/**
 * Formats date range strings using standard en-dashes.
 */
export function formatDateRange(start: string, end: string): string {
  return `${start} – ${end}`
}
