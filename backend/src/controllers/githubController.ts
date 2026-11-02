import { Request, Response } from 'express'
import { githubService } from '../services/githubService.js'

export const getGithubContributions = async (req: Request, res: Response): Promise<void> => {
  try {
    const username = process.env.GITHUB_USERNAME || 'AmooAyomikun'
    const currentYear = new Date().getFullYear().toString()
    const rawYear = req.query.year
    const year = typeof rawYear === 'string' && /^\d{4}$/.test(rawYear.trim())
      ? rawYear.trim()
      : currentYear

    const result = await githubService.getContributions(username, year)
    res.status(200).json(result)
  } catch (error) {
    console.error('[GithubController] Error retrieving contributions:', error)
    res.status(500).json({ error: 'Failed to fetch contribution data' })
  }
}
