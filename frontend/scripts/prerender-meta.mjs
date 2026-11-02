#!/usr/bin/env node
/**
 * prerender-meta.mjs
 * Post-build route prerenderer for SPA social previews & SEO crawlers (Issue 5.3).
 * Generates standalone dist/<route>/index.html files with route-specific OpenGraph,
 * Twitter Cards, canonical URLs, and meta descriptions for WhatsApp, X, LinkedIn, etc.
 */

import { readFile, writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, '..')
const DIST_DIR = join(ROOT, 'dist')

const baseUrl = (process.env.VITE_SITE_URL || 'https://amoo-quadri.vercel.app').replace(/\/$/, '')

const PAGE_METADATA = [
  {
    path: 'education',
    title: 'Education & Academic Credentials | Quadri Ayomikun Amoo',
    description: 'B.Sc. Software Engineering (4.45/5.00 Final CGPA, Top 10%, Second-Class Upper) at Abiola Ajimobi Technical University. Coursework, leadership, and honors.',
    heading: 'Education & Academic Credentials',
    summary: 'Graduated in top 10% of class with 4.45/5.00 CGPA. Research assistant under Assoc. Prof. Jude Sinebe.'
  },
  {
    path: 'research',
    title: 'Research & Academic Publications | Quadri Ayomikun Amoo',
    description: 'Applied Artificial Intelligence, software engineering reliability, geospatial hotel recommender systems, and algorithmic fairness research.',
    heading: 'Research & Publications',
    summary: 'Undergraduate thesis on geospatial recommendation models and ongoing research in applied machine learning.'
  },
  {
    path: 'experience',
    title: 'Work Experience & Engineering Roles | Quadri Ayomikun Amoo',
    description: 'Professional software engineering experience at Circo Digital / Orange, CodeAlpha, and academic tutoring for 350+ students weekly.',
    heading: 'Engineering Experience & Timeline',
    summary: 'Frontend, full-stack, and academic instructional experience across enterprise and startup environments.'
  },
  {
    path: 'projects',
    title: 'Projects Showcase & Architecture | Quadri Ayomikun Amoo',
    description: 'Full-stack web applications, logistics tracking platforms, machine learning models, and offline-first Progressive Web Apps.',
    heading: 'Featured Engineering Projects',
    summary: 'Interactive mockups and production case studies for DispatchLane, Kora, Pathly, and CleanReport.'
  },
  {
    path: 'news',
    title: 'News & Academic Announcements | Quadri Ayomikun Amoo',
    description: 'Latest updates on publications, technical research milestones, academic honors, and software project launches.',
    heading: 'News & Announcements',
    summary: 'Chronological announcements and research updates from Quadri Ayomikun Amoo.'
  },
  {
    path: 'contact',
    title: 'Contact & Collaboration Portal | Quadri Ayomikun Amoo',
    description: 'Connect with Quadri regarding postgraduate research positions, academic fellowships, software roles, or engineering collaborations.',
    heading: 'Contact & Inquiry Portal',
    summary: 'Direct communication channels, message submission, and academic profiles.'
  },
  {
    path: 'guestbook',
    title: 'Guestbook & Community Signatures | Quadri Ayomikun Amoo',
    description: 'Leave an interactive handwritten signature and digital note on Quadri Ayomikun Amoo\'s portfolio guestbook.',
    heading: 'Community Guestbook',
    summary: 'Public ledger of messages and signatures from visiting researchers and software engineers.'
  },
  {
    path: 'case-study/clean-report',
    title: 'Case Study: CleanReport PWA | Quadri Ayomikun Amoo',
    description: 'Architecting an offline-first inspection Progressive Web App with Dexie.js IndexedDB, background sync, and camera hardware capture.',
    heading: 'CleanReport PWA Architecture Case Study',
    summary: 'Offline-first field operations PWA built with React, TypeScript, and local database synchronization.'
  },
  {
    path: 'case-study/hotel-recommendation',
    title: 'Case Study: Hybrid Hotel Recommender | Quadri Ayomikun Amoo',
    description: 'Machine learning thesis combining collaborative filtering, TF-IDF content similarity, and Haversine geospatial proximity.',
    heading: 'Hybrid Hotel Recommendation Engine',
    summary: 'B.Sc. software engineering thesis analyzing geospatial proximity and content similarity ranking.'
  },
  {
    path: 'projects/dispatchlane',
    title: 'DispatchLane — Real-Time Logistics Tracker | Quadri Ayomikun Amoo',
    description: 'Delivery and dispatch tracker with live courier status, state machines, and interactive route preview.',
    heading: 'DispatchLane Delivery Suite',
    summary: 'Modern logistics web application for courier management and parcel tracking.'
  },
  {
    path: 'projects/kora-ecommerce',
    title: 'Kora — Multi-Vendor E-Commerce Platform | Quadri Ayomikun Amoo',
    description: 'High-performance e-commerce storefront with cart reconciliation, seller management, and product catalogs.',
    heading: 'Kora E-Commerce Architecture',
    summary: 'Full-stack marketplace with real-time shopping cart and checkout pipeline.'
  },
  {
    path: 'projects/pathly-online',
    title: 'Pathly — Online Learning Platform | Quadri Ayomikun Amoo',
    description: 'Modern EdTech platform with curriculum tracks, video progression, and interactive coursework modules.',
    heading: 'Pathly EdTech Platform',
    summary: 'Online education and course management system with responsive video layouts.'
  },
  {
    path: 'projects/cleanreport-pwa',
    title: 'CleanReport — Offline Field Inspection PWA | Quadri Ayomikun Amoo',
    description: 'Progressive Web App for enterprise facility inspections, featuring offline data queuing and camera capture.',
    heading: 'CleanReport Offline PWA',
    summary: 'Production inspection system built for field technicians with intermittent network connectivity.'
  },
  {
    path: 'projects/hotel-recommendation-system',
    title: 'Hotel Recommendation System — ML Architecture | Quadri Ayomikun Amoo',
    description: 'Geospatial recommendation engine combining user preferences, TF-IDF feature vectors, and distance matrices.',
    heading: 'Geospatial Recommendation Engine',
    summary: 'Machine learning model integrating spatial distance with preference-based collaborative filtering.'
  }
]

async function prerenderRoutes() {
  const indexHtmlPath = join(DIST_DIR, 'index.html')
  if (!existsSync(indexHtmlPath)) {
    console.warn('dist/index.html not found, skipping prerender.')
    return
  }

  const templateHtml = await readFile(indexHtmlPath, 'utf8')

  for (const page of PAGE_METADATA) {
    const pageUrl = `${baseUrl}/${page.path}`
    const pageDir = join(DIST_DIR, page.path)
    await mkdir(pageDir, { recursive: true })

    let pageHtml = templateHtml

    // 1. Replace <title>
    pageHtml = pageHtml.replace(/<title>.*?<\/title>/i, `<title>${page.title}</title>`)

    // 2. Replace Meta Description
    pageHtml = pageHtml.replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${page.description}" />`
    )

    // 3. Replace Canonical Link
    pageHtml = pageHtml.replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${pageUrl}" />`
    )

    // 4. Replace OpenGraph Meta Tags
    pageHtml = pageHtml.replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${page.title}" />`
    )
    pageHtml = pageHtml.replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:description" content="${page.description}" />`
    )
    pageHtml = pageHtml.replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:url" content="${pageUrl}" />`
    )

    // 5. Replace Twitter Meta Tags
    pageHtml = pageHtml.replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${page.title}" />`
    )
    pageHtml = pageHtml.replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:description" content="${page.description}" />`
    )

    // 6. Inject crawler-friendly semantic shell inside <div id="root">
    // (Hydrates cleanly in client without interfering with React)
    const crawlerFallback = `
      <div style="padding: 2rem; max-width: 800px; margin: 0 auto; font-family: sans-serif; display: none;" class="crawler-noscript-fallback">
        <h1>${page.heading}</h1>
        <p>${page.summary}</p>
        <p>${page.description}</p>
      </div>
    `
    pageHtml = pageHtml.replace('<div id="root"></div>', `<div id="root">${crawlerFallback}</div>`)

    const outputPath = join(pageDir, 'index.html')
    await writeFile(outputPath, pageHtml, 'utf8')
    console.log(`✓ Prerendered static meta tags for /${page.path}`)
  }

  console.log(`✓ All ${PAGE_METADATA.length} routes prerendered with social preview meta tags!`)
}

prerenderRoutes().catch((err) => {
  console.error('Error during prerender:', err)
  process.exit(1)
})
