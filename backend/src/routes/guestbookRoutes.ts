import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { getSignatures, addSignature } from '../controllers/guestbookController.js'
import { validateBody, guestbookSignatureSchema } from '../middleware/validate.js'

const router = Router()

const guestbookLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: { error: 'Too many guestbook submissions, please try again in a few minutes.' },
  standardHeaders: true,
  legacyHeaders: false
})

router.get('/', getSignatures)
router.post('/', guestbookLimiter, validateBody(guestbookSignatureSchema), addSignature)

export default router
