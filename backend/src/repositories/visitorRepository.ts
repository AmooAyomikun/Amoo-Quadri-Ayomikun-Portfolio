import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { db } from '../config/firebase.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const visitorsFilePath = path.join(__dirname, '../data/visitors.json')

export interface VisitorRecord {
  id: string
  ipHash: string
  country: string
  countryCode: string
  city: string
  lat: number | null
  lon: number | null
  timestamp: string
}

export interface CachedStats {
  total: number
  countries: number
  countryStats: Record<string, number>
  topCountries: Array<{ rank: number; name: string; code: string; count: number }>
  locations: Array<{ lat: number; lon: number; city: string; country: string; countryCode?: string }>
}

export class VisitorRepository {
  private localStore: VisitorRecord[] | null = null

  private readFromFile(): VisitorRecord[] {
    try {
      if (fs.existsSync(visitorsFilePath)) {
        const raw = fs.readFileSync(visitorsFilePath, 'utf8')
        const parsed = JSON.parse(raw) as VisitorRecord[]
        return parsed.filter(v => v && !v.id?.startsWith('vis-sample-'))
      }
    } catch (err) {
      console.warn('[VisitorRepository] Error reading local file fallback:', err)
    }
    return []
  }

  private saveToFile(visitors: VisitorRecord[]): void {
    try {
      const clean = visitors.filter(v => v && !v.id?.startsWith('vis-sample-'))
      fs.writeFileSync(visitorsFilePath, JSON.stringify(clean, null, 2), 'utf8')
    } catch (err) {
      console.warn('[VisitorRepository] Error saving local file fallback:', err)
    }
  }

  async getAll(): Promise<VisitorRecord[]> {
    if (db) {
      try {
        const snapshot = await db.collection('visitors').get()
        if (!snapshot.empty) {
          const docs = snapshot.docs
            .map(d => ({ id: d.id, ...d.data() }) as VisitorRecord)
            .filter(v => v && !v.id?.startsWith('vis-sample-'))
          if (docs.length > 0) {
            this.localStore = docs
            return docs
          }
        }
      } catch (err) {
        console.warn('[VisitorRepository] Firestore getAll error, falling back to local file:', err)
      }
    }

    if (!this.localStore) {
      this.localStore = this.readFromFile()
    }
    return [...this.localStore]
  }

  async getAggregatedStats(): Promise<CachedStats | null> {
    if (db) {
      try {
        const doc = await db.collection('analytics').doc('visitors_summary').get()
        if (doc.exists) {
          const data = doc.data() as CachedStats
          // If summary contains legacy sample data, invalidate it
          const hasLegacyMock = data.locations?.some(l => l.country === 'United States' && l.city === 'New York' && l.lat === 40.7128)
          if (!hasLegacyMock) {
            return data
          }
        }
      } catch (err) {
        console.warn('[VisitorRepository] Firestore getAggregatedStats failed:', err)
      }
    }
    return null
  }

  async saveAggregatedStats(stats: CachedStats): Promise<void> {
    if (db) {
      try {
        await db.collection('analytics').doc('visitors_summary').set({
          ...stats,
          updatedAt: new Date().toISOString()
        })
      } catch (err) {
        console.warn('[VisitorRepository] Firestore saveAggregatedStats error:', err)
      }
    }
  }

  async saveVisitors(visitors: VisitorRecord[]): Promise<void> {
    const clean = visitors.filter(v => v && !v.id?.startsWith('vis-sample-'))
    this.localStore = clean
    this.saveToFile(clean)

    if (db) {
      try {
        const batch = db.batch()
        for (const visitor of clean) {
          const docRef = db.collection('visitors').doc(visitor.id)
          batch.set(docRef, visitor, { merge: true })
        }
        await batch.commit()
      } catch (err) {
        console.warn('[VisitorRepository] Firestore batch write visitors error:', err)
      }
    }
  }
}

export const visitorRepository = new VisitorRepository()
