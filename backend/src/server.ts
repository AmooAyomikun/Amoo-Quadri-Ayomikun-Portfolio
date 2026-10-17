import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'

import { submitContact, getContactMessages, deleteContactMessage } from './controllers/contactController.js'
import { getTestimonials } from './controllers/testimonialsController.js'
import { getNews, publishNews, deleteNewsArticle } from './controllers/newsController.js'
import { getGithubContributions } from './controllers/githubController.js'
import { logVisitor, getVisitors } from './controllers/visitorsController.js'
import { getSignatures, addSignature, deleteGuestbookEntry } from './controllers/guestbookController.js'
import { handleAiChat } from './controllers/aiController.js'
import { adminLogin, adminVerify } from './controllers/adminController.js'
import { subscribeNewsletter, getSubscribers } from './controllers/subscribeController.js'
import { requireAdmin } from './middleware/adminAuth.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// 1. Strict CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://amooquadri.dev',
  'https://www.amooquadri.dev',
  process.env.FRONTEND_URL
].filter(Boolean) as string[]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com') ||
      origin.endsWith('.amooquadri.dev')
    ) {
      return callback(null, true)
    }
    return callback(new Error(`CORS blocked request from origin ${origin}`))
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key']
}))

// 2. Body Parser with sensible 2MB payload limit (Issue 2.4)
app.use(express.json({ limit: '2mb' }))

// 3. Rate Limiters (Issue 2.4)
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

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'Amoo Quadri Portfolio API Backend',
    timestamp: new Date().toISOString()
  })
})

// Admin Auth & Management Routes (Issue 2.1, 2.2, 3.7)
app.post('/api/admin/login', adminLoginLimiter, adminLogin)
app.get('/api/admin/verify', requireAdmin, adminVerify)
app.get('/api/admin/messages', requireAdmin, getContactMessages)
app.delete('/api/admin/messages/:id', requireAdmin, deleteContactMessage)
app.delete('/api/admin/news/:id', requireAdmin, deleteNewsArticle)
app.delete('/api/admin/guestbook/:id', requireAdmin, deleteGuestbookEntry)
app.get('/api/admin/subscribers', requireAdmin, getSubscribers)

// Testimonials
app.get('/api/testimonials', getTestimonials)

// News Routes (Issue 2.2 & 3.3 - Protected with requireAdmin)
app.get('/api/news', getNews)
app.post('/api/news', requireAdmin, publishNews)

// Contact & Subscription Routes (Issue 3.1 & 3.6)
app.post('/api/contact', contactLimiter, submitContact)
app.post('/api/subscribe', contactLimiter, subscribeNewsletter)

// GitHub Analytics
app.get('/api/github-contributions', getGithubContributions)

// Visitors & Geolocation (Issue 2.4 & Geolocation Fixes)
app.post('/api/visitors/log', visitorLimiter, logVisitor)
app.get('/api/visitors', getVisitors)

// Guestbook (Issue 2.6)
app.get('/api/guestbook', getSignatures)
app.post('/api/guestbook', guestbookLimiter, addSignature)

// AI Assistant Terminal (Issue 3.5)
app.post('/api/chat', chatLimiter, handleAiChat)

// Proxy endpoint for live preview frames with strict SSRF & CSP Protection (Issue 2.3)
app.get('/api/proxy', async (req, res) => {
  const targetUrl = req.query.url as string
  if (!targetUrl) {
    res.status(400).send('Missing url parameter')
    return
  }

  let urlObj: URL
  try {
    urlObj = new URL(targetUrl)
  } catch {
    res.status(400).send('Invalid target URL')
    return
  }

  // Only allow http & https
  if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
    res.status(400).send('Invalid URL protocol')
    return
  }

  const hostname = urlObj.hostname.toLowerCase()

  // SSRF Protection: Block private and internal IPs & cloud metadata addresses
  const isPrivateOrInternal = 
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname === '0.0.0.0' ||
    hostname === '169.254.169.254' ||
    hostname.startsWith('10.') ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('169.254.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname) ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.local')

  if (isPrivateOrInternal) {
    res.status(403).send('Forbidden: Access to internal or private resources is blocked.')
    return
  }

  // Allow verified portfolio preview domains
  const allowedHostSuffixes = [
    'github.io',
    'vercel.app',
    'netlify.app',
    'onrender.com',
    'amooquadri.dev',
    'amooquadri.com',
    'firebaseapp.com',
    'web.app'
  ]

  const isAllowedHost = allowedHostSuffixes.some(suffix => hostname === suffix || hostname.endsWith(`.${suffix}`))
  if (!isAllowedHost) {
    res.status(403).send('Forbidden: Proxy is restricted to verified portfolio demonstration domains.')
    return
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Portfolio-Proxy'
      },
      signal: AbortSignal.timeout(10000)
    })

    let html = await response.text()
    html = html.replace('<head>', `<head><base href="${urlObj.origin}">`)

    // Sandboxing and Content-Security-Policy to protect API origin
    res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; frame-ancestors *;")
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.send(html)
  } catch (err) {
    res.status(502).send('Proxy error: Unable to fetch remote preview.')
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Quadri Portfolio Backend Server listening on http://localhost:${PORT}`)
})

export default app
