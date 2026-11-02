import React from 'react'
import { Mail, Clock, Trash2 } from 'lucide-react'
import { apiUrl } from '../../lib/api'

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  lens?: string
  timestamp: string
}

interface AdminMessagesTabProps {
  adminToken: string
  messages: ContactMessage[]
  setMessages: React.Dispatch<React.SetStateAction<ContactMessage[]>>
}

export const AdminMessagesTab: React.FC<AdminMessagesTabProps> = ({
  adminToken,
  messages,
  setMessages
}) => {
  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return
    try {
      const res = await fetch(apiUrl(`/api/admin/messages/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      })
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id))
      }
    } catch (err) {
      console.error('Delete message error:', err)
    }
  }

  return (
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
          {messages.map((msg) => (
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
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
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
  )
}

export default AdminMessagesTab
