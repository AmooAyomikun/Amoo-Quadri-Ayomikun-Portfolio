import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Badge } from '../components/Badge'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  Share2, 
  Headphones, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react'
import { initialNewsData, formatNewsDate, type NewsItem } from '../content/newsData'
import { apiUrl } from '../lib/api'
import { SEO } from '../components/SEO'
import { PageContainer } from '../components/PageContainer'

export default function NewsArticlePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [allNews, setAllNews] = useState<NewsItem[]>(initialNewsData)
  const [news, setNews] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  
  // Audio Narrator State
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackProgress, setPlaybackProgress] = useState(0) // 0 to 100
  const [currentTime, setCurrentTime] = useState(0)
  const [speechRate, setSpeechRate] = useState<number>(1)
  const [isMuted, setIsMuted] = useState(false)
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Estimated duration in seconds based on word count (~145 words per minute)
  const estimatedDuration = useMemo(() => {
    if (!news) return 120
    const words = (news.summary + ' ' + news.content).trim().split(/\s+/).length
    return Math.max(60, Math.round((words / 145) * 60))
  }, [news])

  // Readers view count simulation based on article ID hash
  const readersCount = useMemo(() => {
    if (!id) return 14
    let hash = 0
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i)
      hash |= 0
    }
    return 12 + Math.abs(hash % 24)
  }, [id])

  // Fetch all articles and locate active article
  useEffect(() => {
    window.scrollTo(0, 0)
    
    // Stop any ongoing speech when switching articles
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsPlaying(false)
    setPlaybackProgress(0)
    setCurrentTime(0)

    const fetchArticles = async () => {
      try {
        const res = await fetch(apiUrl('/api/news'))
        const data = await res.json()
        if (res.ok && data.success && Array.isArray(data.data) && data.data.length > 0) {
          // Merge API items with initial items to guarantee full coverage
          const combined = [...data.data, ...initialNewsData]
          const seen = new Set<string>()
          const unique = combined.filter((item: NewsItem) => {
            const key = item.id || (item.title || '').trim().toLowerCase()
            if (!key || seen.has(key)) return false
            seen.add(key)
            return true
          })
          setAllNews(unique)
          const target = unique.find((n: NewsItem) => n.id === id) || initialNewsData.find(n => n.id === id)
          setNews(target || null)
        } else {
          throw new Error('API unavailable')
        }
      } catch {
        setAllNews(initialNewsData)
        const target = initialNewsData.find(n => n.id === id)
        setNews(target || null)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [id])

  // Initialize Speech Synthesis Voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis

      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        if (voices.length > 0) {
          // Prioritize English voices
          const englishVoices = voices.filter(v => v.lang.startsWith('en'))
          setAvailableVoices(englishVoices.length > 0 ? englishVoices : voices)
        }
      }

      updateVoices()
      window.speechSynthesis.onvoiceschanged = updateVoices
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
      if (progressTimerRef.current) clearInterval(progressTimerRef.current)
    }
  }, [])

  // Audio Playback Controller
  const startProgressTimer = useCallback(() => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current)
    const effectiveDuration = estimatedDuration / speechRate

    progressTimerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 0.5
        if (next >= effectiveDuration) {
          setPlaybackProgress(100)
          return effectiveDuration
        }
        setPlaybackProgress(Math.min(100, Math.round((next / effectiveDuration) * 100)))
        return next
      })
    }, 500)
  }, [estimatedDuration, speechRate])

  const handleTogglePlay = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !news) {
      return
    }

    const synth = window.speechSynthesis

    if (isPlaying) {
      synth.pause()
      setIsPlaying(false)
      if (progressTimerRef.current) clearInterval(progressTimerRef.current)
      return
    }

    if (synth.paused) {
      synth.resume()
      setIsPlaying(true)
      startProgressTimer()
      return
    }

    // Cancel any previous speech
    synth.cancel()

    // Clean plain text without markdown hashes for smooth narration
    const cleanContent = news.content
      .replace(/##+/g, '')
      .replace(/\*\*/g, '')
      .replace(/`/g, '')
      .replace(/\n+/g, '. ')
    const speechText = `${news.title}. ${news.summary}. ${cleanContent}`

    const utterance = new SpeechSynthesisUtterance(speechText)
    utteranceRef.current = utterance

    if (availableVoices[selectedVoiceIndex]) {
      utterance.voice = availableVoices[selectedVoiceIndex]
    }
    utterance.rate = speechRate
    utterance.volume = isMuted ? 0 : 1

    utterance.onend = () => {
      setIsPlaying(false)
      setPlaybackProgress(100)
      setCurrentTime(estimatedDuration)
      if (progressTimerRef.current) clearInterval(progressTimerRef.current)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
      if (progressTimerRef.current) clearInterval(progressTimerRef.current)
    }

    synth.speak(utterance)
    setIsPlaying(true)
    startProgressTimer()
  }, [isPlaying, news, availableVoices, selectedVoiceIndex, speechRate, isMuted, estimatedDuration, startProgressTimer])

  const handleRewind = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    if (progressTimerRef.current) clearInterval(progressTimerRef.current)
    setCurrentTime(0)
    setPlaybackProgress(0)
    setIsPlaying(false)
  }

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5]
    const nextIdx = (speeds.indexOf(speechRate) + 1) % speeds.length
    const nextSpeed = speeds[nextIdx]
    setSpeechRate(nextSpeed)
    if (isPlaying) {
      handleRewind()
    }
  }

  // Formatting helpers for audio timer
  const formatAudioTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  // Social Sharing Handlers
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://amoo-quadri.vercel.app'

  const handleNativeShare = async () => {
    if (navigator.share && news) {
      try {
        await navigator.share({
          title: news.title,
          text: news.summary,
          url: currentUrl
        })
      } catch {
        // User cancelled or unsupported
      }
    } else {
      handleCopyLink()
    }
  }

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  // Sidebar articles (exclude the current article)
  const sidebarArticles = useMemo(() => {
    return allNews.filter((n) => n.id !== id).slice(0, 4)
  }, [allNews, id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-surface-base)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
          <span className="text-xs font-mono text-[var(--color-primary)] animate-pulse">Loading Article...</span>
        </div>
      </div>
    )
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-[var(--color-surface-base)] flex items-center justify-center flex-col gap-4 text-center px-4">
        <SEO title="Article Not Found" canonicalUrl="/news" />
        <h1 className="text-3xl font-serif font-bold text-[var(--color-text-main)]">Article Not Found</h1>
        <p className="text-sm text-[var(--color-text-muted)] max-w-md">
          The requested news dispatch or research blog could not be located in the current repository timeline.
        </p>
        <button 
          onClick={() => navigate('/news')} 
          className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] text-xs font-mono font-semibold text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Return to News Timeline
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)] flex flex-col selection:bg-[var(--color-primary)]/20 selection:text-[var(--color-primary)]">
      <SEO 
        title={news.title}
        description={news.summary}
        canonicalUrl={`/news/${news.id}`}
        type="article"
      />
      <Navbar />

      <PageContainer as="main" id="main-content" className="flex-grow pt-24 sm:pt-32 pb-20 sm:pb-28">
        {/* Back Link */}
        <div className="mb-6 sm:mb-8">
          <button 
            onClick={() => navigate('/news')} 
            className="group inline-flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" /> 
            <span>Back to News Timeline</span>
          </button>
        </div>

        {/* 2-Column Responsive Layout: Main Content (col-span-8) & More News Sidebar (col-span-4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Main Article Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Editorial Title */}
            <div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--color-text-main)] leading-[1.18] tracking-tight">
                {news.title}
              </h1>
            </div>

            {/* Meta Pill Badges */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-mono text-[var(--color-text-subtle)]">
              {/* Date */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-surface-card)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
                <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>{formatNewsDate(news.date)}</span>
              </span>

              {/* Readers count */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-surface-card)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
                <Users className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>{readersCount} readers</span>
              </span>

              {/* Reading time */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-surface-card)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
                <Clock className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>{news.readTime}</span>
              </span>

              {/* Category */}
              <Badge variant="primary" size="sm" className="ml-auto sm:ml-0">
                {news.category}
              </Badge>
            </div>

            {/* Social Share Bar */}
            <div className="flex items-center flex-wrap gap-2.5 pt-1 pb-2 border-b border-[var(--color-border)]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-subtle)] mr-1">
                SHARE:
              </span>

              {/* Native / General Share Button */}
              <button
                onClick={handleNativeShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-main)] hover:text-[var(--color-primary)] transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${news.title} - ${currentUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-surface-card)] hover:bg-emerald-500/10 border border-[var(--color-border)] hover:border-emerald-500/50 text-[var(--color-text-muted)] hover:text-emerald-400 transition-all shadow-xs"
                title="Share on WhatsApp"
              >
                <span className="text-xs font-bold font-mono">WA</span>
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(news.title)}&url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-surface-card)] hover:bg-cyan-500/10 border border-[var(--color-border)] hover:border-cyan-500/50 text-[var(--color-text-muted)] hover:text-cyan-400 transition-all shadow-xs"
                title="Share on X"
              >
                <span className="text-xs font-bold font-mono">𝕏</span>
              </a>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-surface-card)] hover:bg-blue-500/10 border border-[var(--color-border)] hover:border-blue-500/50 text-[var(--color-text-muted)] hover:text-blue-400 transition-all shadow-xs"
                title="Share on LinkedIn"
              >
                <span className="text-xs font-bold font-mono">in</span>
              </a>

              {/* Copy Link Button */}
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-all cursor-pointer shadow-xs active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Audio Narrator Player Card ("Listen to this update") */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-4 sm:p-6 shadow-sm hover:border-[var(--color-primary)]/40 transition-colors">
              {/* Header Row */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 via-cyan-500/20 to-teal-500/20 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)] shadow-xs">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-serif font-bold text-[var(--color-text-main)] leading-snug">
                      Listen to this update
                    </h3>
                    <p className="text-xs font-mono text-[var(--color-text-subtle)] flex items-center gap-1.5">
                      <span>{news.readTime}</span>
                      <span>•</span>
                      <span className="text-[var(--color-primary)]">Audio Narrator</span>
                    </p>
                  </div>
                </div>

                {/* Speed & Voice Controls */}
                <div className="flex items-center gap-2">
                  {availableVoices.length > 1 && (
                    <select
                      value={selectedVoiceIndex}
                      onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
                      className="hidden sm:inline-block text-[11px] font-mono bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-lg px-2 py-1 text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)]"
                    >
                      {availableVoices.slice(0, 4).map((v, idx) => (
                        <option key={idx} value={idx}>
                          {v.name.slice(0, 18)}
                        </option>
                      ))}
                    </select>
                  )}

                  <button
                    onClick={cycleSpeed}
                    className="px-2.5 py-1 rounded-lg border border-[var(--color-border)] text-xs font-mono font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all cursor-pointer"
                    title="Playback Speed"
                  >
                    {speechRate}x
                  </button>
                </div>
              </div>

              {/* Progress Scrubber Bar */}
              <div className="space-y-1.5 mb-4">
                <div className="w-full bg-[var(--color-surface-base)] h-2 rounded-full overflow-hidden border border-[var(--color-border)] relative">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-[var(--color-primary)] to-cyan-400 transition-all duration-300"
                    style={{ width: `${playbackProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-[var(--color-text-subtle)]">
                  <span>{formatAudioTime(currentTime)} ({playbackProgress}%)</span>
                  <span>{formatAudioTime(estimatedDuration / speechRate)}</span>
                </div>
              </div>

              {/* Player Button Controls */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  {/* Rewind */}
                  <button
                    onClick={handleRewind}
                    className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-white/5 border border-transparent hover:border-[var(--color-border)] transition-all cursor-pointer"
                    title="Restart narration"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Play / Pause Primary Button */}
                  <button
                    onClick={handleTogglePlay}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--color-text-main)] text-[var(--color-surface-base)] hover:opacity-90 font-mono text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>Play</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Mute Toggle */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-white/5 border border-transparent hover:border-[var(--color-border)] transition-all cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Lead Summary Callout Block */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-surface-card)]/60 border-l-4 border-l-[var(--color-primary)] border border-[var(--color-border)] text-sm sm:text-base leading-relaxed text-[var(--color-text-main)] font-medium">
              <span className="block text-xs font-mono text-[var(--color-primary)] uppercase tracking-widest font-semibold mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Executive Summary
              </span>
              <p>{news.summary}</p>
            </div>

            {/* Rich Article Body Content */}
            <article className="prose prose-invert max-w-none text-sm sm:text-base leading-relaxed text-[var(--color-text-muted)] space-y-6">
              {news.content.split(/\n\n+/).filter(Boolean).map((block, idx) => {
                const trimmed = block.trim()
                
                // Markdown H2 Subheading
                if (trimmed.startsWith('## ')) {
                  return (
                    <h2 
                      key={idx} 
                      className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[var(--color-text-main)] pt-6 mt-8 border-t border-[var(--color-border)]/60 first:border-t-0 first:pt-0"
                    >
                      {trimmed.replace(/^##\s+/, '')}
                    </h2>
                  )
                }

                // Markdown H3 Subheading
                if (trimmed.startsWith('### ')) {
                  return (
                    <h3 
                      key={idx} 
                      className="text-lg sm:text-xl font-serif font-bold text-[var(--color-text-main)] pt-4 mt-6"
                    >
                      {trimmed.replace(/^###\s+/, '')}
                    </h3>
                  )
                }

                // Numbered or Bullet List
                if (trimmed.includes('\n- ') || trimmed.includes('\n1. ') || trimmed.startsWith('- ') || trimmed.startsWith('1. ')) {
                  const listItems = trimmed.split('\n').filter(Boolean)
                  return (
                    <ul key={idx} className="space-y-2.5 my-4 pl-2">
                      {listItems.map((item, itemIdx) => {
                        const cleanItem = item.replace(/^[-*]\s+|\d+\.\s+/, '')
                        return (
                          <li key={itemIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-[var(--color-text-muted)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-2 shrink-0" />
                            <span>{cleanItem}</span>
                          </li>
                        )
                      })}
                    </ul>
                  )
                }

                // Regular Paragraph
                return (
                  <p key={idx} className="leading-relaxed text-sm sm:text-base text-[var(--color-text-muted)]">
                    {trimmed}
                  </p>
                )
              })}
            </article>

            {/* Tags Cloud */}
            <div className="pt-6 border-t border-[var(--color-border)]">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--color-text-subtle)] block mb-3">
                TOPIC TAGS:
              </span>
              <div className="flex flex-wrap gap-2">
                {news.tags.map((tag, i) => (
                  <Badge key={i} variant="subtle" size="sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Author Attribution Card */}
            <div className="mt-10 p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)] font-serif font-bold text-lg shrink-0">
                  {news.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-serif font-bold text-[var(--color-text-main)]">
                    {news.author}
                  </h4>
                  <p className="text-xs font-mono text-[var(--color-text-subtle)] mt-0.5">
                    Software Engineer & NYSC Research Assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Link
                  to="/contact"
                  className="flex-1 sm:flex-none text-center px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-[var(--color-surface-base)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-main)] hover:text-[var(--color-primary)] transition-all"
                >
                  Contact Author
                </Link>
                <Link
                  to="/research"
                  className="flex-1 sm:flex-none text-center px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-[var(--color-surface-base)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-main)] hover:text-[var(--color-primary)] transition-all"
                >
                  View Research
                </Link>
              </div>
            </div>

          </div>

          {/* Right Column: "More News" Sidebar (Screenshots 2-5) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-serif font-bold text-[var(--color-text-main)] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
                <span>More News</span>
              </h2>

              <Link
                to="/news"
                className="text-xs font-mono text-[var(--color-primary)] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Sidebar Article Cards */}
            <div className="space-y-4">
              {sidebarArticles.map((other) => (
                <Link
                  key={other.id}
                  to={`/news/${other.id}`}
                  className="group block p-4 sm:p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="subtle" size="sm">
                      {other.category}
                    </Badge>
                    <span className="text-[11px] font-mono text-[var(--color-text-subtle)] flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {formatNewsDate(other.date)}
                    </span>
                  </div>

                  <h3 className="text-sm font-serif font-bold text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors leading-snug mb-2 line-clamp-2">
                    {other.title}
                  </h3>

                  <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mb-3 leading-relaxed">
                    {other.summary}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-text-subtle)] pt-2 border-t border-[var(--color-border)]/60">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {other.readTime}
                    </span>
                    <span className="text-[var(--color-primary)] font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                      <span>Read</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Newsletter / Keep In Touch Callout in Sidebar */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-cyan-500/10 to-transparent border border-[var(--color-border)] space-y-3">
              <span className="text-xs font-mono text-[var(--color-primary)] uppercase tracking-wider font-semibold">
                // STAY CONNECTED
              </span>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Interested in academic collaborations, technical articles, or project inquiries?
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--color-primary)] hover:underline"
              >
                <span>Leave a message</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>

        </div>
      </PageContainer>

      <Footer />
    </div>
  )
}
