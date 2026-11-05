import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, GraduationCap, Briefcase, BookOpen, Download } from 'lucide-react'
import { motion, type Variants } from 'framer-motion'
import { AnimatedWords } from '../components/AnimatedWords'
import { useTypewriter } from '../hooks/useTypewriter'

const TYPEWRITER_PHRASES = [
  'applied ML frameworks.',
  'geospatial architectures.',
  'offline-first platforms.',
  'data-driven software.'
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
  }
}

export const HeroSection: React.FC = () => {
  const { currentText } = useTypewriter(TYPEWRITER_PHRASES)

  return (
    <section
      className="relative pt-6 sm:pt-12 pb-8 sm:pb-12 lg:min-h-[calc(100vh-70px)] lg:flex lg:flex-col lg:justify-center bg-[var(--color-surface-base)] text-[var(--color-text-main)] overflow-hidden transition-colors duration-200"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-12 lg:px-16 w-full flex flex-col justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start text-left space-y-3 sm:space-y-4 md:space-y-4 max-w-4xl"
        >
          {/* Discipline / Credential Eyebrow */}
          <motion.div
            variants={itemVariants}
            className="font-mono text-[var(--color-primary)] text-[11px] sm:text-xs tracking-widest uppercase font-semibold flex flex-wrap items-center gap-x-2.5 gap-y-1"
          >
            <span>Software Engineer &amp; Applied ML Researcher</span>
            <span className="text-[var(--color-text-subtle)] hidden sm:inline">·</span>
            <span className="text-[var(--color-text-muted)] font-normal hidden sm:inline">
              B.Sc. Software Engineering (4.45 / 5.00 CGPA, Top 10%)
            </span>
          </motion.div>

          {/* Main Name Header */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-5xl lg:text-6xl font-sans font-bold text-[var(--color-text-main)] tracking-tight leading-tight break-words"
          >
            <AnimatedWords text="Quadri Ayomikun Amoo." />
          </motion.h1>

          {/* Second Headline with Synchronized Typewriter Effect */}
          <motion.h2
            variants={itemVariants}
            className="text-xl sm:text-3xl lg:text-4xl font-sans font-bold text-[var(--color-text-muted)] tracking-tight leading-snug"
          >
            <span>Engineering production web systems &amp;&nbsp;</span>
            <span className="text-[var(--color-primary)] inline">{currentText}</span>
            <span
              className="inline-block w-[3px] h-[0.85em] bg-[var(--color-primary)] ml-1 align-baseline animate-pulse"
              aria-hidden="true"
            />
          </motion.h2>

          {/* Grounded Bio Paragraph */}
          <motion.p
            variants={itemVariants}
            className="text-[var(--color-text-muted)] text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl font-sans pt-1"
          >
            I design and build full-stack web applications alongside empirical research in machine learning and spatial recommendation systems. My work bridges accessible, offline-capable frontend engineering with peer-reviewed studies on data quality, algorithmic fairness, and location-aware computing.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 w-full sm:w-auto"
          >
            <Link
              to="/projects"
              className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] font-mono text-xs sm:text-sm font-semibold hover:bg-[var(--color-primary-light)] transition-all duration-200 group text-center"
            >
              <span>Explore Projects &amp; Research</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="/Amoo_Quadri_CV.pdf"
              download="Amoo_Quadri_CV.pdf"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-main)] font-mono text-xs sm:text-sm font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-200 shadow-xs text-center"
            >
              <Download className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Download CV (PDF)</span>
            </a>
          </motion.div>

          {/* Quick Links in font-mono */}
          <motion.div
            variants={itemVariants}
            className="pt-4 sm:pt-5 border-t border-[var(--color-border)] w-full flex flex-wrap items-center gap-4 sm:gap-7 font-mono text-[11px] sm:text-xs text-[var(--color-text-muted)]"
          >
            <Link to="/research" className="hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>Publications (2)</span>
            </Link>
            <Link to="/experience" className="hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>Experience</span>
            </Link>
            <a href="#about" className="hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5 cursor-pointer">
              <GraduationCap className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              <span>Biography</span>
            </a>
            <a href="#contact" className="hover:text-[var(--color-primary)] transition-colors">
              <span>Get in Touch →</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
