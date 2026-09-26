import React, { useEffect, useRef } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { AboutSection } from '../sections/AboutSection'
import profileImg from '../assets/profile.png'
import gsap from 'gsap'

export default function AboutPage() {
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
        
        {/* Page Hero Header */}
        <div ref={headerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest font-semibold text-[var(--color-primary)]">
                About & Statement of Purpose
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[var(--color-text-main)] tracking-tight">
                Quadri Ayomikun Amoo
              </h1>
              <p className="text-lg text-[var(--color-primary)] font-serif italic font-semibold">
                Software Engineering Scholar & Research Assistant
              </p>
              <p className="text-base text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
                Graduated with a first-class B.Sc. in Software Engineering (5.0/5.0 Major GPA, 4.45/5.00 Final CGPA). Currently pursuing an MSc in Computer Science at Delta State University while supporting research under Prof. Jude Sinebe.
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-2 border-[var(--color-primary)]/40 shadow-md">
                <img
                  src={profileImg}
                  alt="Quadri Ayomikun Amoo"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Detailed About Content */}
        <AboutSection />

      </main>
      <Footer />
    </div>
  )
}
