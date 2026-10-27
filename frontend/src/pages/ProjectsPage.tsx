import React, { useEffect, useRef } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ProjectsSection } from '../sections/ProjectsSection'
import gsap from 'gsap'
import { SEO } from '../components/SEO'

export default function ProjectsPage() {
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
      <SEO 
        title="Featured Projects & Architecture" 
        description="Explore real-world software engineering projects, system architectures, and case studies built by Quadri Ayomikun Amoo."
        canonicalUrl="/projects"
      />
      <Navbar />
      <main id="main-content" className="pt-20 sm:pt-24 pb-16">
        
        <ProjectsSection />

      </main>
      <Footer />
    </div>
  )
}
