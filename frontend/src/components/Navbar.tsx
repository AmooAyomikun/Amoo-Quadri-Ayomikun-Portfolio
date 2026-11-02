import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  FlaskConical,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Newspaper,
  Mail,
  BookOpen,
  Menu,
  FileText
} from 'lucide-react'
import { useTheme } from '../lib/theme'
import { motion } from 'framer-motion'
import { HeaderThemeButton, type ThemeMode } from './NavThemeToggle'
import { NavMobileMenu, type NavItem } from './NavMobileMenu'

export const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const location = useLocation()
  const isHome = location.pathname === '/'

  // Theme mode (system / light / dark)
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('aq-theme-mode') as ThemeMode | null
    return saved === 'system' || saved === 'light' || saved === 'dark' ? saved : (theme as ThemeMode)
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
  }, [mode, setTheme])

  // Sticky hide-on-scroll header logic
  const [isVisible, setIsVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    let lastScrollY = window.scrollY

    const onScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 40)

      if (currentScrollY <= 50) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY + 8) {
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY - 8) {
        setIsVisible(true)
      }

      lastScrollY = Math.max(0, currentScrollY)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsVisible(true)
    setMobileMenuOpen(false)
  }, [location.pathname, location.hash])

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
    { num: '07', name: 'Guestbook', path: '/guestbook', isHash: false, icon: BookOpen }
  ]

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

  return (
    <>
      {/* Top sticky banner */}
      <header
        className={`sticky top-0 z-50 w-full border-b-2 border-[var(--color-text-main)] transition-all duration-300 ease-in-out ${
          isVisible || mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        } ${
          isScrolled ? 'bg-[var(--color-surface-base)]/85 backdrop-blur-md shadow-sm' : 'bg-[var(--color-surface-base)]'
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
                  transitionDelay: `${i * 90}ms`
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
                    transitionDelay: `${i * 110}ms`
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

          <HeaderThemeButton
            theme={theme}
            onClick={() => setMode(theme === 'dark' ? 'light' : 'dark')}
          />
        </div>
      </header>

      {/* Desktop Floating Dock */}
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

      {/* Mobile Dock */}
      <motion.nav
        aria-label="Mobile Navigation"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.15 }}
        className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[min(94vw,390px)]"
      >
        <div className="flex items-center justify-around p-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-card)]/90 backdrop-blur-xl shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)]">
          {mobilePrimaryLinks.map(renderDockItem)}

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

      {/* Mobile Drawer Sheet */}
      <NavMobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={navLinks}
        isActiveLink={isActiveLink}
        isHome={isHome}
        scrollToHash={scrollToHash}
        theme={theme}
        mode={mode}
        setMode={setMode}
      />
    </>
  )
}

export default Navbar
