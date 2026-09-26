import React, { useEffect, useRef } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ResearchSection } from '../sections/ResearchSection'
import gsap from 'gsap'

export default function ResearchPage() {
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
            Academic & Independent Research
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-[var(--color-text-main)] tracking-tight mb-6 leading-tight">
            Scholarly <span className="italic font-light text-[var(--color-text-muted)]">Explorations</span>
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] leading-relaxed max-w-2xl mx-auto">
            Investigating complex software systems, artificial intelligence, and applied algorithms to solve tangible problems.
          </p>
        </div>

        <ResearchSection />

      </main>
      <Footer />
    </div>
  )
}
