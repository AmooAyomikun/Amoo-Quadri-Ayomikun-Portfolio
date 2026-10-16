import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Newspaper, Calendar, Clock, PlusCircle, X, CheckCircle2, ArrowRight, Loader2, BookOpen } from 'lucide-react'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { apiUrl, getAdminToken, setAdminToken } from '../lib/api'

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
        setNewsList(data.data)
      } else {
        throw new Error('API response invalid')
      }
    } catch (err) {
      console.warn('Backend news API unavailable, using fallback:', err)
      setNewsList([
        {
          id: 'news-dsu-assistantship',
          title: 'Appointed NYSC Research Assistant under Prof. Jude Sinebe',
          date: 'Sept 2025',
          category: 'Research',
          summary: 'Selected to join the Computer Science postgraduate research lab, investigating applied data science and software reliability.',
          content: 'I am profoundly honored to announce my appointment as a Research Assistant within the Department of Computer Science, serving under the esteemed mentorship of Professor Jude Sinebe during my NYSC service year. This role represents a pivotal step in my academic and professional journey, allowing me to bridge the gap between theoretical computer science and practical, industry-standard software engineering.\n\nIn this capacity, my primary research focus is directed towards computational intelligence, the rigorous evaluation of machine learning models, and advanced software quality assurance methodologies. We are currently investigating how data-driven paradigms can be leveraged to improve the reliability and fault-tolerance of complex software systems.\n\nWorking in the postgraduate research lab provides an intellectually stimulating environment where I collaborate on empirical data analysis, algorithm optimization, and technical documentation. I am actively involved in developing script pipelines for data processing and assisting in the preparation of research manuscripts for peer-reviewed journals. This assistantship not only hones my technical acumen but also reinforces my commitment to advancing the frontiers of applied artificial intelligence and intelligent computing.',
          author: 'Quadri Ayomikun Amoo',
          readTime: '2 min read',
          tags: ['Research Assistantship', 'Computer Science', 'Prof Jude Sinebe', 'AI'],
          isPinned: true
        },
        {
          id: 'news-cleanreport-launch',
          title: 'CleanReport Civic-Tech PWA Successfully Deployed at Circo Digital Academy',
          date: 'August 2026',
          category: 'Industry',
          summary: 'As sole frontend engineer on the 5-member team, I built CleanReport—a civic sanitation PWA supporting offline issue queueing and real-time map pinning.',
          content: 'I am thrilled to share the successful deployment of CleanReport, a civic-technology sanitation platform developed during the intensive 8-week Orange Internship Programme at Circo Digital Academy. Serving as the sole frontend engineer in a dynamic, cross-functional team of five, I was tasked with architecture and building a robust, highly accessible user interface that empowers citizens to report environmental hazards seamlessly.\n\nCleanReport is built as a Progressive Web Application (PWA) with a strong emphasis on offline-first capabilities. I engineered a sophisticated synchronization architecture using Service Workers and IndexedDB, ensuring that users can log sanitation issues even in areas with poor cellular connectivity. Once the network is restored, the application automatically queues and syncs the localized data with our backend servers.\n\nAdditionally, I integrated the HTML5 Geolocation API and interactive mapping tools to allow precise marker positioning for reported issues. The dashboard provides real-time notifications, image upload compression, and administrative triage controls. This project stands as a testament to the power of civic tech in driving community engagement and showcases my ability to deliver production-ready, performant web applications under tight deadlines.',
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
          content: 'It is with immense gratitude and pride that I reflect on my graduation from First Technical University (now Abiola Ajimobi Technical University), where I was honored to receive the Best Graduating Student award in four core software engineering disciplines. Achieving a perfect 5.0/5.0 Major GPA and graduating in the Top 10% of my class was the culmination of years of rigorous academic discipline and a deep-seated passion for computer science.\n\nThe four subject honors I received encompass critical areas of software engineering: Operating Systems I, Human Computer Interaction, Software Engineering Professional Practice, and Fundamentals of Data Structures. Mastering these subjects required a holistic understanding of how low-level system architecture interacts with user-centric design, as well as the ethical and professional standards required to build software at scale.\n\nThese accolades are not just a reflection of academic grades, but a validation of my problem-solving methodology, algorithmic thinking, and dedication to continuous learning. I extend my deepest appreciation to my lecturers, mentors, and peers who challenged and inspired me throughout this journey. As I transition further into the tech industry and advanced research, these foundational pillars will continue to guide my approach to engineering intelligent, high-performance systems.',
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
    } catch (err: any) {
      console.error('Publish news failed:', err)
      setPublishError(err.message || 'Error: Could not connect to publish server.')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <section id="news" className="py-20 bg-[var(--color-surface-base)] border-t border-[var(--color-border)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-primary)] font-semibold flex items-center gap-1.5">
              <Newspaper className="w-4 h-4" /> Latest Updates & Articles
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[var(--color-text-main)] mt-1">
              News & Announcements
            </h2>
          </div>

          <button
            onClick={() => setPublishModalOpen(true)}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-[var(--color-surface-card)] text-[var(--color-text-main)] hover:text-[var(--color-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Post Update</span>
          </button>
        </div>

        {/* News Items Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {newsList.map((item) => (
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
              }}
              whileHover={{ y: -5, scale: 1.02 }}
              key={item.id} 
              className="card-elevated p-6 bg-[var(--color-surface-card)] flex flex-col justify-between h-full rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-xl hover:border-[var(--color-primary)] transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Badge variant="primary" size="sm">{item.category}</Badge>
                  <span className="text-xs font-mono text-[var(--color-text-subtle)] flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {item.date}
                  </span>
                </div>

                <h3 
                  onClick={() => setSelectedNews(item)}
                  className="text-lg font-serif font-bold text-[var(--color-text-main)] mb-2 leading-snug cursor-pointer group-hover:text-[var(--color-primary)] transition-colors"
                >
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
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedNews(item)}
                    className="text-xs font-mono text-[var(--color-primary)] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* Reader Modal (Issue 3.9) */}
      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl relative"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant="primary" size="md" className="mb-2">{selectedNews.category}</Badge>
                  <h3 className="text-2xl font-serif font-bold text-[var(--color-text-main)]">
                    {selectedNews.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs font-mono text-[var(--color-text-subtle)] mt-1">
                    <span>By {selectedNews.author}</span>
                    <span>• {selectedNews.date}</span>
                    <span>• {selectedNews.readTime}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNews(null)}
                  aria-label="Close reader"
                  className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-sm text-[var(--color-text-muted)] leading-relaxed border-t border-[var(--color-border)] pt-4 whitespace-pre-line font-sans">
                {selectedNews.content}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--color-border)]">
                <div className="flex flex-wrap gap-1.5">
                  {selectedNews.tags.map((t, i) => (
                    <Badge key={i} variant="subtle" size="sm">{t}</Badge>
                  ))}
                </div>
                
                <Link
                  to={`/news/${selectedNews.id}`}
                  className="text-xs font-mono text-[var(--color-primary)] hover:underline flex items-center gap-1"
                >
                  <span>Open Dedicated Page</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Publish Modal (Issue 3.9 & 2.1) */}
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
                      onChange={e => setForm(prev => ({ ...prev, category: e.target.value as any }))}
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
