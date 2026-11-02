import React from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ContactSection } from '../sections/ContactSection'
import { ContactHero } from '../components/PageHeroes'
import { SEO } from '../components/SEO'

import { PageContainer } from '../components/PageContainer'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)] flex flex-col justify-between selection:bg-[#64ffda] selection:text-[#0a192f]">
      <SEO 
        title="Contact & Collaboration" 
        description="Get in touch with Quadri Ayomikun Amoo for software engineering opportunities, research collaborations, or technical consulting."
        canonicalUrl="/contact"
      />
      <Navbar />
      <PageContainer as="main" id="main-content" className="pb-28 sm:pb-32">
        <ContactHero />
        <ContactSection showHeader={false} />
      </PageContainer>
      <Footer />
    </div>
  )
}
