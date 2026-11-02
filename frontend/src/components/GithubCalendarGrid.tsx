import React from 'react'
import type { ContributionDay } from '../hooks/useGithubContributions'

interface GithubCalendarGridProps {
  contributionMatrix: ContributionDay[][]
  monthLabels: { name: string; colIndex: number }[]
  hoveredDay: { day: ContributionDay; x: number; y: number } | null
  setHoveredDay: (val: { day: ContributionDay; x: number; y: number } | null) => void
  getLevelColor: (level: number, isEmptyPlaceholder: boolean) => string
}

export const GithubCalendarGrid: React.FC<GithubCalendarGridProps> = ({
  contributionMatrix,
  monthLabels,
  hoveredDay,
  setHoveredDay,
  getLevelColor
}) => {
  return (
    <>
      {/* Mobile swipe helper cue */}
      <div className="sm:hidden flex items-center justify-end text-[10px] font-mono text-[var(--color-text-subtle)] pb-1.5">
        <span>← Swipe for full year →</span>
      </div>

      {/* Scrollable Heatmap Canvas Container */}
      <div className="overflow-x-auto no-scrollbar pb-2 touch-pan-x" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="min-w-[720px]">
          {/* Month labels row */}
          <div className="flex text-[11px] font-mono text-neutral-400 mb-2 pl-8 relative h-4">
            {monthLabels.map((m, idx) => (
              <span
                key={idx}
                className="absolute transform -translate-x-1/2"
                style={{ left: `${32 + m.colIndex * 13.5}px` }}
              >
                {m.name}
              </span>
            ))}
          </div>

          {/* Grid Body: Day labels on left + 52 Column heatmap */}
          <div className="flex items-start gap-2">
            {/* Day labels column */}
            <div className="flex flex-col justify-between text-[10px] font-mono text-neutral-400 h-[104px] py-1 select-none pr-1">
              <span className="h-3 leading-none"></span>
              <span className="h-3 leading-none">Mon</span>
              <span className="h-3 leading-none"></span>
              <span className="h-3 leading-none">Wed</span>
              <span className="h-3 leading-none"></span>
              <span className="h-3 leading-none">Fri</span>
              <span className="h-3 leading-none"></span>
            </div>

            {/* 52 Column Grid */}
            <div className="flex gap-[3px] flex-1">
              {contributionMatrix.map((col, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-[3px]">
                  {col.map((day, dayIdx) => {
                    const isEmpty = day.count === -1
                    return (
                      <div
                        key={dayIdx}
                        onMouseEnter={(e) => {
                          if (!isEmpty) {
                            const rect = e.currentTarget.getBoundingClientRect()
                            setHoveredDay({
                              day,
                              x: rect.left + rect.width / 2,
                              y: rect.top - 8
                            })
                          }
                        }}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2px] transition-all duration-150 ${getLevelColor(
                          day.level,
                          isEmpty
                        )} ${!isEmpty ? 'hover:scale-125 hover:z-10 cursor-pointer' : ''}`}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Legend Row matching GitHub */}
          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)] pt-4 mt-2 border-t border-[var(--color-border)]/60">
            <a
              href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/showing-an-overview-of-your-activity-on-your-profile"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--color-primary)] transition-colors"
            >
              Learn how we count contributions
            </a>

            <div className="flex items-center gap-2">
              <span>Less</span>
              <div className="flex gap-1 items-center">
                {[0, 1, 2, 3, 4].map((lvl) => (
                  <span
                    key={lvl}
                    className={`w-2.5 h-2.5 rounded-[2px] ${getLevelColor(lvl, false)}`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Day Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full px-2.5 py-1 rounded bg-[#0a192f] border border-[#233554] text-xs font-mono text-[#ccd6f6] shadow-xl whitespace-nowrap"
          style={{ left: `${hoveredDay.x}px`, top: `${hoveredDay.y}px` }}
        >
          <span className="text-[#64ffda] font-bold">
            {hoveredDay.day.count} {hoveredDay.day.count === 1 ? 'contribution' : 'contributions'}
          </span>{' '}
          on {hoveredDay.day.dateStr}
        </div>
      )}
    </>
  )
}

export default GithubCalendarGrid
