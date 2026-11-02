import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'

import { env } from './config/env.js'
import { submitContact, getContactMessages, deleteContactMessage } from './controllers/contactController.js'
import { getTestimonials } from './controllers/testimonialsController.js'
import { getNews, publishNews, deleteNewsArticle } from './controllers/newsController.js'
import { getGithubContributions } from './controllers/githubController.js'
import { logVisitor, getVisitors } from './controllers/visitorsController.js'
import { getSignatures, addSignature, deleteGuestbookEntry } from './controllers/guestbookController.js'
import { handleAiChat } from './controllers/aiController.js'
import { adminLogin, adminVerify, adminLogout } from './controllers/adminController.js'
import { subscribeNewsletter, getSubscribers } from './controllers/subscribeController.js'
import { requireAdmin } from './middleware/adminAuth.js'
import {
  validateBody,
  publishNewsSchema,
  contactMessageSchema,
  subscribeSchema,
  guestbookSignatureSchema,
  aiChatSchema,
  visitorLogSchema,
  adminLoginSchema
} from './middleware/validate.js'
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandlers.js'

const app = express()
const PORT = env.PORT

// 1. Trust proxy: enabled for accurate client IP resolution behind reverse proxies (Render, Cloudflare) (Issue 2.2)
app.set('trust proxy', 1)

// 2. HTTP Security headers and response compression (Issue 2.8)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))
app.use(compression())

// 3. Cookie parser for httpOnly admin token support (Issue 2.10)
app.use(cookieParser())

// 4. Strict CORS configuration without wildcards (Issue 2.6 & 2.7)
const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://amooquadri.dev',
  'https://www.amooquadri.dev'
]

const envOrigins = (env.ALLOWED_ORIGINS || env.FRONTEND_URL || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean)

const allowedOriginsSet = new Set([...defaultAllowedOrigins, ...envOrigins])

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests or same-origin server requests
    if (!origin) return callback(null, true)
    if (allowedOriginsSet.has(origin)) {
      return callback(null, true)
    }
    // Issue 2.6: Return callback(null, false) so blocked origins do not trigger an HTML 500 error page
    return callback(null, false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key']
}))

// 5. Body Parser with 2MB payload limit
app.use(express.json({ limit: '2mb' }))

// 6. Rate Limiters (backed by trusted req.ip from trust proxy) (Issue 2.2 & 2.5)
const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  message: { error: 'Too many chat requests, please try again in a few minutes.' },
  standardHeaders: true,
  legacyHeaders: false
})

const guestbookLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: { error: 'Too many guestbook submissions, please try again in a few minutes.' },
  standardHeaders: true,
  legacyHeaders: false
})

const visitorLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 45,
  message: { error: 'Too many visitor logs from this IP.' },
  standardHeaders: true,
  legacyHeaders: false
})

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many messages sent. Please wait a few minutes before trying again.' },
  standardHeaders: true,
  legacyHeaders: false
})

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many login attempts. Please wait 15 minutes before retrying.' },
  standardHeaders: true,
  legacyHeaders: false
})

// 7. Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'Amoo Quadri Portfolio API Backend',
    timestamp: new Date().toISOString()
  })
})

// 8. Admin Auth & Management Routes (Issue 2.4, 2.9, 2.10)
app.post('/api/admin/login', adminLoginLimiter, validateBody(adminLoginSchema), adminLogin)
app.post('/api/admin/logout', adminLogout)
app.get('/api/admin/verify', requireAdmin, adminVerify)
app.get('/api/admin/messages', requireAdmin, getContactMessages)
app.delete('/api/admin/messages/:id', requireAdmin, deleteContactMessage)
app.delete('/api/admin/news/:id', requireAdmin, deleteNewsArticle)
app.delete('/api/admin/guestbook/:id', requireAdmin, deleteGuestbookEntry)
app.get('/api/admin/subscribers', requireAdmin, getSubscribers)

// 9. Testimonials (Legacy / Archived read-only)
app.get('/api/testimonials', getTestimonials)

// 10. News Routes with Zod schema validation (Issue 2.4)
app.get('/api/news', getNews)
app.post('/api/news', requireAdmin, validateBody(publishNewsSchema), publishNews)

// 11. Contact & Subscription Routes with Zod validation (Issue 2.4 & 2.8)
app.post('/api/contact', contactLimiter, validateBody(contactMessageSchema), submitContact)
app.post('/api/subscribe', contactLimiter, validateBody(subscribeSchema), subscribeNewsletter)

// 12. GitHub Analytics
app.get('/api/github-contributions', getGithubContributions)

// 13. Visitors & Geolocation with Zod bounds validation (Issue 2.2 & 2.3)
app.post('/api/visitors/log', visitorLimiter, validateBody(visitorLogSchema), logVisitor)
app.get('/api/visitors', getVisitors)

// 14. Guestbook with Zod validation (Issue 2.4)
app.get('/api/guestbook', getSignatures)
app.post('/api/guestbook', guestbookLimiter, validateBody(guestbookSignatureSchema), addSignature)

// 15. AI Assistant Terminal with Zod length cap & rate limiting (Issue 2.4 & 2.5)
app.post('/api/chat', chatLimiter, validateBody(aiChatSchema), handleAiChat)

// 16. Secure Proxy endpoint for live preview frames with strict SSRF & Hop Re-validation (Issue 2.1)
const ALLOWED_DEMO_HOSTS = new Set([
  'cleanreport-frontend.vercel.app',
  ...(env.ALLOWED_PROXY_HOSTS ? env.ALLOWED_PROXY_HOSTS.split(',').map(h => h.trim().toLowerCase()) : [])
])

function isPrivateOrInternalHost(hostname: string): boolean {
  const h = hostname.toLowerCase()
  return (
    h === 'localhost' ||
    h === '127.0.0.1' ||
    h === '::1' ||
    h === '0.0.0.0' ||
    h === '169.254.169.254' ||
    h.startsWith('10.') ||
    h.startsWith('192.168.') ||
    h.startsWith('169.254.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(h) ||
    h.endsWith('.internal') ||
    h.endsWith('.local')
  )
}

app.get('/api/proxy', async (req, res) => {
  const targetUrl = req.query.url as string
  if (!targetUrl || typeof targetUrl !== 'string') {
    res.status(400).json({ error: 'Missing or invalid url query parameter' })
    return
  }

  let urlObj: URL
  try {
    urlObj = new URL(targetUrl)
  } catch {
    res.status(400).json({ error: 'Invalid target URL format' })
    return
  }

  // Only allow http and https
  if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
    res.status(400).json({ error: 'Invalid URL protocol: only http and https are permitted' })
    return
  }

  const initialHost = urlObj.hostname.toLowerCase()

  // Strict allowlist: only exact pre-approved demo hostnames (Issue 2.1)
  if (!ALLOWED_DEMO_HOSTS.has(initialHost) || isPrivateOrInternalHost(initialHost)) {
    res.status(403).json({ error: 'Forbidden: Proxy is restricted to approved portfolio demo hostnames.' })
    return
  }

  try {
    let currentUrl = targetUrl
    // Manual redirect handling: fetch will NOT follow 301/302 redirects automatically to prevent SSRF bypass (Issue 2.1)
    let response = await fetch(currentUrl, {
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Portfolio-Proxy'
      },
      signal: AbortSignal.timeout(10000)
    })

    // Re-validate each redirect hop strictly against allowed hosts and private IP blocks (Issue 2.1)
    let redirectCount = 0
    const maxRedirects = 3
    while ([301, 302, 303, 307, 308].includes(response.status) && redirectCount < maxRedirects) {
      redirectCount++
      const locationHeader = response.headers.get('location')
      if (!locationHeader) break

      const nextUrl = new URL(locationHeader, currentUrl)
      const nextHost = nextUrl.hostname.toLowerCase()

      if (
        (nextUrl.protocol !== 'http:' && nextUrl.protocol !== 'https:') ||
        !ALLOWED_DEMO_HOSTS.has(nextHost) ||
        isPrivateOrInternalHost(nextHost)
      ) {
        res.status(403).json({ error: 'Forbidden: Redirect target is not an approved demo host.' })
        return
      }

      currentUrl = nextUrl.href
      response = await fetch(currentUrl, {
        redirect: 'manual',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Portfolio-Proxy'
        },
        signal: AbortSignal.timeout(10000)
      })
    }

    if (!response.ok && response.status >= 400) {
      res.status(response.status).json({ error: `Remote demo returned HTTP status ${response.status}` })
      return
    }

    let html = await response.text()
    const injectedScript = `
<script>
  try {
    Object.defineProperty(navigator, 'serviceWorker', {
      value: undefined,
      configurable: true
    });
  } catch(e) {}
  if (window.location.pathname.startsWith('/api/proxy')) {
    try {
      window.history.replaceState(null, '', window.location.origin + ${JSON.stringify(urlObj.pathname || '/')});
    } catch(e) {}
  }
</script>
`
    html = html.replace('<head>', `<head>${injectedScript}`)
    html = html.replaceAll('src="/', `src="${urlObj.origin}/`)
    html = html.replaceAll('href="/', `href="${urlObj.origin}/`)

    // Restrict frame-ancestors to own domain and local dev only (Issue 2.1)
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; frame-ancestors 'self' https://amooquadri.dev https://www.amooquadri.dev http://localhost:5173 http://localhost:3000;"
    )
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.type('html').send(html)
  } catch {
    res.status(502).json({ error: 'Proxy error: Unable to fetch remote demo preview.' })
  }
})

// 17. 404 handler and Global Error Handler returning JSON (Issue 2.6)
app.use(notFoundHandler)
app.use(globalErrorHandler)

// 18. Start server
app.listen(PORT, () => {
  console.log(`🚀 Quadri Portfolio Backend Server listening on http://localhost:${PORT}`)
})

export default app
