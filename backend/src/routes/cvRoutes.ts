import { Router } from 'express'
import { cvData } from '../data/cvData.js'

const router = Router()

router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    data: cvData
  })
})

export default router
