import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { initialNewsData, NewsItem } from '../data/newsData.js'
import { db } from '../config/firebase.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const newsFilePath = path.join(__dirname, '../data/news.json')

// Read news from disk or initialize with initialNewsData
const readNewsFromFile = (): NewsItem[] => {
  try {
    if (fs.existsSync(newsFilePath)) {
      const raw = fs.readFileSync(newsFilePath, 'utf8')
      const parsed = JSON.parse(raw) as NewsItem[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.error('Error reading news.json:', err)
  }
  // Initialize file with default data
  saveNewsToFile(initialNewsData)
  return [...initialNewsData]
}

const saveNewsToFile = (news: NewsItem[]): void => {
  try {
    fs.writeFileSync(newsFilePath, JSON.stringify(news, null, 2), 'utf8')
  } catch (err) {
    console.error('Error saving news.json:', err)
  }
}

let newsStore: NewsItem[] = readNewsFromFile()

export const getNews = async (req: Request, res: Response): Promise<void> => {
  const { category } = req.query

  // Refresh from file to capture any updates
  newsStore = readNewsFromFile()

  if (db) {
    try {
      const snapshot = await db.collection('news').orderBy('date', 'desc').get()
      if (!snapshot.empty) {
        const firestoreNews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as NewsItem)
        if (firestoreNews.length > 0) {
          newsStore = firestoreNews
        }
      }
    } catch (err) {
      // Fallback silently to newsStore
    }
  }

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

export const publishNews = async (req: Request, res: Response): Promise<void> => {
  const { title, category, summary, content, tags, externalUrl } = req.body as Partial<NewsItem>

  if (!title || !summary || !content) {
    res.status(400).json({
      success: false,
      error: 'Missing required fields: title, summary, and content are required.'
    })
    return
  }

  const newArticle: NewsItem = {
    id: `news-${Date.now()}`,
    title: title.trim(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    category: (category as NewsItem['category']) || 'Research',
    summary: summary.trim(),
    content: content.trim(),
    author: 'Quadri Ayomikun Amoo',
    readTime: `${Math.max(1, Math.ceil(content.split(' ').length / 150))} min read`,
    tags: Array.isArray(tags) ? tags : ['News Update'],
    externalUrl,
    isPinned: false
  }

  newsStore.unshift(newArticle)
  saveNewsToFile(newsStore)

  if (db) {
    try {
      await db.collection('news').doc(newArticle.id).set(newArticle)
    } catch (err) {
      console.error('Firestore save news error:', err)
    }
  }

  console.log('[News API Published]', newArticle)

  res.status(201).json({
    success: true,
    message: 'News announcement published successfully!',
    data: newArticle
  })
}

export const deleteNewsArticle = async (req: Request, res: Response): Promise<void> => {
  const rawId = req.params.id
  const id = Array.isArray(rawId) ? rawId[0] : rawId
  if (!id) {
    res.status(400).json({ success: false, error: 'Article ID is required' })
    return
  }

  newsStore = newsStore.filter(n => n.id !== id)
  saveNewsToFile(newsStore)

  if (db) {
    try {
      await db.collection('news').doc(id).delete()
    } catch (err) {
      console.error('Firestore delete news error:', err)
    }
  }

  res.status(200).json({
    success: true,
    message: 'Article deleted successfully.'
  })
}
