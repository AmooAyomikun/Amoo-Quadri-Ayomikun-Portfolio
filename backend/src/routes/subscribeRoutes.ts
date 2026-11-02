import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { subscribeNewsletter, unsubscribeNewsletter } from '../controllers/subscribeController.js'
import { validateBody, subscribeSchema } from '../middleware/validate.js'

const router = Router()

const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many subscription requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
})

router.post('/', subscribeLimiter, validateBody(subscribeSchema), subscribeNewsletter)
router.post('/unsubscribe', unsubscribeNewsletter)
router.get('/unsubscribe', unsubscribeNewsletter)

export default router
