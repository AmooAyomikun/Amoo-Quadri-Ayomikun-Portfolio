import NodeCache from 'node-cache'

// Cache contributions for 1 hour (3600s) instead of aggressive 1 minute (Issue 3.8)
const githubCache = new NodeCache({ stdTTL: 3600 })

export interface ContributionDay {
  date: string
  level: number
  count: number
  tooltip: string
}

export interface ContributionResult {
  username: string
  year: number
  totalContributions: number
  days: ContributionDay[]
}

export class GithubService {
  async getContributions(username: string, year: string): Promise<ContributionResult> {
    const currentYear = new Date().getFullYear().toString()
    const validYear = /^\d{4}$/.test(year) ? year : currentYear
    const cacheKey = `github_contributions_${username}_${validYear}`

    const cached = githubCache.get<ContributionResult>(cacheKey)
    if (cached) {
      return cached
    }

    let totalCount = 0
    const days: ContributionDay[] = []

    // 1. Primary: GitHub GraphQL API
    const token = process.env.GITHUB_TOKEN
    if (token) {
      try {
        const fromDate = `${validYear}-01-01T00:00:00Z`
        const toDate = `${validYear}-12-31T23:59:59Z`

        const query = `
          query($userName: String!, $from: DateTime, $to: DateTime) {
            user(login: $userName) {
              contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                    }
                  }
                }
              }
            }
          }
        `

        const graphqlRes = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Amoo-Quadri-Portfolio'
          },
          body: JSON.stringify({
            query,
            variables: {
              userName: username,
              from: fromDate,
              to: toDate
            }
          }),
          signal: AbortSignal.timeout(6000)
        })

        if (graphqlRes.ok) {
          const gqlData = (await graphqlRes.json()) as any
          const calendar = gqlData?.data?.user?.contributionsCollection?.contributionCalendar
          if (calendar && Array.isArray(calendar.weeks) && calendar.weeks.length > 0) {
            totalCount = calendar.totalContributions || 0
            for (const week of calendar.weeks) {
              if (Array.isArray(week.contributionDays)) {
                for (const day of week.contributionDays) {
                  const count = day.contributionCount || 0
                  const level = count > 8 ? 4 : count > 5 ? 3 : count > 2 ? 2 : count > 0 ? 1 : 0
                  days.push({
                    date: day.date,
                    level,
                    count,
                    tooltip: `${count} contributions on ${day.date}`
                  })
                }
              }
            }

            if (totalCount > 0 || days.length > 0) {
              const result: ContributionResult = {
                username,
                year: parseInt(validYear, 10),
                totalContributions: totalCount,
                days
              }
              githubCache.set(cacheKey, result)
              return result
            }
          }
        }
      } catch (gqlErr) {
        console.warn('[GithubService] GitHub GraphQL fetch error:', gqlErr)
      }
    }

    // 2. High-reliability Public Contributions API Fallback
    try {
      const publicApiRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=${validYear}`, {
        headers: { 'User-Agent': 'Amoo-Quadri-Portfolio' },
        signal: AbortSignal.timeout(5000)
      })

      if (publicApiRes.ok) {
        const pubData = await publicApiRes.json() as any
        const pubContributions = pubData?.contributions
        if (Array.isArray(pubContributions) && pubContributions.length > 0) {
          const pubTotal = pubData?.total?.[validYear] ?? pubContributions.reduce((acc: number, cur: any) => acc + (cur.count || 0), 0)
          const pubDays: ContributionDay[] = pubContributions.map((c: any) => ({
            date: c.date,
            level: Math.min(4, Math.max(0, c.level || 0)),
            count: c.count || 0,
            tooltip: `${c.count || 0} contributions on ${c.date}`
          }))

          const result: ContributionResult = {
            username,
            year: parseInt(validYear, 10),
            totalContributions: pubTotal,
            days: pubDays
          }
          githubCache.set(cacheKey, result)
          return result
        }
      }
    } catch (pubErr) {
      console.warn('[GithubService] Public contributions API error:', pubErr)
    }

    // 3. Fallback via GitHub REST API User Events
    try {
      const restRes = await fetch(`https://api.github.com/users/${username}/events/public`, {
        headers: {
          'User-Agent': 'Amoo-Quadri-Portfolio',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        signal: AbortSignal.timeout(5000)
      })

      if (restRes.ok) {
        const events = await restRes.json() as any[]
        const dateCounts: Record<string, number> = {}

        if (Array.isArray(events)) {
          for (const ev of events) {
            if (ev.created_at) {
              const d = ev.created_at.split('T')[0]
              if (d.startsWith(validYear)) {
                dateCounts[d] = (dateCounts[d] || 0) + 1
              }
            }
          }
        }

        totalCount = Object.values(dateCounts).reduce((a, b) => a + b, 0)
        for (const [date, count] of Object.entries(dateCounts)) {
          const level = count > 8 ? 4 : count > 5 ? 3 : count > 2 ? 2 : count > 0 ? 1 : 0
          days.push({
            date,
            level,
            count,
            tooltip: `${count} contributions on ${date}`
          })
        }

        if (totalCount > 0) {
          const result: ContributionResult = {
            username,
            year: parseInt(validYear, 10),
            totalContributions: totalCount,
            days
          }
          githubCache.set(cacheKey, result)
          return result
        }
      }
    } catch (restErr) {
      console.warn('[GithubService] GitHub REST events fallback error:', restErr)
    }

    const fallbackResult: ContributionResult = {
      username,
      year: parseInt(validYear, 10),
      totalContributions: totalCount,
      days
    }
    // Only cache successful results, or cache empty failures for at most 15 seconds
    githubCache.set(cacheKey, fallbackResult, 15)
    return fallbackResult
  }
}

export const githubService = new GithubService()
