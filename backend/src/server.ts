import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'

import { env } from './config/env.js'
import apiRouter from './routes/index.js'
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
  'https://amoo-quadri-ayomikun-portfolio-fron.vercel.app',
  'https://amoo-quadri.vercel.app',
  'https://www.amoo-quadri.vercel.app',
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
    if (!origin) return callback(null, true)
    if (
      allowedOriginsSet.has(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.amooquadri.dev')
    ) {
      return callback(null, true)
    }
    return callback(null, false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key']
}))

// 5. Body Parser with 2MB payload limit
app.use(express.json({ limit: '2mb' }))

// 6. Mount Modular API Router (Issue 3.7: layered routes, services, repositories)
app.use('/api', apiRouter)

// 7. Global 404 and Error Handler returning JSON (Issue 2.6)
app.use(notFoundHandler)
app.use(globalErrorHandler)

// 8. Start server (only if executed directly as primary process, allows supertest in integration tests)
const isTestRun = process.env.NODE_ENV === 'test' || process.argv.some(a => a.includes('test') || a.includes('spec'))
const entryFile = process.argv[1] || ''
const isServerEntry = entryFile.endsWith('server.ts') || entryFile.endsWith('server.js')

if (!isTestRun && isServerEntry) {
  const server = app.listen(PORT, () => {
    console.log(`[INFO] Quadri Portfolio Backend Server listening on http://localhost:${PORT}`)
  })

  // Graceful shutdown handler (Issue 1.4)
  const shutdown = (signal: string) => {
    console.log(`\n[INFO] Received ${signal}. Starting graceful shutdown...`)
    server.close((err) => {
      if (err) {
        console.error('Error during server close:', err)
        process.exit(1)
      }
      console.log('[INFO] HTTP server closed. Inflight requests drained.')
      process.exit(0)
    })

    // Force exit if connections take too long to close
    setTimeout(() => {
      console.error('[WARN] Forcing server shutdown after 10s timeout.')
      process.exit(1)
    }, 10000).unref()
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

export default app
