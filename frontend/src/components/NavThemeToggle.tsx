import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Monitor, Sparkles } from 'lucide-react'

export type ThemeMode = 'system' | 'light' | 'dark'

interface NavThemeToggleProps {
  theme: string
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

export const HeaderThemeButton: React.FC<{ theme: string; onClick: () => void }> = ({
  theme,
  onClick
}) => {
  return (
    <button
      id="header-theme-toggle"
      onClick={onClick}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="group shrink-0 grid place-items-center w-8 h-8 sm:w-11 sm:h-11 rounded-full border-2 border-[var(--color-text-main)] text-[var(--color-text-main)] hover:bg-[var(--color-text-main)] hover:text-[var(--color-surface-base)] transition-colors cursor-pointer overflow-hidden active:scale-95"
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      >
        {theme === 'dark' ? (
          <Sun className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
        ) : (
          <Moon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
        )}
      </motion.span>
    </button>
  )
}

export const SegmentedThemeToggle: React.FC<NavThemeToggleProps> = ({ mode, setMode }) => {
  const modes: { key: ThemeMode; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
    { key: 'system', icon: Monitor, label: 'System theme' },
    { key: 'light', icon: Sun, label: 'Light theme' },
    { key: 'dark', icon: Moon, label: 'Dark theme' }
  ]

  return (
    <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)]">
      <span className="text-xs font-mono text-[var(--color-text-muted)] flex items-center gap-1.5 pl-2">
        <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
        <span>Theme</span>
      </span>
      <div className="flex items-center gap-1">
        {modes.map(({ key, icon: Icon, label }) => {
          const active = mode === key
          return (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                active
                  ? 'bg-[var(--color-primary)] text-[var(--color-primary-text)] font-bold shadow-xs'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
              }`}
              aria-label={label}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="capitalize">{key}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
