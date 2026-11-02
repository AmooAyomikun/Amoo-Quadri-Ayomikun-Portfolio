import React from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { AboutSection } from '../sections/AboutSection'
import profileImg from '../assets/profile.webp'
import { SEO } from '../components/SEO'
import { PageContainer } from '../components/PageContainer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)] flex flex-col justify-between selection:bg-[#64ffda] selection:text-[#0a192f]">
      <SEO 
        title="About & Biography" 
        description="Learn about Quadri Ayomikun Amoo, his background in Software Engineering (4.45/5.00 Final CGPA, Top 10%), research philosophy, and engineering mindset."
        canonicalUrl="/about"
      />
      <Navbar />
      <PageContainer as="main" id="main-content" className="pb-28 sm:pb-32">
        {/* Page Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="py-10 sm:py-14 border-b border-[var(--color-border)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest font-semibold text-[var(--color-primary)]">
                About &amp; Statement of Purpose
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[var(--color-text-main)] tracking-tight">
                Quadri Ayomikun Amoo
              </h1>
              <p className="text-lg text-[var(--color-primary)] font-serif italic font-semibold">
                Software Engineering Scholar &amp; Research Assistant
              </p>
              <p className="text-base text-[var(--color-text-muted)] leading-relaxed max-w-2xl font-sans">
                Graduated in the Top 10% of class with a B.Sc. in Software Engineering (4.45/5.00 Final CGPA, Second-Class Upper Honors). Currently focused on postgraduate research in applied artificial intelligence, software reliability, and intelligent computing under Assoc. Prof. Jude Sinebe.
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-2 border-[var(--color-primary)]/40 shadow-md">
                <img
                  src={profileImg}
                  alt="Quadri Ayomikun Amoo"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                  width={208}
                  height={208}
                />
              </div>
            </div>

          </div>
        </motion.div>

        <AboutSection />

      </PageContainer>
      <Footer />
    </div>
  )
}
