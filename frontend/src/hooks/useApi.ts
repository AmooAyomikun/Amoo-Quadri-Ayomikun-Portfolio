import { useState, useEffect, useRef, useCallback } from 'react'

export interface UseApiOptions {
  immediate?: boolean
  retries?: number
  headers?: Record<string, string>
}

export interface UseApiResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Standardized data-fetching hook with request cancellation, exponential retry,
 * and unified error/loading state management (Issue 4.3).
 */
export function useApi<T>(
  url: string,
  options: UseApiOptions = {}
): UseApiResult<T> {
  const { immediate = true, retries = 1, headers = {} } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(immediate)
  const [error, setError] = useState<string | null>(null)

  // Track active abort controller
  const abortControllerRef = useRef<AbortController | null>(null)
  const headersRef = useRef(headers)
  headersRef.current = headers

  const executeFetch = useCallback(
    async (attempt = 0): Promise<void> => {
      // Cancel any ongoing fetch for this hook instance
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      const controller = new AbortController()
      abortControllerRef.current = controller

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...headersRef.current
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`)
        }

        const json = await response.json()
        setData(json)
        setError(null)
      } catch (err: unknown) {
        // If request was aborted on unmount or re-fetch, do not update state
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }

        if (attempt < retries) {
          // Exponential backoff retry
          setTimeout(() => {
            void executeFetch(attempt + 1)
          }, 300 * Math.pow(2, attempt))
          return
        }

        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        setError(message)
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    },
    [url, retries]
  )

  useEffect(() => {
    if (immediate) {
      void executeFetch()
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [immediate, executeFetch])

  const refetch = useCallback(async () => {
    await executeFetch(0)
  }, [executeFetch])

  return { data, loading, error, refetch }
}

export default useApi
