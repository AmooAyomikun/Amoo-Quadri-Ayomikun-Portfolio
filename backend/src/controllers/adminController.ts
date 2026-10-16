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
  res.status(200).json({ success: true, token, expiresAt })
}

/** Reached only after requireAdmin, so a 200 means the token is valid. */
export const adminVerify = (_req: Request, res: Response): void => {
  res.status(200).json({ success: true })
}
