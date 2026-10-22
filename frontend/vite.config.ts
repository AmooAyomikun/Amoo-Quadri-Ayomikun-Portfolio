import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'portfolio-proxy-plugin',
      configureServer(server) {
        server.middlewares.use('/api/proxy', async (req, res) => {
          const urlParam = new URL(req.url!, `http://${req.headers.host}`).searchParams.get('url')
          if (!urlParam) {
            res.statusCode = 400
            res.end('Missing url parameter')
            return
          }
          try {
            const targetUrl = new URL(urlParam)
            const upstream = await fetch(urlParam, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Portfolio-Proxy',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
              }
            })
            let html = await upstream.text()
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
      window.history.replaceState(null, '', window.location.origin + ${JSON.stringify(targetUrl.pathname || '/')});
    } catch(e) {}
  }
</script>
`
            html = html.replace('<head>', `<head>${injectedScript}`)
            // Ensure root-relative asset URLs resolve directly to upstream origin
            html = html.replaceAll('src="/', `src="${targetUrl.origin}/`)
            html = html.replaceAll('href="/', `href="${targetUrl.origin}/`)
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Content-Security-Policy', "frame-ancestors *;")
            res.removeHeader('X-Frame-Options')
            res.end(html)
          } catch (err: any) {
            res.statusCode = 502
            res.end('Proxy error: ' + (err?.message || 'Failed to fetch'))
          }
        })
      }
    }
  ],
  resolve: {
    alias: {
      '@': `${import.meta.dirname}/src`,
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons'
          }
        },
      },
    },
  },
})
