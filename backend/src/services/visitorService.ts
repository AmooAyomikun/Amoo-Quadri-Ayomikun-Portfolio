import crypto from 'crypto'
import { env } from '../config/env.js'
import { visitorRepository, VisitorRecord, CachedStats } from '../repositories/visitorRepository.js'

let memoryStatsCache: (CachedStats & { cachedAt: number }) | null = null
const CACHE_TTL_MS = 30 * 1000

export const ISO_COUNTRY_NAMES: Record<string, string> = {
  NG: 'Nigeria',
  US: 'United States',
  GB: 'United Kingdom',
  CA: 'Canada',
  DE: 'Germany',
  FR: 'France',
  IN: 'India',
  GH: 'Ghana',
  ZA: 'South Africa',
  KE: 'Kenya',
  RW: 'Rwanda',
  EG: 'Egypt',
  NL: 'Netherlands',
  SE: 'Sweden',
  IE: 'Ireland',
  AU: 'Australia',
  BR: 'Brazil',
  JP: 'Japan',
  SG: 'Singapore',
  CN: 'China',
  IT: 'Italy',
  ES: 'Spain',
  CH: 'Switzerland',
  AE: 'United Arab Emirates',
  SA: 'Saudi Arabia'
}

export class VisitorService {
  private hashIp(ip: string): string {
    const salt = env.VISITOR_SALT || 'amoo-quadri-visitor-salt'
    return crypto.createHmac('sha256', salt).update(ip).digest('hex').substring(0, 20)
  }

  private computeStats(visitors: VisitorRecord[]): CachedStats {
    const countryStats: Record<string, number> = {}
    const countryCodeMap: Record<string, string> = {}
    const validLocations: Array<{ lat: number; lon: number; city: string; country: string; countryCode?: string }> = []
    let totalVisits = 0

    visitors.forEach(v => {
      const count = Math.max(1, v.visitCount || 1)
      totalVisits += count

      if (v.country && v.country !== 'Unknown') {
        countryStats[v.country] = (countryStats[v.country] || 0) + count
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
      total: totalVisits,
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
    visitorId?: string
    country?: string
    countryCode?: string
    city?: string
    lat?: number | null
    lon?: number | null
  }): Promise<{
    stats: CachedStats
    resolvedCountry: string
    resolvedCity: string
    resolvedCode: string
  }> {
    const rawIp = ipAddress.replace(/^::ffff:/, '').trim()
    let country = typeof clientHint.country === 'string' ? clientHint.country.trim().slice(0, 60) : ''
    let countryCode = typeof clientHint.countryCode === 'string' ? clientHint.countryCode.trim().toUpperCase().slice(0, 3) : ''
    let city = typeof clientHint.city === 'string' ? clientHint.city.trim().slice(0, 60) : ''
    let lat: number | null = (typeof clientHint.lat === 'number' && !isNaN(clientHint.lat) && clientHint.lat >= -90 && clientHint.lat <= 90) ? clientHint.lat : null
    let lon: number | null = (typeof clientHint.lon === 'number' && !isNaN(clientHint.lon) && clientHint.lon >= -180 && clientHint.lon <= 180) ? clientHint.lon : null

    // Normalize country from 2-letter ISO code if needed
    if (countryCode && (!country || country.length <= 3)) {
      country = ISO_COUNTRY_NAMES[countryCode] || countryCode
    }

    const isPrivateIp = !rawIp || rawIp === '::1' || rawIp === '127.0.0.1' || rawIp.startsWith('192.168.') || rawIp.startsWith('10.') || rawIp.startsWith('172.')
    let resolvedIp = rawIp

    // 1. Production Geolocation: Resolve via public IP lookup if country missing
    if ((!country || country === 'Unknown' || lat === null || lon === null) && resolvedIp && !isPrivateIp) {
      try {
        const geoRes = await fetch(`https://freeipapi.com/api/json/${resolvedIp}`, { signal: AbortSignal.timeout(3000) })
        if (geoRes.ok) {
          const geo = await geoRes.json() as any
          if (geo?.cityName && geo?.countryName) {
            country = geo.countryName
            countryCode = geo.countryCode || countryCode || 'UN'
            city = geo.cityName
            lat = typeof geo.latitude === 'number' ? geo.latitude : lat
            lon = typeof geo.longitude === 'number' ? geo.longitude : lon
          }
        }
      } catch {
        // Fallback silently
      }
    }

    // 2. Local Development Geolocation: Resolve developer's public IP
    if ((!country || country === 'Unknown') && isPrivateIp) {
      try {
        const localGeoRes = await fetch('https://freeipapi.com/api/json/', { signal: AbortSignal.timeout(2500) })
        if (localGeoRes.ok) {
          const devGeo = await localGeoRes.json() as any
          if (devGeo?.countryName) {
            country = devGeo.countryName
            countryCode = devGeo.countryCode || 'UN'
            city = devGeo.cityName || 'Local'
            lat = typeof devGeo.latitude === 'number' ? devGeo.latitude : 6.4474
            lon = typeof devGeo.longitude === 'number' ? devGeo.longitude : 3.3903
          }
        }
      } catch {
        // Fallback silently
      }
    }

    if (!country) {
      country = 'Unknown'
      countryCode = 'UN'
      city = 'Unknown'
      lat = null
      lon = null
    }

    const ipKey = rawIp ? this.hashIp(rawIp) : ''
    const vid = clientHint.visitorId?.trim()

    const visitors = await visitorRepository.getAll()
    const existingIndex = visitors.findIndex(v =>
      (vid && v.visitorId && v.visitorId === vid) ||
      (vid && v.id === vid) ||
      (ipKey && v.ipHash === ipKey)
    )
    const nowIso = new Date().toISOString()
    const SESSION_INACTIVITY_MS = 30 * 60 * 1000 // 30 minutes industry-standard session window

    if (existingIndex >= 0) {
      const existing = visitors[existingIndex]
      const lastSeenTime = new Date(existing.lastSeenAt || existing.timestamp).getTime()
      const isNewSession = isNaN(lastSeenTime) || (Date.now() - lastSeenTime) > SESSION_INACTIVITY_MS

      if (isNewSession) {
        existing.visitCount = (existing.visitCount || 1) + 1
      }
      existing.lastSeenAt = nowIso
      existing.timestamp = nowIso
      if (vid && !existing.visitorId) {
        existing.visitorId = vid
      }

      if (country !== 'Unknown') {
        existing.country = country
        existing.countryCode = countryCode
        existing.city = city
        existing.lat = lat
        existing.lon = lon
      }
    } else {
      visitors.push({
        id: vid || `vis-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        visitorId: vid,
        ipHash: ipKey || (vid ? this.hashIp(vid) : this.hashIp('anon-fallback')),
        country,
        countryCode,
        city,
        lat,
        lon,
        timestamp: nowIso,
        lastSeenAt: nowIso,
        visitCount: 1
      })
    }

    await visitorRepository.saveVisitors(visitors)
    const stats = this.computeStats(visitors)
    memoryStatsCache = { ...stats, cachedAt: Date.now() }
    visitorRepository.saveAggregatedStats(stats).catch(err => {
      console.warn('[VisitorService] Failed to update aggregated firestore document:', err)
    })

    return {
      stats,
      resolvedCountry: country,
      resolvedCity: city,
      resolvedCode: countryCode
    }
  }
}

export const visitorService = new VisitorService()
