import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { db } from '../config/firebase.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const subscribersFilePath = path.join(__dirname, '../data/subscribers.json')

export interface Subscriber {
  id: string
  email: string
  status: 'active' | 'unsubscribed'
  subscribedAt: string
  unsubscribedAt?: string
  unsubscribeToken: string
  consent: boolean
  consentTimestamp: string
}

export class SubscriberRepository {
  private localStore: Subscriber[] | null = null

  private readFromFile(): Subscriber[] {
    try {
      if (fs.existsSync(subscribersFilePath)) {
        const raw = fs.readFileSync(subscribersFilePath, 'utf8')
        return JSON.parse(raw) as Subscriber[]
      }
    } catch (err) {
      console.warn('[SubscriberRepository] Error reading local file fallback:', err)
    }
    return []
  }

  private saveToFile(subscribers: Subscriber[]): void {
    try {
      fs.writeFileSync(subscribersFilePath, JSON.stringify(subscribers, null, 2), 'utf8')
    } catch (err) {
      console.warn('[SubscriberRepository] Error saving local file fallback:', err)
    }
  }

  /**
   * Fetches all subscribers.
   * Firestore is the single source of truth when configured (Issue 3.1: no 0 count after redeploy).
   */
  async getAll(): Promise<Subscriber[]> {
    if (db) {
      try {
        const snapshot = await db.collection('subscribers')
          .orderBy('subscribedAt', 'desc')
          .get()

        if (!snapshot.empty) {
          return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Subscriber[]
        }
      } catch (err) {
        console.warn('[SubscriberRepository] Firestore read failed, using local store:', err)
      }
    }

    if (!this.localStore) {
      this.localStore = this.readFromFile()
    }
    return [...this.localStore]
  }

  async findByEmail(email: string): Promise<Subscriber | null> {
    const cleanEmail = email.trim().toLowerCase()
    if (db) {
      try {
        const snapshot = await db.collection('subscribers')
          .where('email', '==', cleanEmail)
          .limit(1)
          .get()

        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          return { id: doc.id, ...doc.data() } as Subscriber
        }
      } catch (err) {
        console.warn('[SubscriberRepository] Firestore query by email failed, using local store:', err)
      }
    }

    if (!this.localStore) {
      this.localStore = this.readFromFile()
    }
    return this.localStore.find(s => s.email === cleanEmail) || null
  }

  async findByToken(token: string): Promise<Subscriber | null> {
    if (db) {
      try {
        const snapshot = await db.collection('subscribers')
          .where('unsubscribeToken', '==', token)
          .limit(1)
          .get()

        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          return { id: doc.id, ...doc.data() } as Subscriber
        }
      } catch (err) {
        console.warn('[SubscriberRepository] Firestore query by token failed:', err)
      }
    }

    if (!this.localStore) {
      this.localStore = this.readFromFile()
    }
    return this.localStore.find(s => s.unsubscribeToken === token) || null
  }

  async save(subscriber: Subscriber): Promise<void> {
    if (db) {
      try {
        await db.collection('subscribers').doc(subscriber.id).set(subscriber)
        return
      } catch (err) {
        console.warn('[SubscriberRepository] Firestore write failed, writing to fallback:', err)
      }
    }

    if (!this.localStore) {
      this.localStore = this.readFromFile()
    }
    const idx = this.localStore.findIndex(s => s.id === subscriber.id)
    if (idx >= 0) {
      this.localStore[idx] = subscriber
    } else {
      this.localStore.unshift(subscriber)
    }
    this.saveToFile(this.localStore)
  }

  async unsubscribe(emailOrToken: string): Promise<boolean> {
    const clean = emailOrToken.trim().toLowerCase()
    let sub = await this.findByToken(emailOrToken) || await this.findByEmail(clean)
    if (!sub) return false

    sub.status = 'unsubscribed'
    sub.unsubscribedAt = new Date().toISOString()
    await this.save(sub)
    return true
  }
}

export const subscriberRepository = new SubscriberRepository()
