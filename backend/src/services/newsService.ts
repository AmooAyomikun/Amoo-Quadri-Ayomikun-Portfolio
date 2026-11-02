import { newsRepository } from '../repositories/newsRepository.js'
import { NewsItem } from '../data/newsData.js'

export class NewsService {
  async getAllNews(): Promise<NewsItem[]> {
    return newsRepository.getAll()
  }

  async publishArticle(data: {
    title: string
    category?: NewsItem['category']
    summary: string
    content: string
    tags?: string[]
    externalUrl?: string
  }): Promise<NewsItem> {
    const safeTags = Array.isArray(data.tags)
      ? data.tags.filter(t => typeof t === 'string').map(t => t.trim().slice(0, 50)).slice(0, 10)
      : ['News Update']

    const newArticle: NewsItem = {
      id: `news-${Date.now()}`,
      title: data.title.trim().slice(0, 200),
      // Store ISO 8601 string for accurate chronological sorting in Firestore (Issue 3.2)
      date: new Date().toISOString(),
      category: data.category || 'Research',
      summary: data.summary.trim().slice(0, 500),
      content: data.content.trim().slice(0, 20000),
      author: 'Quadri Ayomikun Amoo',
      readTime: `${Math.max(1, Math.ceil(data.content.split(/\s+/).length / 150))} min read`,
      tags: safeTags.length > 0 ? safeTags : ['News Update'],
      externalUrl: data.externalUrl,
      isPinned: false
    }

    await newsRepository.save(newArticle)
    return newArticle
  }

  async deleteArticle(id: string): Promise<boolean> {
    return newsRepository.delete(id)
  }
}

export const newsService = new NewsService()
