import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Newspaper, BookOpen, Sparkles, PlusCircle, X, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { AnimatedWords } from '../components/AnimatedWords'
import { apiUrl, getAdminToken, setAdminToken } from '../lib/api'
import { initialNewsData, formatFullNewsDate, type NewsItem } from '../content/newsData'

export type { NewsItem }

interface NewsSectionProps {
  heading?: string
  badgeText?: string
  limit?: number
  showViewAll?: boolean
  initialTab?: 'all' | 'news' | 'blog'
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  heading = 'News & Announcements',
  badgeText = '// TIMELINE & DISPATCHES',
  limit,
  showViewAll = false,
  initialTab = 'all'
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'news' | 'blog'>(initialTab)
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [publishModalOpen, setPublishModalOpen] = useState(false)

  // Publish Form state
  const [form, setForm] = useState({
    title: '',
    category: 'Research' as NewsItem['category'],
    summary: '',
    content: '',
    tags: '',
    adminPassphrase: ''
  })
  const [publishing, setPublishing] = useState(false)
  const [publishStatus, setPublishStatus] = useState('')
  const [publishError, setPublishError] = useState('')

  const fetchNews = async () => {
    try {
      const res = await fetch(apiUrl('/api/news'))
      const data = await res.json()
      if (res.ok && data.success && Array.isArray(data.data)) {
        // Merge server articles with initial flagship articles so that real articles are never missing
        const combined = [...data.data, ...initialNewsData].filter(
          (item: NewsItem) => !(item.title || '').toLowerCase().includes('new research paper published')
        )
        const seen = new Set<string>()
        const unique = combined.filter((item: NewsItem) => {
          const key = (item.title || '').trim().toLowerCase()
          if (!key || seen.has(key)) return false
          seen.add(key)
          return true
        })
        setNewsList(unique.length > 0 ? unique : initialNewsData)
      } else {
        throw new Error('API response invalid')
      }
    } catch (err) {
      console.warn('Backend news API unavailable, using fallback:', err)
      setNewsList(initialNewsData)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPublishError('')
    setPublishStatus('')

    if (!form.title || !form.summary || !form.content) {
      setPublishError('Title, summary, and content are required.')
      return
    }

    setPublishing(true)

    try {
      let token = getAdminToken()

      // If no stored token, attempt login with entered passphrase
      if (!token && form.adminPassphrase) {
        const loginRes = await fetch(apiUrl('/api/admin/login'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: form.adminPassphrase.trim() })
        })
        const loginData = await loginRes.json()
        if (loginRes.ok && loginData.success && typeof loginData.token === 'string') {
          token = loginData.token
          setAdminToken(loginData.token)
        } else {
          throw new Error(loginData.error || 'Invalid admin passphrase. Access denied.')
        }
      }

      if (!token) {
        throw new Error('Admin authentication required to publish live announcements.')
      }

      const res = await fetch(apiUrl('/api/news'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          summary: form.summary,
          content: form.content,
          tags: form.tags ? form.tags.split(',').map(t => t.trim()) : ['Update']
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setPublishStatus('Announcement published live to website!')
        setForm({ title: '', category: 'Research', summary: '', content: '', tags: '', adminPassphrase: '' })
        fetchNews()
        setTimeout(() => {
          setPublishModalOpen(false)
          setPublishStatus('')
        }, 1200)
      } else {
        throw new Error(data.error || 'Failed to publish announcement')
      }
    } catch (err) {
      console.error('Publish news failed:', err)
      setPublishError(err instanceof Error ? err.message : 'Error: Could not connect to publish server.')
    } finally {
      setPublishing(false)
    }
  }

  const filteredList = newsList.filter(item => {
    if (activeTab === 'news') return (item.type || 'news') === 'news'
    if (activeTab === 'blog') return item.type === 'blog'
    return true
  })

  const displayList = typeof limit === 'number' && limit > 0 ? filteredList.slice(0, limit) : filteredList

  const newsCount = newsList.filter(i => (i.type || 'news') === 'news').length
  const blogCount = newsList.filter(i => i.type === 'blog').length

  return (
    <section id="news" className="py-8 sm:py-16 bg-[var(--color-surface-base)] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-12 md:px-16 lg:px-20">
        <div className="border-t border-[var(--color-border)] pt-6 sm:pt-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-primary)] font-semibold flex items-center gap-1.5">
              <Newspaper className="w-4 h-4" /> {badgeText}
            </span>
            <h2 className="text-xl sm:text-4xl font-serif font-bold text-[var(--color-text-main)] mt-1">
              <AnimatedWords text={heading} />
            </h2>
          </div>

          {Boolean(getAdminToken()) && (
            <button
              onClick={() => setPublishModalOpen(true)}
              className="self-start sm:self-auto inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-mono font-semibold bg-[var(--color-surface-card)] text-[var(--color-text-main)] hover:text-[var(--color-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Post Update (Admin)</span>
            </button>
          )}
        </div>

        {/* Tab Controls: Separating News from Blogs - compact horizontal layout on mobile */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2 sm:mx-0 sm:px-0 sm:flex-wrap">
          <button
            onClick={() => setActiveTab('all')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer shrink-0 ${
              activeTab === 'all'
                ? 'bg-[var(--color-primary)] text-[var(--color-primary-text)] shadow-sm font-bold'
                : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border border-[var(--color-border)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="sm:hidden">All ({newsList.length})</span>
            <span className="hidden sm:inline">All Entries ({newsList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer shrink-0 ${
              activeTab === 'news'
                ? 'bg-[var(--color-primary)] text-[var(--color-primary-text)] shadow-sm font-bold'
                : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border border-[var(--color-border)]'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5 shrink-0" />
            <span className="sm:hidden">News ({newsCount})</span>
            <span className="hidden sm:inline">News &amp; Announcements ({newsCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer shrink-0 ${
              activeTab === 'blog'
                ? 'bg-[var(--color-primary)] text-[var(--color-primary-text)] shadow-sm font-bold'
                : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border border-[var(--color-border)]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="sm:hidden">Blog ({blogCount})</span>
            <span className="hidden sm:inline">Blog Posts &amp; Tech Articles ({blogCount})</span>
          </button>
        </div>

        {/* News Items Grid: Exactly 3 in a row, compact card layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.map((item) => (
            <div 
              key={item.id} 
              className="card-elevated p-4 sm:p-5 bg-[var(--color-surface-card)] flex flex-col justify-between h-full rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-lg hover:border-[var(--color-primary)]/70 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div>
                {item.imageUrl && (
                  <Link 
                    to={`/news/${item.id}`} 
                    className="block overflow-hidden rounded-xl mb-3 aspect-[16/9] max-h-40 bg-[var(--color-surface-base)] border border-[var(--color-border)]/60 group/thumb"
                  >
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-105"
                      loading="lazy"
                    />
                  </Link>
                )}

                {/* Relatable metadata format: October 6th, 2026 • 9 min read */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-[var(--color-text-subtle)] mb-2">
                  <span className="font-semibold text-[var(--color-primary)] uppercase tracking-wider text-[10px]">
                    {item.type === 'blog' ? 'Blog Post' : 'News'}
                  </span>
                  <span>•</span>
                  <span>{formatFullNewsDate(item.date)}</span>
                  <span>•</span>
                  <span>{item.readTime}</span>
                </div>

                <Link 
                  to={`/news/${item.id}`}
                  className="text-base font-serif font-bold text-[var(--color-text-main)] mb-1.5 leading-snug hover:text-[var(--color-primary)] transition-colors block line-clamp-2"
                >
                  {item.title}
                </Link>

                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mb-3 line-clamp-2">
                  {item.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between gap-2">
                <Badge variant="primary" size="sm">{item.category}</Badge>
                
                <Link
                  to={`/news/${item.id}`}
                  className="text-xs font-mono text-[var(--color-primary)] font-semibold hover:underline flex items-center gap-1"
                >
                  <span>{item.type === 'blog' ? 'Read Blog' : 'Read Article'}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {showViewAll && (
          <div className="mt-10 sm:mt-12 flex justify-center">
            <Link
              to="/news"
              className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-main)] hover:text-[var(--color-primary)] font-mono text-xs sm:text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-lg active:scale-95"
            >
              <span>Explore All News & Timeline</span>
              <ArrowRight className="w-4 h-4 text-[var(--color-primary)] transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
        </div>
      </div>


      {/* Quick Article Publish Modal (Admin) */}
      <AnimatePresence>
        {publishModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-2 text-lg font-serif font-bold text-[var(--color-text-main)]">
                  <Newspaper className="w-5 h-5 text-[var(--color-primary)]" />
                  <span>Publish Announcement</span>
                </div>
                <button
                  onClick={() => setPublishModalOpen(false)}
                  className="p-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {publishError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                  {publishError}
                </div>
              )}

              {publishStatus && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{publishStatus}</span>
                </div>
              )}

              <form onSubmit={handlePublishSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[var(--color-text-subtle)] mb-1">TITLE *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Milestone title..."
                    required
                    className="w-full bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-xl px-3.5 py-2 text-xs text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[var(--color-text-subtle)] mb-1">CATEGORY</label>
                    <select
                      value={form.category}
                      onChange={e => setForm(prev => ({ ...prev, category: e.target.value as NewsItem['category'] }))}
                      className="w-full bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-xs text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                    >
                      <option value="Research">Research</option>
                      <option value="Industry">Industry</option>
                      <option value="Academics">Academics</option>
                      <option value="Awards">Awards</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[var(--color-text-subtle)] mb-1">TAGS (COMMA-SEPARATED)</label>
                    <input
                      type="text"
                      value={form.tags}
                      onChange={e => setForm(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="AI, Thesis"
                      className="w-full bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-xs text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--color-text-subtle)] mb-1">SHORT SUMMARY *</label>
                  <textarea
                    rows={2}
                    value={form.summary}
                    onChange={e => setForm(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="Brief 1-2 sentence preview..."
                    required
                    className="w-full bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-xl px-3.5 py-2 text-xs text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--color-text-subtle)] mb-1">FULL ARTICLE CONTENT *</label>
                  <textarea
                    rows={5}
                    value={form.content}
                    onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Detailed announcement content..."
                    required
                    className="w-full bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-xl px-3.5 py-2 text-xs text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] resize-none"
                  />
                </div>

                {!getAdminToken() && (
                  <div>
                    <label className="block text-xs font-mono text-[var(--color-text-subtle)] mb-1">ADMIN PASSPHRASE *</label>
                    <input
                      type="password"
                      value={form.adminPassphrase}
                      onChange={e => setForm(prev => ({ ...prev, adminPassphrase: e.target.value }))}
                      placeholder="Enter admin password to publish..."
                      required
                      className="w-full bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-xl px-3.5 py-2 text-xs text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPublishModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-mono border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-white"
                  >
                    Cancel
                  </button>
                  <Button type="submit" variant="primary" disabled={publishing}>
                    {publishing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Publishing...
                      </>
                    ) : (
                      'Publish Now'
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  )
}
