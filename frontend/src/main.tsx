import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@/styles/global.css'
import App from './App'

// Wire axe-core accessibility auditing in development mode (Issue 4.8)
if (import.meta.env.DEV) {
  Promise.all([
    import('@axe-core/react'),
    import('react-dom')
  ]).then(([{ default: axe }, ReactDOM]) => {
    axe(React, ReactDOM, 1000)
  }).catch((err) => {
    console.debug('axe-core dev audit skipped:', err)
  })
}

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
