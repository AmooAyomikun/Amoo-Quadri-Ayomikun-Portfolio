import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { db } from '../config/firebase.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const guestbookFilePath = path.join(__dirname, '../data/guestbook.json')

export interface GuestbookEntry {
  id: string
  name: string
  message: string
  signatureData: string
  timestamp: string
}

export interface PaginatedGuestbook {
  entries: GuestbookEntry[]
  nextCursor: string | null
  hasMore: boolean
  total: number
}

export class GuestbookRepository {
  private localStore: GuestbookEntry[] | null = null

  private readFromFile(): GuestbookEntry[] {
    try {
      if (fs.existsSync(guestbookFilePath)) {
        const raw = fs.readFileSync(guestbookFilePath, 'utf8')
        return JSON.parse(raw) as GuestbookEntry[]
      }
    } catch (err) {
      console.warn('[GuestbookRepository] Error reading local file fallback:', err)
    }
    return []
  }

  private saveToFile(entries: GuestbookEntry[]): void {
    try {
      fs.writeFileSync(guestbookFilePath, JSON.stringify(entries, null, 2), 'utf8')
    } catch (err) {
      console.warn('[GuestbookRepository] Error saving local file fallback:', err)
    }
  }

  private isMockOrTestEntry(entry: GuestbookEntry): boolean {
    const name = (entry.name || '').trim().toLowerCase()
    const msg = (entry.message || '').trim().toLowerCase()
    return name.includes('adeleke') || msg.includes('inspiring academic trajectory')
  }

  /**
   * Paginates signatures to prevent unbounded memory and 500KB payload issues (Issue 3.3).
   * Firestore is single source of truth when configured (Issue 3.1).
   */
  async getSignatures(options: { limit?: number; cursor?: string } = {}): Promise<PaginatedGuestbook> {
    const limit = Math.min(Math.max(1, options.limit || 20), 50)
    const cursor = options.cursor

    if (db) {
      try {
        let query = db.collection('guestbook')
          .orderBy('timestamp', 'desc')

        if (cursor) {
          const cursorDoc = await db.collection('guestbook').doc(cursor).get()
          if (cursorDoc.exists) {
            query = query.startAfter(cursorDoc) as any
          }
        }

        const snapshot = await query.limit(limit + 5).get()
        const docs = snapshot.docs
        const rawEntries = docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data()
        })) as GuestbookEntry[]

        const filtered = rawEntries.filter(e => !this.isMockOrTestEntry(e))
        const hasMore = filtered.length > limit
        const entries = hasMore ? filtered.slice(0, limit) : filtered
        const nextCursor = hasMore && entries.length > 0 ? entries[entries.length - 1].id : null

        return {
          entries,
          nextCursor,
          hasMore,
          total: entries.length
        }
      } catch (err) {
        console.warn('[GuestbookRepository] Firestore read failed, using local store:', err)
      }
    }

    if (!this.localStore) {
      this.localStore = this.readFromFile()
    }

    const all = [...this.localStore]
      .filter(e => !this.isMockOrTestEntry(e))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    let startIndex = 0
    if (cursor) {
      const idx = all.findIndex(e => e.id === cursor)
      if (idx >= 0) startIndex = idx + 1
    }

    const sliced = all.slice(startIndex, startIndex + limit)
    const hasMore = startIndex + limit < all.length
    const nextCursor = hasMore && sliced.length > 0 ? sliced[sliced.length - 1].id : null

    return {
      entries: sliced,
      nextCursor,
      hasMore,
      total: all.length
    }
  }

  async save(entry: GuestbookEntry): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      if (!this.localStore) {
        this.localStore = this.readFromFile()
      }
      this.localStore.unshift(entry)
      return
    }

    if (db) {
      try {
        await db.collection('guestbook').doc(entry.id).set(entry)
        return
      } catch (err) {
        console.warn('[GuestbookRepository] Firestore write failed, writing to fallback:', err)
      }
    }

    if (!this.localStore) {
      this.localStore = this.readFromFile()
    }
    this.localStore.unshift(entry)
    this.saveToFile(this.localStore)
  }

  async delete(id: string): Promise<boolean> {
    if (db) {
      try {
        await db.collection('guestbook').doc(id).delete()
        return true
      } catch (err) {
        console.warn('[GuestbookRepository] Firestore delete failed, falling back:', err)
      }
    }

    if (!this.localStore) {
      this.localStore = this.readFromFile()
    }
    this.localStore = this.localStore.filter(e => e.id !== id)
    this.saveToFile(this.localStore)
    return true
  }
}

export const guestbookRepository = new GuestbookRepository()
