import { describe, it, expect } from 'vitest'
import { cx, typeset, typeSet, formatDateRange, truncate } from '../lib/utils'

describe('Utility helpers (frontend/src/lib/utils.ts)', () => {
  describe('cx (classnames helper)', () => {
    it('joins truthy class names with a space', () => {
      expect(cx('btn', 'btn-primary', 'active')).toBe('btn btn-primary active')
    })

    it('filters out falsy values (false, null, undefined, empty string)', () => {
      expect(cx('btn', false, null, undefined, '', 'visible')).toBe('btn visible')
    })
  })

  describe('typeset and typeSet (typographic polish)', () => {
    it('replaces triple hyphens with em dash', () => {
      expect(typeset('word---another')).toBe('word\u2014another')
    })

    it('replaces double hyphens with en dash', () => {
      expect(typeset('2021--2024')).toBe('2021\u20132024')
    })

    it('replaces isolated hyphens with en dash', () => {
      expect(typeset('Software Engineer - AI Researcher')).toBe('Software Engineer \u2013 AI Researcher')
    })

    it('typeSet alias produces identical output', () => {
      expect(typeSet('Testing -- alias')).toBe(typeset('Testing -- alias'))
    })
  })

  describe('formatDateRange', () => {
    it('formats closed date ranges with an en-dash', () => {
      expect(formatDateRange('Sept 2021', 'July 2024')).toBe('Sept 2021\u2013July 2024')
    })

    it('formats ongoing date ranges with "present"', () => {
      expect(formatDateRange('Sept 2025', null)).toBe('Sept 2025\u2013present')
    })
  })

  describe('truncate', () => {
    it('returns original string if within limit', () => {
      expect(truncate('Hello world', 20)).toBe('Hello world')
    })

    it('truncates at word boundary with ellipsis if exceeding limit', () => {
      const text = 'Full-Stack Software Engineer and Machine Learning Researcher'
      const truncated = truncate(text, 25)
      expect(truncated.endsWith('\u2026')).toBe(true)
      expect(truncated.length).toBeLessThanOrEqual(26)
    })
  })
})
