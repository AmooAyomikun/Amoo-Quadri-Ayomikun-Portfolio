import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, Check } from 'lucide-react'
import type { ColorTheme } from '../hooks/useGithubContributions'

interface GithubSettingsDropdownProps {
  settingsOpen: boolean
  setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>
  colorTheme: ColorTheme
  setColorTheme: (theme: ColorTheme) => void
  includePrivate: boolean
  setIncludePrivate: (val: boolean) => void
  settingsRef: React.RefObject<HTMLDivElement | null>
}

export const GithubSettingsDropdown: React.FC<GithubSettingsDropdownProps> = ({
  settingsOpen,
  setSettingsOpen,
  colorTheme,
  setColorTheme,
  includePrivate,
  setIncludePrivate,
  settingsRef
}) => {
  return (
    <div className="relative" ref={settingsRef}>
      <button
        onClick={() => setSettingsOpen(!settingsOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-base)] text-xs font-mono hover:border-[#64ffda] hover:text-[#64ffda] transition-colors cursor-pointer"
        aria-label="Contribution Settings"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Settings</span>
      </button>

      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-xl bg-[#0a192f] border border-[#233554] p-4 shadow-2xl z-50 space-y-4"
          >
            {/* Private activity toggle */}
            <div className="pb-3 border-b border-[#233554]">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-mono font-medium text-neutral-200">
                  Include Private Contributions
                </span>
                <input
                  type="checkbox"
                  checked={includePrivate}
                  onChange={(e) => setIncludePrivate(e.target.checked)}
                  className="rounded accent-[#64ffda] w-4 h-4 cursor-pointer"
                />
              </label>
              <p className="text-[10px] text-neutral-400 mt-1 font-mono">
                Simulate public-only vs total activity across repositories.
              </p>
            </div>

            {/* Color Palette Selector */}
            <div>
              <span className="block text-[11px] font-bold text-neutral-300 uppercase font-mono mb-2">
                COLOR THEME
              </span>
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                {[
                  { key: 'classic', label: 'Classic Green', color: '#39D353' },
                  { key: 'cyberpunk', label: 'Neon Teal', color: '#64ffda' },
                  { key: 'ocean', label: 'Ocean Blue', color: '#54AEFF' },
                  { key: 'sunset', label: 'Sunset Orange', color: '#FA8900' }
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setColorTheme(t.key as ColorTheme)}
                    className={`p-2 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                      colorTheme === t.key
                        ? 'border-[#64ffda] bg-white/5 font-bold text-white'
                        : 'border-[#233554] text-neutral-400 hover:border-neutral-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                      <span>{t.label}</span>
                    </div>
                    {colorTheme === t.key && <Check className="w-3 h-3 text-[#64ffda]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* External profile link */}
            <div className="pt-2 border-t border-[#233554] flex justify-between items-center text-[11px] text-neutral-400 font-mono">
              <span>Profile activity overview</span>
              <a
                href="https://github.com/settings/profile"
                target="_blank"
                rel="noreferrer"
                className="text-[#64ffda] hover:underline flex items-center gap-1"
              >
                GitHub Settings ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GithubSettingsDropdown
