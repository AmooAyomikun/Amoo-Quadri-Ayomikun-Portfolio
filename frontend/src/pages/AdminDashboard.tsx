import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Newspaper, ShieldCheck, Mail, MessageSquare, Users, Loader2, RefreshCw, Menu, X } from 'lucide-react'
import { apiUrl, getAdminToken, clearAdminToken } from '../lib/api'
import { SEO } from '../components/SEO'
import { AdminNewsTab, type NewsItem } from '../components/admin/AdminNewsTab'
import { AdminMessagesTab, type ContactMessage } from '../components/admin/AdminMessagesTab'
import { AdminGuestbookTab, type GuestbookEntry } from '../components/admin/AdminGuestbookTab'
import { AdminSubscribersTab, type SubscriberItem } from '../components/admin/AdminSubscribersTab'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'news' | 'messages' | 'guestbook' | 'subscribers'>('news')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [adminToken, setAdminTokenState] = useState<string | null>(null)
  const [loadingVerify, setLoadingVerify] = useState(true)

  // Data collections
  const [newsArticles, setNewsArticles] = useState<NewsItem[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([])
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([])
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

  const fetchDashboardData = useCallback(async () => {
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
        else if (Array.isArray(json.entries)) setGuestbookEntries(json.entries)
      }

      // 4. Fetch Subscribers
      const subRes = await fetch(apiUrl('/api/admin/subscribers'), {
        headers: { Authorization: `Bearer ${adminToken}` }
      })
      if (subRes.ok) {
        const json = await subRes.json()
        if (Array.isArray(json.data)) setSubscribers(json.data)
      }
    } catch (err) {
      console.warn('Error loading dashboard data:', err)
    } finally {
      setLoadingData(false)
    }
  }, [adminToken])

  useEffect(() => {
    if (adminToken) {
      fetchDashboardData()
    }
  }, [adminToken, fetchDashboardData])

  const handleLogout = () => {
    clearAdminToken()
    navigate('/')
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
      <SEO title="Admin Dashboard" description="Portfolio content and telemetry management." canonicalUrl="/admin/dashboard" noIndex />
      {/* Sidebar */}
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
              onClick={() => setMobileMenuOpen((prev) => !prev)}
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

            <button
              onClick={() => {
                setActiveTab('subscribers')
                setMobileMenuOpen(false)
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-mono text-sm transition-colors cursor-pointer ${
                activeTab === 'subscribers'
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/30 font-bold'
                  : 'text-[var(--color-text-muted)] hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-3">
                <Users className="w-4 h-4" /> Gmail Subscribers
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                {subscribers.filter(s => s.status === 'active').length}
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
        {activeTab === 'news' && (
          <AdminNewsTab
            adminToken={adminToken}
            newsArticles={newsArticles}
            setNewsArticles={setNewsArticles}
            onRefresh={fetchDashboardData}
          />
        )}

        {activeTab === 'messages' && (
          <AdminMessagesTab
            adminToken={adminToken}
            messages={messages}
            setMessages={setMessages}
          />
        )}

        {activeTab === 'guestbook' && (
          <AdminGuestbookTab
            adminToken={adminToken}
            guestbookEntries={guestbookEntries}
            setGuestbookEntries={setGuestbookEntries}
          />
        )}

        {activeTab === 'subscribers' && (
          <AdminSubscribersTab subscribers={subscribers} />
        )}
      </main>
    </div>
  )
}
