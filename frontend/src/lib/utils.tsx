/**
 * Small utility helpers — typography, a11y, etc.
 */

/**
 * Join class names, filtering falsy values.
 * Tiny alternative to clsx for this project.
 */
export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Typographic polish: replace straight quotes, dashes, etc.
 * Used when rendering text from data files.
 */
export function typeset(str: string): string {
  return str
    .replace(/---/g, '\u2014') // em dash
    .replace(/--/g, '\u2013') // en dash
    .replace(/(\s)"(\w)/g, '\u201C') // opening "
    .replace(/(\w)"(\s|,|\.)/g, '\u201D') // closing "
    .replace(/(\s)'(\w)/g, '\u2018') // opening '
    .replace(/(\w)'(\s|s)/g, '\u2019') // closing '
}

/**
 * Format a date range with an en dash (PRD §7.4).
 * e.g. formatDateRange('Sept 2021', 'July 2024') → 'Sept 2021–July 2024'
 */
export function formatDateRange(start: string, end: string | null): string {
  if (!end) return `${start}–present`
  return `${start}\u2013${end}`
}

/**
 * Truncate text to a character limit, preserving word boundaries.
 */
export function truncate(str: string, limit: number): string {
  if (str.length <= limit) return str
  return str.slice(0, str.lastIndexOf(' ', limit)) + '\u2026'
}
