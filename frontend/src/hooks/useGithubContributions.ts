import { useState, useEffect, useMemo, useRef } from 'react'
import { format, subDays, startOfYear, endOfYear, eachDayOfInterval } from 'date-fns'
import { apiUrl } from '../lib/api'

export interface ContributionDay {
  date: Date
  dateStr: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export type ColorTheme = 'classic' | 'cyberpunk' | 'ocean' | 'sunset'

export interface GithubDayItem {
  date: string
  count?: number
  level?: number
}

export interface GithubApiResponse {
  username?: string
  totalContributions?: number
  days?: GithubDayItem[]
}

const currentYear = new Date().getFullYear()
export const DYNAMIC_YEARS = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3]

export function useGithubContributions() {
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [username, setUsername] = useState<string>('AmooAyomikun')
  const [realContributions, setRealContributions] = useState<{
    totalContributions: number
    daysMap: Record<string, { level: 0 | 1 | 2 | 3 | 4; count: number }>
  } | null>(null)

  const [colorTheme, setColorTheme] = useState<ColorTheme>('classic')
  const [includePrivate, setIncludePrivate] = useState(true)
  const [hoveredDay, setHoveredDay] = useState<{ day: ContributionDay; x: number; y: number } | null>(null)

  const abortRef = useRef<AbortController | null>(null)
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    abortRef.current = controller

    const fetchDirectPublicContributions = async (): Promise<boolean> => {
      try {
        const publicRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=${selectedYear}`, {
          signal: controller.signal
        })
        if (publicRes.ok) {
          const pubData = await publicRes.json()
          if (!controller.signal.aborted && Array.isArray(pubData?.contributions) && pubData.contributions.length > 0) {
            const map: Record<string, { level: 0 | 1 | 2 | 3 | 4; count: number }> = {}
            pubData.contributions.forEach((d: { date: string; count?: number; level?: number }) => {
              if (d.date) {
                map[d.date] = {
                  level: Math.min(4, Math.max(0, d.level || 0)) as 0 | 1 | 2 | 3 | 4,
                  count: d.count || 0
                }
              }
            })
            const total = typeof pubData.total?.[selectedYear] === 'number'
              ? pubData.total[selectedYear]
              : Object.values(map).reduce((a, b) => a + b.count, 0)

            setRealContributions({
              totalContributions: total,
              daysMap: map
            })
            return true
          }
        }
      } catch (e) {
        if (!(e instanceof DOMException && e.name === 'AbortError')) {
          console.debug('Direct public GitHub contributions fallback note:', e)
        }
      }
      return false
    }

    const fetchRealContributions = async (isRetry = false) => {
      try {
        const res = await fetch(apiUrl(`/api/github-contributions?year=${selectedYear}`), {
          signal: controller.signal
        })

        if (res.ok) {
          const data: GithubApiResponse = await res.json()
          if (data && !controller.signal.aborted) {
            if (data.username) {
              setUsername(data.username)
            }
            if (Array.isArray(data.days) && data.days.length > 0 && (data.totalContributions ?? 0) > 0) {
              const map: Record<string, { level: 0 | 1 | 2 | 3 | 4; count: number }> = {}
              data.days.forEach((d: GithubDayItem) => {
                if (d.date) {
                  map[d.date] = {
                    level: Math.min(4, Math.max(0, d.level || 0)) as 0 | 1 | 2 | 3 | 4,
                    count: d.count || 0
                  }
                }
              })
              setRealContributions({
                totalContributions: data.totalContributions ?? 0,
                daysMap: map
              })
              return
            } else {
              // If backend returned 0 contributions, verify with direct public API
              const recovered = await fetchDirectPublicContributions()
              if (recovered) return

              setRealContributions({
                totalContributions: data.totalContributions ?? 0,
                daysMap: {}
              })
            }
          }
        } else {
          const recovered = await fetchDirectPublicContributions()
          if (recovered) return
          if (!isRetry && !controller.signal.aborted) {
            retryTimerRef.current = setTimeout(() => fetchRealContributions(true), 2500)
          }
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        console.warn('Backend GitHub contributions unreachable, checking public fallback:', err)
        const recovered = await fetchDirectPublicContributions()
        if (recovered) return
        if (!isRetry && !controller.signal.aborted) {
          retryTimerRef.current = setTimeout(() => fetchRealContributions(true), 2500)
        }
      }
    }

    fetchRealContributions()

    return () => {
      controller.abort()
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current)
    }
  }, [selectedYear])

  const { contributionMatrix, totalContributions, monthLabels } = useMemo(() => {
    const today = new Date()
    let startDate: Date
    let endDate: Date

    if (selectedYear === currentYear) {
      endDate = today
      startDate = subDays(today, 364)
    } else {
      startDate = startOfYear(new Date(selectedYear, 0, 1))
      endDate = endOfYear(new Date(selectedYear, 0, 1))
    }

    const allDays = eachDayOfInterval({ start: startDate, end: endDate })
    const multiplier = includePrivate ? 1 : 0.65
    const baseTotal = realContributions ? realContributions.totalContributions : 0
    const displayTotal = Math.round(baseTotal * multiplier)

    const daysData: ContributionDay[] = allDays.map((d) => {
      const dateStr = format(d, 'yyyy-MM-dd')
      let level: 0 | 1 | 2 | 3 | 4 = 0
      let count = 0

      if (realContributions && realContributions.daysMap[dateStr]) {
        level = realContributions.daysMap[dateStr].level
        count = realContributions.daysMap[dateStr].count
        if (!includePrivate && level > 0) {
          level = Math.max(0, level - 1) as 0 | 1 | 2 | 3 | 4
          count = Math.max(0, Math.floor(count * 0.65))
        }
      }

      return { date: d, dateStr, count, level }
    })

    const columns: ContributionDay[][] = []
    let currentWeek: ContributionDay[] = []

    const firstDayOfWeek = startDate.getDay()
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({
        date: new Date(0),
        dateStr: '',
        count: -1,
        level: 0
      })
    }

    daysData.forEach((day) => {
      currentWeek.push(day)
      if (currentWeek.length === 7) {
        columns.push(currentWeek)
        currentWeek = []
      }
    })

    if (currentWeek.length > 0) {
      columns.push(currentWeek)
    }

    const months: { name: string; colIndex: number }[] = []
    let lastMonth = -1

    columns.forEach((col, colIdx) => {
      const validDay = col.find((d) => d.count !== -1)
      if (validDay) {
        const m = validDay.date.getMonth()
        if (m !== lastMonth) {
          months.push({
            name: format(validDay.date, 'MMM'),
            colIndex: colIdx
          })
          lastMonth = m
        }
      }
    })

    return {
      contributionMatrix: columns,
      totalContributions: displayTotal,
      monthLabels: months
    }
  }, [selectedYear, realContributions, includePrivate])

  const getLevelColor = (level: number, isEmptyPlaceholder: boolean) => {
    if (isEmptyPlaceholder) return 'transparent'

    if (colorTheme === 'cyberpunk') {
      switch (level) {
        case 0: return 'bg-[#112240] border border-[#233554]'
        case 1: return 'bg-[#0d3b43] border border-[#134e56]'
        case 2: return 'bg-[#165a65] border border-[#1f7583]'
        case 3: return 'bg-[#299d95] border border-[#37b8af]'
        case 4: return 'bg-[#64ffda] border border-[#9bfce5] shadow-[0_0_8px_rgba(100,255,218,0.5)]'
        default: return 'bg-[#112240]'
      }
    }

    if (colorTheme === 'ocean') {
      switch (level) {
        case 0: return 'bg-[#161B22] border border-neutral-900/60'
        case 1: return 'bg-[#0A3069] border border-[#0A3069]'
        case 2: return 'bg-[#0969DA] border border-[#0969DA]'
        case 3: return 'bg-[#54AEFF] border border-[#54AEFF]'
        case 4: return 'bg-[#80CCFF] border border-[#B6E3FF] shadow-[0_0_8px_rgba(84,174,255,0.4)]'
        default: return 'bg-[#161B22]'
      }
    }

    if (colorTheme === 'sunset') {
      switch (level) {
        case 0: return 'bg-[#161B22] border border-neutral-900/60'
        case 1: return 'bg-[#5C1D11] border border-[#5C1D11]'
        case 2: return 'bg-[#BD561D] border border-[#BD561D]'
        case 3: return 'bg-[#FA8900] border border-[#FA8900]'
        case 4: return 'bg-[#FFB703] border border-[#FFD000] shadow-[0_0_8px_rgba(255,183,3,0.4)]'
        default: return 'bg-[#161B22]'
      }
    }

    switch (level) {
      case 0: return 'bg-[#161B22] border border-neutral-900/60'
      case 1: return 'bg-[#0E4429] border border-[#0E4429]'
      case 2: return 'bg-[#006D32] border border-[#006D32]'
      case 3: return 'bg-[#26A641] border border-[#26A641]'
      case 4: return 'bg-[#39D353] border border-[#39D353] shadow-[0_0_8px_rgba(57,211,83,0.4)]'
      default: return 'bg-[#161B22]'
    }
  }

  return {
    username,
    selectedYear,
    setSelectedYear,
    colorTheme,
    setColorTheme,
    includePrivate,
    setIncludePrivate,
    contributionMatrix,
    totalContributions,
    monthLabels,
    hoveredDay,
    setHoveredDay,
    getLevelColor,
    dynamicYears: DYNAMIC_YEARS
  }
}

export default useGithubContributions
