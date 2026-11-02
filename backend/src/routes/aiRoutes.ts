import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { handleAiChat } from '../controllers/aiController.js'
import { validateBody, aiChatSchema } from '../middleware/validate.js'

const router = Router()

const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  message: { error: 'Too many chat requests, please try again in a few minutes.' },
  standardHeaders: true,
  legacyHeaders: false
})

router.post('/', chatLimiter, validateBody(aiChatSchema), handleAiChat)

export default router
