import React from 'react'
import { motion } from 'framer-motion'
import { portfolioData } from '../content/portfolioData'

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const TwitterIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

const CodeIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
)

const ScholarIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
)

export const SocialSidebars: React.FC = () => {
  const [hideSidebars, setHideSidebars] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY
      const threshold = document.documentElement.scrollHeight - 650
      setHideSidebars(scrollPosition >= threshold)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const socials = [
    { name: 'GitHub', url: portfolioData.personal.github, icon: <GithubIcon /> },
    { name: 'LinkedIn', url: portfolioData.personal.linkedIn, icon: <LinkedinIcon /> },
    { name: 'Twitter / X', url: portfolioData.personal.twitter, icon: <TwitterIcon /> },
    { name: 'Google Scholar', url: portfolioData.personal.googleScholar, icon: <ScholarIcon /> },
    { name: 'Projects', url: '/projects', icon: <CodeIcon />, isInternal: true },
  ]

  return (
    <>
      {/* Left Social Icons Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: hideSidebars ? 0 : 1, y: hideSidebars ? 20 : 0 }}
        transition={{ duration: 0.3 }}
        className={`hidden md:flex fixed bottom-0 left-6 lg:left-10 z-30 flex-col items-center gap-6 ${
          hideSidebars ? 'pointer-events-none' : ''
        }`}
      >
        <div className="flex flex-col items-center gap-6">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target={social.isInternal ? undefined : '_blank'}
              rel={social.isInternal ? undefined : 'noopener noreferrer'}
              aria-label={social.name}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:-translate-y-1 transition-all duration-200"
            >
              {social.icon}
            </a>
          ))}
        </div>
        {/* Vertical Rule Line */}
        <div className="w-[1px] h-24 bg-[var(--color-border)]" />
      </motion.div>

      {/* Right Email Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: hideSidebars ? 0 : 1, y: hideSidebars ? 20 : 0 }}
        transition={{ duration: 0.3 }}
        className={`hidden md:flex fixed bottom-0 right-6 lg:right-10 z-30 flex-col items-center gap-6 ${
          hideSidebars ? 'pointer-events-none' : ''
        }`}
      >
        <a
          href={`mailto:${portfolioData.personal.email}`}
          className="font-mono text-xs tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:-translate-y-1 transition-all duration-200 [writing-mode:vertical-rl]"
        >
          {portfolioData.personal.email}
        </a>
        {/* Vertical Rule Line */}
        <div className="w-[1px] h-24 bg-[var(--color-border)]" />
      </motion.div>
    </>
  )
}
