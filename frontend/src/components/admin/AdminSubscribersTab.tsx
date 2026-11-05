import React, { useState } from 'react'
import { Users, Copy, Check, Mail, Calendar } from 'lucide-react'
import { Badge } from '../Badge'

export interface SubscriberItem {
  id: string
  email: string
  status: 'active' | 'unsubscribed'
  subscribedAt: string
}

interface AdminSubscribersTabProps {
  subscribers: SubscriberItem[]
}

export const AdminSubscribersTab: React.FC<AdminSubscribersTabProps> = ({ subscribers }) => {
  const [copied, setCopied] = useState(false)

  const activeSubscribers = subscribers.filter((s) => s.status === 'active')

  const handleCopyAllEmails = () => {
    const list = activeSubscribers.map((s) => s.email).join(', ')
    if (!list) return
    navigator.clipboard.writeText(list)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[var(--color-primary)]" />
            <span>Newsletter &amp; Gmail Subscribers</span>
          </h2>
          <p className="text-xs font-mono text-[var(--color-text-muted)] mt-1">
            Readers subscribed to receive your new research &amp; engineering dispatches ({activeSubscribers.length} active)
          </p>
        </div>

        {activeSubscribers.length > 0 && (
          <button
            type="button"
            onClick={handleCopyAllEmails}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-xs font-mono font-semibold text-[var(--color-text-main)] hover:text-[var(--color-primary)] transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied {activeSubscribers.length} emails!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Active Emails</span>
              </>
            )}
          </button>
        )}
      </div>

      {subscribers.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[var(--color-surface-card)] border border-dashed border-[var(--color-border)] text-center text-sm font-mono text-[var(--color-text-muted)]">
          No subscribers recorded yet.
        </div>
      ) : (
        <div className="space-y-3">
          {subscribers.map((sub) => (
            <div
              key={sub.id || sub.email}
              className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-surface-base)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-mono font-bold text-[var(--color-text-main)] truncate">
                    {sub.email}
                  </p>
                  <p className="text-[11px] font-mono text-[var(--color-text-subtle)] flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {sub.subscribedAt
                        ? new Date(sub.subscribedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : 'Subscribed'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Badge variant={sub.status === 'active' ? 'primary' : 'subtle'} size="sm">
                  {sub.status === 'active' ? 'Active' : 'Unsubscribed'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default AdminSubscribersTab
