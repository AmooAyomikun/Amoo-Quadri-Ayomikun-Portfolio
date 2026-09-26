import { Request, Response } from 'express';
import fetch from 'node-fetch';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 900 }); // 15 minutes cache

export const getGithubActivity = async (req: Request, res: Response): Promise<void> => {
  const username = process.env.GITHUB_USERNAME || 'Amoo-Quadri'; // Fallback to a placeholder
  const cacheKey = `github_events_${username}`;

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    res.json(cachedData);
    return;
  }

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    // Use PAT if available to avoid rate limits
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(`https://api.github.com/users/${username}/events/public`, { headers });
    
    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const events = await response.json();
    
    // Process and filter the events (e.g. only push events, PRs)
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
