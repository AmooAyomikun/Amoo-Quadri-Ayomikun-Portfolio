import React from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ProjectsSection } from '../sections/ProjectsSection'
import { SEO } from '../components/SEO'

export default function ProjectsPage() {

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)] flex flex-col justify-between selection:bg-[var(--color-primary)] selection:text-[var(--color-primary-text)]">
      <SEO 
        title="Featured Projects & Architecture" 
        description="Explore real-world software engineering projects, system architectures, and case studies built by Quadri Ayomikun Amoo."
        canonicalUrl="/projects"
      />
      <Navbar />
      <main id="main-content" className="w-full pb-28 sm:pb-32">
        <ProjectsSection />
      </main>
      <Footer />
    </div>
  )
}
