import { Request, Response } from 'express'
import { cvData } from '../data/cvData.js'

export const getPortfolioData = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: cvData
  })
}
