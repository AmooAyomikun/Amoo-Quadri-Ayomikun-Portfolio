import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Newspaper, Plus, ShieldCheck, Trash2, Mail, MessageSquare, Loader2, Calendar, Clock, RefreshCw, Menu, X } from 'lucide-react'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { apiUrl, getAdminToken, clearAdminToken } from '../lib/api'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  lens?: string
  timestamp: string
}

interface NewsItem {
  id: string
  title: string
  date: string
  category: string
  summary: string
  content: string
}

interface GuestbookEntry {
  id: string
  name: string
  message: string
  signatureData: string
  timestamp: string
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'news' | 'messages' | 'guestbook'>('news')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [adminToken, setAdminTokenState] = useState<string | null>(null)
  const [loadingVerify, setLoadingVerify] = useState(true)

  // News Form State
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Research')
  const [tags, setTags] = useState('Research, AI')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')

  // Data collections
  const [newsArticles, setNewsArticles] = useState<NewsItem[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([])
  const [loadingData, setLoadingData] = useState(false)

  // Verify Admin Session on mount
  useEffect(() => {
    const token = getAdminToken()
    if (!token) {
      navigate('/admin')
      return
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(apiUrl('/api/admin/verify'), {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          setAdminTokenState(token)
        } else {
          clearAdminToken()
          navigate('/admin')
        }
      } catch {
        clearAdminToken()
        navigate('/admin')
      } finally {
        setLoadingVerify(false)
      }
    }

    verifyToken()
  }, [navigate])

  const fetchDashboardData = async () => {
    if (!adminToken) return
    setLoadingData(true)
    try {
      // 1. Fetch News
      const newsRes = await fetch(apiUrl('/api/news'))
      if (newsRes.ok) {
        const json = await newsRes.json()
        if (json.data) setNewsArticles(json.data)
      }

      // 2. Fetch Messages
      const msgRes = await fetch(apiUrl('/api/admin/messages'), {
        headers: { Authorization: `Bearer ${adminToken}` }
      })
      if (msgRes.ok) {
        const json = await msgRes.json()
        if (json.data) setMessages(json.data)
      }

      // 3. Fetch Guestbook
      const gbRes = await fetch(apiUrl('/api/guestbook'))
      if (gbRes.ok) {
        const json = await gbRes.json()
        if (Array.isArray(json)) setGuestbookEntries(json)
      }
    } catch (err) {
      console.warn('Error loading dashboard data:', err)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (adminToken) {
      fetchDashboardData()
    }
  }, [adminToken])

  const handleLogout = () => {
    clearAdminToken()
    navigate('/')
  }

  const handlePublishNews = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !summary || !content) {
      setFeedback('Error: All fields are required.')
      return
    }

    setIsSubmitting(true)
    setFeedback('')

    try {
      const res = await fetch(apiUrl('/api/news'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          title,
          summary,
          content,
          category,
          tags: tags.split(',').map(t => t.trim())
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setFeedback('Success! News article published live.')
        setTitle('')
        setSummary('')
        setContent('')
        fetchDashboardData()
      } else {
        setFeedback(`Failed: ${data.error || 'Server rejected article'}`)
      }
    } catch {
      setFeedback('Error: Failed to connect to server.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteNews = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news article?')) return
    try {
      const res = await fetch(apiUrl(`/api/admin/news/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      })
      if (res.ok) {
        setNewsArticles(prev => prev.filter(n => n.id !== id))
      }
    } catch (err) {
      console.error('Delete news error:', err)
    }
  }

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return
    try {
      const res = await fetch(apiUrl(`/api/admin/messages/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      })
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== id))
      }
    } catch (err) {
      console.error('Delete message error:', err)
    }
  }

  const handleDeleteGuestbook = async (id: string) => {
    if (!confirm('Are you sure you want to delete this guestbook signature?')) return
    try {
      const res = await fetch(apiUrl(`/api/admin/guestbook/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      })
      if (res.ok) {
        setGuestbookEntries(prev => prev.filter(g => g.id !== id))
      }
    } catch (err) {
      console.error('Delete guestbook error:', err)
    }
  }

  if (loadingVerify || !adminToken) {
    return (
      <div className="min-h-screen bg-[var(--color-surface-base)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)] flex flex-col md:flex-row">
      {/* Sidebar (Issue 5.11: Fully responsive on mobile with toggleable drawer) */}
      <aside className="w-full md:w-64 bg-[var(--color-surface-card)] border-r border-[var(--color-border)] flex flex-col shrink-0">
        <div className="p-4 sm:p-6 border-b border-[var(--color-border)] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[var(--color-primary)] font-serif font-bold text-base sm:text-lg">
              <ShieldCheck className="w-5 h-5" /> Admin Control
            </div>
            <p className="text-[11px] font-mono text-[var(--color-text-muted)] mt-0.5">Quadri Amoo Portal</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboardData}
              title="Refresh data"
              className="p-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col flex-grow`}>
          <nav className="p-4 flex-grow space-y-1.5">
            <button
              onClick={() => {
                setActiveTab('news')
                setMobileMenuOpen(false)
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-mono text-sm transition-colors cursor-pointer ${
                activeTab === 'news'
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/30 font-bold'
                  : 'text-[var(--color-text-muted)] hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-3">
                <Newspaper className="w-4 h-4" /> Announcements
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                {newsArticles.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('messages')
                setMobileMenuOpen(false)
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-mono text-sm transition-colors cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/30 font-bold'
                  : 'text-[var(--color-text-muted)] hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-3">
                <Mail className="w-4 h-4" /> Inquiries & Messages
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${messages.length > 0 ? 'bg-[var(--color-primary)] text-black font-bold' : 'bg-neutral-800 text-neutral-300'}`}>
                {messages.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('guestbook')
                setMobileMenuOpen(false)
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-mono text-sm transition-colors cursor-pointer ${
                activeTab === 'guestbook'
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/30 font-bold'
                  : 'text-[var(--color-text-muted)] hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" /> Guestbook Signatures
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                {guestbookEntries.length}
              </span>
            </button>
          </nav>

          <div className="p-4 border-t border-[var(--color-border)]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-mono text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Secure Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 sm:p-10 overflow-y-auto">
        
        {/* --- TAB 1: NEWS PUBLISHING & MANAGEMENT --- */}
        {activeTab === 'news' && (
          <div className="space-y-10 max-w-4xl">
            {/* Create New Announcement Form */}
            <div className="bg-[var(--color-surface-card)] rounded-3xl border border-[var(--color-border)] p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold">Publish New Announcement</h2>
                  <p className="text-xs font-mono text-[var(--color-text-muted)]">Post research milestones, news, and project releases live</p>
                </div>
              </div>

              <form onSubmit={handlePublishNews} className="space-y-5">
                <div>
                  <label className="block text-xs font-mono text-[var(--color-text-subtle)] mb-1.5 uppercase">Article Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="e.g. Published Paper on Geospatial Recommender Systems..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[var(--color-text-subtle)] mb-1.5 uppercase">Category</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                    >
                      <option value="Research">Research</option>
                      <option value="Industry">Industry</option>
                      <option value="Academics">Academics</option>
                      <option value="Awards">Awards</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[var(--color-text-subtle)] mb-1.5 uppercase">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={tags}
                      onChange={e => setTags(e.target.value)}
                      className="w-full bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                      placeholder="e.g. AI, NLP, Research"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--color-text-subtle)] mb-1.5 uppercase">Short Summary (Preview Card) *</label>
                  <textarea
                    value={summary}
                    onChange={e => setSummary(e.target.value)}
                    rows={2}
                    className="w-full bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] resize-none"
                    placeholder="Brief 1-2 sentence overview shown on the home page."
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--color-text-subtle)] mb-1.5 uppercase">Full Article Content *</label>
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows={6}
                    className="w-full bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] resize-none"
                    placeholder="Full detailed article text. Supports multiple paragraphs with line breaks."
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className={`text-xs font-mono ${feedback.includes('Error') || feedback.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
                    {feedback}
                  </span>
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Publishing live...' : 'Publish Announcement'}
                  </Button>
                </div>
              </form>
            </div>

            {/* List of Existing Articles */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-bold">Currently Published Articles ({newsArticles.length})</h3>
              <div className="space-y-3">
                {newsArticles.map(article => (
                  <div
                    key={article.id}
                    className="p-4 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="primary" size="sm">{article.category}</Badge>
                        <span className="text-xs font-mono text-[var(--color-text-subtle)]">{article.date}</span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-[var(--color-text-main)]">{article.title}</h4>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-1">{article.summary}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteNews(article.id)}
                      className="self-end sm:self-center p-2 rounded-xl text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: CONTACT MESSAGES --- */}
        {activeTab === 'messages' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-serif font-bold">Contact Inquiries ({messages.length})</h2>
                <p className="text-xs font-mono text-[var(--color-text-muted)]">Real submissions received from the contact form</p>
              </div>
            </div>

            {messages.length === 0 ? (
              <div className="p-12 text-center bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)]">
                <Mail className="w-10 h-10 text-[var(--color-text-muted)] mx-auto mb-3" />
                <p className="text-sm font-mono text-[var(--color-text-muted)]">No messages received yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className="p-6 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--color-border)]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-base">{msg.name}</span>
                          <span className="text-xs font-mono text-[var(--color-primary)]">
                            &lt;{msg.email}&gt;
                          </span>
                        </div>
                        <div className="text-xs font-mono text-[var(--color-text-muted)] mt-0.5 flex items-center gap-2">
                          <span>Subject: {msg.subject}</span>
                          {msg.lens && <span>• [{msg.lens.toUpperCase()}]</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-[var(--color-text-subtle)] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(msg.timestamp).toLocaleString()}
                        </span>
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                          className="px-3 py-1 rounded-lg text-xs font-mono bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/20"
                        >
                          Reply
                        </a>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[var(--color-text-main)] whitespace-pre-wrap leading-relaxed font-sans pt-1">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB 3: GUESTBOOK MODERATION --- */}
        {activeTab === 'guestbook' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h2 className="text-2xl font-serif font-bold">Guestbook Moderation ({guestbookEntries.length})</h2>
              <p className="text-xs font-mono text-[var(--color-text-muted)]">Manage public visitor signatures and messages</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guestbookEntries.map(entry => (
                <div
                  key={entry.id}
                  className="p-5 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-[var(--color-text-main)]">{entry.name}</span>
                      <button
                        onClick={() => handleDeleteGuestbook(entry.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {entry.message && (
                      <p className="text-xs text-[var(--color-text-muted)] mb-3 italic">
                        "{entry.message}"
                      </p>
                    )}

                    {entry.signatureData && (
                      <div className="p-2 bg-neutral-900 rounded-lg mb-2 flex justify-center">
                        <img
                          src={entry.signatureData}
                          alt={`${entry.name}'s signature`}
                          className="h-12 object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-[var(--color-text-subtle)] pt-2 border-t border-[var(--color-border)]">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
