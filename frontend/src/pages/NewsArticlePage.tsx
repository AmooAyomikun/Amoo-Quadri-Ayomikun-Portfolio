import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Badge } from '../components/Badge'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { initialNewsData, type NewsItem } from '../content/newsData'
import { apiUrl } from '../lib/api'
import { SEO } from '../components/SEO'

export default function NewsArticlePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [news, setNews] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    
    const fetchNews = async () => {
      try {
        const res = await fetch(apiUrl('/api/news'))
        const data = await res.json()
        if (res.ok && data.success) {
          const found = data.data.find((n: NewsItem) => n.id === id)
          if (found) {
            setNews(found)
          } else {
            throw new Error('Not found')
          }
        }
      } catch (err) {
        // Fallback to initial local items if API fails or item not in API
        const found = initialNewsData.find(n => n.id === id)
        if (found) setNews(found)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-surface-base)] flex items-center justify-center">
        <div className="text-[var(--color-primary)] font-mono animate-pulse">Loading Article...</div>
      </div>
    )
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-[var(--color-surface-base)] flex items-center justify-center flex-col gap-4">
        <SEO title="Article Not Found" canonicalUrl="/news" />
        <h1 className="text-2xl font-serif text-[var(--color-text-main)]">Article not found.</h1>
        <button onClick={() => navigate('/news')} className="text-[var(--color-primary)] hover:underline font-mono">
          Return to News
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)] flex flex-col">
      <SEO 
        title={news.title}
        description={news.summary}
        canonicalUrl={`/news/${news.id}`}
        type="article"
      />
      <Navbar />
      <main className="flex-grow pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <button 
          onClick={() => navigate('/news')} 
          className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors mb-6 sm:mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to News
        </button>

        <article className="bg-[var(--color-surface-card)] rounded-2xl sm:rounded-3xl p-6 sm:p-12 border border-[var(--color-border)] shadow-xl sm:shadow-2xl">
          <Badge variant="primary" size="lg" className="mb-4 sm:mb-6">{news.category}</Badge>
          
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[var(--color-text-main)] leading-tight mb-4 sm:mb-6">
            {news.title}
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm font-mono text-[var(--color-text-subtle)] border-b border-[var(--color-border)] pb-6 sm:pb-8 mb-6 sm:mb-8">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-bold text-xs">
                {news.author.charAt(0)}
              </span>
              By {news.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {news.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> {news.readTime}
            </span>
          </div>

          <div className="prose prose-invert max-w-none mb-10 sm:mb-12">
            <p className="text-base sm:text-lg leading-relaxed text-[var(--color-text-muted)] font-medium mb-6">
              {news.summary}
            </p>
            <div className="text-sm sm:text-base leading-relaxed text-[var(--color-text-main)] space-y-4 sm:space-y-6">
              {news.content.replace(/\\n/g, '\n').split(/\n+/).filter(Boolean).map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-8 border-t border-[var(--color-border)]">
            {news.tags.map((tag, i) => (
              <Badge key={i} variant="subtle" size="sm">{tag}</Badge>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
