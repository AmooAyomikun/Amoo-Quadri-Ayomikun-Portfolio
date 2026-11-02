import React from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { TestimonialsSection } from '../sections/TestimonialsSection'
import { SEO } from '../components/SEO'
import { PageContainer } from '../components/PageContainer'

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)]">
      <SEO 
        title="Endorsements & Testimonials" 
        description="Recommendations and academic/professional feedback from professors, research mentors, and engineering leads for Quadri Ayomikun Amoo."
        canonicalUrl="/testimonials"
      />
      <Navbar />
      <main id="main-content" className="w-full pb-28 sm:pb-32">
        
        {/* Header Banner */}
        <PageContainer className="py-10 sm:py-14 border-b border-[var(--color-border)]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="text-xs font-mono uppercase tracking-widest font-semibold text-[var(--color-primary)]">
              Supervisor Endorsements
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[var(--color-text-main)] mt-2">
              Testimonials & Reviews
            </h1>
            <p className="text-base text-[var(--color-text-muted)] leading-relaxed max-w-3xl mt-3">
              Read testimonials from academic supervisors, NYSC research mentors, product leads, and internship engineering managers who have worked with Quadri Ayomikun Amoo.
            </p>
          </motion.div>
        </PageContainer>

        <TestimonialsSection />

      </main>
      <Footer />
    </div>
  )
}
