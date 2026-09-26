import React, { useEffect, useRef } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ExperienceSection } from '../sections/ExperienceSection'
import { SkillsSection } from '../sections/SkillsSection'
import gsap from 'gsap'

export default function ExperiencePage() {
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!headerRef.current) return
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
  }, [])

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)]">
      <Navbar />
      <main id="main-content" className="pt-28 pb-16">
        
        {/* Header Banner */}
        <div ref={headerRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest mb-6">
            Professional Track Record
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-[var(--color-text-main)] tracking-tight mb-6 leading-tight">
            Industry & <span className="italic font-light text-[var(--color-text-muted)]">Teaching</span>
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] leading-relaxed max-w-2xl mx-auto">
            Hands-on experience in full-stack engineering, civic technology PWA development, financial machine learning analytics, and undergraduate tutoring.
          </p>
        </div>

        <ExperienceSection />
        <SkillsSection />

      </main>
      <Footer />
    </div>
  )
}
