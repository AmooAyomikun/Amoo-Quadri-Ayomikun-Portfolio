import React from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ResearchSection } from '../sections/ResearchSection'
import { ResearchHero } from '../components/PageHeroes'
import { SEO } from '../components/SEO'

import { PageContainer } from '../components/PageContainer'

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)] flex flex-col justify-between selection:bg-[var(--color-primary)] selection:text-[var(--color-primary-text)]">
      <SEO 
        title="Research & Publications" 
        description="Published academic papers and ongoing scientific research in Machine Learning, Biometrics, and Automated Assessment by Quadri Ayomikun Amoo."
        canonicalUrl="/research"
      />
      <Navbar />
      <PageContainer as="main" id="main-content" className="pb-28 sm:pb-32">
        <ResearchHero />
        <ResearchSection />
      </PageContainer>
      <Footer />
    </div>
  )
}
