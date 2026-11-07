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

const CACHED_STATS_KEY = 'portfolio_visitor_stats_cache_v3'
const DEVICE_LOGGED_KEY = 'portfolio_device_logged_v1'

const getOrCreateVisitorId = (): string => {
  const STORAGE_KEY = 'portfolio_anonymous_uid'
  try {
    let id = localStorage.getItem(STORAGE_KEY)
    if (!id) {
      id = 'vid_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36)
      localStorage.setItem(STORAGE_KEY, id)
    }
    return id
  } catch {
    return 'vid_' + Date.now().toString(36)
  }
}

const INITIAL_REAL_DATA: VisitorResponse = {
  userCountry: 'Nigeria',
  userCountryCode: 'NG',
  userCity: 'Lagos',
  userCountryCount: 17,
  totalVisitors: 23,
  topCountries: [
    { rank: 1, name: 'NIGERIA', code: 'NG', count: 17 },
    { rank: 2, name: 'UNITED STATES', code: 'US', count: 3 },
    { rank: 3, name: 'CANADA', code: 'CA', count: 1 }
  ],
  countryStats: {
    Nigeria: 17,
    'United States': 3,
    Canada: 1
  },
  locations: [
    { lat: 6.4474, lon: 3.3903, city: 'Lagos', country: 'Nigeria', countryCode: 'NG' },
    { lat: 4.7731, lon: 7.0085, city: 'Port Harcourt', country: 'Nigeria', countryCode: 'NG' },
    { lat: 37.3394, lon: -121.895, city: 'San Jose', country: 'United States', countryCode: 'US' },
    { lat: 43.653, lon: -79.383, city: 'Toronto', country: 'Canada', countryCode: 'CA' }
  ]
}

export function useVisitorStats() {
  const [data, setData] = useState<VisitorResponse>(() => {
    try {
      const cached = localStorage.getItem(CACHED_STATS_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (typeof parsed?.totalVisitors === 'number' && parsed.totalVisitors >= INITIAL_REAL_DATA.totalVisitors) {
          return parsed
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_REAL_DATA
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

    const CACHED_USER_GEO = 'portfolio_user_geo'

    const applyClientGeoFallback = (geo: ClientGeo) => {
      const cName = geo.country || 'Nigeria'
      const cCode = geo.country_code || 'NG'
      const cCity = geo.city || ''
      const latNum = geo.latitude ? parseFloat(String(geo.latitude)) : NaN
      const lonNum = geo.longitude ? parseFloat(String(geo.longitude)) : NaN

      if (!cName) return

      setData((prev) => {
        const nextStats = { ...prev.countryStats }
        if (!findCountryCount(cName, nextStats)) {
          nextStats[cName] = 1
        }

        const userCount = findCountryCount(cName, nextStats) || 1
        const nextTotal = Math.max(prev.totalVisitors, Object.values(nextStats).reduce((a, b) => a + b, 0), 1)

        const nextTop: TopCountry[] = Object.entries(nextStats)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count], idx) => ({
            rank: idx + 1,
            name: name.toUpperCase(),
            code:
              normalizeCountry(name) === normalizeCountry(cName)
                ? cCode
                : name.toUpperCase() === 'NIGERIA'
                ? 'NG'
                : name.toUpperCase() === 'UNITED STATES'
                ? 'US'
                : name.toUpperCase() === 'CANADA'
                ? 'CA'
                : 'UN',
            count
          }))

        const nextLocations = [...prev.locations]
        if (!Number.isNaN(latNum) && !Number.isNaN(lonNum)) {
          const exists = nextLocations.some(
            (l) => Math.abs(l.lat - latNum) < 0.2 && Math.abs(l.lon - lonNum) < 0.2
          )
          if (!exists) {
            nextLocations.push({
              city: cCity || cName,
              country: cName,
              countryCode: cCode,
              lat: latNum,
              lon: lonNum
            })
          }
        }

        const next: VisitorResponse = {
          ...prev,
          userCountry: cName,
          userCountryCode: cCode,
          userCity: cCity || prev.userCity,
          userCountryCount: userCount,
          totalVisitors: nextTotal,
          topCountries: nextTop,
          countryStats: nextStats,
          locations: nextLocations
        }
        try {
          localStorage.setItem(CACHED_STATS_KEY, JSON.stringify(next))
        } catch {
          // ignore
        }
        return next
      })
    }

    const fetchClientGeo = async (): Promise<ClientGeo | null> => {
      const cachedGeoStr = sessionStorage.getItem(CACHED_USER_GEO)
      if (cachedGeoStr) {
        try {
          const parsed = JSON.parse(cachedGeoStr) as ClientGeo
          if (parsed?.country) {
            applyClientGeoFallback(parsed)
            return parsed
          }
        } catch {
          // ignore corrupted cache
        }
      }

      try {
        const geoRes = await fetch('https://get.geojs.io/v1/ip/geo.json', {
          signal: AbortSignal.timeout(3000)
        })
        if (geoRes.ok) {
          const geo = (await geoRes.json()) as ClientGeo
          if (geo?.country) {
            sessionStorage.setItem(CACHED_USER_GEO, JSON.stringify(geo))
            applyClientGeoFallback(geo)
            return geo
          }
        }
      } catch {
        // fallback to secondary geo provider
      }

      try {
        const fallbackRes = await fetch('https://ipwho.is/', {
          signal: AbortSignal.timeout(3000)
        })
        if (fallbackRes.ok) {
          const raw = await fallbackRes.json()
          if (raw?.country) {
            const geo: ClientGeo = {
              country: raw.country,
              country_code: raw.country_code,
              city: raw.city,
              latitude: raw.latitude,
              longitude: raw.longitude
            }
            sessionStorage.setItem(CACHED_USER_GEO, JSON.stringify(geo))
            applyClientGeoFallback(geo)
            return geo
          }
        }
      } catch {
        // ignore
      }

      return null
    }

    const initStats = async (retryAttempt = 0) => {
      const clientGeo = await fetchClientGeo()

      const country = clientGeo?.country || ''
      const countryCode = clientGeo?.country_code || ''
      const city = clientGeo?.city || ''
      const lat = clientGeo?.latitude ? parseFloat(String(clientGeo.latitude)) : undefined
      const lon = clientGeo?.longitude ? parseFloat(String(clientGeo.longitude)) : undefined

      try {
        if (retryAttempt === 0) {
          setConnectionStatus('connecting')
        }

        const updateDataWithJson = (json: any, userCountryHint?: string, userCityHint?: string, userCodeHint?: string) => {
          const finalCountry =
            (json.userCountry && json.userCountry !== 'Unknown' ? json.userCountry : '') ||
            userCountryHint ||
            country ||
            'Nigeria'
          const finalCode =
            (json.userCountryCode && json.userCountryCode !== 'UN' ? json.userCountryCode : '') ||
            userCodeHint ||
            countryCode ||
            'NG'
          const finalCity =
            (json.userCity && json.userCity !== 'Unknown' ? json.userCity : '') ||
            userCityHint ||
            city ||
            'Unknown'
          const serverTotal = typeof json.totalVisitors === 'number'
            ? json.totalVisitors
            : typeof json.total === 'number'
            ? json.total
            : 0

          const rawLocations = Array.isArray(json.locations) ? json.locations : []
          const cleanLocations = [...rawLocations]

          if (lat !== undefined && lon !== undefined && !Number.isNaN(lat) && !Number.isNaN(lon) && finalCountry !== 'Unknown') {
            const exists = cleanLocations.some(
              (l: any) => Math.abs(l.lat - lat) < 0.2 && Math.abs(l.lon - lon) < 0.2
            )
            if (!exists) {
              cleanLocations.push({
                city: finalCity !== 'Unknown' ? finalCity : finalCountry,
                country: finalCountry,
                countryCode: finalCode,
                lat,
                lon
              })
            }
          }

          setData((prev) => {
            const hasServerStats = json.countryStats && Object.keys(json.countryStats).length > 0
            const mergedStats: Record<string, number> = hasServerStats
              ? { ...json.countryStats }
              : { ...prev.countryStats }

            if (finalCountry && finalCountry !== 'Unknown' && !findCountryCount(finalCountry, mergedStats)) {
              mergedStats[finalCountry] = 1
            }

            const finalCountryCount =
              typeof json.userCountryCount === 'number' && json.userCountryCount > 0
                ? json.userCountryCount
                : findCountryCount(finalCountry, mergedStats) || 1

            const sumOfStats = Object.values(mergedStats).reduce((a, b) => Number(a) + Number(b), 0)
            const finalTotal = serverTotal > 0 ? Math.max(serverTotal, sumOfStats) : Math.max(prev.totalVisitors, sumOfStats, 1)

            const cleanTopCountries: TopCountry[] = Object.entries(mergedStats)
              .sort((a, b) => Number(b[1]) - Number(a[1]))
              .slice(0, 5)
              .map(([name, count], idx) => ({
                rank: idx + 1,
                name: name.toUpperCase(),
                code:
                  normalizeCountry(name) === normalizeCountry(finalCountry)
                    ? finalCode
                    : name.toUpperCase() === 'NIGERIA'
                    ? 'NG'
                    : name.toUpperCase() === 'UNITED STATES'
                    ? 'US'
                    : name.toUpperCase() === 'CANADA'
                    ? 'CA'
                    : 'UN',
                count: Number(count)
              }))

            const next: VisitorResponse = {
              ...prev,
              userCountry: finalCountry,
              userCountryCode: finalCode,
              userCity: finalCity,
              userCountryCount: finalCountryCount,
              totalVisitors: finalTotal,
              topCountries: cleanTopCountries,
              countryStats: mergedStats,
              locations: cleanLocations.length > 0 ? cleanLocations : prev.locations
            }
            try {
              localStorage.setItem(CACHED_STATS_KEY, JSON.stringify(next))
            } catch {
              // ignore
            }
            return next
          })
        }

        const isDeviceAlreadyLogged = localStorage.getItem(DEVICE_LOGGED_KEY) === 'true'

        if (isDeviceAlreadyLogged) {
          // Same device reloading: fetch read-only stats without logging a duplicate visit
          const res = await fetch(apiUrl('/api/visitors'), { signal: controller.signal })
          if (res.ok) {
            const json = await res.json()
            if (!controller.signal.aborted) {
              setConnectionStatus('connected')
              updateDataWithJson(json, country, city, countryCode)
            }
          } else if (retryAttempt < 8 && !controller.signal.aborted) {
            setConnectionStatus('connecting')
            retryTimerRef.current = setTimeout(() => initStats(retryAttempt + 1), 4500)
          } else if (!controller.signal.aborted) {
            setConnectionStatus('offline')
          }
        } else {
          const visitorId = getOrCreateVisitorId()
          const logPayload = {
            visitorId,
            ...(clientGeo ? { country, countryCode, city, lat, lon } : {})
          }

          const res = await fetch(apiUrl('/api/visitors/log'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logPayload),
            signal: controller.signal
          })

          if (res.ok) {
            const json = await res.json()
            try {
              localStorage.setItem(DEVICE_LOGGED_KEY, 'true')
            } catch {
              // ignore
            }
            if (!controller.signal.aborted) {
              setConnectionStatus('connected')
              updateDataWithJson(json, country, city, countryCode)
            }
          } else if (retryAttempt < 8 && !controller.signal.aborted) {
            setConnectionStatus('connecting')
            retryTimerRef.current = setTimeout(() => initStats(retryAttempt + 1), 4500)
          } else if (!controller.signal.aborted) {
            setConnectionStatus('offline')
          }
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        console.warn('Visitor sync note:', err)
        if (!controller.signal.aborted) {
          if (retryAttempt < 8) {
            setConnectionStatus('connecting')
            retryTimerRef.current = setTimeout(() => initStats(retryAttempt + 1), 4500)
          } else {
            setConnectionStatus('offline')
          }
        }
      }
    }

    initStats()

    // Keep visitor data always live: poll every 30s while page is visible
    const livePollingInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        void fetch(apiUrl('/api/visitors'), { signal: controller.signal })
          .then(async (res) => {
            if (res.ok) {
              const json = await res.json()
              if (!controller.signal.aborted) {
                setConnectionStatus('connected')
                setData((prev) => {
                  const serverTotal = typeof json.totalVisitors === 'number'
                    ? json.totalVisitors
                    : typeof json.total === 'number'
                    ? json.total
                    : prev.totalVisitors
                  const mergedStats: Record<string, number> = { ...prev.countryStats }
                  for (const [k, v] of Object.entries(json.countryStats || {})) {
                    const numVal = Number(v) || 0
                    const existingKey = Object.keys(mergedStats).find((ek) => normalizeCountry(ek) === normalizeCountry(k)) || k
                    mergedStats[existingKey] = Math.max(mergedStats[existingKey] || 0, numVal)
                  }
                  const finalTotal = Math.max(prev.totalVisitors, serverTotal, Object.values(mergedStats).reduce((a, b) => a + b, 0))
                  const rawLocations = Array.isArray(json.locations) ? json.locations : []
                  const next: VisitorResponse = {
                    ...prev,
                    totalVisitors: finalTotal,
                    userCountryCount: Math.max(prev.userCountryCount, findCountryCount(prev.userCountry, mergedStats) || 1),
                    countryStats: mergedStats,
                    locations: rawLocations.length > 0 ? rawLocations : prev.locations
                  }
                  try {
                    localStorage.setItem(CACHED_STATS_KEY, JSON.stringify(next))
                  } catch {
                    // ignore
                  }
                  return next
                })
              }
            }
          })
          .catch(() => {})
      }
    }, 30000)

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        void fetch(apiUrl('/api/visitors'), { signal: controller.signal })
          .then(async (res) => {
            if (res.ok) {
              const json = await res.json()
              if (!controller.signal.aborted) {
                setConnectionStatus('connected')
                setData((prev) => {
                  const serverTotal = typeof json.totalVisitors === 'number'
                    ? json.totalVisitors
                    : typeof json.total === 'number'
                    ? json.total
                    : prev.totalVisitors
                  return {
                    ...prev,
                    totalVisitors: Math.max(prev.totalVisitors, serverTotal)
                  }
                })
              }
            }
          })
          .catch(() => {})
      }
    }

    window.addEventListener('visibilitychange', handleVisibilityOrFocus)
    window.addEventListener('focus', handleVisibilityOrFocus)

    return () => {
      controller.abort()
      clearInterval(livePollingInterval)
      window.removeEventListener('visibilitychange', handleVisibilityOrFocus)
      window.removeEventListener('focus', handleVisibilityOrFocus)
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current)
    }
  }, [])

  const handlePinpointCity = useCallback(() => {
    setPinpointLoading(true)

    const finalizePinpoint = (city: string, country: string, countryCode: string, latitude: number, longitude: number) => {
      const newPinpoint = { city, lat: latitude, lon: longitude }
      setPinpointedData(newPinpoint)
      try {
        localStorage.setItem('portfolio_user_pinpoint_geo', JSON.stringify(newPinpoint))
      } catch {
        // ignore
      }

      setData((prev) => {
        const nextStats = { ...prev.countryStats }
        if (country && !findCountryCount(country, nextStats)) {
          nextStats[country] = 1
        }
        const userCount = findCountryCount(country, nextStats) || 1
        const nextTotal = Math.max(prev.totalVisitors, Object.values(nextStats).reduce((a, b) => a + b, 0), 1)
        const nextTop =
          prev.topCountries.length > 0
            ? prev.topCountries
            : Object.entries(nextStats)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([name, count], idx) => ({
                  rank: idx + 1,
                  name,
                  code: name === country ? countryCode : 'UN',
                  count
                }))

        return {
          ...prev,
          userCountry: country || prev.userCountry,
          userCountryCode: countryCode || prev.userCountryCode,
          userCity: city || prev.userCity,
          userCountryCount: Math.max(prev.userCountryCount, userCount),
          totalVisitors: nextTotal,
          topCountries: nextTop,
          countryStats: nextStats
        }
      })

      fetch(apiUrl('/api/visitors/log'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country, countryCode, city, lat: latitude, lon: longitude })
      }).catch(() => {})
    }

    const fallbackToIpPinpoint = async () => {
      try {
        const res = await fetch('https://get.geojs.io/v1/ip/geo.json', { signal: AbortSignal.timeout(4000) })
        if (res.ok) {
          const geo = (await res.json()) as ClientGeo
          const lat = geo.latitude ? parseFloat(String(geo.latitude)) : NaN
          const lon = geo.longitude ? parseFloat(String(geo.longitude)) : NaN
          if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
            finalizePinpoint(
              geo.city || data.userCity || 'Verified City',
              geo.country || data.userCountry || 'Nigeria',
              geo.country_code || data.userCountryCode || 'NG',
              lat,
              lon
            )
            setPinpointLoading(false)
            return
          }
        }
      } catch {
        // try secondary provider
      }

      try {
        const res2 = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(4000) })
        if (res2.ok) {
          const raw = await res2.json()
          const lat = typeof raw.latitude === 'number' ? raw.latitude : parseFloat(String(raw.latitude))
          const lon = typeof raw.longitude === 'number' ? raw.longitude : parseFloat(String(raw.longitude))
          if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
            finalizePinpoint(
              raw.city || data.userCity || 'Verified City',
              raw.country || data.userCountry || 'Nigeria',
              raw.country_code || data.userCountryCode || 'NG',
              lat,
              lon
            )
          }
        }
      } catch {
        // ignore
      } finally {
        setPinpointLoading(false)
      }
    }

    if (!navigator.geolocation) {
      void fallbackToIpPinpoint()
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          if (res.ok) {
            const geo = await res.json()
            const city = geo.city || geo.locality || data.userCity || 'Verified City'
            const country = geo.countryName || data.userCountry || 'Nigeria'
            const countryCode = geo.countryCode || data.userCountryCode || 'NG'
            finalizePinpoint(city, country, countryCode, latitude, longitude)
          } else {
            finalizePinpoint(data.userCity || 'Verified City', data.userCountry || 'Nigeria', data.userCountryCode || 'NG', latitude, longitude)
          }
        } catch {
          finalizePinpoint(data.userCity || 'Verified City', data.userCountry || 'Nigeria', data.userCountryCode || 'NG', latitude, longitude)
        } finally {
          setPinpointLoading(false)
        }
      },
      () => {
        void fallbackToIpPinpoint()
      },
      { timeout: 6000 }
    )
  }, [data.userCity, data.userCountry, data.userCountryCode])

  return {
    data,
    connectionStatus,
    pinpointedData,
    pinpointLoading,
    handlePinpointCity
  }
}

export default useVisitorStats
