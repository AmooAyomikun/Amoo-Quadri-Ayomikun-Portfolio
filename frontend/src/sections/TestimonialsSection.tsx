import React, { useState, useEffect, useRef } from 'react'
import { portfolioData } from '../content/portfolioData'
import { TestimonialCard } from '../components/TestimonialCard'
import { Code, ChevronLeft, ChevronRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const TestimonialsSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'academic' | 'industry'>('all')
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  const filteredTestimonials = portfolioData.testimonials.filter(t => {
    if (filter === 'all') return true
    return t.category === filter || t.category === 'both'
  })

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const parent = track.parentElement
    if (!parent) return

    // Create GSAP context synchronously so cleanup is guaranteed
    const ctx = gsap.context(() => {
      const parentWidth = parent.clientWidth
      const trackWidth = track.scrollWidth
      const totalScroll = Math.max(0, trackWidth - parentWidth)

      if (totalScroll <= 0) {
        gsap.set(track, { x: 0 })
        setScrollProgress(100)
        return
      }

      gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.8,
          start: 'top top+=64',
          end: () => `+=${totalScroll + 250}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = Math.round(self.progress * 100)
            setScrollProgress(progress)
            const cardCount = filteredTestimonials.length
            const idx = Math.min(cardCount - 1, Math.floor(self.progress * cardCount))
            setCurrentIndex(idx)
          }
        }
      })
    }, section)

    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 50)

    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [filter, filteredTestimonials.length])

  const handleManualScroll = (direction: 'left' | 'right') => {
    const track = trackRef.current
    if (!track) return
    const cardWidth = 500 + 24
    const scrollDelta = direction === 'right' ? cardWidth : -cardWidth
    window.scrollBy({ top: scrollDelta, behavior: 'smooth' })
  }

  return (
    <section 
      id="testimonials" 
      ref={sectionRef} 
      className="py-6 sm:py-10 bg-[var(--color-surface-base)] relative overflow-hidden border-t border-[var(--color-border)] flex flex-col justify-center min-h-[90vh]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--color-surface-card)] text-[var(--color-primary)] text-xs font-mono font-bold border border-[var(--color-border)] mb-2">
              <Code className="w-3.5 h-3.5" />
              <span>peer_endorsements.ts</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-mono font-bold text-[var(--color-text-main)] tracking-tight">
              &lt;Peer Recommendations /&gt;
            </h2>

            <p className="mt-1 text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed font-sans max-w-2xl">
              Endorsements and reviews from academic thesis advisors, research collaborators, product leads, and engineering mentors.
            </p>
          </div>

          {/* Navigation Controls & Scroll Progress Bar */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleManualScroll('left')}
                aria-label="Scroll left"
                className="p-2 rounded-xl bg-[var(--color-surface-card)] hover:bg-[var(--color-primary)] text-[var(--color-text-main)] hover:text-black border border-[var(--color-border)] transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleManualScroll('right')}
                aria-label="Scroll right"
                className="p-2 rounded-xl bg-[var(--color-surface-card)] hover:bg-[var(--color-primary)] text-[var(--color-text-main)] hover:text-black border border-[var(--color-border)] transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Scroll Progress Indicator */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[var(--color-text-muted)]">
                {currentIndex + 1} / {filteredTestimonials.length}
              </span>
              <div className="w-28 h-1.5 bg-[var(--color-surface-card)] rounded-full overflow-hidden border border-[var(--color-border)]">
                <div
                  className="h-full bg-[var(--color-primary)] transition-all duration-150"
                  style={{ width: `${Math.max(10, scrollProgress)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toggle Buttons */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-none pb-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap font-bold ${
              filter === 'all'
                ? 'bg-[var(--color-primary)] !text-black shadow-xs'
                : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border border-[var(--color-border)]'
            }`}
          >
            All Reviews ({portfolioData.testimonials.length})
          </button>
          <button
            onClick={() => setFilter('academic')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap font-bold ${
              filter === 'academic'
                ? 'bg-[var(--color-primary)] !text-black shadow-xs'
                : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border border-[var(--color-border)]'
            }`}
          >
            Academic Supervisors
          </button>
          <button
            onClick={() => setFilter('industry')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap font-bold ${
              filter === 'industry'
                ? 'bg-[var(--color-primary)] !text-black shadow-xs'
                : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border border-[var(--color-border)]'
            }`}
          >
            Industry Product Leads
          </button>
        </div>

        {/* Horizontal Scroll Track Wrapper */}
        <div className="overflow-hidden py-1">
          <div 
            ref={trackRef} 
            className="flex gap-6 items-stretch w-max"
          >
            {filteredTestimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="w-[280px] sm:w-[440px] lg:w-[500px] shrink-0 flex flex-col"
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}


