import React from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ResearchSection } from '../sections/ResearchSection'
import { ResearchHero } from '../components/PageHeroes'
import { SEO } from '../components/SEO'

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)] flex flex-col justify-between selection:bg-[#64ffda] selection:text-[#0a192f]">
      <SEO 
        title="Research & Publications" 
        description="Published academic papers and ongoing scientific research in Machine Learning, Biometrics, and Automated Assessment by Quadri Ayomikun Amoo."
        canonicalUrl="/research"
      />
      <Navbar />
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-28 sm:pb-32">
        <ResearchHero />
        <ResearchSection />
      </main>
      <Footer />
    </div>
  )
}
