import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Sun,
  Moon,
  Monitor,
  Home,
  FlaskConical,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Newspaper,
  Mail,
  BookOpen,
  Menu,
  X,
  FileText,
  Sparkles,
} from 'lucide-react'
import { useTheme } from '../lib/theme'
import { motion, AnimatePresence } from 'framer-motion'

type NavItem = {
  num: string
  name: string
  path: string
  isHash: boolean
  icon: React.ComponentType<{ className?: string }>
}

type ThemeMode = 'system' | 'light' | 'dark'

export const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const location = useLocation()
  const isHome = location.pathname === '/'

  // Theme mode (system / light / dark) layered on top of the existing theme provider
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('aq-theme-mode') as ThemeMode | null
    return saved === 'system' || saved === 'light' || saved === 'dark' ? saved : theme
  })

  // Mobile navigation drawer sheet state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('aq-theme-mode', mode)
    if (mode !== 'system') {
      setTheme(mode)
      return
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => setTheme(mq.matches ? 'dark' : 'light')
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  // Collapse the name banner into a monogram once the user scrolls
  const [isScrolled, setIsScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname, location.hash])

  // Leave room at the bottom of every page so the dock never covers content
  useEffect(() => {
    const prev = document.body.style.paddingBottom
    document.body.style.paddingBottom = '96px'
    return () => {
      document.body.style.paddingBottom = prev
    }
  }, [])

  const navLinks: NavItem[] = [
    { num: '00', name: 'Home', path: '/', isHash: false, icon: Home },
    { num: '01', name: 'Research', path: '/research', isHash: false, icon: FlaskConical },
    { num: '02', name: 'Projects', path: '/projects', isHash: false, icon: FolderGit2 },
    { num: '03', name: 'Experience', path: '/experience', isHash: false, icon: Briefcase },
    { num: '04', name: 'Education', path: '/education', isHash: false, icon: GraduationCap },
    { num: '05', name: 'News', path: '/news', isHash: false, icon: Newspaper },
    isHome
      ? { num: '06', name: 'Contact', path: '/#contact', isHash: true, icon: Mail }
      : { num: '06', name: 'Contact', path: '/contact', isHash: false, icon: Mail },
    { num: '07', name: 'Guestbook', path: '/guestbook', isHash: false, icon: BookOpen },
  ]

  // Primary mobile bar shortcuts (first 4 key destinations)
  const mobilePrimaryLinks = navLinks.slice(0, 4)

  const scrollToHash = (path: string) => {
    const hash = path.replace('/#', '').replace('#', '')
    const elem = document.getElementById(hash)
    if (elem) {
      const offsetPosition = elem.getBoundingClientRect().top + window.pageYOffset - 80
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
    }
  }

  const isActiveLink = (link: NavItem) => {
    const currentPath = location.pathname
    if (link.isHash) return isHome && location.hash === link.path.replace('/', '')
    if (link.path === '/') return currentPath === '/' && !location.hash
    return currentPath === link.path || currentPath.startsWith(`${link.path}/`)
  }

  // Check if current page is one of the secondary items in the "More" drawer
  const isSecondaryActive = navLinks.slice(4).some(isActiveLink)

  const renderDockItem = (link: NavItem) => {
    const active = isActiveLink(link)
    const Icon = link.icon
    const className = `group relative flex items-center gap-1.5 px-3 py-2 rounded-full text-xs sm:text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
      active
        ? 'text-[var(--color-primary)] font-semibold'
        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-elevated)]/60'
    }`

    const inner = (
      <>
        {active && (
          <motion.span
            layoutId="dockActive"
            className="absolute inset-0 rounded-full bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 shadow-[0_0_12px_rgba(100,255,218,0.2)]"
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          />
        )}
        <Icon className="relative w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
        <span className={`relative whitespace-nowrap ${active ? 'inline font-bold' : 'hidden md:inline'}`}>
          {link.name}
        </span>
      </>
    )

    if (link.isHash) {
      return (
        <a
          key={link.name}
          id={`dock-${link.name.toLowerCase()}`}
          href={link.path}
          aria-label={link.name}
          aria-current={active ? 'page' : undefined}
          onClick={(e) => {
            if (isHome) {
              e.preventDefault()
              window.history.replaceState(null, '', link.path)
              scrollToHash(link.path)
            }
          }}
          className={className}
        >
          {inner}
        </a>
      )
    }

    return (
      <Link
        key={link.name}
        id={`dock-${link.name.toLowerCase()}`}
        to={link.path}
        aria-label={link.name}
        aria-current={active ? 'page' : undefined}
        className={className}
      >
        {inner}
      </Link>
    )
  }

  const modes: { key: ThemeMode; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
    { key: 'system', icon: Monitor, label: 'System theme' },
    { key: 'light', icon: Sun, label: 'Light theme' },
    { key: 'dark', icon: Moon, label: 'Dark theme' },
  ]

  return (
    <>
      {/* =========================================================================
          TOP HEADER: Fully responsive, zero-overflow sticky name banner
      ========================================================================= */}
      <header
        className={`sticky top-0 z-50 w-full border-b-2 border-[var(--color-text-main)] transition-[background-color,backdrop-filter] duration-500 ${
          isScrolled ? 'bg-[var(--color-surface-base)]/85 backdrop-blur-md' : 'bg-[var(--color-surface-base)]'
        }`}
      >
        <div
          className={`flex items-center justify-between gap-2 sm:gap-6 px-3 sm:px-8 transition-[padding] duration-500 ease-[cubic-bezier(.7,0,.2,1)] ${
            isScrolled ? 'py-1.5 sm:py-2' : 'py-2 sm:py-3'
          }`}
        >
          <Link
            to="/"
            aria-label="Home - Quadri Ayomikun Amoo"
            className={`name-banner group flex flex-1 items-center min-w-0 focus:outline-none ${
              isScrolled ? 'justify-start gap-1 sm:gap-2' : 'justify-between gap-1.5 sm:gap-4'
            }`}
          >
            {['Quadri', 'Ayomikun', 'Amoo'].map((word, i) => (
              <span
                key={word}
                className="name-word font-black uppercase leading-none tracking-tight inline-flex shrink-0 transition-[font-size] duration-500 ease-[cubic-bezier(.7,0,.2,1)]"
                style={{
                  fontFamily: "'Archivo Black', 'Inter', system-ui, sans-serif",
                  fontSize: isScrolled
                    ? 'clamp(0.95rem, 2.6vw, 1.75rem)'
                    : 'clamp(0.88rem, 4.2vw, 4rem)',
                  transitionDelay: `${i * 90}ms`,
                }}
              >
                <span className="name-fill" style={{ transitionDelay: `${i * 110}ms` }}>
                  {word[0]}
                </span>
                <span
                  className="name-fill overflow-hidden whitespace-nowrap"
                  style={{
                    maxWidth: isScrolled ? '0' : '12ch',
                    opacity: isScrolled ? 0 : 1,
                    transitionDelay: `${i * 110}ms`,
                  }}
                >
                  {word.slice(1)}
                </span>
                {isScrolled && i < 2 && (
                  <span className="ml-1 sm:ml-2 text-[var(--color-primary)] font-bold" aria-hidden>
                    ·
                  </span>
                )}
              </span>
            ))}
          </Link>

          {/* Quick theme toggle button in header */}
          <button
            id="header-theme-toggle"
            onClick={() => setMode(theme === 'dark' ? 'light' : 'dark')}
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
        </div>
      </header>

      {/* =========================================================================
          DESKTOP FLOATING DOCK (>= 768px): Full menu with all destinations
      ========================================================================= */}
      <motion.nav
        aria-label="Desktop Primary"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.15 }}
        className="hidden md:block fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-2rem)]"
      >
        <div className="flex items-center gap-1 p-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-base)]/80 backdrop-blur-xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)]">
          {navLinks.map(renderDockItem)}
          
          <span className="mx-1 h-5 w-px shrink-0 bg-[var(--color-border)]" />
          
          {/* Direct Resume CTA */}
          <a
            href="/Amoo_Quadri_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full text-xs font-mono font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume</span>
          </a>
        </div>
      </motion.nav>

      {/* =========================================================================
          MOBILE DOCK (< 768px): 4 primary shortcuts + "More" drawer trigger
          Guaranteed 100% responsive, finger-friendly, zero accidental horizontal overflow
      ========================================================================= */}
      <motion.nav
        aria-label="Mobile Navigation"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.15 }}
        className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[min(94vw,390px)]"
      >
        <div className="flex items-center justify-around p-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-card)]/90 backdrop-blur-xl shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]">
          {mobilePrimaryLinks.map(renderDockItem)}

          {/* "More" Sheet Trigger Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open full menu"
            className={`group relative flex items-center gap-1 px-3 py-2 rounded-full text-xs transition-all focus:outline-none cursor-pointer ${
              isSecondaryActive || mobileMenuOpen
                ? 'text-[var(--color-primary)] font-semibold'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
            }`}
          >
            {(isSecondaryActive || mobileMenuOpen) && (
              <motion.span
                layoutId="dockActiveMobile"
                className="absolute inset-0 rounded-full bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <Menu className="relative w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
            <span className="relative text-[11px] font-mono">More</span>
            {isSecondaryActive && !mobileMenuOpen && (
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] absolute -top-0.5 right-1 animate-pulse" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* =========================================================================
          MOBILE BOTTOM SHEET DRAWER: Smooth native app slide-up menu
      ========================================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
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
                  onClick={() => setMobileMenuOpen(false)}
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
                          setMobileMenuOpen(false)
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
                      onClick={() => setMobileMenuOpen(false)}
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

                {/* Theme Selector Segmented Pill */}
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
