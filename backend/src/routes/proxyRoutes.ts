import { Router, Request, Response } from 'express'
import rateLimit from 'express-rate-limit'
import { env } from '../config/env.js'

const router = Router()

const proxyLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  message: { error: 'Too many proxy preview requests. Please wait a few minutes before retrying.' },
  standardHeaders: true,
  legacyHeaders: false
})

const ALLOWED_DEMO_HOSTS = new Set([
  'cleanreport-frontend.vercel.app',
  ...(env.ALLOWED_PROXY_HOSTS ? env.ALLOWED_PROXY_HOSTS.split(',').map(h => h.trim().toLowerCase()) : [])
])

function isPrivateOrInternalHost(hostname: string): boolean {
  const h = hostname.toLowerCase()
  return (
    h === 'localhost' ||
    h === '127.0.0.1' ||
    h === '::1' ||
    h === '0.0.0.0' ||
    h === '169.254.169.254' ||
    h.startsWith('10.') ||
    h.startsWith('192.168.') ||
    h.startsWith('169.254.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(h) ||
    h.endsWith('.internal') ||
    h.endsWith('.local')
  )
}

router.get('/', proxyLimiter, async (req: Request, res: Response): Promise<void> => {
  const targetUrl = req.query.url as string
  if (!targetUrl || typeof targetUrl !== 'string') {
    res.status(400).json({ error: 'Missing or invalid url query parameter' })
    return
  }

  let urlObj: URL
  try {
    urlObj = new URL(targetUrl)
  } catch {
    res.status(400).json({ error: 'Invalid target URL format' })
    return
  }

  if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
    res.status(400).json({ error: 'Invalid URL protocol: only http and https are permitted' })
    return
  }

  const initialHost = urlObj.hostname.toLowerCase()
  if (!ALLOWED_DEMO_HOSTS.has(initialHost) || isPrivateOrInternalHost(initialHost)) {
    res.status(403).json({ error: 'Forbidden: Proxy is restricted to approved portfolio demo hostnames.' })
    return
  }

  try {
    let currentUrl = targetUrl
    let response = await fetch(currentUrl, {
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Portfolio-Proxy'
      },
      signal: AbortSignal.timeout(10000)
    })

    let redirectCount = 0
    const maxRedirects = 3
    while ([301, 302, 303, 307, 308].includes(response.status) && redirectCount < maxRedirects) {
      redirectCount++
      const locationHeader = response.headers.get('location')
      if (!locationHeader) break

      const nextUrl = new URL(locationHeader, currentUrl)
      const nextHost = nextUrl.hostname.toLowerCase()

      if (
        (nextUrl.protocol !== 'http:' && nextUrl.protocol !== 'https:') ||
        !ALLOWED_DEMO_HOSTS.has(nextHost) ||
        isPrivateOrInternalHost(nextHost)
      ) {
        res.status(403).json({ error: 'Forbidden: Redirect target is not an approved demo host.' })
        return
      }

      currentUrl = nextUrl.href
      response = await fetch(currentUrl, {
        redirect: 'manual',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Portfolio-Proxy'
        },
        signal: AbortSignal.timeout(10000)
      })
    }

    if (!response.ok && response.status >= 400) {
      res.status(response.status).json({ error: `Remote demo returned HTTP status ${response.status}` })
      return
    }

    let html = await response.text()
    const injectedScript = `
<script>
  try {
    Object.defineProperty(navigator, 'serviceWorker', {
      value: undefined,
      configurable: true
    });
  } catch(e) {}
  if (window.location.pathname.startsWith('/api/proxy')) {
    try {
      window.history.replaceState(null, '', window.location.origin + ${JSON.stringify(urlObj.pathname || '/')});
    } catch(e) {}
  }
</script>
`
    html = html.replace('<head>', `<head>${injectedScript}`)
    html = html.replaceAll('src="/', `src="${urlObj.origin}/`)
    html = html.replaceAll('href="/', `href="${urlObj.origin}/`)

    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; frame-ancestors 'self' https://amoo-quadri.vercel.app https://amooquadri.dev https://www.amooquadri.dev http://localhost:5173 http://localhost:3000;"
    )
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.type('html').send(html)
  } catch {
    res.status(502).json({ error: 'Proxy error: Unable to fetch remote demo preview.' })
  }
})

export default router
