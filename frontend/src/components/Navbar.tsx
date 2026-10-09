import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, Menu, X, Download, FileText } from 'lucide-react'
import { useTheme } from '../lib/theme'
import profileImg from '../assets/profile.png'

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Education', path: '/education' },
    { name: 'Research', path: '/research' },
    { name: 'Experience', path: '/experience' },
    { name: 'Projects', path: '/projects' },
    { name: 'News', path: '/news' },
    { name: 'Guestbook', path: '/guestbook' },
    { name: 'Contact', path: '/contact' },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--color-surface-card)]/90 backdrop-blur-md border-b border-[var(--color-border)] shadow-xs py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo with Quadri's Profile Image */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--color-primary)] shadow-sm group-hover:scale-105 transition-transform duration-300">
            <img
              src={profileImg}
              alt="Quadri Ayomikun Amoo"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg text-[var(--color-text-main)] tracking-tight leading-tight group-hover:text-[var(--color-primary)] transition-colors">
              Quadri Amoo
            </span>
            <span className="text-[11px] font-sans text-[var(--color-text-muted)] uppercase tracking-wide font-medium">
              Software Engineer & Researcher
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[var(--color-surface-elevated)] p-1.5 rounded-full border border-[var(--color-border)]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
                isActive(link.path)
                  ? 'bg-[var(--color-primary)] !text-black font-extrabold shadow-xs'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-card)] font-medium'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Controls: Theme Toggle & Direct CV Button */}
        <div className="hidden md:flex items-center gap-3">

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:border-[var(--color-primary)] transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 lg:hidden">

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-muted)]"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open Navigation Menu"
            className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-main)]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[var(--color-surface-card)] border-b border-[var(--color-border)] px-4 pt-4 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-[var(--color-primary)] !text-black font-extrabold'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)]'
                }`}
              >
                {link.name}
              </Link>
            ))}

          </div>
        </div>
      )}
    </header>
  )
}

