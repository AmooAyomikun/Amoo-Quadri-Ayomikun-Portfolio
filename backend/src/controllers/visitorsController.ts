import { Request, Response } from 'express'
import { visitorService } from '../services/visitorService.js'

export const getVisitors = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await visitorService.getStats()
    res.status(200).json(stats)
  } catch (error) {
    console.error('[VisitorsController] Error fetching visitor stats:', error)
    res.status(500).json({ error: 'Failed to retrieve visitor statistics' })
  }
}

export const logVisitor = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawIp = req.ip || req.socket.remoteAddress || ''
    const stats = await visitorService.logVisitor(rawIp, req.body ?? {})
    res.status(200).json(stats)
  } catch (error) {
    console.error('[VisitorsController] Error logging visitor:', error)
    res.status(500).json({ error: 'Failed to record visitor location' })
  }
}
