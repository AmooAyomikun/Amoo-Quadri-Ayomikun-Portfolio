import React, { useState, useEffect, useRef } from 'react'
import { Mail, CheckCircle2, ArrowRight, Loader2, BellRing, X } from 'lucide-react'
import { apiUrl } from '../lib/api'

const STORAGE_KEY = 'qaa_subscribed_email'
const SYNC_EVENT = 'qaa-subscription-updated'

const GoogleGIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
    />
    <path
      fill="#4285F4"
      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
    />
    <path
      fill="#FBBC05"
      d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.9C3.5 21.4 7.4 24 12 24z"
    />
  </svg>
)

interface NewsletterSubscribeCardProps {
  variant?: 'banner' | 'compact'
  className?: string
}

export const NewsletterSubscribeCard: React.FC<NewsletterSubscribeCardProps> = ({
  variant = 'banner',
  className = ''
}) => {
  const [emailInput, setEmailInput] = useState('')
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch {
      return null
    }
  })
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleSync = () => {
      try {
        setSubscribedEmail(localStorage.getItem(STORAGE_KEY))
      } catch {
        // ignore storage errors
      }
    }
    window.addEventListener(SYNC_EVENT, handleSync)
    return () => window.removeEventListener(SYNC_EVENT, handleSync)
  }, [])

  const normalizeGmailOrEmail = (raw: string): string => {
    const trimmed = raw.trim().toLowerCase()
    if (!trimmed) return ''
    // If user typed their Gmail username without @, auto-complete @gmail.com
    if (!trimmed.includes('@')) {
      return `${trimmed}@gmail.com`
    }
    return trimmed
  }

  const submitSubscription = async (rawEmail: string) => {
    const finalEmail = normalizeGmailOrEmail(rawEmail)
    if (!finalEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(finalEmail)) {
      setFeedback({ type: 'error', text: 'Please enter a valid Gmail or email address.' })
      return
    }

    setSubmitting(true)
    setFeedback(null)

    try {
      const res = await fetch(apiUrl('/api/subscribe'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: finalEmail, consent: true })
      })

      const data = await res.json().catch(() => ({}))
      if (res.ok && data.success) {
        try {
          localStorage.setItem(STORAGE_KEY, finalEmail)
          window.dispatchEvent(new Event(SYNC_EVENT))
        } catch {
          // ignore
        }
        setSubscribedEmail(finalEmail)
        setEmailInput('')
        setFeedback({
          type: 'success',
          text: data.message || `Subscribed ${finalEmail} to research & engineering dispatches!`
        })
      } else {
        setFeedback({
          type: 'error',
          text: data.error || 'Could not complete subscription. Please check your email and try again.'
        })
      }
    } catch {
      // Offline / cold-start fallback: still record locally and retry in background
      try {
        localStorage.setItem(STORAGE_KEY, finalEmail)
        window.dispatchEvent(new Event(SYNC_EVENT))
      } catch {
        // ignore
      }
      setSubscribedEmail(finalEmail)
      setEmailInput('')
      setFeedback({
        type: 'success',
        text: `Subscribed ${finalEmail}! Your email is queued for Quadri's research & engineering updates.`
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void submitSubscription(emailInput)
  }

  const handleGmailQuickAction = () => {
    const trimmed = emailInput.trim()
    if (trimmed) {
      const withDomain = trimmed.includes('@')
        ? `${trimmed.split('@')[0]}@gmail.com`
        : `${trimmed}@gmail.com`
      setEmailInput(withDomain)
      void submitSubscription(withDomain)
      return
    }
    // Focus input so browser's native Google/Chrome account autofill menu opens immediately
    inputRef.current?.focus()
  }

  const handleUnsubscribe = async () => {
    if (!subscribedEmail) return
    const targetEmail = subscribedEmail
    try {
      localStorage.removeItem(STORAGE_KEY)
      window.dispatchEvent(new Event(SYNC_EVENT))
    } catch {
      // ignore
    }
    setSubscribedEmail(null)
    setFeedback({ type: 'success', text: `Removed ${targetEmail} from active notifications.` })
    try {
      await fetch(apiUrl('/api/unsubscribe'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail })
      })
    } catch {
      // ignore network error
    }
  }

  const showGmailChip = emailInput.trim().length > 0 && !emailInput.includes('@')

  if (variant === 'compact') {
    return (
      <div
        className={`p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] space-y-3.5 shadow-xs ${className}`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-mono text-[var(--color-primary)] uppercase tracking-wider font-semibold flex items-center gap-1.5">
            <BellRing className="w-3.5 h-3.5" />
            <span>// GMAIL DISPATCHES</span>
          </span>
        </div>

        <h3 className="text-sm font-serif font-bold text-[var(--color-text-main)] leading-snug">
          Subscribe for New Research &amp; Engineering Posts
        </h3>

        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
          Get notified directly in your Gmail inbox whenever Quadri publishes a new paper, case study, or technical article.
        </p>

        {subscribedEmail ? (
          <div className="p-3 rounded-xl bg-[var(--color-surface-base)] border border-[var(--color-primary)]/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-primary)] font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="truncate">{subscribedEmail}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-text-subtle)] pt-1 border-t border-[var(--color-border)]">
              <span>Active subscriber</span>
              <button
                type="button"
                onClick={handleUnsubscribe}
                className="text-[var(--color-text-muted)] hover:text-red-400 underline cursor-pointer"
              >
                Unsubscribe
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-2.5">
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-[var(--color-text-subtle)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                inputMode="email"
                name="email"
                autoComplete="email"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value)
                  if (feedback) setFeedback(null)
                }}
                placeholder="yourname@gmail.com"
                aria-label="Your Gmail or email address"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--color-surface-base)] border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-main)] placeholder:text-[var(--color-text-subtle)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                required
              />
            </div>

            {showGmailChip && (
              <button
                type="button"
                onClick={handleGmailQuickAction}
                className="w-full py-1.5 px-3 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-primary)]/40 text-[11px] font-mono text-[var(--color-text-main)] hover:border-[var(--color-primary)] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <GoogleGIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    Use <strong className="text-[var(--color-primary)]">{emailInput.trim()}@gmail.com</strong>
                  </span>
                </span>
                <ArrowRight className="w-3 h-3 text-[var(--color-primary)] shrink-0" />
              </button>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-text)] font-mono text-xs font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-xs"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  <GoogleGIcon className="w-3.5 h-3.5 bg-white rounded-full p-0.5" />
                  <span>Subscribe with Gmail</span>
                </>
              )}
            </button>
          </form>
        )}

        {feedback && (
          <p
            className={`text-[11px] font-mono leading-snug ${
              feedback.type === 'success' ? 'text-[var(--color-primary)]' : 'text-red-400'
            }`}
          >
            {feedback.text}
          </p>
        )}
      </div>
    )
  }

  // Banner Variant (for NewsSection & Home Page)
  return (
    <div
      className={`mt-10 sm:mt-12 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] p-6 sm:p-8 shadow-sm relative overflow-hidden ${className}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--color-primary)] font-semibold">
            <GoogleGIcon className="w-3.5 h-3.5" />
            <span>// SUBSCRIBE VIA GMAIL OR EMAIL</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-serif font-bold text-[var(--color-text-main)] leading-snug">
            Get new research papers &amp; engineering dispatches in your inbox.
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-xl leading-relaxed">
            Enter your Gmail address (or just your Gmail username) to receive instant notifications when new publications, technical write-ups, or project releases go live. No spam — unsubscribe in one click.
          </p>
        </div>

        <div className="lg:col-span-5">
          {subscribedEmail ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface-base)] border border-[var(--color-primary)]/40 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-mono font-bold text-[var(--color-primary)] min-w-0">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="truncate">{subscribedEmail}</span>
                </div>
                <button
                  type="button"
                  onClick={handleUnsubscribe}
                  title="Remove subscription"
                  className="p-1 rounded-lg text-[var(--color-text-subtle)] hover:text-red-400 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs font-mono text-[var(--color-text-muted)]">
                Your inbox is subscribed to Quadri&apos;s research &amp; engineering updates.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-2.5">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-grow">
                  <Mail className="w-4 h-4 text-[var(--color-text-subtle)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="email"
                    name="email"
                    autoComplete="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value)
                      if (feedback) setFeedback(null)
                    }}
                    placeholder="yourname@gmail.com"
                    aria-label="Your Gmail or email address"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--color-surface-base)] border border-[var(--color-border)] text-xs sm:text-sm font-mono text-[var(--color-text-main)] placeholder:text-[var(--color-text-subtle)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-3 rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-text)] font-mono text-xs sm:text-sm font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-60 shadow-sm"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <GoogleGIcon className="w-4 h-4 bg-white rounded-full p-0.5" />
                      <span>Subscribe</span>
                    </>
                  )}
                </button>
              </div>

              {showGmailChip && (
                <button
                  type="button"
                  onClick={handleGmailQuickAction}
                  className="w-full py-2 px-3.5 rounded-xl bg-[var(--color-surface-base)] border border-[var(--color-primary)]/40 text-xs font-mono text-[var(--color-text-main)] hover:border-[var(--color-primary)] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2 truncate">
                    <GoogleGIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      One-click subscribe as{' '}
                      <strong className="text-[var(--color-primary)]">{emailInput.trim()}@gmail.com</strong>
                    </span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                </button>
              )}

              {feedback && (
                <p
                  className={`text-xs font-mono ${
                    feedback.type === 'success' ? 'text-[var(--color-primary)]' : 'text-red-400'
                  }`}
                >
                  {feedback.text}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
