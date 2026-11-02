import { Router } from 'express'
import { getNews, publishNews } from '../controllers/newsController.js'
import { requireAdmin } from '../middleware/adminAuth.js'
import { validateBody, publishNewsSchema } from '../middleware/validate.js'

const router = Router()

router.get('/', getNews)
router.post('/', requireAdmin, validateBody(publishNewsSchema), publishNews)

export default router
