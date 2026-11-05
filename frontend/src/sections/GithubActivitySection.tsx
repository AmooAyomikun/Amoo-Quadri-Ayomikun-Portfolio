import React, { useRef, useState, useEffect } from 'react'
import { Terminal, ExternalLink, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { AnimatedWords } from '../components/AnimatedWords'
import { useGithubContributions } from '../hooks/useGithubContributions'
import { GithubSettingsDropdown } from '../components/GithubSettingsDropdown'
import { GithubCalendarGrid } from '../components/GithubCalendarGrid'

export const GithubActivitySection: React.FC = () => {
  const {
    username,
    selectedYear,
    setSelectedYear,
    colorTheme,
    setColorTheme,
    includePrivate,
    setIncludePrivate,
    contributionMatrix,
    totalContributions,
    monthLabels,
    hoveredDay,
    setHoveredDay,
    getLevelColor,
    dynamicYears
  } = useGithubContributions()

  const [settingsOpen, setSettingsOpen] = useState(false)
  const settingsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false)
      }
    }
    if (settingsOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [settingsOpen])

  return (
    <section className="py-12 sm:py-16 bg-[var(--color-surface-base)] text-[var(--color-text-main)] font-mono relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20">
        <div className="border-t border-[var(--color-border)] pt-12">
          {/* Retro Command Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 text-xs text-[var(--color-primary)] mb-2 font-bold tracking-wider">
              <Terminal className="w-4 h-4" />
              <span>gh activity --user {username}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[var(--color-text-main)] tracking-tight">
              <AnimatedWords text="Engineering & Research Contributions" />
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[var(--color-text-muted)] font-sans max-w-2xl leading-relaxed">
              Real-time activity ledger tracked directly via the GitHub GraphQL &amp; REST APIs, reflecting production commits, open-source repositories, and research implementations.
            </p>
          </motion.div>

          {/* GitHub Activity Card Container */}
          <div className="border border-[var(--color-border)] rounded-2xl bg-[var(--color-surface-card)] p-4 sm:p-6 shadow-xl relative">
            {/* Header: Title / Commit Count + Year Pills & Settings */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--color-border)]/60">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl font-bold text-[var(--color-text-main)]">
                    {totalContributions.toLocaleString()}
                  </span>
                  <span className="text-xs sm:text-sm text-[var(--color-text-muted)]">
                    contributions in {selectedYear}
                  </span>
                </div>
                <a
                  href={`https://github.com/${username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[var(--color-primary)] hover:underline inline-flex items-center gap-1 group font-semibold"
                >
                  <span>@{username} on GitHub</span>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>

              {/* Controls: Year Selector & Settings Button */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                {/* Desktop Year Pills */}
                <div className="hidden sm:flex items-center bg-[var(--color-surface-base)] p-1 rounded-xl border border-[var(--color-border)] gap-1">
                  {dynamicYears.map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        selectedYear === year
                          ? 'bg-[var(--color-primary)] text-black font-bold shadow-xs'
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>

                {/* Mobile Year Dropdown */}
                <div className="sm:hidden relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="appearance-none bg-[var(--color-surface-base)] border border-[var(--color-border)] text-[var(--color-text-main)] text-xs font-mono py-1.5 pl-3 pr-8 rounded-lg focus:outline-none"
                  >
                    {dynamicYears.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--color-text-muted)] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Settings Dropdown Button */}
                <GithubSettingsDropdown
                  settingsOpen={settingsOpen}
                  setSettingsOpen={setSettingsOpen}
                  colorTheme={colorTheme}
                  setColorTheme={setColorTheme}
                  includePrivate={includePrivate}
                  setIncludePrivate={setIncludePrivate}
                  settingsRef={settingsRef}
                />
              </div>
            </div>

            {/* Heatmap Matrix Grid */}
            <GithubCalendarGrid
              contributionMatrix={contributionMatrix}
              monthLabels={monthLabels}
              hoveredDay={hoveredDay}
              setHoveredDay={setHoveredDay}
              getLevelColor={getLevelColor}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default GithubActivitySection
