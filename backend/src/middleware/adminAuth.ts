import crypto from 'crypto'
import { Request, Response, NextFunction } from 'express'

/**
 * Minimal stateless admin auth.
 *
 * - ADMIN_PASSWORD   : the passphrase you type on /admin (set on Render, never in the frontend)
 * - ADMIN_TOKEN_SECRET: random string used to sign session tokens (falls back to ADMIN_PASSWORD)
 *
 * If ADMIN_PASSWORD is not set, admin login is disabled (fails closed).
 */

const TOKEN_TTL_MS = 1000 * 60 * 60 * 8 // 8 hours

const getSecret = (): string =>
  process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_PASSWORD || ''

const sign = (payload: string, secret: string): string =>
  crypto.createHmac('sha256', secret).update(payload).digest('base64url')

const safeEqual = (a: string, b: string): boolean => {
  const ha = crypto.createHash('sha256').update(a).digest()
  const hb = crypto.createHash('sha256').update(b).digest()
  return crypto.timingSafeEqual(ha, hb)
}

export const isAdminConfigured = (): boolean =>
  Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.trim().length > 0)

export const checkAdminPassword = (input: unknown): boolean => {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected || typeof input !== 'string') return false
  return safeEqual(input, expected)
}

export const issueAdminToken = (): { token: string; expiresAt: number } => {
  const secret = getSecret()
  if (!secret) throw new Error('Admin auth not configured')
  const expiresAt = Date.now() + TOKEN_TTL_MS
  const payload = Buffer.from(JSON.stringify({ role: 'admin', exp: expiresAt })).toString('base64url')
  return { token: `${payload}.${sign(payload, secret)}`, expiresAt }
}

export const verifyAdminToken = (token: string | undefined): boolean => {
  const secret = getSecret()
  if (!secret || !token) return false
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false
  if (!safeEqual(signature, sign(payload, secret))) return false
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    return data.role === 'admin' && typeof data.exp === 'number' && data.exp > Date.now()
  } catch {
    return false
  }
}

const extractBearer = (req: Request): string | undefined => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) return undefined
  return header.slice('Bearer '.length).trim()
}

/** Express middleware: rejects the request unless a valid admin token is supplied. */
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!isAdminConfigured()) {
    res.status(503).json({ success: false, error: 'Admin access is not configured on the server.' })
    return
  }
  if (!verifyAdminToken(extractBearer(req))) {
    res.status(401).json({ success: false, error: 'Unauthorized: valid admin session required.' })
    return
  }
  next()
}
