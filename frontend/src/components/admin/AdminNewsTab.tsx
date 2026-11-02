import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '../Button'
import { Badge } from '../Badge'
import { apiUrl } from '../../lib/api'

export interface NewsItem {
  id: string
  title: string
  date: string
  category: string
  summary: string
  content: string
}

interface AdminNewsTabProps {
  adminToken: string
  newsArticles: NewsItem[]
  setNewsArticles: React.Dispatch<React.SetStateAction<NewsItem[]>>
  onRefresh: () => void
}

export const AdminNewsTab: React.FC<AdminNewsTabProps> = ({
  adminToken,
  newsArticles,
  setNewsArticles,
  onRefresh
}) => {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Research')
  const [tags, setTags] = useState('Research, AI')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')

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
          tags: tags.split(',').map((t) => t.trim())
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setFeedback('Success! News article published live.')
        setTitle('')
        setSummary('')
        setContent('')
        onRefresh()
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
    if (!window.confirm('Are you sure you want to delete this news article?')) return
    try {
      const res = await fetch(apiUrl(`/api/admin/news/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      })
      if (res.ok) {
        setNewsArticles((prev) => prev.filter((n) => n.id !== id))
      }
    } catch (err) {
      console.error('Delete news error:', err)
    }
  }

  return (
    <div className="space-y-10 max-w-4xl">
      {/* Create New Announcement Form */}
      <div className="bg-[var(--color-surface-card)] rounded-3xl border border-[var(--color-border)] p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
            <Plus className="w-5 h-5 text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold">Publish New Announcement</h2>
            <p className="text-xs font-mono text-[var(--color-text-muted)]">
              Post research milestones, news, and project releases live
            </p>
          </div>
        </div>

        <form onSubmit={handlePublishNews} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-[var(--color-text-subtle)] mb-1.5 uppercase">
              Article Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="Research">Research</option>
                <option value="Industry">Industry</option>
                <option value="Academics">Academics</option>
                <option value="Awards">Awards</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-[var(--color-text-subtle)] mb-1.5 uppercase">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                placeholder="e.g. AI, NLP, Research"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--color-text-subtle)] mb-1.5 uppercase">
              Short Summary (Preview Card) *
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={2}
              className="w-full bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] resize-none"
              placeholder="Brief 1-2 sentence overview shown on the home page."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--color-text-subtle)] mb-1.5 uppercase">
              Full Article Content *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] resize-none"
              placeholder="Full detailed article text. Supports multiple paragraphs with line breaks."
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span
              className={`text-xs font-mono ${
                feedback.includes('Error') || feedback.includes('Failed') ? 'text-red-400' : 'text-green-400'
              }`}
            >
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
          {newsArticles.map((article) => (
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
                className="self-end sm:self-center p-2 rounded-xl text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors cursor-pointer"
                title="Delete Article"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminNewsTab
