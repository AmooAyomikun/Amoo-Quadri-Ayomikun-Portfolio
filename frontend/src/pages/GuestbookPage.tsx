import React, { useState, useEffect, useRef } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import SignatureCanvas from 'react-signature-canvas'
import { PenTool, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react'
import { apiUrl } from '../lib/api'
import { useTheme } from '../lib/theme'
import { SEO } from '../components/SEO'
import { GuestbookHero } from '../components/PageHeroes'
import { PageContainer } from '../components/PageContainer'

interface GuestbookEntry {
  id: string
  name: string
  message: string
  signatureData: string
  timestamp: string
}

export default function GuestbookPage() {
  const { theme } = useTheme()
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isWakingServer, setIsWakingServer] = useState(false)
  
  const sigCanvas = useRef<SignatureCanvas>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 128 })

  // Issue 5.2: Preserve in-progress signature on window resize
  useEffect(() => {
    const updateSize = () => {
      if (wrapperRef.current) {
        const newWidth = wrapperRef.current.offsetWidth
        const newHeight = wrapperRef.current.offsetHeight

        setCanvasSize(prev => {
          if (prev.width === newWidth && prev.height === newHeight) return prev

          const savedData = sigCanvas.current && !sigCanvas.current.isEmpty()
            ? sigCanvas.current.toDataURL()
            : null

          if (savedData) {
            setTimeout(() => {
              sigCanvas.current?.fromDataURL(savedData)
            }, 60)
          }

          return { width: newWidth, height: newHeight }
        })
      }
    }
    
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    setLoading(true)
    const wakeTimer = setTimeout(() => {
      setIsWakingServer(true)
    }, 2500)

    try {
      const res = await fetch(apiUrl('/api/guestbook?limit=15'))
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setEntries(data)
          setHasMore(false)
        } else if (data && Array.isArray(data.entries)) {
          setEntries(data.entries)
          setNextCursor(data.nextCursor || null)
          setHasMore(Boolean(data.hasMore))
        }
      }
    } catch (err) {
      console.error('Failed to fetch guestbook entries', err)
    } finally {
      clearTimeout(wakeTimer)
      setIsWakingServer(false)
      setLoading(false)
    }
  }

  const loadMoreEntries = async () => {
    if (!nextCursor || loadingMore) return
    setLoadingMore(true)
    try {
      const res = await fetch(apiUrl(`/api/guestbook?limit=15&cursor=${encodeURIComponent(nextCursor)}`))
      if (res.ok) {
        const data = await res.json()
        if (data && Array.isArray(data.entries)) {
          setEntries(prev => [...prev, ...data.entries])
          setNextCursor(data.nextCursor || null)
          setHasMore(Boolean(data.hasMore))
        }
      }
    } catch (err) {
      console.error('Failed to load more entries', err)
    } finally {
      setLoadingMore(false)
    }
  }

  const clearSignature = () => {
    sigCanvas.current?.clear()
  }

  // Issue 5.3: Actionable feedback for 400, 503, and network errors
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    
    const signatureData = sigCanvas.current?.isEmpty() ? '' : sigCanvas.current?.toDataURL('image/png')
    
    if (!name.trim() || (!message.trim() && !signatureData)) {
      setSubmitError('Please enter your name and either a message or a signature.')
      return
    }

    setIsSubmitting(true)
    
    try {
      const res = await fetch(apiUrl('/api/guestbook'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), message: message.trim(), signatureData })
      })

      if (res.ok) {
        setSubmitted(true)
        setName('')
        setMessage('')
        clearSignature()
        fetchEntries()
        
        setTimeout(() => {
          setSubmitted(false)
        }, 3000)
      } else {
        const errJson = await res.json().catch(() => ({}))
        const errorMsg = errJson.error || (res.status === 503
          ? 'Guestbook service is temporarily unavailable (503). Please try again in a few moments.'
          : res.status === 400
          ? 'Invalid submission data (400). Please check your inputs.'
          : `Submission failed with status ${res.status}.`)
        setSubmitError(errorMsg)
      }
    } catch (err) {
      console.error('Failed to submit entry', err)
      setSubmitError('Network error: unable to connect to the backend server. Please verify your connection.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)]">
      <SEO 
        title="Interactive Guestbook" 
        description="Leave your digital signature, greeting, or feedback on Quadri Ayomikun Amoo's portfolio guestbook."
        canonicalUrl="/guestbook"
      />
      <Navbar />
      
      <PageContainer as="main" id="main-content" className="pb-28 sm:pb-32">
        <GuestbookHero />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--color-surface-card)] rounded-2xl p-6 border border-[var(--color-border)] shadow-sm sticky top-32">
              <h2 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-[var(--color-primary)]" />
                Sign the Book
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="guestbook-name" className="block text-xs font-mono text-[var(--color-text-muted)] mb-2">NAME <span className="text-[var(--color-primary)]">*</span></label>
                  <input
                    id="guestbook-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (submitError) setSubmitError(null)
                    }}
                    required
                    placeholder="John Doe"
                    className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="guestbook-message" className="block text-xs font-mono text-[var(--color-text-muted)] mb-2">MESSAGE</label>
                  <textarea
                    id="guestbook-message"
                    name="message"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value)
                      if (submitError) setSubmitError(null)
                    }}
                    placeholder="You are amazing, keep it up! 🔥"
                    rows={3}
                    className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label id="guestbook-signature-label" className="block text-xs font-mono text-[var(--color-text-muted)]">SIGNATURE DRAWING</label>
                    <button type="button" onClick={clearSignature} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] flex items-center gap-1 cursor-pointer">
                      <RefreshCw className="w-3 h-3" /> Clear
                    </button>
                  </div>
                  <div ref={wrapperRef} className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg overflow-hidden h-32 relative group">
                    <SignatureCanvas 
                      ref={sigCanvas}
                      penColor={theme === 'dark' ? '#d4a359' : '#181816'}
                      canvasProps={{ 
                        width: canvasSize.width, 
                        height: canvasSize.height,
                        className: 'cursor-crosshair w-full h-full',
                        'aria-labelledby': 'guestbook-signature-label',
                        role: 'img'
                      }}
                      backgroundColor="transparent"
                    />
                    <div className="absolute inset-0 pointer-events-none border-2 border-transparent group-focus-within:border-[var(--color-primary)] rounded-lg transition-colors" />
                  </div>
                </div>

                {submitError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || submitted}
                  className={`w-full py-3 rounded-lg text-sm font-bold tracking-wide transition-all ${
                    submitted 
                      ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border border-[var(--color-primary)]/50 cursor-default'
                      : 'bg-[var(--color-primary)] text-[var(--color-primary-text)] hover:bg-[var(--color-primary-hover)] cursor-pointer'
                  } flex items-center justify-center gap-2`}
                >
                  {isSubmitting ? 'Signing...' : submitted ? <><CheckCircle className="w-4 h-4" /> Signed Successfully</> : 'Sign Guestbook'}
                </button>
              </form>
            </div>
          </div>

          {/* Entries Grid */}
          <div className="lg:col-span-2">
            {isWakingServer && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                <span>Connecting to backend server (waking up free-tier instance, may take ~20–30s)...</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col justify-between animate-pulse"
                  >
                    <div className="space-y-3 mb-6">
                      <div className="h-4 bg-[var(--color-surface-elevated)] rounded w-3/4" />
                      <div className="h-4 bg-[var(--color-surface-elevated)] rounded w-1/2" />
                      <div className="w-full h-24 bg-[var(--color-surface-elevated)] rounded-xl border border-[var(--color-border)]/50 mt-4" />
                    </div>
                    <div className="border-t border-[var(--color-border)] pt-4 space-y-2">
                      <div className="h-5 bg-[var(--color-surface-elevated)] rounded w-1/3" />
                      <div className="h-3 bg-[var(--color-surface-elevated)] rounded w-1/4" />
                    </div>
                  </div>
                ))
              ) : entries.length === 0 ? (
                <div className="col-span-full py-20 text-center text-[var(--color-text-muted)] bg-[var(--color-surface-card)] rounded-2xl border border-dashed border-[var(--color-border)]">
                  No signatures yet. Be the first to sign!
                </div>
              ) : (
                entries.map((entry) => (
                  <div key={entry.id} className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col justify-between group hover:border-[var(--color-primary)]/50 transition-colors">
                    
                    <div className="mb-6">
                      {entry.message && (
                        <p className="text-[var(--color-text-main)] text-sm leading-relaxed mb-4">
                          {entry.message}
                        </p>
                      )}
                      
                      {entry.signatureData && (
                        <div className="w-full h-24 flex items-center justify-center bg-[var(--color-surface-elevated)] rounded-xl border border-[var(--color-border)]/50 p-2">
                          {/* Issue 5.2: Invert only in dark mode; dark ink shows perfectly in light mode */}
                          <img 
                            src={entry.signatureData} 
                            alt={`${entry.name}'s signature`} 
                            className="max-h-full max-w-full opacity-90 dark:invert transition-all" 
                          />
                        </div>
                      )}
                    </div>

                    <div className="mt-auto border-t border-[var(--color-border)] pt-4">
                      <h4 className="font-serif font-bold text-lg text-[var(--color-text-main)] mb-1 group-hover:text-[var(--color-primary)] transition-colors">{entry.name}</h4>
                      <p className="text-xs font-mono text-[var(--color-text-muted)] uppercase">
                        {new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {' · '}
                        {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {hasMore && (
              <div className="pt-6 text-center">
                <button
                  onClick={loadMoreEntries}
                  disabled={loadingMore}
                  className="px-6 py-2.5 rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] text-xs font-mono font-semibold text-[var(--color-text-main)] hover:bg-[var(--color-surface-elevated)] transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Loading more signatures...</span>
                    </>
                  ) : (
                    <span>Load More Signatures</span>
                  )}
                </button>
              </div>
            )}
          </div>
          
        </div>
      </PageContainer>
      <Footer />
    </div>
  )
}
