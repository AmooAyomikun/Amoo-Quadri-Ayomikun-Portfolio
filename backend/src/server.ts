import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { submitContact } from './controllers/contactController.js'
import { getTestimonials } from './controllers/testimonialsController.js'
import { getPortfolioData } from './controllers/portfolioController.js'
import { getNews, publishNews } from './controllers/newsController.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'Amoo Quadri Portfolio API Backend',
    timestamp: new Date().toISOString()
  })
})

import { getGithubActivity } from './controllers/githubController.js'
import { logVisitor, getVisitors } from './controllers/visitorsController.js'
import { getSignatures, addSignature } from './controllers/guestbookController.js'

// API routes
app.get('/api/portfolio', getPortfolioData)
app.get('/api/testimonials', getTestimonials)
app.get('/api/news', getNews)
app.post('/api/news', publishNews)
app.post('/api/contact', submitContact)
app.get('/api/github-activity', getGithubActivity)
app.post('/api/visitors/log', logVisitor)
app.get('/api/visitors', getVisitors)
app.get('/api/guestbook', getSignatures)
app.post('/api/guestbook', addSignature)

// Proxy endpoint to bypass X-Frame-Options for live previews
app.get('/api/proxy', async (req, res) => {
  const targetUrl = req.query.url as string
  if (!targetUrl) {
    res.status(400).send('Missing url parameter')
    return
  }
  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    let html = await response.text()
    const urlObj = new URL(targetUrl)
    html = html.replace('<head>', `<head><base href="${urlObj.origin}">`)
    res.send(html)
  } catch (err) {
    res.status(500).send('Proxy error')
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Quadri Portfolio Backend Server listening on http://localhost:${PORT}`)
})

export default app
