import React from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ExperienceSection } from '../sections/ExperienceSection'
import { SkillsSection } from '../sections/SkillsSection'
import { ExperienceHero } from '../components/PageHeroes'
import { SEO } from '../components/SEO'

import { PageContainer } from '../components/PageContainer'

export default function ExperiencePage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)] flex flex-col justify-between selection:bg-[#64ffda] selection:text-[#0a192f]">
      <SEO 
        title="Work Experience & History" 
        description="Professional career timeline, software engineering roles, and leadership experience of Quadri Ayomikun Amoo."
        canonicalUrl="/experience"
      />
      <Navbar />
      <PageContainer as="main" id="main-content" className="pb-28 sm:pb-32">
        <ExperienceHero />
        <ExperienceSection />
        <SkillsSection />
      </PageContainer>
      <Footer />
    </div>
  )
}
