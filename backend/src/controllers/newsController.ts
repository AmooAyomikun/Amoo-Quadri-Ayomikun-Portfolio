import { Request, Response } from 'express'
import { initialNewsData, NewsItem } from '../data/newsData.js'

// In-memory store initialized with initial data
let newsStore: NewsItem[] = [...initialNewsData]

export const getNews = (req: Request, res: Response): void => {
  const { category } = req.query

  if (category && typeof category === 'string') {
    const filtered = newsStore.filter(n => n.category.toLowerCase() === category.toLowerCase())
    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered
    })
    return
  }

  res.status(200).json({
    success: true,
    count: newsStore.length,
    data: newsStore
  })
}

export const publishNews = (req: Request, res: Response): void => {
  const { title, category, summary, content, tags, externalUrl, adminPassphrase } = req.body as Partial<NewsItem> & { adminPassphrase?: string }
  const authHeader = req.headers['x-admin-key']

  if (authHeader !== 'quadri2026' && adminPassphrase !== 'quadri2026' && process.env.NODE_ENV === 'production') {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Only Quadri Amoo (Admin) is authorized to publish announcements.'
    })
    return
  }

  if (!title || !summary || !content) {
    res.status(400).json({
      success: false,
      error: 'Missing required fields: title, summary, and content are required.'
    })
    return
  }

  const newArticle: NewsItem = {
    id: `news-${Date.now()}`,
    title,
    date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    category: (category as NewsItem['category']) || 'Research',
    summary,
    content,
    author: 'Quadri Ayomikun Amoo',
    readTime: `${Math.max(1, Math.ceil(content.split(' ').length / 150))} min read`,
    tags: Array.isArray(tags) ? tags : ['News Update'],
    externalUrl,
    isPinned: false
  }

  newsStore.unshift(newArticle)

  console.log('[News API Published]', newArticle)

  res.status(201).json({
    success: true,
    message: 'News announcement published successfully!',
    data: newArticle
  })
}
