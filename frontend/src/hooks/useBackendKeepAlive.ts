import { useEffect, useState } from 'react'
import { apiUrl } from '../lib/api'

export interface BackendHealthState {
  isOnline: boolean
  isWaking: boolean
}

/**
 * Background keep-alive and cold-start detector for Render free tier backend (Issue 5.5).
 * Immediately pings /api/health on mount to warm up the instance and detect wake-up latency.
 */
export function useBackendKeepAlive(): BackendHealthState {
  const [isOnline, setIsOnline] = useState(false)
  const [isWaking, setIsWaking] = useState(false)

  useEffect(() => {
    let wakingTimer: ReturnType<typeof setTimeout> | null = null
    const controller = new AbortController()

    const pingHealth = async () => {
      // If server does not respond within 2.5s, it is likely cold-starting on Render free tier
      wakingTimer = setTimeout(() => {
        setIsWaking(true)
      }, 2500)

      try {
        const res = await fetch(apiUrl('/api/health'), {
          signal: controller.signal
        })
        if (res.ok) {
          setIsOnline(true)
          setIsWaking(false)
        }
      } catch {
        // Handled silently - server may still be booting
      } finally {
        if (wakingTimer) clearTimeout(wakingTimer)
      }
    }

    void pingHealth()

    // Periodically ping every 10 minutes to prevent Render free-tier sleep while tab is active
    const keepAliveInterval = setInterval(() => {
      void fetch(apiUrl('/api/health'), { signal: controller.signal }).catch(() => {})
    }, 10 * 60 * 1000)

    return () => {
      if (wakingTimer) clearTimeout(wakingTimer)
      clearInterval(keepAliveInterval)
      controller.abort()
    }
  }, [])

  return { isOnline, isWaking }
}

export default useBackendKeepAlive
