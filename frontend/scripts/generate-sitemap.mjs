#!/usr/bin/env node
/**
 * generate-sitemap.mjs
 * Generates an up-to-date sitemap.xml dynamically at build time (Issue 5.2).
 * Excludes redirecting routes (/about, /testimonials) and restricted routes (/admin).
 */

import { writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, '..')

const baseUrl = (process.env.VITE_SITE_URL || 'https://amoo-quadri-ayomikun-portfolio-fron.vercel.app').replace(/\/$/, '')
const today = new Date().toISOString().split('T')[0]

// Define all valid, canonical, indexed routes with priorities
const routes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/projects', priority: '0.9', changefreq: 'weekly' },
  { path: '/research', priority: '0.9', changefreq: 'monthly' },
  { path: '/education', priority: '0.8', changefreq: 'monthly' },
  { path: '/experience', priority: '0.8', changefreq: 'monthly' },
  { path: '/news', priority: '0.8', changefreq: 'weekly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/guestbook', priority: '0.7', changefreq: 'weekly' },
  { path: '/case-study/clean-report', priority: '0.8', changefreq: 'monthly' },
  { path: '/case-study/hotel-recommendation', priority: '0.8', changefreq: 'monthly' },
  // Key project showcase deep links
  { path: '/projects/dispatchlane', priority: '0.7', changefreq: 'monthly' },
  { path: '/projects/kora-ecommerce', priority: '0.7', changefreq: 'monthly' },
  { path: '/projects/kynda-ai-assistant', priority: '0.7', changefreq: 'monthly' },
  { path: '/projects/pathly-online', priority: '0.7', changefreq: 'monthly' },
  { path: '/projects/cleanreport-pwa', priority: '0.7', changefreq: 'monthly' },
  { path: '/projects/hotel-recommendation-system', priority: '0.7', changefreq: 'monthly' },
]

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${baseUrl}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`

async function main() {
  const publicDir = join(ROOT, 'public')
  const distDir = join(ROOT, 'dist')

  await writeFile(join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8')
  console.log(`✓ Generated public/sitemap.xml (${routes.length} canonical routes, lastmod: ${today})`)

  if (existsSync(distDir)) {
    await writeFile(join(distDir, 'sitemap.xml'), sitemapXml, 'utf8')
    console.log(`✓ Copied sitemap.xml to dist/sitemap.xml`)
  }
}

main().catch((err) => {
  console.error('Error generating sitemap:', err)
  process.exit(1)
})
