import React, { useEffect, useRef } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { NewsSection } from '../sections/NewsSection'
import { portfolioData } from '../content/portfolioData'
import { Badge } from '../components/Badge'
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-8 border-t border-[var(--color-border)]">
          <h2 className="text-3xl font-serif font-bold text-[var(--color-text-main)] mb-8">
            Published Research & Papers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolioData.publications.map(pub => (
              <div key={pub.id} className="p-6 bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] shadow-sm hover:border-[var(--color-primary)] transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="primary">{pub.type}</Badge>
                  <span className="text-xs font-mono text-[var(--color-text-muted)] font-semibold">{pub.date}</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-[var(--color-text-main)] mb-2 leading-tight">{pub.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-4">{pub.authors}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--color-border)]">
                  <span className="text-xs font-bold font-mono tracking-widest uppercase text-[var(--color-text-main)]">{pub.journal}</span>
                  {pub.link && (
                    <a href={pub.link} target="_blank" rel="noreferrer" className="text-xs text-[var(--color-primary)] hover:underline font-mono font-bold">
                      View Publication ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  )
}
