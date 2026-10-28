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
} from 'lucide-react'
import { useTheme } from '../lib/theme'
import { motion } from 'framer-motion'

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
    const onScroll = () => setIsScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  const renderDockItem = (link: NavItem) => {
    const active = isActiveLink(link)
    const Icon = link.icon
    const className = `group relative flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-full text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
      active
        ? 'text-[var(--color-primary)]'
        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
    }`

    const inner = (
      <>
        {active && (
          <motion.span
            layoutId="dockActive"
            className="absolute inset-0 rounded-full bg-[var(--color-primary)]/10"
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          />
        )}
        <Icon className="relative w-4 h-4 shrink-0" />
        <span className={`relative whitespace-nowrap ${active ? 'inline' : 'hidden lg:inline'}`}>
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
      {/* Full-width name banner header */}
      <header
        className={`sticky top-0 z-50 w-full border-b-2 border-[var(--color-text-main)] transition-[background-color,backdrop-filter] duration-500 ${
          isScrolled ? 'bg-[var(--color-surface-base)]/80 backdrop-blur-md' : 'bg-[var(--color-surface-base)]'
        }`}
      >
        <div
          className={`flex items-center gap-3 sm:gap-6 px-4 sm:px-8 transition-[padding] duration-500 ease-[cubic-bezier(.7,0,.2,1)] ${
            isScrolled ? 'py-2' : 'py-2 sm:py-3'
          }`}
        >
          <Link
            to="/"
            aria-label="Home - Quadri Ayomikun Amoo"
            className={`name-banner group flex flex-1 items-center focus:outline-none ${
              isScrolled ? 'justify-start gap-1 sm:gap-2' : 'justify-between gap-4'
            }`}
          >
            {['Quadri', 'Ayomikun', 'Amoo'].map((word, i) => (
              <span
                key={word}
                className="name-word font-black uppercase leading-none tracking-tight inline-flex transition-[font-size] duration-500 ease-[cubic-bezier(.7,0,.2,1)]"
                style={{
                  fontFamily: "'Archivo Black', 'Inter', system-ui, sans-serif",
                  fontSize: isScrolled ? 'clamp(1.25rem,2.4vw,1.75rem)' : 'clamp(1.4rem,5.6vw,4rem)',
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
                  <span className="ml-1 sm:ml-2 text-[var(--color-primary)]" aria-hidden>
                    ·
                  </span>
                )}
              </span>
            ))}
          </Link>

          <button
            id="header-theme-toggle"
            onClick={() => setMode(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="group shrink-0 grid place-items-center w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-[var(--color-text-main)] text-[var(--color-text-main)] hover:bg-[var(--color-text-main)] hover:text-[var(--color-surface-base)] transition-colors cursor-pointer overflow-hidden"
          >
            <motion.span
              key={theme}
              initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </motion.span>
          </button>
        </div>
      </header>

      {/* Floating bottom dock navigation */}
      <motion.nav
        aria-label="Primary"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.15 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-1.5rem)]"
      >
        <div className="flex items-center gap-0.5 p-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-base)]/70 backdrop-blur-xl shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] overflow-x-auto no-scrollbar">
          {navLinks.map(renderDockItem)}
          <span className="mx-1 h-5 w-px shrink-0 bg-[var(--color-border)]" />
          <div role="radiogroup" aria-label="Theme" className="flex items-center gap-0.5 pr-1">
            {modes.map(({ key, icon: Icon, label }) => {
              const active = mode === key
              return (
                <button
                  key={key}
                  id={`theme-${key}`}
                  role="radio"
                  aria-checked={active}
                  aria-label={label}
                  title={label}
                  onClick={() => setMode(key)}
                  className={`relative p-1.5 rounded-full transition-colors cursor-pointer ${
                    active
                      ? 'text-[var(--color-text-main)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="themeActive"
                      className="absolute inset-0 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)]"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <Icon className="relative w-3.5 h-3.5" />
                </button>
              )
            })}
          </div>
        </div>
      </motion.nav>
    </>
  )
}
