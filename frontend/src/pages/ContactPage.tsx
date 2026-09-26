import React, { useEffect, useRef } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ContactSection } from '../sections/ContactSection'
import gsap from 'gsap'

export default function ContactPage() {
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
        <div ref={headerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-[var(--color-border)]">
          <span className="text-xs font-mono uppercase tracking-widest font-semibold text-[var(--color-primary)]">
            Initiate Contact & Collaboration
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[var(--color-text-main)] mt-2">
            Get In Touch
          </h1>
          <p className="text-base text-[var(--color-text-muted)] leading-relaxed max-w-3xl mt-3">
            Reach out regarding postgraduate research opportunities, academic scholarships, software development positions, or technical inquiries.
          </p>
        </div>

        <ContactSection />

      </main>
      <Footer />
    </div>
  )
}
