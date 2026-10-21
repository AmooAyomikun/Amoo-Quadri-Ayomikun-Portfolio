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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform ${
        isVisible ? 'translate-y-0' : '-translate-y-full shadow-none'
      } ${
        isScrolled
          ? 'bg-[#0a192f]/85 backdrop-blur-md shadow-[0_10px_30px_-10px_rgba(2,12,27,0.7)] py-4'
          : 'bg-transparent py-6'
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
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => {
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
                    className="font-mono text-xs text-[#ccd6f6] hover:text-[#64ffda] transition-colors flex items-center gap-1.5 group cursor-pointer"
                  >
                    <span className="text-[#64ffda] text-[11px] font-normal">{link.num}</span>
                    <span className="group-hover:text-[#64ffda]">{link.name}</span>
                  </a>
                )
              }
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="font-mono text-xs text-[#ccd6f6] hover:text-[#64ffda] transition-colors flex items-center gap-1.5 group"
                >
                  <span className="text-[#64ffda] text-[11px] font-normal">{link.num}</span>
                  <span className="group-hover:text-[#64ffda]">{link.name}</span>
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
              className="px-4 py-2 rounded border border-[#64ffda] text-[#64ffda] font-mono text-xs font-medium hover:bg-[rgba(100,255,218,0.1)] transition-all duration-200"
            >
              Resume
            </a>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded border border-[#233554] text-[#8892b0] hover:text-[#64ffda] hover:border-[#64ffda] transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-[#ccd6f6]" />}
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded border border-[#233554] text-[#8892b0]"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-[#ccd6f6]" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="p-2 text-[#64ffda] focus:outline-none cursor-pointer"
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
            className="fixed inset-y-0 right-0 w-[min(75vw,360px)] h-screen bg-[#112240] shadow-2xl z-50 flex flex-col justify-center items-center px-8 border-l border-[#233554] md:hidden"
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2 text-[#64ffda]"
              aria-label="Close Menu"
            >
              <X className="w-7 h-7" />
            </button>

            <nav className="flex flex-col items-center gap-7 text-center w-full">
              {navLinks.map((link) => {
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
                      className="font-mono text-base text-[#ccd6f6] hover:text-[#64ffda] transition-colors flex flex-col items-center gap-1"
                    >
                      <span className="text-[#64ffda] text-xs">{link.num}</span>
                      <span>{link.name}</span>
                    </a>
                  )
                }
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-mono text-base text-[#ccd6f6] hover:text-[#64ffda] transition-colors flex flex-col items-center gap-1"
                  >
                    <span className="text-[#64ffda] text-xs">{link.num}</span>
                    <span>{link.name}</span>
                  </Link>
                )
              })}

              <a
                href="/Amoo_Quadri_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 px-8 py-3 rounded border border-[#64ffda] text-[#64ffda] font-mono text-sm font-medium hover:bg-[rgba(100,255,218,0.1)] transition-all"
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
