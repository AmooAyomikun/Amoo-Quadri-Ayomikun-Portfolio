import { Request, Response } from 'express';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 }); // 1 minute cache to allow live updates

export const getGithubContributions = async (req: Request, res: Response): Promise<void> => {
  const username = process.env.GITHUB_USERNAME || 'AmooAyomikun';
  const currentYear = new Date().getFullYear().toString();
  const rawYear = req.query.year;
  const year = typeof rawYear === 'string' && /^\d{4}$/.test(rawYear.trim())
    ? rawYear.trim()
    : currentYear;
  const cacheKey = `github_contributions_${username}_${year}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    res.json(cached);
    return;
  }

  let totalCount = 0;
  const days: Array<{ date: string; level: number; count: number; tooltip: string }> = [];

  try {
    let usedGraphQL = false;

    // --- TRY GRAPHQL API FIRST (FOR PRIVATE CONTRIBUTIONS) ---
    if (process.env.GITHUB_TOKEN) {
      try {
        const now = new Date();
        const currentYear = now.getFullYear().toString();
        let fromDate, toDate;
        
        if (year === currentYear) {
          // Exactly 1 year back from today to avoid the 1-year GraphQL limit
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(now.getFullYear() - 1);
          fromDate = oneYearAgo.toISOString();
          toDate = now.toISOString();
        } else {
          fromDate = `${year}-01-01T00:00:00Z`;
          toDate = `${year}-12-31T23:59:59Z`;
        }

        const query = `
          query($userName: String!, $from: DateTime, $to: DateTime) {
            user(login: $userName){
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
        `;
        
        const graphqlRes = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Portfolio-App'
          },
          body: JSON.stringify({
            query,
            variables: {
              userName: username,
              from: fromDate,
              to: toDate
            }
          })
        });

        if (graphqlRes.ok) {
          const gqlData = (await graphqlRes.json()) as {
            data?: {
              user?: {
                contributionsCollection?: {
                  contributionCalendar: {
                    totalContributions: number;
                    weeks: Array<{ contributionDays: Array<{ contributionCount: number; date: string }> }>;
                  };
                };
              };
            };
          };
          if (gqlData.data?.user?.contributionsCollection) {
            const calendar = gqlData.data.user.contributionsCollection.contributionCalendar;
            totalCount = calendar.totalContributions;
            
            calendar.weeks.forEach((week: any) => {
              week.contributionDays.forEach((day: any) => {
                const count = day.contributionCount;
                const level = count > 8 ? 4 : count > 5 ? 3 : count > 2 ? 2 : count > 0 ? 1 : 0;
                days.push({
                  date: day.date,
                  level,
                  count,
                  tooltip: `${count} contributions on ${day.date}`
                });
              });
            });
            usedGraphQL = true;
          } else {
            console.error("GraphQL response missing data:", gqlData);
          }
        } else {
          console.error("GraphQL request failed:", await graphqlRes.text());
        }
      } catch (gqlErr) {
        console.warn('GraphQL fetch failed, falling back to HTML scraping', gqlErr);
      }
    }

    // --- FALLBACK TO HTML SCRAPING ---
    if (!usedGraphQL) {
      let url = `https://github.com/users/${username}/contributions`;
      const currentYearStr = new Date().getFullYear().toString();
      if (year !== currentYearStr) {
        url = `https://github.com/users/${username}/contributions?from=${year}-01-01&to=${year}-12-31`;
      }
      
      const dayRegex = /<td[^>]*data-date="([^"]+)"[^>]*data-level="(\d)"[^>]*>[\s\S]*?(?:<tool-tip[^>]*>([^<]+)<\/tool-tip>)?/gi;

      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        if (!response.ok) {
          console.warn(`GitHub contributions scraping returned ${response.status}`);
        } else {
          const html = await response.text();

          const totalMatch = html.match(/([\d,]+)\s+contributions/i);
          const parsedTotalCount = totalMatch ? parseInt(totalMatch[1].replace(/,/g, ''), 10) : 0;
          if (parsedTotalCount > totalCount) {
            totalCount = parsedTotalCount;
          }

          let match: RegExpExecArray | null;
          while ((match = dayRegex.exec(html)) !== null) {
            const date = match[1];
            const level = parseInt(match[2], 10);
            const tooltip = match[3] ? match[3].trim() : '';

            let count = 0;
            if (tooltip) {
              const countMatch = tooltip.match(/^(\d+)\s+contribution/i);
              if (countMatch) {
                count = parseInt(countMatch[1], 10);
              }
            } else if (level > 0) {
              count = level * 2;
            }

            days.push({ date, level, count, tooltip });
          }
        }
      } catch (scrapeErr) {
        console.warn('Failed to scrape HTML contributions:', scrapeErr);
      }
    }
    const result = {
      username,
      year: parseInt(year, 10),
      totalContributions: totalCount,
      days
    };

    cache.set(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.error('Error fetching contributions:', err);
    res.status(500).json({ error: 'Failed to fetch contribution data' });
  }
};

