import React, { useState, useEffect } from 'react'
import { Newspaper, Calendar, Clock, PlusCircle, X, CheckCircle2, ArrowRight } from 'lucide-react'
import { SectionHeader } from '../components/SectionHeader'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'

export interface NewsItem {
  id: string
  title: string
  date: string
  category: 'Research' | 'Industry' | 'Academics' | 'Awards'
  summary: string
  content: string
  author: string
  readTime: string
  tags: string[]
  externalUrl?: string
  isPinned?: boolean
}

export const NewsSection: React.FC = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [publishModalOpen, setPublishModalOpen] = useState(false)

  // Publish Form state
  const [form, setForm] = useState({
    title: '',
    category: 'Research' as NewsItem['category'],
    summary: '',
    content: '',
    tags: ''
  })
  const [publishing, setPublishing] = useState(false)
  const [publishStatus, setPublishStatus] = useState('')

  const fetchNews = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/news`)
      const data = await res.json()
      if (res.ok && data.success) {
        setNewsList(data.data)
      } else {
        throw new Error('API error')
      }
    } catch (err) {
      console.warn('Backend news API offline, using fallback:', err)
      setNewsList([
        {
          id: 'news-dsu-assistantship',
          title: 'Appointed NYSC Research Assistant under Prof. Jude Sinebe at Delta State University',
          date: 'Sept 2025',
          category: 'Research',
          summary: 'Selected to join the Computer Science postgraduate research lab at Delta State University, investigating applied data science and software reliability.',
          content: 'I am honored to serve as a NYSC Research Assistant in the Department of Computer Science at Delta State University, Asaba under the mentorship of Professor Jude Sinebe. Our research focuses on computational intelligence, machine learning model evaluation, and software quality assurance methodologies.',
          author: 'Quadri Ayomikun Amoo',
          readTime: '2 min read',
          tags: ['Research Assistantship', 'Delta State Univ', 'Prof Jude Sinebe', 'AI'],
          isPinned: true
        },
        {
          id: 'news-cleanreport-launch',
          title: 'CleanReport Civic-Tech PWA Successfully Deployed at Circo Digital Academy',
          date: 'August 2026',
          category: 'Industry',
          summary: 'As sole frontend engineer on the 5-member team, I built CleanReport—a civic sanitation PWA supporting offline issue queueing and real-time map pinning.',
          content: 'During the 8-week Circo Digital Academy Orange Internship Programme, our cross-functional team delivered CleanReport. I engineered the offline PWA synchronization architecture, HTML5 Geolocation map integration, and responsive user dashboard.',
          author: 'Quadri Ayomikun Amoo',
          readTime: '3 min read',
          tags: ['CleanReport PWA', 'Circo Digital Academy', 'React', 'Offline Sync'],
          isPinned: true
        },
        {
          id: 'news-best-graduating-awards',
          title: 'Awarded 4 Best Graduating Student Subject Honors at First Technical University',
          date: 'Sept 2024',
          category: 'Awards',
          summary: 'Graduated in the Top 10% of Software Engineering class with a 5.0/5.0 Major GPA and top marks in Operating Systems, HCI, SE Practice, and Data Structures.',
          content: 'Recognized at graduation as the Best Graduating Student across four core curriculum areas: Operating Systems I, Human Computer Interaction, Software Engineering Professional Practice, and Fundamentals of Data Structures.',
          author: 'Quadri Ayomikun Amoo',
          readTime: '2 min read',
          tags: ['5.0/5.0 Major GPA', 'Best Graduating Student', 'Academic Honors'],
          isPinned: false
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.summary || !form.content) return
    setPublishing(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        setPublishStatus('News published successfully!')
        setForm({ title: '', category: 'Research', summary: '', content: '', tags: '' })
        fetchNews()
        setTimeout(() => {
          setPublishModalOpen(false)
          setPublishStatus('')
        }, 1200)
      } else {
        throw new Error(data.error || 'Failed to publish')
      }
    } catch (err) {
      console.error('Publish news failed:', err)
      setPublishStatus('Published locally to news feed.')
      const localNewsItem: NewsItem = {
        id: `news-${Date.now()}`,
        title: form.title,
        date: 'Just Now',
        category: form.category,
        summary: form.summary,
        content: form.content,
        author: 'Quadri Ayomikun Amoo',
        readTime: '1 min read',
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : ['News']
      }
      setNewsList(prev => [localNewsItem, ...prev])
      setTimeout(() => {
        setPublishModalOpen(false)
        setPublishStatus('')
      }, 1200)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <section id="news" className="py-20 bg-[var(--color-surface-base)] border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-primary)] font-semibold flex items-center gap-1.5">
              <Newspaper className="w-4 h-4" /> Latest Updates & Articles
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[var(--color-text-main)] mt-1">
              News & Announcements
            </h2>
          </div>

          <Button
            onClick={() => setPublishModalOpen(true)}
            variant="outline"
            size="sm"
            icon={<PlusCircle className="w-4 h-4 text-[var(--color-primary)]" />}
          >
            Publish Announcement
          </Button>
        </div>

        {/* News Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsList.map((item) => (
            <div key={item.id} className="card-elevated p-6 bg-[var(--color-surface-card)] flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="primary" size="sm">{item.category}</Badge>
                  <span className="text-xs font-mono text-[var(--color-text-subtle)] flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {item.date}
                  </span>
                </div>

                <h3 className="text-lg font-serif font-bold text-[var(--color-text-main)] mb-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mb-4">
                  {item.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-[var(--color-text-subtle)] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.readTime}
                </span>
                <button
                  onClick={() => setSelectedNews(item)}
                  className="text-xs font-mono text-[var(--color-primary)] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Reader Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge variant="primary" size="md" className="mb-2">{selectedNews.category}</Badge>
                <h3 className="text-2xl font-serif font-bold text-[var(--color-text-main)]">
                  {selectedNews.title}
                </h3>
                <div className="flex items-center gap-4 text-xs font-mono text-[var(--color-text-subtle)] mt-1">
                  <span>By {selectedNews.author}</span>
                  <span>• {selectedNews.date}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedNews(null)}
                aria-label="Close reader"
                className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed border-t border-[var(--color-border)] pt-4">
              {selectedNews.content}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[var(--color-border)]">
              {selectedNews.tags.map((t, i) => (
                <Badge key={i} variant="subtle" size="sm">{t}</Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Publish News Modal */}
      {publishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handlePublishSubmit} className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-serif font-bold text-[var(--color-text-main)]">
                Publish New Announcement
              </h3>
              <button
                type="button"
                onClick={() => setPublishModalOpen(false)}
                className="p-2 rounded-lg text-[var(--color-text-muted)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {publishStatus && (
              <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{publishStatus}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-[var(--color-text-muted)] mb-1">Headline Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Paper Accepted / Project Launched..."
                className="w-full px-3.5 py-2 rounded-lg bg-[var(--color-surface-base)] border border-[var(--color-border)] text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-[var(--color-text-muted)] mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value as NewsItem['category'] })}
                  className="w-full px-3.5 py-2 rounded-lg bg-[var(--color-surface-base)] border border-[var(--color-border)] text-sm"
                >
                  <option value="Research">Research</option>
                  <option value="Industry">Industry</option>
                  <option value="Academics">Academics</option>
                  <option value="Awards">Awards</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--color-text-muted)] mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })}
                  placeholder="AI, Paper, Award"
                  className="w-full px-3.5 py-2 rounded-lg bg-[var(--color-surface-base)] border border-[var(--color-border)] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--color-text-muted)] mb-1">Summary *</label>
              <input
                type="text"
                required
                value={form.summary}
                onChange={e => setForm({ ...form, summary: e.target.value })}
                placeholder="Brief 1-sentence overview..."
                className="w-full px-3.5 py-2 rounded-lg bg-[var(--color-surface-base)] border border-[var(--color-border)] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--color-text-muted)] mb-1">Full Content *</label>
              <textarea
                required
                rows={4}
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                placeholder="Detailed announcement content..."
                className="w-full px-3.5 py-2 rounded-lg bg-[var(--color-surface-base)] border border-[var(--color-border)] text-sm"
              />
            </div>

            <Button type="submit" variant="primary" size="md" disabled={publishing} className="w-full">
              {publishing ? 'Publishing...' : 'Publish Update to API'}
            </Button>
          </form>
        </div>
      )}
    </section>
  )
}
