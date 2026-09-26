import React from 'react'
import { Mail, Phone, MapPin, GraduationCap, ArrowUp } from 'lucide-react'
import { portfolioData } from '../content/portfolioData'

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[var(--color-surface-card)] border-t border-[var(--color-border)] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white font-serif font-bold text-sm flex items-center justify-center">
                QA
              </div>
              <span className="font-serif font-bold text-lg text-[var(--color-text-main)]">
                Quadri Ayomikun Amoo
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed max-w-md">
              Software Engineering Scholar (5.0/5.0 Major GPA) & Full-Stack Engineer. Committed to impactful research and intelligent computing applications across academia and industry.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {/* GitHub SVG */}
              <a
                href={portfolioData.personal.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              {/* LinkedIn SVG */}
              <a
                href={portfolioData.personal.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
              <a
                href={portfolioData.personal.googleScholar}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Scholar"
                className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
              >
                <GraduationCap className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="font-serif font-bold text-sm text-[var(--color-text-main)] mb-4 uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs text-[var(--color-text-muted)]">
              <li><a href="#about" className="hover:text-[var(--color-primary)] transition-colors">About & Statement of Purpose</a></li>
              <li><a href="#research" className="hover:text-[var(--color-primary)] transition-colors">Research Experience</a></li>
              <li><a href="#experience" className="hover:text-[var(--color-primary)] transition-colors">Industrial Experience</a></li>
              <li><a href="#projects" className="hover:text-[var(--color-primary)] transition-colors">Key Projects</a></li>
              <li><a href="#testimonials" className="hover:text-[var(--color-primary)] transition-colors">Testimonials & Reviews</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-serif font-bold text-sm text-[var(--color-text-main)] mb-4 uppercase tracking-wider">
              Direct Contact
            </h3>
            <ul className="space-y-2.5 text-xs text-[var(--color-text-muted)]">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                <a href={`mailto:${portfolioData.personal.email}`} className="hover:text-[var(--color-primary)] transition-colors">
                  {portfolioData.personal.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                <a href={`tel:${portfolioData.personal.phone.replace(/\s+/g, '')}`} className="hover:text-[var(--color-primary)] transition-colors">
                  {portfolioData.personal.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0 mt-0.5" />
                <span>Ibadan, Oyo State & Delta State, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & Back to top */}
        <div className="pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-subtle)] font-mono">
          <p>© {new Date().getFullYear()} Quadri Ayomikun Amoo. All rights reserved.</p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-[var(--color-primary)] transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}
