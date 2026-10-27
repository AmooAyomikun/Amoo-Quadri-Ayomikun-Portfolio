import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { useTheme } from '../lib/theme'
import { motion, AnimatePresence } from 'framer-motion'
import { AQALogo } from './AQALogo'

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  
  // Smart Sticky state: hide on scroll down, show on scroll up
  const [isVisible, setIsVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Determine if scrolled past initial threshold
      setIsScrolled(currentScrollY > 50)

      // Only toggle smart hide/reveal once past 100px
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY && !mobileMenuOpen) {
          // Scrolling down -> hide navbar
          setIsVisible(false)
        } else {
          // Scrolling up -> show navbar
          setIsVisible(true)
        }
      } else {
        // At top -> always visible
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, mobileMenuOpen])

  // Brittany Chiang inspired navigation items with numbering (Home is accessed via the AQA logo)
  const navLinks = isHome
    ? [
        { num: '01.', name: 'Research', path: '/research', isHash: false },
        { num: '02.', name: 'Projects', path: '/projects', isHash: false },
        { num: '03.', name: 'Experience', path: '/experience', isHash: false },
        { num: '04.', name: 'Education', path: '/education', isHash: false },
        { num: '05.', name: 'News', path: '/news', isHash: false },
        { num: '06.', name: 'Contact', path: '/#contact', isHash: true },
        { num: '07.', name: 'Guestbook', path: '/guestbook', isHash: false },
      ]
    : [
        { num: '01.', name: 'Research', path: '/research', isHash: false },
        { num: '02.', name: 'Projects', path: '/projects', isHash: false },
        { num: '03.', name: 'Experience', path: '/experience', isHash: false },
        { num: '04.', name: 'Education', path: '/education', isHash: false },
        { num: '05.', name: 'News', path: '/news', isHash: false },
        { num: '06.', name: 'Contact', path: '/contact', isHash: false },
        { num: '07.', name: 'Guestbook', path: '/guestbook', isHash: false },
      ]

  const handleLinkClick = (isHash: boolean, path: string) => {
    setMobileMenuOpen(false)
    if (isHash && isHome) {
      const hash = path.replace('/#', '').replace('#', '')
      const elem = document.getElementById(hash)
      if (elem) {
        const headerOffset = 80
        const elementPosition = elem.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }
  }

  // Determine if a link corresponds to the current route or subroute
  const isActiveLink = (link: { path: string; isHash?: boolean }) => {
    const currentPath = location.pathname
    
    // Hash links on homepage
    if (link.isHash) {
      if (isHome && location.hash) {
        return location.hash === link.path.replace('/', '')
      }
      return false
    }

    // Exact homepage match
    if (link.path === '/') {
      return currentPath === '/'
    }

    // Match exact route or subroutes (e.g. /projects/dispatchlane active for /projects)
    return currentPath === link.path || currentPath.startsWith(`${link.path}/`)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform ${
        isVisible ? 'translate-y-0' : '-translate-y-full shadow-none'
      } ${
        isScrolled
          ? 'bg-[var(--color-surface-base)]/90 backdrop-blur-md border-b border-[var(--color-border)] shadow-[var(--shadow-sm)] py-3.5'
          : 'bg-transparent py-5 sm:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex items-center justify-between">
        
        {/* Creative Monogram Logo for AQA (Amoo Quadri Ayomikun) */}
        <Link
          to="/"
          className="focus:outline-none"
          aria-label="Home - Quadri Ayomikun Amoo (AQA)"
        >
          <AQALogo />
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-7">
          <nav className="flex items-center gap-4 lg:gap-5">
            {navLinks.map((link) => {
              const active = isActiveLink(link)

              if (link.isHash) {
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={(e) => {
                      if (isHome) {
                        e.preventDefault()
                        handleLinkClick(true, link.path)
                      }
                    }}
                    className={`relative font-mono text-xs px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 group cursor-pointer ${
                      active
                        ? 'text-[var(--color-primary)] font-bold bg-[var(--color-primary)]/10 shadow-xs'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-elevated)]/40 font-medium'
                    }`}
                  >
                    <span className="text-[var(--color-primary)] text-[11px] font-mono">{link.num}</span>
                    <span className={active ? 'text-[var(--color-primary)] font-bold' : 'group-hover:text-[var(--color-primary)]'}>
                      {link.name}
                    </span>
                    {active && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        className="absolute -bottom-1 left-2 right-2 h-[2px] bg-[var(--color-primary)] rounded-full shadow-[0_0_8px_var(--color-primary)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                )
              }
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative font-mono text-xs px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 group ${
                    active
                      ? 'text-[var(--color-primary)] font-bold bg-[var(--color-primary)]/10 shadow-xs'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-elevated)]/40 font-medium'
                  }`}
                >
                  <span className="text-[var(--color-primary)] text-[11px] font-mono">{link.num}</span>
                  <span className={active ? 'text-[var(--color-primary)] font-bold' : 'group-hover:text-[var(--color-primary)]'}>
                    {link.name}
                  </span>
                  {active && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-2 right-2 h-[2px] bg-[var(--color-primary)] rounded-full shadow-[0_0_8px_var(--color-primary)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Brittany Chiang Style Outlined Resume Button */}
          <div className="flex items-center gap-4">
            <a
              href="/Amoo_Quadri_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] font-mono text-xs font-semibold hover:bg-[var(--color-primary-light)] transition-all duration-200"
            >
              Resume
            </a>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:border-[var(--color-primary)] transition-all cursor-pointer shadow-xs group"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform group-hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 transition-transform group-hover:-rotate-12" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)]"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="p-2 text-[var(--color-primary)] focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-[min(75vw,360px)] h-screen bg-[var(--color-surface-card)] shadow-2xl z-50 flex flex-col justify-center items-center px-8 border-l border-[var(--color-border)] md:hidden"
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2 text-[var(--color-primary)]"
              aria-label="Close Menu"
            >
              <X className="w-7 h-7" />
            </button>

            <nav className="flex flex-col items-center gap-3.5 text-center w-full">
              {navLinks.map((link) => {
                const active = isActiveLink(link)

                if (link.isHash) {
                  return (
                    <a
                      key={link.name}
                      href={link.path}
                      onClick={(e) => {
                        if (isHome) {
                          e.preventDefault()
                          handleLinkClick(true, link.path)
                        } else {
                          setMobileMenuOpen(false)
                        }
                      }}
                      className={`w-full font-mono text-sm px-4 py-2.5 rounded-lg transition-all flex items-center justify-between font-medium ${
                        active
                          ? 'text-[var(--color-primary)] font-bold bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 shadow-xs'
                          : 'text-[var(--color-text-main)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-elevated)]/40'
                      }`}
                    >
                      <span className="text-[var(--color-primary)] text-xs font-mono">{link.num}</span>
                      <span>{link.name}</span>
                      {active ? (
                        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)] animate-pulse" />
                      ) : (
                        <span className="w-2 h-2" />
                      )}
                    </a>
                  )
                }
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full font-mono text-sm px-4 py-2.5 rounded-lg transition-all flex items-center justify-between font-medium ${
                      active
                        ? 'text-[var(--color-primary)] font-bold bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 shadow-xs'
                        : 'text-[var(--color-text-main)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-elevated)]/40'
                    }`}
                  >
                    <span className="text-[var(--color-primary)] text-xs font-mono">{link.num}</span>
                    <span>{link.name}</span>
                    {active ? (
                      <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)] animate-pulse" />
                    ) : (
                      <span className="w-2 h-2" />
                    )}
                  </Link>
                )
              })}

              <a
                href="/Amoo_Quadri_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 px-8 py-3 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] font-mono text-sm font-semibold hover:bg-[var(--color-primary-light)] transition-all"
              >
                Resume
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
