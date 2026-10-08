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
  const pinContainerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const filteredTestimonials = portfolioData.testimonials.filter(t => {
    if (filter === 'all') return true
    return t.category === filter || t.category === 'both'
  })

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const timer = setTimeout(() => {
      const getScrollAmount = () => {
        return Math.max(0, track.scrollWidth - (window.innerWidth - 64))
      }

      const totalScroll = getScrollAmount()

      if (totalScroll <= 0) return

      const ctx = gsap.context(() => {
        gsap.to(track, {
          x: () => -totalScroll,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1,
            start: 'top top+=80',
            end: () => `+=${totalScroll + 400}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              setScrollProgress(Math.round(self.progress * 100))
            }
          }
        })
      }, section)

      ScrollTrigger.refresh()

      return () => ctx.revert()
    }, 200)

    return () => clearTimeout(timer)
  }, [filter, filteredTestimonials.length])

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      const scrollAmount = trackRef.current.clientWidth * 0.75
      trackRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section id="testimonials" ref={sectionRef} className="py-20 bg-[var(--color-surface-base)] relative overflow-hidden border-t border-[var(--color-border)]">
      <div ref={pinContainerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--color-surface-card)] text-[var(--color-primary)] text-xs font-mono font-bold border border-[var(--color-border)] mb-3">
              <Code className="w-3.5 h-3.5" />
              <span>peer_endorsements.ts</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-mono font-bold text-[var(--color-text-main)] tracking-tight">
              &lt;Peer Recommendations /&gt;
            </h2>

            <p className="mt-2 text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed font-sans max-w-2xl">
              Endorsements and reviews from academic thesis advisors, research collaborators, product leads, and engineering mentors.
            </p>
          </div>

          {/* Navigation Controls & Scroll Progress Bar */}
          <div className="flex flex-col items-end gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleManualScroll('left')}
                aria-label="Scroll left"
                className="p-2.5 rounded-xl bg-[var(--color-surface-card)] hover:bg-[var(--color-primary)] text-[var(--color-text-main)] hover:text-black border border-[var(--color-border)] transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleManualScroll('right')}
                aria-label="Scroll right"
                className="p-2.5 rounded-xl bg-[var(--color-surface-card)] hover:bg-[var(--color-primary)] text-[var(--color-text-main)] hover:text-black border border-[var(--color-border)] transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Scroll Progress Bar */}
            <div className="w-32 h-1.5 bg-[var(--color-surface-card)] rounded-full overflow-hidden border border-[var(--color-border)]">
              <div
                className="h-full bg-[var(--color-primary)] transition-all duration-150"
                style={{ width: `${Math.max(10, scrollProgress)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filter Toggle Buttons */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-none pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
              filter === 'all'
                ? 'bg-[var(--color-primary)] !text-black font-bold shadow-xs'
                : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border border-[var(--color-border)] font-medium'
            }`}
          >
            All Reviews ({portfolioData.testimonials.length})
          </button>
          <button
            onClick={() => setFilter('academic')}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
              filter === 'academic'
                ? 'bg-[var(--color-primary)] !text-black font-bold shadow-xs'
                : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border border-[var(--color-border)] font-medium'
            }`}
          >
            Academic Supervisors
          </button>
          <button
            onClick={() => setFilter('industry')}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
              filter === 'industry'
                ? 'bg-[var(--color-primary)] !text-black font-bold shadow-xs'
                : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border border-[var(--color-border)] font-medium'
            }`}
          >
            Industry Product Leads
          </button>
        </div>

        {/* Horizontal Scroll Track Wrapper */}
        <div className="overflow-hidden py-4">
          <div ref={trackRef} className="flex gap-6 items-stretch w-max transition-transform ease-out">
            {filteredTestimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="w-[300px] sm:w-[460px] lg:w-[540px] shrink-0 flex flex-col"
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


