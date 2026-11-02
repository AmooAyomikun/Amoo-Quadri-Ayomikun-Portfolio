import { Router } from 'express'
import adminRoutes from './adminRoutes.js'
import newsRoutes from './newsRoutes.js'
import contactRoutes from './contactRoutes.js'
import subscribeRoutes from './subscribeRoutes.js'
import guestbookRoutes from './guestbookRoutes.js'
import aiRoutes from './aiRoutes.js'
import visitorRoutes from './visitorRoutes.js'
import githubRoutes from './githubRoutes.js'
import proxyRoutes from './proxyRoutes.js'
import cvRoutes from './cvRoutes.js'
import { getTestimonials } from '../controllers/testimonialsController.js'

const apiRouter = Router()

// Health check
apiRouter.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'Amoo Quadri Portfolio API Backend',
    timestamp: new Date().toISOString()
  })
})

// Sub-routers
apiRouter.use('/admin', adminRoutes)
apiRouter.use('/news', newsRoutes)
apiRouter.use('/contact', contactRoutes)
apiRouter.use('/subscribe', subscribeRoutes)
apiRouter.use('/guestbook', guestbookRoutes)
apiRouter.use('/chat', aiRoutes)
apiRouter.use('/visitors', visitorRoutes)
apiRouter.use('/github-contributions', githubRoutes)
apiRouter.use('/proxy', proxyRoutes)
apiRouter.use('/cv', cvRoutes)

// Testimonials read-only route
apiRouter.get('/testimonials', getTestimonials)

export default apiRouter
