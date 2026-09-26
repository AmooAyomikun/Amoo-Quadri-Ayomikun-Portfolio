import React, { useState } from 'react'
import { portfolioData } from '../content/portfolioData'
import { TestimonialCard } from '../components/TestimonialCard'
import { Carousel } from '../components/Carousel'
import { Code } from 'lucide-react'

export const TestimonialsSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'academic' | 'industry'>('all')

  const filteredTestimonials = portfolioData.testimonials.filter(t => {
    if (filter === 'all') return true
    return t.category === filter || t.category === 'both'
  })

  return (
    <section id="testimonials" className="py-20 bg-[var(--color-surface-base)] relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Developer Code Tag Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--color-surface-card)] text-[var(--color-primary)] text-xs font-mono font-bold border border-[var(--color-border)] mb-3">
            <Code className="w-3.5 h-3.5" />
            <span>peer_endorsements.ts</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-mono font-bold text-[var(--color-text-main)] tracking-tight">
            &lt;Peer Recommendations /&gt;
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed font-sans">
            Endorsements and reviews from academic thesis advisors, research collaborators, product leads, and engineering mentors.
          </p>
        </div>

        {/* Filter Toggle Buttons */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border border-[var(--color-border)]'
            }`}
          >
            All Reviews ({portfolioData.testimonials.length})
          </button>
          <button
            onClick={() => setFilter('academic')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
              filter === 'academic'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border border-[var(--color-border)]'
            }`}
          >
            Academic Supervisors
          </button>
          <button
            onClick={() => setFilter('industry')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
              filter === 'industry'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border border-[var(--color-border)]'
            }`}
          >
            Industry Product Leads
          </button>
        </div>

        {/* Carousel View for Testimonials */}
        <div>
          <Carousel autoPlay={true} interval={6000} itemsPerPageDesktop={2}>
            {filteredTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </Carousel>
        </div>

      </div>
    </section>
  )
}

