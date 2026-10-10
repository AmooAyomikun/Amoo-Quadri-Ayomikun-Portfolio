import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Newspaper, Plus, ShieldCheck, Trash2 } from 'lucide-react'
import { Button } from '../components/Button'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [adminKey, setAdminKey] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'news' | 'messages'>('news')

  // News Form State
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Research')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    const key = localStorage.getItem('admin_key')
    if (key !== 'quadri2026') {
      navigate('/admin') // Redirect to login if not authenticated
    } else {
      setAdminKey(key)
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('admin_key')
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
      const apiUrl = import.meta.env.PROD 
        ? 'https://portfolio-backend-st78.onrender.com/api/news' 
        : 'http://localhost:5000/api/news'

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey || ''
        },
        body: JSON.stringify({
          title,
          summary,
          content,
          category,
          adminPassphrase: adminKey
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setFeedback('Success! News article published live.')
        setTitle('')
        setSummary('')
        setContent('')
      } else {
        setFeedback(`Failed: ${data.error || 'Unknown error'}`)
      }
    } catch (err) {
      setFeedback('Error: Failed to connect to server.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!adminKey) return null

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--color-surface-card)] border-r border-[var(--color-border)] flex flex-col">
        <div className="p-6 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3 text-[var(--color-primary)] font-serif font-bold text-xl mb-1">
            <ShieldCheck className="w-6 h-6" /> Admin
          </div>
          <p className="text-xs font-mono text-[var(--color-text-muted)]">Quadri Amoo Portal</p>
        </div>

        <nav className="p-4 flex-grow space-y-2">
          <button 
            onClick={() => setActiveTab('news')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-sm transition-colors ${activeTab === 'news' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/30' : 'text-[var(--color-text-muted)] hover:bg-white/5'}`}
          >
            <Newspaper className="w-4 h-4" /> Publish News
          </button>
        </nav>

        <div className="p-4 border-t border-[var(--color-border)]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-mono text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 sm:p-12 overflow-y-auto">
        <h1 className="text-3xl font-serif font-bold mb-8">Dashboard Overview</h1>

        {activeTab === 'news' && (
          <div className="max-w-3xl bg-[var(--color-surface-card)] rounded-3xl border border-[var(--color-border)] p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                <Plus className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <h2 className="text-xl font-serif font-bold">Publish New Article</h2>
            </div>

            <form onSubmit={handlePublishNews} className="space-y-6">
              <div>
                <label className="block text-xs font-mono text-[var(--color-text-subtle)] mb-2 uppercase">Article Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="e.g. Launched new AI feature..."
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--color-text-subtle)] mb-2 uppercase">Category</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                >
                  <option value="Research">Research</option>
                  <option value="Industry">Industry</option>
                  <option value="Awards">Awards</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--color-text-subtle)] mb-2 uppercase">Short Summary (Preview)</label>
                <textarea 
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  rows={2}
                  className="w-full bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] resize-none"
                  placeholder="Brief 1-2 sentences shown on the news card."
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--color-text-subtle)] mb-2 uppercase">Full Article Content</label>
                <textarea 
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={8}
                  className="w-full bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-primary)] resize-none"
                  placeholder="The full detailed article text. Use double newlines for paragraphs."
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <span className={`text-sm font-mono ${feedback.includes('Error') || feedback.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
                  {feedback}
                </span>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Publishing...' : 'Publish Article'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
