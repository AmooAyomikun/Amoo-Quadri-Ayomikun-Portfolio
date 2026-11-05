import React from 'react'
import { motion } from 'framer-motion'
import type { TopCountry } from '../hooks/useVisitorStats'

interface VisitorLeaderboardProps {
  leaderboard: TopCountry[]
  maxCount: number
  connectionStatus: 'connecting' | 'connected' | 'offline'
}

const titleCase = (s: string) => {
  if (!s) return ''
  return s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())
}

export const VisitorLeaderboard: React.FC<VisitorLeaderboardProps> = ({
  leaderboard,
  maxCount,
  connectionStatus
}) => {
  return (
    <aside className="lg:col-span-4">
      <h3 className="text-sm font-semibold text-[var(--color-text-main)]">Top countries</h3>
      <p className="text-xs font-mono text-[var(--color-text-muted)]/75 mt-0.5">By number of visits</p>

      {leaderboard.length > 0 ? (
        <ol className="mt-5 border-t border-[var(--color-border)]">
          {leaderboard.map((c) => (
            <li key={c.name} className="py-3.5 border-b border-[var(--color-border)]">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="flex items-baseline gap-3 min-w-0">
                  <span className="font-mono text-xs text-[var(--color-text-subtle)] w-5 shrink-0">
                    {String(c.rank).padStart(2, '0')}
                  </span>
                  <span className="text-[var(--color-text-muted)] truncate">{titleCase(c.name)}</span>
                </span>
                <span className="font-mono text-xs text-[var(--color-text-main)] tabular-nums">
                  {c.count.toLocaleString()}
                </span>
              </div>
              <div className="mt-2 ml-8 h-[3px] bg-[var(--color-surface-elevated)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(c.count / maxCount) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="h-full bg-[var(--color-primary)]/80 rounded-full"
                />
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-5 pt-5 border-t border-[var(--color-border)] text-sm text-[var(--color-text-muted)]">
          {connectionStatus === 'connecting' ? 'Loading…' : 'No visits recorded yet.'}
        </p>
      )}
    </aside>
  )
}

export default VisitorLeaderboard
