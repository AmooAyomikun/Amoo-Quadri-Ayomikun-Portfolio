import { Request, Response } from 'express'
import { visitorService } from '../services/visitorService.js'

export const getVisitors = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await visitorService.getStats()
    res.status(200).json({
      success: true,
      totalVisitors: stats.total,
      ...stats
    })
  } catch (error) {
    console.error('[VisitorsController] Error fetching visitor stats:', error)
    res.status(500).json({ error: 'Failed to retrieve visitor statistics' })
  }
}

export const logVisitor = async (req: Request, res: Response): Promise<void> => {
  try {
    const forwarded = req.headers['x-forwarded-for']
    const rawIp = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '') ||
      req.ip ||
      req.socket.remoteAddress ||
      ''

    const edgeCountryCode = (req.headers['x-vercel-ip-country'] || req.headers['cf-ipcountry'] || '') as string
    const edgeCity = (req.headers['x-vercel-ip-city'] || '') as string
    const edgeLatStr = req.headers['x-vercel-ip-latitude'] as string | undefined
    const edgeLonStr = req.headers['x-vercel-ip-longitude'] as string | undefined

    const clientHint = {
      country: req.body?.country || undefined,
      countryCode: req.body?.countryCode || (edgeCountryCode && edgeCountryCode !== 'XX' ? edgeCountryCode.toUpperCase() : undefined),
      city: req.body?.city || (edgeCity ? decodeURIComponent(edgeCity) : undefined),
      lat: typeof req.body?.lat === 'number' ? req.body.lat : (edgeLatStr ? parseFloat(edgeLatStr) : undefined),
      lon: typeof req.body?.lon === 'number' ? req.body.lon : (edgeLonStr ? parseFloat(edgeLonStr) : undefined)
    }

    const { stats, resolvedCountry, resolvedCity, resolvedCode } = await visitorService.logVisitor(rawIp, clientHint)
    const userCountry = resolvedCountry || clientHint.country || ''
    const userCountryCount = userCountry ? (stats.countryStats[userCountry] || 1) : 1

    res.status(200).json({
      success: true,
      totalVisitors: stats.total,
      userCountry,
      userCountryCode: resolvedCode || clientHint.countryCode || '',
      userCity: resolvedCity || clientHint.city || '',
      userCountryCount,
      ...stats
    })
  } catch (error) {
    console.error('[VisitorsController] Error logging visitor:', error)
    res.status(500).json({ error: 'Failed to record visitor location' })
  }
}
