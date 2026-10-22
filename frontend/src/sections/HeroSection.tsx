import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, GraduationCap, Briefcase, Download } from 'lucide-react'
import { AnimatedWords } from '../components/AnimatedWords'
import gsap from 'gsap'

const TYPEWRITER_PHRASES = [
  'intelligent systems.',
  'research applications.',
  'accessible platforms.',
  'scalable software.'
]

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Typewriter effect states
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Typewriter animation loop
  useEffect(() => {
    const targetPhrase = TYPEWRITER_PHRASES[phraseIndex]
    const typingSpeed = isDeleting ? 35 : 70

    if (!isDeleting && currentText === targetPhrase) {
      // Pause at full phrase before deleting
      const pauseTimer = setTimeout(() => setIsDeleting(true), 1800)
      return () => clearTimeout(pauseTimer)
    }

    if (isDeleting && currentText === '') {
      // Completed backspacing, advance to next phrase
      setIsDeleting(false)
      setPhraseIndex((prev) => (prev + 1) % TYPEWRITER_PHRASES.length)
      return
    }

    const charTimer = setTimeout(() => {
      setCurrentText((prev) =>
        isDeleting
          ? targetPhrase.substring(0, prev.length - 1)
          : targetPhrase.substring(0, prev.length + 1)
      )
    }, typingSpeed)

    return () => clearTimeout(charTimer)
  }, [currentText, isDeleting, phraseIndex])

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-hero-item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] md:h-screen flex flex-col justify-center pt-20 pb-8 sm:pt-24 sm:pb-10 bg-[var(--color-surface-base)] text-[var(--color-text-main)] overflow-hidden transition-colors duration-200"
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 w-full flex flex-col justify-center h-full">
        <div className="flex flex-col items-start text-left space-y-3 sm:space-y-4 md:space-y-4 max-w-4xl">
          
          {/* Subtitle / Intro Greeting */}
          <div className="gsap-hero-item font-mono text-[var(--color-primary)] text-xs sm:text-sm tracking-wide font-medium">
            Hi, my name is
          </div>

          {/* Huge Main Name Header */}
          <h1 className="gsap-hero-item text-3xl sm:text-5xl lg:text-6xl font-sans font-bold text-[var(--color-text-main)] tracking-tight leading-tight break-words">
            <AnimatedWords text="Quadri Ayomikun Amoo." />
          </h1>

          {/* Second Headline with Synchronized Typewriter Effect */}
          <h2 className="gsap-hero-item text-2xl sm:text-3xl lg:text-4xl font-sans font-bold text-[var(--color-text-muted)] tracking-tight leading-snug">
            <span>I build things for the web &amp;&nbsp;</span>
            <span className="text-[var(--color-primary)] inline">{currentText}</span>
            <span className="inline-block w-[3px] h-[0.85em] bg-[var(--color-primary)] ml-1 align-baseline animate-pulse" />
          </h2>

          {/* Subtitle / Bio Paragraph */}
          <p className="gsap-hero-item text-[var(--color-text-muted)] text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl font-sans pt-1">
            I am a software engineer specializing in building high-performance web applications with a strong focus on creating fast, intuitive, and accessible user experiences. While frontend is where I do my best work, I also build complete full-stack applications and engage in applied academic research in machine learning, data-driven systems, and intelligent computing.
          </p>

          {/* CTA Buttons */}
          <div className="gsap-hero-item pt-2 sm:pt-3 flex flex-wrap items-center gap-3.5">
            <Link
              to="/projects"
              className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] font-mono text-xs sm:text-sm font-semibold hover:bg-[var(--color-primary-light)] transition-all duration-200 group text-center"
            >
              <span>Check out my work!</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="/Amoo_Quadri_CV.pdf"
              download="Amoo_Quadri_CV.pdf"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-main)] font-mono text-xs sm:text-sm font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-200 shadow-xs"
            >
              <Download className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Download CV (PDF)</span>
            </a>
          </div>

          {/* Quick Links in font-mono */}
          <div className="gsap-hero-item pt-4 sm:pt-5 border-t border-[var(--color-border)] w-full flex flex-wrap items-center gap-5 sm:gap-7 font-mono text-[11px] sm:text-xs text-[var(--color-text-muted)]">
            <a href="#about" className="hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5 cursor-pointer">
              <GraduationCap className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>Read Biography</span>
            </a>
            <Link to="/experience" className="hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>Experience</span>
            </Link>
            <a href="#contact" className="hover:text-[var(--color-primary)] transition-colors">
              <span>Get in Touch →</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}
