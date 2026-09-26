import React, { useEffect, useRef } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { NewsSection } from '../sections/NewsSection'
import gsap from 'gsap'

export default function NewsPage() {
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
            Latest Publications & Media
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[var(--color-text-main)] mt-2">
            News & Announcements
          </h1>
          <p className="text-base text-[var(--color-text-muted)] leading-relaxed max-w-3xl mt-3">
            Stay updated with recent research milestones, software deployments, academic awards, and media announcements from Quadri Ayomikun Amoo.
          </p>
        </div>

        <NewsSection />

      </main>
      <Footer />
    </div>
  )
}
