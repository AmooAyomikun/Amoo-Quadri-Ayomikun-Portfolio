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
        return JSON.parse(raw) as VisitorRecord[]
      }
    } catch (err) {
      console.warn('[VisitorRepository] Error reading local file fallback:', err)
    }
    return []
  }

  private saveToFile(visitors: VisitorRecord[]): void {
    try {
      fs.writeFileSync(visitorsFilePath, JSON.stringify(visitors, null, 2), 'utf8')
    } catch (err) {
      console.warn('[VisitorRepository] Error saving local file fallback:', err)
    }
  }

  async getAll(): Promise<VisitorRecord[]> {
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
          return doc.data() as CachedStats
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
    this.localStore = visitors
    this.saveToFile(visitors)
  }
}

export const visitorRepository = new VisitorRepository()
