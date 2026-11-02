import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('5000'),
  VISITOR_SALT: z.string().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  ADMIN_TOKEN_SECRET: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  ALLOWED_ORIGINS: z.string().optional(),
  FRONTEND_URL: z.string().optional(),
  ALLOWED_PROXY_HOSTS: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.NODE_ENV === 'production') {
    if (!data.VISITOR_SALT || data.VISITOR_SALT.length < 16) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['VISITOR_SALT'],
        message: 'CRITICAL SECURITY: VISITOR_SALT must be configured and at least 16 characters in production.'
      })
    }

    if (data.ADMIN_PASSWORD) {
      if (!data.ADMIN_TOKEN_SECRET || data.ADMIN_TOKEN_SECRET.length < 16) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['ADMIN_TOKEN_SECRET'],
          message: 'CRITICAL SECURITY: ADMIN_TOKEN_SECRET must be configured independently from password (min 16 chars) in production.'
        })
      } else if (data.ADMIN_TOKEN_SECRET === data.ADMIN_PASSWORD) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['ADMIN_TOKEN_SECRET'],
          message: 'CRITICAL SECURITY: ADMIN_TOKEN_SECRET must not match ADMIN_PASSWORD in production.'
        })
      }
    }
  }
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error('❌ Environment validation failed:')
  for (const issue of parsedEnv.error.issues) {
    console.error(` - [${issue.path.join('.')}]: ${issue.message}`)
  }
  if (process.env.NODE_ENV === 'production') {
    console.error('Server execution aborted due to invalid production security configuration.')
    process.exit(1)
  }
}

export const env = parsedEnv.success 
  ? parsedEnv.data 
  : {
      NODE_ENV: 'development' as const,
      PORT: process.env.PORT || '5000',
      VISITOR_SALT: process.env.VISITOR_SALT || 'dev-insecure-visitor-salt-key-32',
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
      ADMIN_TOKEN_SECRET: process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_PASSWORD || 'dev-insecure-admin-token-secret-32',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
      FRONTEND_URL: process.env.FRONTEND_URL,
      ALLOWED_PROXY_HOSTS: process.env.ALLOWED_PROXY_HOSTS,
    }
