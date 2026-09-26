import { Request, Response } from 'express'
import { testimonialsData } from '../data/testimonialsData.js'

export const getTestimonials = (req: Request, res: Response): void => {
  const { category } = req.query

  if (category && (category === 'academic' || category === 'industry')) {
    const filtered = testimonialsData.filter(
      t => t.category === category || t.category === 'both'
    )
    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered
    })
    return
  }

  res.status(200).json({
    success: true,
    count: testimonialsData.length,
    data: testimonialsData
  })
}
