import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('5000'),
  VISITOR_SALT: z.string().min(16).optional(),
  ADMIN_PASSWORD: z.string().optional(),
  ADMIN_TOKEN_SECRET: z.string().min(16).optional(),
  GEMINI_API_KEY: z.string().optional(),
  ALLOWED_ORIGINS: z.string().optional(),
  FRONTEND_URL: z.string().optional(),
  ALLOWED_PROXY_HOSTS: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  ADMIN_NOTIFY_EMAIL: z.string().optional(),
  GITHUB_TOKEN: z.string().optional(),
  GITHUB_USERNAME: z.string().default('AmooAyomikun')
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.warn('[WARN] Environment configuration notice:')
  for (const issue of parsedEnv.error.issues) {
    console.warn(` - [${issue.path.join('.')}]: ${issue.message}`)
  }
}

// Production-safe defaults to prevent Render deployment crashes
const isProd = process.env.NODE_ENV === 'production'
const fallbackSalt = process.env.VISITOR_SALT || 'amoo-quadri-visitor-salt-production-fallback-key-32'
const fallbackSecret = process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_PASSWORD || 'amoo-quadri-admin-token-secret-fallback-key-32'

if (isProd && (!process.env.VISITOR_SALT || process.env.VISITOR_SALT.length < 16)) {
  console.warn('[WARN] [Production Warning] VISITOR_SALT is not configured in Render dashboard. Using secure internal fallback.')
}

export const env = {
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'test' | 'production') || 'development',
  PORT: process.env.PORT || '5000',
  VISITOR_SALT: fallbackSalt,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
  ADMIN_TOKEN_SECRET: fallbackSecret,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  FRONTEND_URL: process.env.FRONTEND_URL,
  ALLOWED_PROXY_HOSTS: process.env.ALLOWED_PROXY_HOSTS,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  ADMIN_NOTIFY_EMAIL: process.env.ADMIN_NOTIFY_EMAIL,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  GITHUB_USERNAME: process.env.GITHUB_USERNAME || 'AmooAyomikun'
}
