import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
    tags: '',
    adminKey: ''
  })
  const [publishing, setPublishing] = useState(false)
  const [publishStatus, setPublishStatus] = useState('')
  const [publishError, setPublishError] = useState('')

  const fetchNews = async () => {
    try {
      const apiUrl = import.meta.env.PROD 
        ? 'https://portfolio-backend-st78.onrender.com/api/news' 
        : 'http://localhost:5000/api/news'
      const res = await fetch(apiUrl)
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
          title: 'Appointed NYSC Research Assistant under Prof. Jude Sinebe',
          date: 'Sept 2025',
          category: 'Research',
          summary: 'Selected to join the Computer Science postgraduate research lab, investigating applied data science and software reliability.',
          content: 'I am profoundly honored to announce my appointment as a Research Assistant within the Department of Computer Science, serving under the esteemed mentorship of Professor Jude Sinebe during my NYSC service year. This role represents a pivotal step in my academic and professional journey, allowing me to bridge the gap between theoretical computer science and practical, industry-standard software engineering.\\n\\nIn this capacity, my primary research focus is directed towards computational intelligence, the rigorous evaluation of machine learning models, and advanced software quality assurance methodologies. We are currently investigating how data-driven paradigms can be leveraged to improve the reliability and fault-tolerance of complex software systems.\\n\\nWorking in the postgraduate research lab provides an intellectually stimulating environment where I collaborate on empirical data analysis, algorithm optimization, and technical documentation. I am actively involved in developing script pipelines for data processing and assisting in the preparation of research manuscripts for peer-reviewed journals. This assistantship not only hones my technical acumen but also reinforces my commitment to advancing the frontiers of applied artificial intelligence and intelligent computing.',
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
          content: 'I am thrilled to share the successful deployment of CleanReport, a civic-technology sanitation platform developed during the intensive 8-week Orange Internship Programme at Circo Digital Academy. Serving as the sole frontend engineer in a dynamic, cross-functional team of five, I was tasked with architecture and building a robust, highly accessible user interface that empowers citizens to report environmental hazards seamlessly.\\n\\nCleanReport is built as a Progressive Web Application (PWA) with a strong emphasis on offline-first capabilities. I engineered a sophisticated synchronization architecture using Service Workers and IndexedDB, ensuring that users can log sanitation issues even in areas with poor cellular connectivity. Once the network is restored, the application automatically queues and syncs the localized data with our backend servers.\\n\\nAdditionally, I integrated the HTML5 Geolocation API and interactive mapping tools to allow precise marker positioning for reported issues. The dashboard provides real-time notifications, image upload compression, and administrative triage controls. This project stands as a testament to the power of civic tech in driving community engagement and showcases my ability to deliver production-ready, performant web applications under tight deadlines.',
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
          content: 'It is with immense gratitude and pride that I reflect on my graduation from First Technical University (now Abiola Ajimobi Technical University), where I was honored to receive the Best Graduating Student award in four core software engineering disciplines. Achieving a perfect 5.0/5.0 Major GPA and graduating in the Top 10% of my class was the culmination of years of rigorous academic discipline and a deep-seated passion for computer science.\\n\\nThe four subject honors I received encompass critical areas of software engineering: Operating Systems I, Human Computer Interaction, Software Engineering Professional Practice, and Fundamentals of Data Structures. Mastering these subjects required a holistic understanding of how low-level system architecture interacts with user-centric design, as well as the ethical and professional standards required to build software at scale.\\n\\nThese accolades are not just a reflection of academic grades, but a validation of my problem-solving methodology, algorithmic thinking, and dedication to continuous learning. I extend my deepest appreciation to my lecturers, mentors, and peers who challenged and inspired me throughout this journey. As I transition further into the tech industry and advanced research, these foundational pillars will continue to guide my approach to engineering intelligent, high-performance systems.',
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

    if (form.adminKey.trim().toLowerCase() !== 'quadri2026' && form.adminKey.trim().toLowerCase() !== 'quadri') {
      setPublishError('Unauthorized: Only Quadri Amoo (Admin) is authorized to publish announcements.')
      return
    }

    if (!form.title || !form.summary || !form.content) return
    setPublishing(true)

    try {
      const apiUrl = import.meta.env.PROD 
        ? 'https://portfolio-backend-st78.onrender.com/api/news' 
        : 'http://localhost:5000/api/news'
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-key': 'quadri2026'
        },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          summary: form.summary,
          content: form.content,
          tags: form.tags ? form.tags.split(',').map(t => t.trim()) : ['Update'],
          adminPassphrase: form.adminKey
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setPublishStatus('News published successfully!')
        setForm({ title: '', category: 'Research', summary: '', content: '', tags: '', adminKey: '' })
        fetchNews()
        setTimeout(() => {
          setPublishModalOpen(false)
          setPublishStatus('')
        }, 1200)
      } else {
        throw new Error(data.error || 'Failed to publish')
      }
    } catch (err: any) {
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
              className="card-elevated p-6 bg-[var(--color-surface-card)] flex flex-col justify-between h-full rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-xl hover:border-[var(--color-primary)] transition-all duration-300"
            >
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
                <Link
                  to={`/news/${item.id}`}
                  className="text-xs font-mono text-[var(--color-primary)] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

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


    </section>
  )
}
