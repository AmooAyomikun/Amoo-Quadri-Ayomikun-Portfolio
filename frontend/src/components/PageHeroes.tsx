import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, ExternalLink, Mail } from 'lucide-react'
import { portfolioData } from '../content/portfolioData'

/* -------------------------------------------------------------------------- */
/*  Shared Animation & Helper Styles                                          */
/* -------------------------------------------------------------------------- */

const ease = [0.22, 1, 0.36, 1] as const

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease, delay },
})

/**
 * Terminal / Monospace Eyebrow Badge matching reference screenshots:
 * e.g. `>_ QA.PROJECTS_AND_SKILLS>` or `🔬 QA.RESEARCH_AND_PUBLICATIONS>`
 */
interface EyebrowProps {
  children: React.ReactNode
}

const Eyebrow: React.FC<EyebrowProps> = ({ children }) => (
  <motion.div {...rise(0)} className="flex items-center justify-center mb-3">
    <span className="font-mono text-[10px] sm:text-xs font-semibold tracking-wider text-[var(--color-primary)] uppercase inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/25 select-none shadow-xs">
      {children}
    </span>
  </motion.div>
)

/* -------------------------------------------------------------------------- */
/*  1. RESEARCH HERO                                                          */
/* -------------------------------------------------------------------------- */

export const ResearchHero: React.FC = () => {
  return (
    <header className="pt-6 sm:pt-14 pb-6 sm:pb-12 px-3 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
      <Eyebrow>
        <span className="text-xs">🔬</span> // EMPIRICAL RESEARCH &amp; SCHOLARSHIP
      </Eyebrow>

      <motion.h1
        {...rise(0.08)}
        className="font-serif font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-main)] tracking-tight leading-tight mt-2"
      >
        Research &amp; Scientific Publications
      </motion.h1>

      <motion.p
        {...rise(0.16)}
        className="mt-3 sm:mt-4 text-xs sm:text-base md:text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed px-1 sm:px-0"
      >
        Peer-reviewed papers, empirical investigations, and algorithmic software engineering models spanning machine learning, recommender systems, and fairness in AI.
      </motion.p>

      {/* Quick highlight tags */}
      <motion.div
        {...rise(0.24)}
        className="mt-5 sm:mt-7 flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 text-[11px] sm:text-xs font-mono"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-surface-card)] border border-[var(--color-border)] text-[var(--color-text-main)] shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0" />
          <span>2 Peer-Reviewed Papers</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-surface-card)] border border-[var(--color-border)] text-[var(--color-text-main)] shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
          <span>1 B.Sc. Thesis</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-surface-card)] border border-[var(--color-border)] text-[var(--color-text-main)] shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
          <span>4 Departmental Awards</span>
        </span>
        <a
          href={portfolioData.personal.googleScholar}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-[var(--color-primary)] font-semibold hover:bg-[var(--color-primary)]/20 transition-all hover:scale-105"
        >
          <span>Google Scholar</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </motion.div>
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/*  2. PROJECTS HERO (With Infinite Animated Logo Carousel)                  */
/* -------------------------------------------------------------------------- */

const techIconsRow1 = [
  { name: 'TensorFlow', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg' },
  { name: 'PyTorch', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg' },
  { name: 'Scikit-Learn', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg' },
  { name: 'Python', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
  { name: 'Node.js', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
  { name: 'PostgreSQL', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
  { name: 'MongoDB', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg' },
  { name: 'Docker', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg' },
]

const techIconsRow2 = [
  { name: 'Figma', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg' },
  { name: 'TypeScript', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
  { name: 'JavaScript', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
  { name: 'React', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
  { name: 'Next.js', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg' },
  { name: 'Firebase', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-plain.svg' },
  { name: 'Tailwind CSS', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'Git', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
]

// Quadrupled arrays for seamless 30s marquee loops
const marqueeRow1 = [...techIconsRow1, ...techIconsRow1, ...techIconsRow1, ...techIconsRow1]
const marqueeRow2 = [...techIconsRow2, ...techIconsRow2, ...techIconsRow2, ...techIconsRow2]

export const ProjectsHero: React.FC = () => {
  return (
    <header className="pt-10 sm:pt-14 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
      <Eyebrow>
        <span>⚡</span> // PRODUCTION SYSTEMS &amp; ARCHITECTURE
      </Eyebrow>

      <motion.h1
        {...rise(0.08)}
        className="font-sans font-extrabold text-3xl sm:text-5xl md:text-6xl text-[var(--color-text-main)] tracking-tight leading-tight"
      >
        Engineering Systems &amp; Software Works
      </motion.h1>

      <motion.p
        {...rise(0.16)}
        className="mt-4 text-sm sm:text-base md:text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed"
      >
        Production web applications, full-stack architectures, and intelligent algorithmic platforms engineered for scalability and real-world impact.
      </motion.p>

      {/* Infinite Animated Tech Logos Carousel */}
      <motion.div
        {...rise(0.24)}
        className="relative w-full max-w-2xl mx-auto overflow-hidden py-3 mt-6 group select-none"
      >
        {/* Soft edge gradient fades */}
        <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-[var(--color-surface-base)] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-[var(--color-surface-base)] to-transparent z-10 pointer-events-none" />

        {/* Row 1 - scrolling left */}
        <div className="flex items-center space-x-4 sm:space-x-6 whitespace-nowrap w-max py-2 animate-marquee group-hover:[animation-play-state:paused]">
          {marqueeRow1.map((tech, idx) => (
            <div
              key={`m1-${idx}`}
              title={tech.name}
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center p-2 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs hover:border-[var(--color-primary)] hover:scale-115 transition-all duration-200 cursor-default shrink-0"
            >
              <img
                src={tech.iconUrl}
                alt={tech.name}
                className="w-6 h-6 object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Row 2 - scrolling right (reverse) */}
        <div
          className="flex items-center space-x-4 sm:space-x-6 whitespace-nowrap w-max py-2 animate-marquee group-hover:[animation-play-state:paused]"
          style={{ animationDirection: 'reverse' }}
        >
          {marqueeRow2.map((tech, idx) => (
            <div
              key={`m2-${idx}`}
              title={tech.name}
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center p-2 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs hover:border-[var(--color-primary)] hover:scale-115 transition-all duration-200 cursor-default shrink-0"
            >
              <img
                src={tech.iconUrl}
                alt={tech.name}
                className="w-6 h-6 object-contain"
                style={{ filter: tech.name === 'Next.js' ? 'var(--nextjs-filter, none)' : 'none' }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/*  3. EXPERIENCE HERO                                                        */
/* -------------------------------------------------------------------------- */

export const ExperienceHero: React.FC = () => {
  return (
    <header className="pt-10 sm:pt-14 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
      <Eyebrow>
        <span>💼</span> // CAREER &amp; ENGINEERING TIMELINE
      </Eyebrow>

      <motion.h1
        {...rise(0.08)}
        className="font-sans font-extrabold text-3xl sm:text-5xl md:text-6xl text-[var(--color-text-main)] tracking-tight leading-tight"
      >
        Work Experience &amp; Track Record
      </motion.h1>

      <motion.p
        {...rise(0.16)}
        className="mt-4 text-sm sm:text-base md:text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed"
      >
        Detailed overview of software engineering engagements, machine learning research fellowships, and university teaching track records.
      </motion.p>

      {/* Clean metrics row */}
      <motion.div
        {...rise(0.24)}
        className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-mono"
      >
        <span className="px-3 py-1 rounded-full bg-[var(--color-surface-card)] border border-[var(--color-border)] text-[var(--color-text-main)] shadow-xs">
          3+ Years Software Engineering
        </span>
        <span className="px-3 py-1 rounded-full bg-[var(--color-surface-card)] border border-[var(--color-border)] text-[var(--color-text-main)] shadow-xs">
          5 Industry &amp; Academic Roles
        </span>
        <span className="px-3 py-1 rounded-full bg-[var(--color-surface-card)] border border-[var(--color-border)] text-[var(--color-text-main)] shadow-xs">
          500+ Undergraduates Tutored
        </span>
      </motion.div>
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/*  4. EDUCATION HERO                                                         */
/* -------------------------------------------------------------------------- */

export const EducationHero: React.FC = () => {
  return (
    <header className="pt-6 sm:pt-14 pb-4 sm:pb-8 px-2 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
      <Eyebrow>
        <span>🎓</span> // ACADEMIC FOUNDATIONS &amp; CREDENTIALS
      </Eyebrow>

      <motion.h1
        {...rise(0.08)}
        className="font-sans font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-main)] tracking-tight leading-snug sm:leading-tight"
      >
        Academic Degrees &amp; Credentials
      </motion.h1>

      <motion.p
        {...rise(0.16)}
        className="mt-2.5 sm:mt-4 text-xs sm:text-base md:text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed"
      >
        Software engineering degree, professional diplomas, departmental subject honors, and core coursework foundations.
      </motion.p>
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/*  5. NEWS HERO                                                              */
/* -------------------------------------------------------------------------- */

export const NewsHero: React.FC = () => {
  return (
    <header className="pt-10 sm:pt-14 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
      <Eyebrow>
        <span>📰</span> // DISPATCHES &amp; ANNOUNCEMENTS
      </Eyebrow>

      <motion.h1
        {...rise(0.08)}
        className="font-sans font-extrabold text-3xl sm:text-5xl md:text-6xl text-[var(--color-text-main)] tracking-tight leading-tight"
      >
        News &amp; Announcements
      </motion.h1>

      <motion.p
        {...rise(0.16)}
        className="mt-4 text-sm sm:text-base md:text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed"
      >
        Latest updates on research appointments, publications, software releases, and academic honors.
      </motion.p>
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/*  6. CONTACT HERO                                                           */
/* -------------------------------------------------------------------------- */

export const ContactHero: React.FC = () => {
  const { personal } = portfolioData
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${personal.email}`
    }
  }

  return (
    <header className="pt-10 sm:pt-14 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
      <Eyebrow>
        <span>✉️</span> // DIRECT INQUIRIES &amp; COLLABORATION
      </Eyebrow>

      <motion.h1
        {...rise(0.08)}
        className="font-sans font-extrabold text-3xl sm:text-5xl md:text-6xl text-[var(--color-text-main)] tracking-tight leading-tight"
      >
        Get In Touch &amp; Collaborate
      </motion.h1>

      <motion.p
        {...rise(0.16)}
        className="mt-4 text-sm sm:text-base md:text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed"
      >
        Feel free to reach out for software engineering positions, postgraduate research opportunities, or technical project collaborations.
      </motion.p>

      {/* Quick email copy button & direct interaction pill */}
      <motion.div
        {...rise(0.24)}
        className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-mono"
      >
        <button
          type="button"
          onClick={copyEmail}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-main)] font-medium shadow-xs transition-colors cursor-pointer group"
          title="Click to copy email address"
        >
          <Mail className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <span>{personal.email}</span>
          <span className="inline-flex items-center gap-1 text-[11px] text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] ml-1">
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied!' : 'Copy'}
          </span>
        </button>

        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Based in Ibadan, Nigeria (UTC+1)
        </span>
      </motion.div>
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/*  7. GUESTBOOK HERO                                                         */
/* -------------------------------------------------------------------------- */

export const GuestbookHero: React.FC = () => {
  return (
    <header className="pt-10 sm:pt-14 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
      <Eyebrow>
        <span>✍️</span> // DIGITAL VISITOR LOGBOOK
      </Eyebrow>

      <motion.h1
        {...rise(0.08)}
        className="font-sans font-extrabold text-3xl sm:text-5xl md:text-6xl text-[var(--color-text-main)] tracking-tight leading-tight"
      >
        Interactive Digital Guestbook
      </motion.h1>

      <motion.p
        {...rise(0.16)}
        className="mt-4 text-sm sm:text-base md:text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed"
      >
        Sign the guestbook, sketch a hand-drawn signature or doodle, and leave a permanent greeting on my corner of the web.
      </motion.p>

      <motion.div
        {...rise(0.24)}
        className="mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-surface-card)] border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-muted)] shadow-xs"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Permanent Digital Ledger · Hand-Drawn Signatures &amp; Messages</span>
      </motion.div>
    </header>
  )
}
