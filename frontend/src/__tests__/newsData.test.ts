import { describe, it, expect } from 'vitest'
import { initialNewsData } from '../content/newsData'

describe('News Data (frontend/src/content/newsData.ts)', () => {
  it('contains at least 3 initial articles', () => {
    expect(initialNewsData.length).toBeGreaterThanOrEqual(3)
  })

  it('ensures each article has an id, title, valid category, and non-empty content', () => {
    const validCategories = ['Research', 'Industry', 'Academics', 'Awards']
    const ids = new Set<string>()

    for (const article of initialNewsData) {
      expect(article.id).toBeDefined()
      expect(typeof article.id).toBe('string')
      expect(ids.has(article.id)).toBe(false)
      ids.add(article.id)

      expect(article.title.trim().length).toBeGreaterThan(5)
      expect(validCategories).toContain(article.category)
      expect(article.summary.trim().length).toBeGreaterThan(10)
      expect(article.content.trim().length).toBeGreaterThan(50)
      expect(article.author).toBe('Quadri Ayomikun Amoo')
      expect(Array.isArray(article.tags)).toBe(true)
      expect(article.tags.length).toBeGreaterThan(0)
      expect(new Date(article.date).getTime()).not.toBeNaN()
    }
  })

  it('formats ISO dates into human-readable strings via formatNewsDate', async () => {
    const { formatNewsDate } = await import('../content/newsData')
    expect(formatNewsDate('2026-08-15T10:00:00.000Z')).toBe('Aug 2026')
    expect(formatNewsDate('2025-09-01T00:00:00.000Z')).toBe('Sep 2025')
  })
})
