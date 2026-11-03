import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { db } from '../config/firebase.js'
import { initialNewsData, NewsItem } from '../data/newsData.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const newsFilePath = path.join(__dirname, '../data/news.json')

export class NewsRepository {
  private localStore: NewsItem[] | null = null

  private readFromFile(): NewsItem[] {
    try {
      if (fs.existsSync(newsFilePath)) {
        const raw = fs.readFileSync(newsFilePath, 'utf8')
        const parsed = JSON.parse(raw) as NewsItem[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch (err) {
      console.warn('[NewsRepository] Error reading local file fallback:', err)
    }
    return [...initialNewsData]
  }

  private saveToFile(articles: NewsItem[]): void {
    if (process.env.NODE_ENV === 'test') {
      return // Do not pollute news.json file during CI and automated test runs
    }
    try {
      fs.writeFileSync(newsFilePath, JSON.stringify(articles, null, 2), 'utf8')
    } catch (err) {
      console.warn('[NewsRepository] Error saving local file fallback:', err)
    }
  }

  /**
   * Fetches news articles. Firestore is the single source of truth when configured (Issue 3.1).
   * Sorted chronologically using ISO 8601 timestamps (Issue 3.2).
   */
  async getAll(): Promise<NewsItem[]> {
    if (db) {
      try {
        const snapshot = await db.collection('news')
          .orderBy('date', 'desc')
          .get()

        if (!snapshot.empty) {
          return snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
          })) as NewsItem[]
        }
      } catch (err) {
        console.warn('[NewsRepository] Firestore read failed, falling back to local store:', err)
      }
    }

    if (!this.localStore) {
      this.localStore = this.readFromFile()
    }
    // Chronological descending sort on ISO strings
    return [...this.localStore].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  async save(article: NewsItem): Promise<void> {
    if (db) {
      try {
        await db.collection('news').doc(article.id).set(article)
        return
      } catch (err) {
        console.warn('[NewsRepository] Firestore write failed, writing to fallback:', err)
      }
    }

    if (!this.localStore) {
      this.localStore = this.readFromFile()
    }
    this.localStore.unshift(article)
    this.saveToFile(this.localStore)
  }

  async delete(id: string): Promise<boolean> {
    if (db) {
      try {
        await db.collection('news').doc(id).delete()
        return true
      } catch (err) {
        console.warn('[NewsRepository] Firestore delete failed, falling back:', err)
      }
    }

    if (!this.localStore) {
      this.localStore = this.readFromFile()
    }
    this.localStore = this.localStore.filter(n => n.id !== id)
    this.saveToFile(this.localStore)
    return true
  }
}

export const newsRepository = new NewsRepository()
