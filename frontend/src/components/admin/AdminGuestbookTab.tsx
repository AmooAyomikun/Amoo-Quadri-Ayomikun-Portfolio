import React from 'react'
import { Trash2 } from 'lucide-react'
import { apiUrl } from '../../lib/api'

export interface GuestbookEntry {
  id: string
  name: string
  message: string
  signatureData: string
  timestamp: string
}

interface AdminGuestbookTabProps {
  adminToken: string
  guestbookEntries: GuestbookEntry[]
  setGuestbookEntries: React.Dispatch<React.SetStateAction<GuestbookEntry[]>>
}

export const AdminGuestbookTab: React.FC<AdminGuestbookTabProps> = ({
  adminToken,
  guestbookEntries,
  setGuestbookEntries
}) => {
  const handleDeleteGuestbook = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this guestbook signature?')) return
    try {
      const res = await fetch(apiUrl(`/api/admin/guestbook/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      })
      if (res.ok) {
        setGuestbookEntries((prev) => prev.filter((g) => g.id !== id))
      }
    } catch (err) {
      console.error('Delete guestbook error:', err)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-serif font-bold">Guestbook Moderation ({guestbookEntries.length})</h2>
        <p className="text-xs font-mono text-[var(--color-text-muted)]">Manage public visitor signatures and messages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guestbookEntries.map((entry) => (
          <div
            key={entry.id}
            className="p-5 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-[var(--color-text-main)]">{entry.name}</span>
                <button
                  onClick={() => handleDeleteGuestbook(entry.id)}
                  className="text-red-400 hover:text-red-300 p-1 rounded cursor-pointer"
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
  )
}

export default AdminGuestbookTab
