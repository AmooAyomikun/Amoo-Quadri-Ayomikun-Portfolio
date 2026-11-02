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
      <h3 className="text-sm font-semibold text-[#ccd6f6]">Top countries</h3>
      <p className="text-xs font-mono text-[#8892b0]/70 mt-0.5">By number of visits</p>

      {leaderboard.length > 0 ? (
        <ol className="mt-5 border-t border-[#233554]">
          {leaderboard.map((c) => (
            <li key={c.name} className="py-3.5 border-b border-[#233554]">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="flex items-baseline gap-3 min-w-0">
                  <span className="font-mono text-xs text-[#495670] w-5 shrink-0">
                    {String(c.rank).padStart(2, '0')}
                  </span>
                  <span className="text-[#a8b2d1] truncate">{titleCase(c.name)}</span>
                </span>
                <span className="font-mono text-xs text-[#ccd6f6] tabular-nums">
                  {c.count.toLocaleString()}
                </span>
              </div>
              <div className="mt-2 ml-8 h-[3px] bg-[#112240] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(c.count / maxCount) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="h-full bg-[#64ffda]/70 rounded-full"
                />
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-5 pt-5 border-t border-[#233554] text-sm text-[#8892b0]">
          {connectionStatus === 'connecting' ? 'Loading…' : 'No visits recorded yet.'}
        </p>
      )}
    </aside>
  )
}

export default VisitorLeaderboard
