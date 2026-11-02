import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { adminLogin, adminVerify, adminLogout } from '../controllers/adminController.js'
import { getContactMessages, deleteContactMessage } from '../controllers/contactController.js'
import { deleteNewsArticle } from '../controllers/newsController.js'
import { deleteGuestbookEntry } from '../controllers/guestbookController.js'
import { getSubscribers } from '../controllers/subscribeController.js'
import { requireAdmin } from '../middleware/adminAuth.js'
import { validateBody, adminLoginSchema } from '../middleware/validate.js'

const router = Router()

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many login attempts. Please wait 15 minutes before retrying.' },
  standardHeaders: true,
  legacyHeaders: false
})

router.post('/login', adminLoginLimiter, validateBody(adminLoginSchema), adminLogin)
router.post('/logout', adminLogout)
router.get('/verify', requireAdmin, adminVerify)
router.get('/messages', requireAdmin, getContactMessages)
router.delete('/messages/:id', requireAdmin, deleteContactMessage)
router.delete('/news/:id', requireAdmin, deleteNewsArticle)
router.delete('/guestbook/:id', requireAdmin, deleteGuestbookEntry)
router.get('/subscribers', requireAdmin, getSubscribers)

export default router
