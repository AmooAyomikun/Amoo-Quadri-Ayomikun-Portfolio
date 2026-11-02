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

    // 1. Primary: GitHub GraphQL API (Issue 3.8)
    const token = process.env.GITHUB_TOKEN
    if (token) {
      try {
        const now = new Date()
        let fromDate: string
        let toDate: string

        if (validYear === currentYear) {
          const oneYearAgo = new Date()
          oneYearAgo.setFullYear(now.getFullYear() - 1)
          fromDate = oneYearAgo.toISOString()
          toDate = now.toISOString()
        } else {
          fromDate = `${validYear}-01-01T00:00:00Z`
          toDate = `${validYear}-12-31T23:59:59Z`
        }

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
          if (calendar) {
            totalCount = calendar.totalContributions || 0
            if (Array.isArray(calendar.weeks)) {
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
            }

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
      } catch (gqlErr) {
        console.warn('[GithubService] GitHub GraphQL fetch error:', gqlErr)
      }
    }

    // 2. Reliable Fallback via GitHub REST API User Events (No brittle HTML scraping!) (Issue 3.8)
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
              dateCounts[d] = (dateCounts[d] || 0) + 1
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
    githubCache.set(cacheKey, fallbackResult)
    return fallbackResult
  }
}

export const githubService = new GithubService()
