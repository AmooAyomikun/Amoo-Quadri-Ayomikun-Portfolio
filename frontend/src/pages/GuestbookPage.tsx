import React, { useState, useEffect, useRef } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import gsap from 'gsap'
import SignatureCanvas from 'react-signature-canvas'
import { PenTool, CheckCircle, RefreshCw } from 'lucide-react'

interface GuestbookEntry {
  id: string
  name: string
  message: string
  signatureData: string
  timestamp: string
}

export default function GuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const sigCanvas = useRef<SignatureCanvas>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 128 })

  useEffect(() => {
    const updateSize = () => {
      if (wrapperRef.current) {
        setCanvasSize({
          width: wrapperRef.current.offsetWidth,
          height: wrapperRef.current.offsetHeight
        })
      }
    }
    
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    fetchEntries()

    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
    }
  }, [])

  const fetchEntries = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/guestbook`)
      if (res.ok) {
        const data = await res.json()
        setEntries(data)
      }
    } catch (err) {
      console.error('Failed to fetch guestbook entries', err)
    }
  }

  const clearSignature = () => {
    sigCanvas.current?.clear()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const signatureData = sigCanvas.current?.isEmpty() ? '' : sigCanvas.current?.toDataURL('image/png')
    
    if (!name || (!message && !signatureData)) {
      alert('Please enter your name and either a message or a signature.')
      return
    }

    setIsSubmitting(true)
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/guestbook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message, signatureData })
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
      }
    } catch (err) {
      console.error('Failed to submit entry', err)
      alert('Error submitting entry. Is the backend running?')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)]">
      <Navbar />
      
      <main className="pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div ref={headerRef} className="mb-16">
          <span className="text-xs font-mono uppercase tracking-widest font-semibold text-[var(--color-primary)] mb-4 block">
            Leave Your Mark
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-text-main)] tracking-tight mb-4">
            Guestbook
          </h1>
          <p className="text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
            I appreciate you stopping by! Drop a message, draw a signature, or just say hello. 
            This is a permanent digital record of awesome people who visited my portfolio.
          </p>
        </div>

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
                  <label className="block text-xs font-mono text-[var(--color-text-muted)] mb-2">NAME <span className="text-[var(--color-primary)]">*</span></label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--color-text-muted)] mb-2">MESSAGE</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="You are amazing, keep it up! 🔥"
                    rows={3}
                    className="w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-xs font-mono text-[var(--color-text-muted)]">SIGNATURE DRAWING</label>
                    <button type="button" onClick={clearSignature} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Clear
                    </button>
                  </div>
                  <div ref={wrapperRef} className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg overflow-hidden h-32 relative group">
                    <SignatureCanvas 
                      ref={sigCanvas}
                      penColor={document.documentElement.classList.contains('dark') ? 'white' : 'black'}
                      canvasProps={{ 
                        width: canvasSize.width, 
                        height: canvasSize.height,
                        className: 'cursor-crosshair' 
                      }}
                      backgroundColor="transparent"
                    />
                    <div className="absolute inset-0 pointer-events-none border-2 border-transparent group-focus-within:border-[var(--color-primary)] rounded-lg transition-colors" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || submitted}
                  className={`w-full py-3 rounded-lg text-sm font-bold tracking-wide transition-all ${
                    submitted 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50 cursor-default'
                      : 'bg-[var(--color-primary)] text-black hover:bg-lime-400 cursor-pointer'
                  } flex items-center justify-center gap-2`}
                >
                  {isSubmitting ? 'Signing...' : submitted ? <><CheckCircle className="w-4 h-4" /> Signed Successfully</> : 'Sign Guestbook'}
                </button>
              </form>
            </div>
          </div>

          {/* Entries Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {entries.length === 0 ? (
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
                          <img src={entry.signatureData} alt="Signature" className="max-h-full max-w-full opacity-90 invert dark:invert-0" style={{ filter: 'var(--signature-filter)' }} />
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
          </div>
          
        </div>
      </main>
      <Footer />
    </div>
  )
}
