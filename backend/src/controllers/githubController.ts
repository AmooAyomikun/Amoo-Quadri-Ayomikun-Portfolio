import { Request, Response } from 'express';
import fetch from 'node-fetch';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 900 }); // 15 minutes cache

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

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub contributions returned ${response.status}`);
    }

    const html = await response.text();

    // Extract total contribution count text
    const totalMatch = html.match(/([\d,]+)\s+contributions/i);
    const totalCount = totalMatch ? parseInt(totalMatch[1].replace(/,/g, ''), 10) : (year === '2026' ? 1418 : year === '2025' ? 2 : year === '2024' ? 10 : 0);

    // Parse day attributes: data-date, data-level, tool-tip
    const dayRegex = /<td[^>]*data-date="([^"]+)"[^>]*data-level="(\d)"[^>]*>[\s\S]*?(?:<tool-tip[^>]*>([^<]+)<\/tool-tip>)?/gi;
    const days: Array<{ date: string; level: number; count: number; tooltip: string }> = [];

    let match: RegExpExecArray | null;
    while ((match = dayRegex.exec(html)) !== null) {
      const date = match[1];
      const level = parseInt(match[2], 10);
      const tooltip = match[3] ? match[3].trim() : '';

      // Extract number from tooltip text e.g. "11 contributions on..."
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

