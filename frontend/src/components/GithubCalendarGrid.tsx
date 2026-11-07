import React, { useEffect, useRef, useState } from 'react'
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
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [selectedDay, setSelectedDay] = useState<ContributionDay | null>(null)

  // Auto-scroll to latest months on mobile so recent activity is immediately visible
  useEffect(() => {
    const el = scrollContainerRef.current
    if (el && window.innerWidth < 768) {
      el.scrollLeft = el.scrollWidth
    }
  }, [contributionMatrix])

  // Build quick lookup from column index -> month label so month headers never drift out of alignment
  const monthByCol = new Map<number, string>()
  monthLabels.forEach((m) => {
    // Avoid overlapping labels if first month is only 1 column wide
    if (m.colIndex === 0 && monthLabels.length > 1 && monthLabels[1].colIndex <= 2) {
      return
    }
    monthByCol.set(m.colIndex, m.name)
  })

  const activeDay = hoveredDay?.day || selectedDay

  return (
    <>
      {/* Mobile swipe helper + active day status bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[var(--color-text-muted)] pb-2.5">
        <div className="min-h-[18px]">
          {activeDay ? (
            <span>
              <strong className={activeDay.count > 0 ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-main)]'}>
                {activeDay.count === 0
                  ? 'No contributions (0 activity)'
                  : `${activeDay.count} ${activeDay.count === 1 ? 'contribution' : 'contributions'}`}
              </strong>{' '}
              on {activeDay.dateStr}
            </span>
          ) : (
            <span className="text-[var(--color-text-subtle)]">
              Tap or hover any square to inspect daily activity
            </span>
          )}
        </div>

        <span className="sm:hidden text-[10px] text-[var(--color-text-subtle)]">
          ← Swipe for full year →
        </span>
      </div>

      {/* Scrollable Heatmap Canvas Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto no-scrollbar pb-2 touch-pan-x"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="inline-flex items-start gap-2 min-w-max pr-2">
          {/* Sticky Day labels column */}
          <div className="sticky left-0 z-10 bg-[var(--color-surface-card)] pr-1.5 pt-5 flex flex-col justify-between text-[10px] font-mono text-[var(--color-text-muted)] h-[126px] sm:h-[132px] select-none">
            <span className="h-3 leading-none"></span>
            <span className="h-3 leading-none">Mon</span>
            <span className="h-3 leading-none"></span>
            <span className="h-3 leading-none">Wed</span>
            <span className="h-3 leading-none"></span>
            <span className="h-3 leading-none">Fri</span>
            <span className="h-3 leading-none"></span>
          </div>

          {/* 52-Week Columns with aligned Month Headers */}
          <div className="flex gap-[3px]">
            {contributionMatrix.map((col, colIdx) => {
              const monthName = monthByCol.get(colIdx)
              return (
                <div key={colIdx} className="flex flex-col">
                  {/* Month Header Cell aligned directly with its week column */}
                  <div className="h-5 relative mb-0.5">
                    {monthName && (
                      <span className="absolute left-0 top-0 text-[10px] sm:text-[11px] font-mono text-[var(--color-text-muted)] whitespace-nowrap">
                        {monthName}
                      </span>
                    )}
                  </div>

                  {/* 7 Day Cells */}
                  <div className="flex flex-col gap-[3px]">
                    {col.map((day, dayIdx) => {
                      const isEmpty = day.count === -1
                      const isSelected = selectedDay?.dateStr && selectedDay.dateStr === day.dateStr
                      return (
                        <div
                          key={dayIdx}
                          onClick={() => {
                            if (!isEmpty) {
                              setSelectedDay(day)
                            }
                          }}
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
                          className={`w-[11px] h-[11px] sm:w-3 sm:h-3 rounded-[2.5px] transition-all duration-150 ${getLevelColor(
                            day.level,
                            isEmpty
                          )} ${!isEmpty ? 'hover:scale-125 hover:z-10 cursor-pointer' : ''} ${
                            isSelected ? 'ring-1 ring-[var(--color-primary)] scale-110 z-10' : ''
                          }`}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer Legend Row clearly distinguishing 0 activity vs active days */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[var(--color-text-muted)] pt-4 mt-2 border-t border-[var(--color-border)]/60">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-[2.5px] inline-block ${getLevelColor(0, false)}`} />
            <span>0 commits (No activity)</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="flex gap-1 items-center">
            {[0, 1, 2, 3, 4].map((lvl) => (
              <span
                key={lvl}
                className={`w-3 h-3 rounded-[2.5px] ${getLevelColor(lvl, false)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Floating Desktop Day Tooltip */}
      {hoveredDay && (
        <div
          className="hidden sm:block fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full px-2.5 py-1 rounded bg-[var(--color-surface-card)] border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-main)] shadow-xl whitespace-nowrap"
          style={{ left: `${hoveredDay.x}px`, top: `${hoveredDay.y}px` }}
        >
          <span className="text-[var(--color-primary)] font-bold">
            {hoveredDay.day.count === 0
              ? 'No contributions'
              : `${hoveredDay.day.count} ${hoveredDay.day.count === 1 ? 'contribution' : 'contributions'}`}
          </span>{' '}
          on {hoveredDay.day.dateStr}
        </div>
      )}
    </>
  )
}

export default GithubCalendarGrid
