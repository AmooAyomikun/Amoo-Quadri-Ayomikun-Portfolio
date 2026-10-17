/**
 * Join CSS class names, filtering out falsy values.
 * Lightweight alternative to clsx.
 */
export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Typographic polish: replace straight quotes, dashes, etc.
 * Handles em dash, en dash, and smart quotes.
 */
export function typeset(str: string): string {
  if (!str) return ''
  return str
    .replace(/---/g, '\u2014') // em dash
    .replace(/ -- /g, ' \u2014 ') // em dash with spaces
    .replace(/--/g, '\u2013') // en dash
    .replace(/ - /g, ' \u2013 ') // en dash with spaces
    .replace(/(\s)"(\w)/g, '$1\u201C$2') // opening "
    .replace(/(\w)"(\s|,|\.|$)/g, '$1\u201D$2') // closing "
    .replace(/(\s)'(\w)/g, '$1\u2018$2') // opening '
    .replace(/(\w)'(\s|s|$)/g, '$1\u2019$2') // closing '
}

/**
 * Backward compatibility alias for typeset
 */
export const typeSet = typeset

/**
 * Formats date range strings using standard en-dashes.
 * e.g. formatDateRange('Sept 2021', 'July 2024') → 'Sept 2021–July 2024'
 * e.g. formatDateRange('Sept 2024', null) → 'Sept 2024–present'
 */
export function formatDateRange(start: string, end: string | null): string {
  if (!end) return `${start}\u2013present`
  return `${start}\u2013${end}`
}

/**
 * Truncate text to a character limit, preserving word boundaries.
 */
export function truncate(str: string, limit: number): string {
  if (!str || str.length <= limit) return str || ''
  const lastSpace = str.lastIndexOf(' ', limit)
  return (lastSpace > 0 ? str.slice(0, lastSpace) : str.slice(0, limit)) + '\u2026'
}
