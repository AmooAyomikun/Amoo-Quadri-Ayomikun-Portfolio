import React from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText } from 'lucide-react'
import { SegmentedThemeToggle, type ThemeMode } from './NavThemeToggle'

export interface NavItem {
  num: string
  name: string
  path: string
  isHash: boolean
  icon: React.ComponentType<{ className?: string }>
}

interface NavMobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navLinks: NavItem[]
  isActiveLink: (link: NavItem) => boolean
  isHome: boolean
  scrollToHash: (hash: string) => void
  theme: string
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

export const NavMobileMenu: React.FC<NavMobileMenuProps> = ({
  isOpen,
  onClose,
  navLinks,
  isActiveLink,
  isHome,
  scrollToHash,
  theme,
  mode,
  setMode
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Slide-up Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] bg-[var(--color-surface-base)] border-t border-[var(--color-border)] rounded-t-3xl shadow-2xl p-6 overflow-y-auto no-scrollbar"
            role="dialog"
            aria-label="Navigation Menu"
          >
            {/* Sheet Drag Handle */}
            <div className="w-12 h-1.5 bg-[var(--color-border)] rounded-full mx-auto mb-4" />

            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-primary)] font-bold">
                  PORTFOLIO INDEX
                </span>
                <h3 className="font-sans font-bold text-lg text-[var(--color-text-main)]">
                  Navigation &amp; Actions
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-[var(--color-surface-card)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Full Route Grid */}
            <div className="grid grid-cols-2 gap-2.5 py-5">
              {navLinks.map((link) => {
                const active = isActiveLink(link)
                const Icon = link.icon

                if (link.isHash) {
                  return (
                    <a
                      key={link.name}
                      href={link.path}
                      onClick={(e) => {
                        onClose()
                        if (isHome) {
                          e.preventDefault()
                          window.history.replaceState(null, '', link.path)
                          scrollToHash(link.path)
                        }
                      }}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                        active
                          ? 'bg-[var(--color-primary)]/15 border-[var(--color-primary)] text-[var(--color-primary)] font-bold'
                          : 'bg-[var(--color-surface-card)] border-[var(--color-border)] text-[var(--color-text-main)] hover:border-[var(--color-primary)]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-mono">{link.name}</span>
                    </a>
                  )
                }

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={onClose}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                      active
                        ? 'bg-[var(--color-primary)]/15 border-[var(--color-primary)] text-[var(--color-primary)] font-bold'
                        : 'bg-[var(--color-surface-card)] border-[var(--color-border)] text-[var(--color-text-main)] hover:border-[var(--color-primary)]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-mono">{link.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* Action Buttons: Resume & Theme */}
            <div className="pt-4 border-t border-[var(--color-border)] space-y-3">
              <a
                href="/Amoo_Quadri_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-mono text-xs font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-primary)]/20 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Download Full Curriculum Vitae (PDF)</span>
              </a>

              <SegmentedThemeToggle theme={theme} mode={mode} setMode={setMode} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NavMobileMenu
