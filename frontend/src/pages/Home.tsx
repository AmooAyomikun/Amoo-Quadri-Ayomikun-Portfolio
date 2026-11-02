import React from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { SocialSidebars } from '../components/SocialSidebars'
import { HeroSection } from '../sections/HeroSection'
import { AboutJourneySection } from '../sections/AboutJourneySection'
import { NewsSection } from '../sections/NewsSection'
import { QuestionsSection } from '../sections/QuestionsSection'
import { ContactSection } from '../sections/ContactSection'
import { GithubActivitySection } from '../sections/GithubActivitySection'
import { VisitorMapSection } from '../sections/VisitorMapSection'
import { TechStackSection } from '../sections/TechStackSection'
import { SEO } from '../components/SEO'

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)] transition-colors duration-200 relative">
      <SEO canonicalUrl="/" />
      <Navbar />
      
      {/* Side logos and vertical email exclusively for home page */}
      <SocialSidebars />

      <main id="main-content" className="relative z-10">
        <HeroSection />

        <AboutJourneySection />

        <TechStackSection />
        
        <VisitorMapSection />
        
        <GithubActivitySection />

        <NewsSection 
          limit={3} 
          showViewAll={true} 
          badgeText="// LATEST UPDATES"
          heading="News & Announcements"
        />

        <QuestionsSection />

        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
