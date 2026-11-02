import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { submitContact } from '../controllers/contactController.js'
import { validateBody, contactMessageSchema } from '../middleware/validate.js'

const router = Router()

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many messages sent. Please wait a few minutes before trying again.' },
  standardHeaders: true,
  legacyHeaders: false
})

router.post('/', contactLimiter, validateBody(contactMessageSchema), submitContact)

export default router
