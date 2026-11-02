import { Request, Response, NextFunction } from 'express'
import { z, ZodSchema } from 'zod'

/**
 * Higher-order middleware to validate req.body against a Zod schema.
 * Rejects with a 400 Bad Request if validation fails.
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const issues = result.error.issues.map(i => ({
        field: i.path.join('.'),
        message: i.message
      }))
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: issues
      })
      return
    }
    // Replace req.body with parsed/sanitized data
    req.body = result.data
    next()
  }
}

// 1. News publishing schema (Protects against non-string crashes & stored XSS via javascript: URLs)
export const publishNewsSchema = z.object({
  title: z.string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  category: z.enum(['Research', 'Industry', 'Awards', 'Technical', 'General']).default('Research'),
  summary: z.string()
    .trim()
    .min(10, 'Summary must be at least 10 characters')
    .max(500, 'Summary cannot exceed 500 characters'),
  content: z.string()
    .trim()
    .min(20, 'Content must be at least 20 characters')
    .max(20000, 'Content cannot exceed 20,000 characters'),
  tags: z.array(z.string().trim().max(50)).max(10).optional().default(['News Update']),
  externalUrl: z.string()
    .trim()
    .url('Invalid external URL')
    .refine(
      url => {
        try {
          const parsed = new URL(url)
          return parsed.protocol === 'https:' || parsed.protocol === 'http:'
        } catch {
          return false
        }
      },
      { message: 'External URL must use http: or https: protocol (no javascript: allowed)' }
    )
    .optional()
    .nullable()
})

// 2. Contact message submission schema
export const contactMessageSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z.string()
    .trim()
    .email('Invalid email address')
    .max(120, 'Email cannot exceed 120 characters'),
  subject: z.string().trim().max(150, 'Subject cannot exceed 150 characters').optional().default('General Inquiry'),
  lens: z.string().trim().max(50, 'Lens cannot exceed 50 characters').optional().default('general'),
  message: z.string()
    .trim()
    .min(5, 'Message must be at least 5 characters')
    .max(3000, 'Message cannot exceed 3,000 characters')
})

// 3. Newsletter subscription schema
export const subscribeSchema = z.object({
  email: z.string()
    .trim()
    .email('Invalid email address')
    .max(120, 'Email cannot exceed 120 characters')
})

// 4. Guestbook signature schema
export const guestbookSignatureSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name cannot exceed 60 characters'),
  message: z.string()
    .trim()
    .min(2, 'Message must be at least 2 characters')
    .max(280, 'Message cannot exceed 280 characters'),
  signatureData: z.string()
    .max(500000, 'Signature data is too large (maximum 500KB)')
    .regex(/^data:image\/png;base64,[A-Za-z0-9+/=]+$/, 'Signature must be a valid PNG image data URL')
    .or(z.literal(''))
    .optional(),
  location: z.string().trim().max(80).optional(),
  avatar: z.string().trim().max(30).optional()
})

// 5. AI Chat input schema (Capped at 500 chars to prevent cost abuse)
export const aiChatSchema = z.object({
  message: z.string()
    .trim()
    .min(1, 'Message cannot be empty')
    .max(500, 'Message length must not exceed 500 characters')
})

// 6. Visitor log client hint schema (Strict boundary and type validation)
export const visitorLogSchema = z.object({
  country: z.string().trim().max(60).optional(),
  countryCode: z.string().trim().toUpperCase().max(3).optional(),
  city: z.string().trim().max(60).optional(),
  lat: z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90').optional().nullable(),
  lon: z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180').optional().nullable()
})

// 7. Admin login schema
export const adminLoginSchema = z.object({
  password: z.string().min(1, 'Password is required')
})
