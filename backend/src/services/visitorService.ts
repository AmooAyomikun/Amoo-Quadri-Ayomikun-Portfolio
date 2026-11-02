import crypto from 'crypto'
import { env } from '../config/env.js'
import { visitorRepository, VisitorRecord, CachedStats } from '../repositories/visitorRepository.js'

let memoryStatsCache: (CachedStats & { cachedAt: number }) | null = null
const CACHE_TTL_MS = 60 * 1000

export class VisitorService {
  private hashIp(ip: string): string {
    const salt = env.VISITOR_SALT || 'amoo-quadri-visitor-salt'
    return crypto.createHmac('sha256', salt).update(ip).digest('hex').substring(0, 20)
  }

  private computeStats(visitors: VisitorRecord[]): CachedStats {
    const countryStats: Record<string, number> = {}
    const countryCodeMap: Record<string, string> = {}
    const validLocations: Array<{ lat: number; lon: number; city: string; country: string; countryCode?: string }> = []

    visitors.forEach(v => {
      if (v.country && v.country !== 'Unknown') {
        countryStats[v.country] = (countryStats[v.country] || 0) + 1
        if (v.countryCode) {
          countryCodeMap[v.country] = v.countryCode
        }
      }

      if (v.lat !== null && v.lon !== null && typeof v.lat === 'number' && typeof v.lon === 'number') {
        validLocations.push({
          lat: v.lat,
          lon: v.lon,
          city: v.city,
          country: v.country,
          countryCode: v.countryCode
        })
      }
    })

    const topCountries = Object.entries(countryStats)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count], index) => ({
        rank: index + 1,
        name: name.toUpperCase(),
        code: countryCodeMap[name] || 'UN',
        count
      }))

    return {
      total: visitors.length,
      countries: Object.keys(countryStats).length,
      countryStats,
      topCountries,
      locations: validLocations
    }
  }

  async getStats(): Promise<CachedStats> {
    if (memoryStatsCache && (Date.now() - memoryStatsCache.cachedAt) < CACHE_TTL_MS) {
      return memoryStatsCache
    }

    const firestoreSummary = await visitorRepository.getAggregatedStats()
    if (firestoreSummary && firestoreSummary.total > 0) {
      memoryStatsCache = { ...firestoreSummary, cachedAt: Date.now() }
      return memoryStatsCache
    }

    const visitors = await visitorRepository.getAll()
    const stats = this.computeStats(visitors)
    memoryStatsCache = { ...stats, cachedAt: Date.now() }
    return stats
  }

  async logVisitor(ipAddress: string, clientHint: {
    country?: string
    countryCode?: string
    city?: string
    lat?: number | null
    lon?: number | null
  }): Promise<CachedStats> {
    const rawIp = ipAddress.replace(/^::ffff:/, '').trim()
    let country = typeof clientHint.country === 'string' ? clientHint.country.trim().slice(0, 60) : ''
    let countryCode = typeof clientHint.countryCode === 'string' ? clientHint.countryCode.trim().toUpperCase().slice(0, 3) : ''
    let city = typeof clientHint.city === 'string' ? clientHint.city.trim().slice(0, 60) : ''
    let lat: number | null = (typeof clientHint.lat === 'number' && !isNaN(clientHint.lat) && clientHint.lat >= -90 && clientHint.lat <= 90) ? clientHint.lat : null
    let lon: number | null = (typeof clientHint.lon === 'number' && !isNaN(clientHint.lon) && clientHint.lon >= -180 && clientHint.lon <= 180) ? clientHint.lon : null

    if (lat === null || lon === null || !country || !city) {
      lat = null
      lon = null
    }

    const isPrivateIp = !rawIp || rawIp === '::1' || rawIp === '127.0.0.1' || rawIp.startsWith('192.168.') || rawIp.startsWith('10.') || rawIp.startsWith('172.')
    let resolvedIp = rawIp

    // Geolocation lookup if needed
    if ((!country || !city || lat === null || lon === null) && resolvedIp && !isPrivateIp) {
      try {
        const geoRes = await fetch(`https://freeipapi.com/api/json/${resolvedIp}`, { signal: AbortSignal.timeout(3000) })
        if (geoRes.ok) {
          const geo = await geoRes.json() as any
          if (geo?.cityName && geo?.countryName) {
            country = geo.countryName
            countryCode = geo.countryCode || 'UN'
            city = geo.cityName
            lat = typeof geo.latitude === 'number' ? geo.latitude : null
            lon = typeof geo.longitude === 'number' ? geo.longitude : null
          }
        }
      } catch {
        // Fallback
      }
    }

    if (!country) {
      country = 'Unknown'
      countryCode = 'UN'
      city = 'Unknown'
      lat = null
      lon = null
    }

    const ipKey = this.hashIp(resolvedIp || 'anonymous-' + Date.now())
    const visitors = await visitorRepository.getAll()
    const existingIndex = visitors.findIndex(v => v.ipHash === ipKey)

    if (existingIndex >= 0) {
      visitors[existingIndex].timestamp = new Date().toISOString()
      if (country !== 'Unknown') {
        visitors[existingIndex].country = country
        visitors[existingIndex].countryCode = countryCode
        visitors[existingIndex].city = city
        visitors[existingIndex].lat = lat
        visitors[existingIndex].lon = lon
      }
    } else {
      visitors.push({
        id: `vis-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        ipHash: ipKey,
        country,
        countryCode,
        city,
        lat,
        lon,
        timestamp: new Date().toISOString()
      })
    }

    await visitorRepository.saveVisitors(visitors)
    const stats = this.computeStats(visitors)
    memoryStatsCache = { ...stats, cachedAt: Date.now() }
    visitorRepository.saveAggregatedStats(stats).catch(err => {
      console.warn('[VisitorService] Failed to update aggregated firestore document:', err)
    })

    return stats
  }
}

export const visitorService = new VisitorService()
