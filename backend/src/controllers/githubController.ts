import { Request, Response } from 'express';
import fetch from 'node-fetch';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 }); // 1 minute cache to allow live updates

export const getGithubActivity = async (req: Request, res: Response): Promise<void> => {
  const username = 'AmooAyomikun';
  const cacheKey = `github_events_${username}`;

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    res.json(cachedData);
    return;
  }

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-App'
    };
    
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(`https://api.github.com/users/${username}/events/public`, { headers });
    
    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const events = await response.json();
    
    const formattedEvents = (events as any[])
      .filter(event => ['PushEvent', 'PullRequestEvent', 'CreateEvent'].includes(event.type))
      .slice(0, 10)
      .map(event => {
        return {
          id: event.id,
          type: event.type,
          repo: event.repo.name,
          date: event.created_at,
          payload: event.payload
        };
      });

    const data = {
      username,
      events: formattedEvents
    };

    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching GitHub activity:', error);
    res.status(500).json({ error: 'Failed to fetch GitHub activity' });
  }
};

export const getGithubContributions = async (req: Request, res: Response): Promise<void> => {
  const username = 'AmooAyomikun';
  const year = (req.query.year as string) || '2026';
  const cacheKey = `github_contributions_${username}_${year}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    res.json(cached);
    return;
  }

  try {
    let url = `https://github.com/users/${username}/contributions`;
    if (year !== '2026') {
      url = `https://github.com/users/${username}/contributions?from=${year}-01-01&to=${year}-12-31`;
    }
    
    let totalCount = (year === '2026' ? 1418 : year === '2025' ? 2 : year === '2024' ? 10 : 0);

    // Parse day attributes: data-date, data-level, tool-tip
    const dayRegex = /<td[^>]*data-date="([^"]+)"[^>]*data-level="(\d)"[^>]*>[\s\S]*?(?:<tool-tip[^>]*>([^<]+)<\/tool-tip>)?/gi;
    const days: Array<{ date: string; level: number; count: number; tooltip: string }> = [];

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

        // Extract total contribution count text
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

    // --- LIVE UPDATE AUGMENTATION ---
    // GitHub's HTML contribution graph is heavily cached.
    // To show "live" updates immediately (like a push that just happened),
    // we fetch the user's public events API (which updates instantly) and augment the current day's data!
    try {
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-App'
      };
      if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
      }
      const eventsRes = await fetch(`https://api.github.com/users/${username}/events/public`, { headers });
      if (eventsRes.ok) {
        const events = await eventsRes.json();
        
        // Group events by date (YYYY-MM-DD)
        const recentCounts: Record<string, number> = {};
        (events as any[]).forEach(event => {
          if (['PushEvent', 'PullRequestEvent', 'CreateEvent', 'IssuesEvent'].includes(event.type)) {
            const dateStr = event.created_at.split('T')[0];
            recentCounts[dateStr] = (recentCounts[dateStr] || 0) + 1;
          }
        });

        // Augment our parsed days
        days.forEach(day => {
          if (recentCounts[day.date]) {
            // If the live events show more contributions than the cached HTML graph, update it!
            if (recentCounts[day.date] > day.count) {
              const diff = recentCounts[day.date] - day.count;
              day.count = recentCounts[day.date];
              day.level = day.count > 8 ? 4 : day.count > 5 ? 3 : day.count > 2 ? 2 : 1;
              day.tooltip = `${day.count} contributions on ${day.date} (Live)`;
              totalCount += diff; // Add the missing ones to the total!
            }
          }
        });
      }
    } catch (augmentErr) {
      console.error('Failed to augment with live events:', augmentErr);
    }
    // --- END LIVE UPDATE AUGMENTATION ---

    const result = {
      username,
      year: parseInt(year, 10),
      totalContributions: totalCount,
      days
    };

    cache.set(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.error('Error fetching contributions HTML:', err);
    res.status(500).json({ error: 'Failed to fetch contribution data' });
  }
};

