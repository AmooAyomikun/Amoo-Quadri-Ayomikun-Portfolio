import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, GraduationCap, Briefcase, Download, Terminal, Sparkles, Award } from 'lucide-react'
import { Button } from '../components/Button'
import profileImg from '../assets/profile.png'
import gsap from 'gsap'
import { motion } from 'framer-motion'

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-hero-item',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' }
      )
      gsap.fromTo(
        '.gsap-profile-cutout',
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 1.1, delay: 0.2, ease: 'power3.out' }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative pt-28 pb-12 md:pt-36 md:pb-14 bg-[var(--color-surface-base)] overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="gsap-hero-item text-[var(--color-text-subtle)] font-sans uppercase tracking-widest text-xs font-semibold mb-2">
              Hello, I am
            </div>

            {/* Hero Main Name Header */}
            <h1 className="gsap-hero-item text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[var(--color-text-main)] tracking-tight leading-[1.15] break-words">
              Quadri Ayomikun Amoo
            </h1>

            <div className="gsap-hero-item text-lg sm:text-2xl text-[var(--color-primary)] font-serif italic font-semibold mt-1 mb-4">
              Software Engineer & Researcher
            </div>

            <p className="gsap-hero-item text-sm sm:text-lg text-[var(--color-text-muted)] leading-relaxed max-w-2xl font-sans mb-6">
              I build modern web applications with a strong focus on creating fast, intuitive, and accessible user experiences. While frontend is where I do my best work, I also enjoy building complete full-stack applications that solve real problems.
              <br className="hidden sm:block" />
              Beyond software engineering, I am deeply involved in academic research, focusing on machine learning, data-driven systems, and intelligent computing.
            </p>

            {/* CTA Buttons: Primary Projects + Download CV */}
            <div className="gsap-hero-item pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button
                  href="/projects"
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto text-center justify-center"
                >
                  View My Work
                </Button>
              </motion.div>

              <motion.a
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                href="/Amoo_Quadri_CV.pdf"
                download="Amoo_Quadri_CV.pdf"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-sans text-sm font-semibold bg-[var(--color-surface-card)] text-[var(--color-text-main)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all shadow-sm w-full sm:w-auto"
              >
                <Download className="w-4 h-4 text-[var(--color-primary)]" />
                Download CV (PDF)
              </motion.a>
            </div>

            {/* Quick Links */}
            <div className="gsap-hero-item pt-6 border-t border-[var(--color-border)] flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-sans text-[var(--color-text-muted)]">
              <Link to="/about" className="hover:text-[var(--color-text-main)] transition-colors flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[var(--color-primary)]" /> Read Biography
              </Link>
              <Link to="/experience" className="hover:text-[var(--color-text-main)] transition-colors flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-[var(--color-primary)]" /> Experience
              </Link>
              <Link to="/contact" className="hover:text-[var(--color-text-main)] transition-colors">
                Contact Form →
              </Link>
            </div>

          </div>

          {/* Right Portrait Image */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="gsap-profile-cutout relative w-full max-w-xs sm:max-w-md"
            >
              <div className="relative p-1 sm:p-4">
                <div className="relative bg-[var(--color-surface-card)] rounded-[2rem] p-2 shadow-xl border border-[var(--color-border)] overflow-hidden">
                  <img
                    src={profileImg}
                    alt="Quadri Ayomikun Amoo"
                    className="w-full h-auto object-cover object-top rounded-[1.5rem]"
                  />

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
