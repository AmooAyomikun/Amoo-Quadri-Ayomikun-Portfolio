import React from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { HeroSection } from '../sections/HeroSection'
import { NumberedAboutFlow } from '../sections/NumberedAboutFlow'
import { TestimonialsSection } from '../sections/TestimonialsSection'
import { NewsSection } from '../sections/NewsSection'
import { ContactSection } from '../sections/ContactSection'
import { GithubActivitySection } from '../sections/GithubActivitySection'
import { VisitorMapSection } from '../sections/VisitorMapSection'
import { TechStackSection } from '../sections/TechStackSection'

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)] transition-colors duration-200">
      <Navbar />
      <main id="main-content">
        <HeroSection />

        <TechStackSection />

        <NumberedAboutFlow />
        
        <VisitorMapSection />
        
        <GithubActivitySection />

        <TestimonialsSection />

        <NewsSection />

        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
