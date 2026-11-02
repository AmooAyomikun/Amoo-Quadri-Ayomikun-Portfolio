import { Request, Response, NextFunction } from 'express'

/**
 * 404 Handler: Catches unmatched routes and returns clean JSON
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.path} - Endpoint not found`
  })
}

/**
 * Global Error Handler: Catches any unhandled errors and returns JSON response
 */
export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const status = typeof err?.status === 'number' && err.status >= 400 && err.status < 600
    ? err.status
    : 500

  // Log the error safely without leaking internal secrets
  console.error(`[Server Error] [Status ${status}]:`, err?.message || err)

  // In production, mask internal 500 errors to avoid leaking implementation details, stack traces or DB errors
  const isProd = process.env.NODE_ENV === 'production'
  const message = (status === 500 && isProd)
    ? 'An unexpected internal server error occurred.'
    : (err?.message || 'An unexpected internal server error occurred.')

  res.status(status).json({
    success: false,
    error: message
  })
}
