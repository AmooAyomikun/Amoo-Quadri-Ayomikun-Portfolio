import { Request, Response } from 'express'
import { checkAdminPassword, isAdminConfigured, issueAdminToken } from '../middleware/adminAuth.js'

export const adminLogin = (req: Request, res: Response): void => {
  if (!isAdminConfigured()) {
    res.status(503).json({ success: false, error: 'Admin access is not configured on the server.' })
    return
  }

  const { password } = req.body ?? {}
  if (!checkAdminPassword(password)) {
    res.status(401).json({ success: false, error: 'Invalid admin passphrase. Access denied.' })
    return
  }

  const { token, expiresAt } = issueAdminToken()

  // Set HTTP-only cookie for secure browser sessions (Item 2.10)
  res.cookie('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 8 * 3600 * 1000 // 8 hours
  })

  res.status(200).json({ success: true, token, expiresAt })
}

/** Reached only after requireAdmin, so a 200 means the token is valid. */
export const adminVerify = (_req: Request, res: Response): void => {
  res.status(200).json({ success: true })
}

export const adminLogout = (_req: Request, res: Response): void => {
  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  })
  res.status(200).json({ success: true, message: 'Admin session terminated successfully.' })
}
