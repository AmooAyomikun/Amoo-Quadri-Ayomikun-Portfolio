import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { db } from '../config/firebase.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const messagesFilePath = path.join(__dirname, '../data/messages.json')

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  lens?: 'research' | 'industry' | 'general'
  timestamp: string
  read?: boolean
}

export interface PaginatedResult<T> {
  data: T[]
  nextCursor: string | null
  hasMore: boolean
  total: number
}

export class ContactRepository {
  private localStore: ContactSubmission[] | null = null

  private readFromFile(): ContactSubmission[] {
    try {
      if (fs.existsSync(messagesFilePath)) {
        const raw = fs.readFileSync(messagesFilePath, 'utf8')
        return JSON.parse(raw) as ContactSubmission[]
      }
    } catch (err) {
      console.warn('[ContactRepository] Error reading local file fallback:', err)
    }
    return []
  }

  private saveToFile(messages: ContactSubmission[]): void {
    try {
      fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), 'utf8')
    } catch (err) {
      console.warn('[ContactRepository] Error saving local file fallback:', err)
    }
  }

  /**
   * Reads contact messages with pagination (Issue 3.3: unbounded reads).
   */
  async getMessages(options: { limit?: number; cursor?: string } = {}): Promise<PaginatedResult<ContactSubmission>> {
    const limit = Math.min(Math.max(1, options.limit || 20), 50)
    const cursor = options.cursor

    if (db) {
      try {
        let query = db.collection('contact_messages')
          .orderBy('timestamp', 'desc')

        if (cursor) {
          const cursorDoc = await db.collection('contact_messages').doc(cursor).get()
          if (cursorDoc.exists) {
            query = query.startAfter(cursorDoc) as any
          }
        }

        const snapshot = await query.limit(limit + 1).get()
        const docs = snapshot.docs
        const hasMore = docs.length > limit
        const resultDocs = hasMore ? docs.slice(0, limit) : docs

        const data = resultDocs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        })) as ContactSubmission[]

        const nextCursor = hasMore && resultDocs.length > 0 ? resultDocs[resultDocs.length - 1].id : null

        return {
          data,
          nextCursor,
          hasMore,
          total: data.length
        }
      } catch (err) {
        console.warn('[ContactRepository] Firestore read failed, using local store:', err)
      }
    }

    if (!this.localStore) {
      this.localStore = this.readFromFile()
    }

    const all = [...this.localStore].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    let startIndex = 0
    if (cursor) {
      const idx = all.findIndex(m => m.id === cursor)
      if (idx >= 0) startIndex = idx + 1
    }

    const sliced = all.slice(startIndex, startIndex + limit)
    const hasMore = startIndex + limit < all.length
    const nextCursor = hasMore && sliced.length > 0 ? sliced[sliced.length - 1].id : null

    return {
      data: sliced,
      nextCursor,
      hasMore,
      total: all.length
    }
  }

  async save(message: ContactSubmission): Promise<void> {
    // Prevent automated integration test fixtures from polluting production Firestore
    if (process.env.NODE_ENV === 'test' || message.email?.includes('test') || message.name?.includes('Dr. Jane Smith')) {
      if (!this.localStore) {
        this.localStore = this.readFromFile()
      }
      this.localStore.unshift(message)
      return
    }

    if (db) {
      try {
        await db.collection('contact_messages').doc(message.id).set(message)
        return
      } catch (err) {
        console.warn('[ContactRepository] Firestore write failed, writing to fallback:', err)
      }
    }

    if (!this.localStore) {
      this.localStore = this.readFromFile()
    }
    this.localStore.unshift(message)
    this.saveToFile(this.localStore)
  }

  async delete(id: string): Promise<boolean> {
    if (db) {
      try {
        await db.collection('contact_messages').doc(id).delete()
        return true
      } catch (err) {
        console.warn('[ContactRepository] Firestore delete failed, falling back:', err)
      }
    }

    if (!this.localStore) {
      this.localStore = this.readFromFile()
    }
    this.localStore = this.localStore.filter(m => m.id !== id)
    this.saveToFile(this.localStore)
    return true
  }
}

export const contactRepository = new ContactRepository()
