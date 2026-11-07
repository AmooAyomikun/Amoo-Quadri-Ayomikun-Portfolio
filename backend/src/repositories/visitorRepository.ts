import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { db } from '../config/firebase.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const visitorsFilePath = path.join(__dirname, '../data/visitors.json')

export interface VisitorRecord {
  id: string
  visitorId?: string
  ipHash: string
  country: string
  countryCode: string
  city: string
  lat: number | null
  lon: number | null
  timestamp: string
  visitCount?: number
  lastSeenAt?: string
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

  private deduplicateVisitors(records: VisitorRecord[]): VisitorRecord[] {
    const map = new Map<string, VisitorRecord>()
    for (const r of records) {
      if (!r || r.id?.startsWith('vis-sample-')) continue
      const key = r.id || r.visitorId || r.ipHash || (r as any).ip
      if (!key) continue
      if (!map.has(key)) {
        map.set(key, { ...r, visitCount: Math.max(1, r.visitCount || 1) })
      } else {
        const existing = map.get(key)!
        if (existing.id === r.id) {
          existing.visitCount = Math.max(existing.visitCount || 1, r.visitCount || 1)
        } else {
          existing.visitCount = (existing.visitCount || 1) + (r.visitCount || 1)
        }
        if (r.country && r.country !== 'Unknown') {
          existing.country = r.country
          existing.countryCode = r.countryCode || existing.countryCode
          existing.city = r.city || existing.city
          existing.lat = r.lat ?? existing.lat
          existing.lon = r.lon ?? existing.lon
        }
      }
    }
    return Array.from(map.values())
  }

  private readFromFile(): VisitorRecord[] {
    try {
      if (fs.existsSync(visitorsFilePath)) {
        const raw = fs.readFileSync(visitorsFilePath, 'utf8')
        const parsed = JSON.parse(raw) as VisitorRecord[]
        return this.deduplicateVisitors(parsed)
      }
    } catch (err) {
      console.warn('[VisitorRepository] Error reading local file fallback:', err)
    }
    return []
  }

  private saveToFile(visitors: VisitorRecord[]): void {
    try {
      const clean = this.deduplicateVisitors(visitors)
      fs.writeFileSync(visitorsFilePath, JSON.stringify(clean, null, 2), 'utf8')
    } catch (err) {
      console.warn('[VisitorRepository] Error saving local file fallback:', err)
    }
  }

  async getAll(): Promise<VisitorRecord[]> {
    const fileRecords = this.readFromFile()

    if (db) {
      try {
        const snapshot = await db.collection('visitors').get()
        if (!snapshot.empty) {
          const docs = snapshot.docs
            .map(d => ({ id: d.id, ...d.data() }) as VisitorRecord)
          // Merge Firestore records with historical file records by ID so historical visits are never lost
          const mergedById = new Map<string, VisitorRecord>()
          for (const item of fileRecords) {
            mergedById.set(item.id, { ...item })
          }
          for (const doc of docs) {
            const prev = mergedById.get(doc.id)
            if (prev) {
              mergedById.set(doc.id, {
                ...prev,
                ...doc,
                visitCount: Math.max(prev.visitCount || 1, doc.visitCount || 1)
              })
            } else {
              mergedById.set(doc.id, doc)
            }
          }
          const deduplicated = this.deduplicateVisitors(Array.from(mergedById.values()))
          if (deduplicated.length > 0) {
            this.localStore = deduplicated
            return deduplicated
          }
        }
      } catch (err) {
        console.warn('[VisitorRepository] Firestore getAll error, falling back to local file:', err)
      }
    }

    if (!this.localStore) {
      this.localStore = fileRecords
    }
    return [...this.localStore]
  }

  async getAggregatedStats(): Promise<CachedStats | null> {
    if (db) {
      try {
        const doc = await db.collection('analytics').doc('visitors_summary').get()
        if (doc.exists) {
          const data = doc.data() as CachedStats
          if (data && typeof data.total === 'number' && data.total > 1) {
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
    if (process.env.NODE_ENV === 'test') {
      return
    }

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

  async saveVisitors(visitors: VisitorRecord[], activeVisitor?: VisitorRecord): Promise<void> {
    const clean = visitors.filter(v => v && !v.id?.startsWith('vis-sample-'))
    this.localStore = clean
    this.saveToFile(clean)

    // Guard: Do not write test visitor records to live Firestore during automated test runs
    if (process.env.NODE_ENV === 'test') {
      return
    }

    if (db) {
      try {
        if (activeVisitor && activeVisitor.id) {
          // O(1) Scalable write: only persist the active or updated visitor record to Firestore
          await db.collection('visitors').doc(activeVisitor.id).set(activeVisitor, { merge: true })
        } else {
          // Bulk write with safe batch chunking (max 400 operations per batch to stay under Firestore 500 limit)
          const BATCH_SIZE = 400
          for (let i = 0; i < clean.length; i += BATCH_SIZE) {
            const chunk = clean.slice(i, i + BATCH_SIZE)
            const batch = db.batch()
            for (const visitor of chunk) {
              const docRef = db.collection('visitors').doc(visitor.id)
              batch.set(docRef, visitor, { merge: true })
            }
            await batch.commit()
          }
        }
      } catch (err) {
        console.warn('[VisitorRepository] Firestore write visitor error:', err)
      }
    }
  }
}

export const visitorRepository = new VisitorRepository()
