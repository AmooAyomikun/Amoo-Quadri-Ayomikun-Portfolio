import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
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

interface CachedStats {
  total: number
  countries: number
  countryStats: Record<string, number>
  topCountries: Array<{ rank: number; name: string; code: string; count: number }>
  locations: Array<{ lat: number; lon: number; city: string; country: string; countryCode?: string }>
  cachedAt: number
}

let memoryStatsCache: CachedStats | null = null
const CACHE_TTL_MS = 60 * 1000 // 60 seconds

const HASH_SALT = process.env.VISITOR_SALT || 'amoo-quadri-visitor-salt'

const hashIp = (ip: string): string => {
  return crypto.createHmac('sha256', HASH_SALT).update(ip).digest('hex').substring(0, 20)
}

const readVisitorsFromFile = (): VisitorRecord[] => {
  try {
    if (fs.existsSync(visitorsFilePath)) {
      const raw = fs.readFileSync(visitorsFilePath, 'utf8')
      const parsed = JSON.parse(raw) as any[]
      return parsed.map(v => ({
        id: v.id || `vis-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        ipHash: v.ipHash || (v.ip ? hashIp(v.ip) : 'anon'),
        country: v.country || 'Unknown',
        countryCode: v.countryCode || 'UN',
        city: v.city || 'Unknown',
        lat: typeof v.lat === 'number' ? v.lat : null,
        lon: typeof v.lon === 'number' ? v.lon : null,
        timestamp: v.timestamp || new Date().toISOString()
      }))
    }
  } catch (err) {
    console.error('Error reading visitors.json:', err)
  }
  return []
}

const saveVisitorsToFile = (visitors: VisitorRecord[]): void => {
  try {
    fs.writeFileSync(visitorsFilePath, JSON.stringify(visitors, null, 2), 'utf8')
  } catch (err) {
    console.error('Error saving visitors.json:', err)
  }
}

const computeStats = (visitors: VisitorRecord[]) => {
  const countryStats: Record<string, number> = {}
  const countryCodeMap: Record<string, string> = {}
  const validLocations: Array<{ lat: number; lon: number; city: string; country: string; countryCode?: string }> = []

  visitors.forEach(v => {
    // Only tally real identified countries (Issue 4.1: never fabricate countries)
    if (v.country && v.country !== 'Unknown' && v.country !== 'Localhost') {
      countryStats[v.country] = (countryStats[v.country] || 0) + 1
      if (v.countryCode && v.countryCode !== 'UN') {
        countryCodeMap[v.country] = v.countryCode
      }
    }
    if (typeof v.lat === 'number' && typeof v.lon === 'number') {
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

export const logVisitor = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Extract client IP from headers
    const ipHeader = req.headers['x-forwarded-for'] || req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.socket.remoteAddress || ''
    let ip = ''
    if (Array.isArray(ipHeader)) {
      ip = ipHeader[0].split(',')[0].trim()
    } else if (typeof ipHeader === 'string') {
      ip = ipHeader.split(',')[0].trim()
    }

    if (ip.startsWith('::ffff:')) {
      ip = ip.substring(7)
    }

    // 2. Client-side hint may be passed from client-side geo lookup (get.geojs.io)
    const clientHint = req.body ?? {}
    let country = clientHint.country ? String(clientHint.country).trim() : ''
    let countryCode = clientHint.countryCode ? String(clientHint.countryCode).trim().toUpperCase() : ''
    let city = clientHint.city ? String(clientHint.city).trim() : ''
    let lat: number | null = typeof clientHint.lat === 'number' && !isNaN(clientHint.lat) ? clientHint.lat : null
    let lon: number | null = typeof clientHint.lon === 'number' && !isNaN(clientHint.lon) ? clientHint.lon : null

    const isPrivateIp = !ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')
    let resolvedIp = ip

    // Resolve public IP if local and no client hint
    if (isPrivateIp && (!country || !city)) {
      try {
        const publicIpRes = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(2500) })
        if (publicIpRes.ok) {
          const publicIpJson = await publicIpRes.json() as any
          if (publicIpJson?.ip) {
            resolvedIp = publicIpJson.ip
          }
        }
      } catch {
        // Fallback
      }
    }

    // 3. Geolocation via secure HTTPS endpoints (Issue 4.5: no unencrypted or rate-limited ip-api.com)
    if ((!country || !city || lat === null || lon === null) && resolvedIp && !isPrivateIp) {
      try {
        // Primary: freeipapi.com over HTTPS
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
        // Fallback: ipwhois.app over HTTPS
        try {
          const geoRes2 = await fetch(`https://ipwhois.app/json/${resolvedIp}`, { signal: AbortSignal.timeout(2500) })
          if (geoRes2.ok) {
            const geo2 = await geoRes2.json() as any
            if (geo2?.success !== false && geo2?.country) {
              country = geo2.country
              countryCode = geo2.country_code || 'UN'
              city = geo2.city || 'Unknown'
              lat = typeof geo2.latitude === 'number' ? geo2.latitude : null
              lon = typeof geo2.longitude === 'number' ? geo2.longitude : null
            }
          }
        } catch {
          // ignore
        }
      }
    }

    // Issue 4.1: If geolocation fails, DO NOT invent Lagos, Nigeria or fake data!
    if (!country) {
      country = 'Unknown'
      countryCode = 'UN'
      city = 'Unknown'
      lat = null
      lon = null
    }

    const ipKey = hashIp(resolvedIp || 'anonymous-' + Date.now())
    let visitors = readVisitorsFromFile()

    // Issue 4.2: Deduplicate strictly by IP hash (never merge different users by city)
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

    saveVisitorsToFile(visitors)

    const stats = computeStats(visitors)

    // Issue 4.6: Update single aggregated Firestore document instead of querying entire collection
    if (db) {
      try {
        const statsRef = db.collection('stats').doc('visitors_summary')
        await statsRef.set({
          total: stats.total,
          countries: stats.countries,
          countryStats: stats.countryStats,
          topCountries: stats.topCountries,
          locations: stats.locations.slice(-150),
          lastUpdated: new Date().toISOString()
        }, { merge: true })

        // Also record visitor by direct document ID (ipKey) for zero-query lookup
        await db.collection('visitors').doc(ipKey).set({
          ipHash: ipKey,
          country,
          countryCode,
          city,
          lat,
          lon,
          timestamp: new Date().toISOString()
        }, { merge: true })
      } catch (err) {
        console.warn('Firestore visitor summary write error:', err)
      }
    }

    // Update in-memory cache
    memoryStatsCache = {
      ...stats,
      cachedAt: Date.now()
    }

    const userCountryCount = country !== 'Unknown' ? (stats.countryStats[country] || 1) : 1

    res.status(200).json({
      success: true,
      userCountry: country.toUpperCase(),
      userCountryCode: countryCode,
      userCity: city,
      userCountryCount,
      totalVisitors: stats.total,
      topCountries: stats.topCountries,
      countryStats: stats.countryStats,
      locations: stats.locations
    })
  } catch (error) {
    console.error('Error logging visitor:', error)
    res.status(500).json({ error: 'Failed to log visitor' })
  }
}

export const getVisitors = async (_req: Request, res: Response): Promise<void> => {
  try {
    // 1. Check in-memory cache (Issue 4.6: 0 DB reads for repeat requests)
    if (memoryStatsCache && Date.now() - memoryStatsCache.cachedAt < CACHE_TTL_MS) {
      res.status(200).json({
        total: memoryStatsCache.total,
        countries: memoryStatsCache.countries,
        countryStats: memoryStatsCache.countryStats,
        topCountries: memoryStatsCache.topCountries,
        locations: memoryStatsCache.locations
      })
      return
    }

    // 2. If Firestore exists, read single summary document (Issue 4.6: 1 document read instead of reading entire collection)
    if (db) {
      try {
        const summaryDoc = await db.collection('stats').doc('visitors_summary').get()
        if (summaryDoc.exists) {
          const docData = summaryDoc.data() as any
          if (docData && typeof docData.total === 'number') {
            memoryStatsCache = {
              total: docData.total,
              countries: docData.countries || Object.keys(docData.countryStats || {}).length,
              countryStats: docData.countryStats || {},
              topCountries: docData.topCountries || [],
              locations: docData.locations || [],
              cachedAt: Date.now()
            }

            res.status(200).json({
              total: memoryStatsCache.total,
              countries: memoryStatsCache.countries,
              countryStats: memoryStatsCache.countryStats,
              topCountries: memoryStatsCache.topCountries,
              locations: memoryStatsCache.locations
            })
            return
          }
        }
      } catch (err) {
        console.warn('Firestore summary fetch failed, using local file:', err)
      }
    }

    // 3. Fallback: compute from local file
    const visitors = readVisitorsFromFile()
    const stats = computeStats(visitors)

    memoryStatsCache = {
      ...stats,
      cachedAt: Date.now()
    }

    res.status(200).json({
      total: stats.total,
      countries: stats.countries,
      countryStats: stats.countryStats,
      topCountries: stats.topCountries,
      locations: stats.locations
    })
  } catch (error) {
    console.error('Error fetching visitors:', error)
    res.status(500).json({ error: 'Failed to fetch visitors' })
  }
}
