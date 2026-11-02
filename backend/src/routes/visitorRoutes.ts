import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { getVisitors, logVisitor } from '../controllers/visitorsController.js'
import { validateBody, visitorLogSchema } from '../middleware/validate.js'

const router = Router()

const visitorLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 45,
  message: { error: 'Too many visitor logs from this IP.' },
  standardHeaders: true,
  legacyHeaders: false
})

router.get('/', getVisitors)
router.post('/log', visitorLimiter, validateBody(visitorLogSchema), logVisitor)

export default router
