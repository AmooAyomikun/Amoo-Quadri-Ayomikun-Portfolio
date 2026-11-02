import { useState, useEffect, useCallback, useRef } from 'react'
import { apiUrl } from '../lib/api'

export interface TopCountry {
  rank: number
  name: string
  code: string
  count: number
}

export interface VisitorLocation {
  lat: number
  lon: number
  city: string
  country: string
  countryCode?: string
}

export interface VisitorResponse {
  userCountry: string
  userCountryCode: string
  userCity: string
  userCountryCount: number
  totalVisitors: number
  topCountries: TopCountry[]
  countryStats: Record<string, number>
  locations: VisitorLocation[]
}

export interface ClientGeo {
  country?: string
  country_code?: string
  city?: string
  latitude?: string | number
  longitude?: string | number
}

export interface PinpointedGeo {
  city: string
  lat: number
  lon: number
}

export const COUNTRY_ALIASES: Record<string, string> = {
  'united states of america': 'united states',
  'usa': 'united states',
  'us': 'united states',
  'united kingdom': 'united kingdom',
  'great britain': 'united kingdom',
  'uk': 'united kingdom',
  'england': 'united kingdom',
  'russian federation': 'russia',
  'korea, republic of': 'south korea',
  'republic of korea': 'south korea',
  'korea': 'south korea',
  'dem. rep. congo': 'democratic republic of the congo',
  'democratic republic of the congo': 'democratic republic of the congo',
  'congo': 'republic of the congo',
  'czech republic': 'czechia',
  'viet nam': 'vietnam',
  'iran, islamic republic of': 'iran',
  'syrian arab republic': 'syria',
  'tanzania, united republic of': 'tanzania',
  'ivory coast': "côte d'ivoire",
  'lao pdr': 'laos',
  'moldova, republic of': 'moldova',
  'venezuela, bolivarian republic of': 'venezuela',
  'bolivia, plurinational state of': 'bolivia'
}

export const normalizeCountry = (name: string): string => {
  if (!name) return ''
  let s = name.toLowerCase().trim()
  s = s.replace(/^the\s+/, '')
  if (COUNTRY_ALIASES[s]) {
    return COUNTRY_ALIASES[s]
  }
  return s
}

export const findCountryCount = (geoName: string, stats: Record<string, number>): number => {
  if (!geoName || !stats) return 0
  if (typeof stats[geoName] === 'number') return stats[geoName]
  const normGeo = normalizeCountry(geoName)
  for (const [key, count] of Object.entries(stats)) {
    if (normalizeCountry(key) === normGeo) {
      return count
    }
  }
  return 0
}

const CACHED_STATS_KEY = 'portfolio_visitor_stats_cache'

const BASELINE_DATA: VisitorResponse = {
  userCountry: 'Nigeria',
  userCountryCode: 'NG',
  userCity: 'Lagos',
  userCountryCount: 5,
  totalVisitors: 8,
  topCountries: [
    { rank: 1, name: 'Nigeria', code: 'NG', count: 5 },
    { rank: 2, name: 'United States', code: 'US', count: 1 },
    { rank: 3, name: 'United Kingdom', code: 'GB', count: 1 }
  ],
  countryStats: {
    'Nigeria': 5,
    'United States': 1,
    'United Kingdom': 1
  },
  locations: [
    { lat: 6.4474, lon: 3.3903, city: 'Lagos', country: 'Nigeria', countryCode: 'NG' },
    { lat: 40.7128, lon: -74.006, city: 'New York', country: 'United States', countryCode: 'US' },
    { lat: 51.5074, lon: -0.1278, city: 'London', country: 'United Kingdom', countryCode: 'GB' },
    { lat: 6.1715, lon: 7.0053, city: 'Enugu-Ukwu', country: 'Nigeria', countryCode: 'NG' }
  ]
}

export function useVisitorStats() {
  const [data, setData] = useState<VisitorResponse>(() => {
    try {
      const cached = localStorage.getItem(CACHED_STATS_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed && typeof parsed.totalVisitors === 'number' && parsed.totalVisitors > 0) {
          return parsed
        }
      }
    } catch {
      // fallback
    }
    return BASELINE_DATA
  })

  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'offline'>('connecting')
  const [pinpointLoading, setPinpointLoading] = useState(false)
  const [pinpointedData, setPinpointedData] = useState<PinpointedGeo | null>(() => {
    try {
      const stored = localStorage.getItem('portfolio_user_pinpoint_geo')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const abortRef = useRef<AbortController | null>(null)
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    abortRef.current = controller

    const SESSION_KEY = 'portfolio_visitor_session_logged'
    const CACHED_USER_GEO = 'portfolio_user_geo'

    const initStats = async (isRetry = false) => {
      let clientGeo: ClientGeo | null = null
      const cachedGeoStr = sessionStorage.getItem(CACHED_USER_GEO)
      if (cachedGeoStr) {
        try {
          clientGeo = JSON.parse(cachedGeoStr)
        } catch {
          // ignore corrupted cache
        }
      }

      if (!clientGeo) {
        try {
          const geoRes = await fetch('https://get.geojs.io/v1/ip/geo.json', {
            signal: AbortSignal.timeout(3000)
          })
          if (geoRes.ok) {
            clientGeo = (await geoRes.json()) as ClientGeo
            if (clientGeo) {
              sessionStorage.setItem(CACHED_USER_GEO, JSON.stringify(clientGeo))
            }
          }
        } catch (err) {
          console.debug('Client geo lookup note:', err)
        }
      }

      const country = clientGeo?.country || ''
      const countryCode = clientGeo?.country_code || ''
      const city = clientGeo?.city || ''
      const lat = clientGeo?.latitude ? parseFloat(String(clientGeo.latitude)) : undefined
      const lon = clientGeo?.longitude ? parseFloat(String(clientGeo.longitude)) : undefined

      const isAlreadyLogged = sessionStorage.getItem(SESSION_KEY) === 'true'

      try {
        setConnectionStatus('connecting')

        if (isAlreadyLogged) {
          const res = await fetch(apiUrl('/api/visitors'), { signal: controller.signal })
          if (res.ok) {
            const json = await res.json()
            if (!controller.signal.aborted) {
              setConnectionStatus('connected')
              const countryCount = country
                ? json.countryStats?.[country] || findCountryCount(country, json.countryStats) || 1
                : 1
              setData((prev) => {
                const next = {
                  ...prev,
                  userCountry: country || prev.userCountry || 'UNKNOWN',
                  userCountryCode: countryCode || prev.userCountryCode,
                  userCity: city || prev.userCity,
                  userCountryCount: countryCount,
                  totalVisitors: typeof json.total === 'number' ? json.total : prev.totalVisitors,
                  topCountries: Array.isArray(json.topCountries) ? json.topCountries : prev.topCountries,
                  countryStats: json.countryStats || prev.countryStats,
                  locations: Array.isArray(json.locations) ? json.locations : prev.locations
                }
                try {
                  localStorage.setItem(CACHED_STATS_KEY, JSON.stringify(next))
                } catch {
                  // ignore
                }
                return next
              })
            }
          } else if (!isRetry && !controller.signal.aborted) {
            setConnectionStatus('offline')
            retryTimerRef.current = setTimeout(() => initStats(true), 3000)
          }
        } else {
          const logPayload = clientGeo
            ? { country, countryCode, city, lat, lon }
            : {}

          const res = await fetch(apiUrl('/api/visitors/log'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logPayload),
            signal: controller.signal
          })

          if (res.ok) {
            const json = await res.json()
            sessionStorage.setItem(SESSION_KEY, 'true')
            if (!controller.signal.aborted && json.success) {
              setConnectionStatus('connected')
              setData((prev) => {
                const next = {
                  ...prev,
                  userCountry: json.userCountry || country || 'UNKNOWN',
                  userCountryCode: json.userCountryCode || countryCode,
                  userCity: json.userCity || city,
                  userCountryCount: json.userCountryCount || 1,
                  totalVisitors: json.totalVisitors || 1,
                  topCountries: Array.isArray(json.topCountries) ? json.topCountries : [],
                  countryStats: json.countryStats || {},
                  locations: Array.isArray(json.locations) ? json.locations : []
                }
                try {
                  localStorage.setItem(CACHED_STATS_KEY, JSON.stringify(next))
                } catch {
                  // ignore
                }
                return next
              })
            }
          } else if (!isRetry && !controller.signal.aborted) {
            setConnectionStatus('offline')
            retryTimerRef.current = setTimeout(() => initStats(true), 3000)
          }
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        console.warn('Visitor sync note:', err)
        if (!controller.signal.aborted) {
          setConnectionStatus('offline')
          if (!isRetry) {
            retryTimerRef.current = setTimeout(() => initStats(true), 3000)
          }
        }
      }
    }

    initStats()

    return () => {
      controller.abort()
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current)
    }
  }, [])

  const handlePinpointCity = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }

    setPinpointLoading(true)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          if (res.ok) {
            const geo = await res.json()
            const city = geo.city || geo.locality || 'Verified City'
            const country = geo.countryName || data.userCountry || 'Nigeria'
            const countryCode = geo.countryCode || data.userCountryCode || 'NG'

            const newPinpoint = { city, lat: latitude, lon: longitude }
            setPinpointedData(newPinpoint)
            localStorage.setItem('portfolio_user_pinpoint_geo', JSON.stringify(newPinpoint))

            fetch(apiUrl('/api/visitors/log'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ country, countryCode, city, lat: latitude, lon: longitude })
            }).catch(() => {})
          }
        } catch (err) {
          console.warn('Reverse geocoding error:', err)
        } finally {
          setPinpointLoading(false)
        }
      },
      () => {
        setPinpointLoading(false)
      },
      { timeout: 8000 }
    )
  }, [data.userCountry, data.userCountryCode])

  return {
    data,
    connectionStatus,
    pinpointedData,
    pinpointLoading,
    handlePinpointCity
  }
}

export default useVisitorStats
