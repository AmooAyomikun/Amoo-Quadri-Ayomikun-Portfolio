import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, User, Microscope, FolderGit2, Briefcase, Newspaper, Mail, ArrowUp } from 'lucide-react'

export const FloatingDock: React.FC = () => {
  const location = useLocation()

  const dockLinks = [
    { name: 'Home', path: '/', icon: <Home className="w-4 h-4" /> },
    { name: 'About', path: '/about', icon: <User className="w-4 h-4" /> },
    { name: 'Research', path: '/research', icon: <Microscope className="w-4 h-4" /> },
    { name: 'Projects', path: '/projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { name: 'Experience', path: '/experience', icon: <Briefcase className="w-4 h-4" /> },
    { name: 'News', path: '/news', icon: <Newspaper className="w-4 h-4" /> },
    { name: 'Contact', path: '/contact', icon: <Mail className="w-4 h-4" /> },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden sm:flex items-center gap-1 p-1.5 rounded-full bg-[var(--color-surface-card)]/90 backdrop-blur-md border border-[var(--color-border)] shadow-xl transition-all duration-300">
      {dockLinks.map((link) => {
        const active = isActive(link.path)
        return (
          <Link
            key={link.name}
            to={link.path}
            className={`group relative flex items-center justify-center p-2.5 rounded-full transition-all duration-200 ${
              active
                ? 'bg-[var(--color-primary)] !text-black shadow-xs'
                : 'text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-elevated)]'
            }`}
          >
            {link.icon}
            
            {/* Tooltip on hover */}
            <span className="absolute -top-9 scale-0 group-hover:scale-100 transition-transform duration-150 px-2.5 py-1 rounded-md bg-[var(--color-text-main)] text-[var(--color-surface-base)] text-[10px] font-mono font-semibold whitespace-nowrap shadow-md pointer-events-none">
              {link.name}
            </span>
          </Link>
        )
      })}

      <div className="w-px h-5 bg-[var(--color-border)] mx-1" />

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="group relative flex items-center justify-center p-2.5 rounded-full text-[var(--color-text-subtle)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-elevated)] transition-colors cursor-pointer"
      >
        <ArrowUp className="w-4 h-4" />
        <span className="absolute -top-9 scale-0 group-hover:scale-100 transition-transform duration-150 px-2.5 py-1 rounded-md bg-[var(--color-text-main)] text-[var(--color-surface-base)] text-[10px] font-mono font-semibold whitespace-nowrap shadow-md pointer-events-none">
          Top
        </span>
      </button>
    </div>
  )
}
