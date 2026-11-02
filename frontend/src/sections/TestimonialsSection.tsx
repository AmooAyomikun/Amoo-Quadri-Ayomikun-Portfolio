import React, { useState, useEffect, useRef, useCallback } from 'react'
import { portfolioData } from '../content/portfolioData'
import { TestimonialCard } from '../components/TestimonialCard'
import { AnimatedWords } from '../components/AnimatedWords'
import { Code, ChevronLeft, ChevronRight } from 'lucide-react'
import { apiUrl } from '../lib/api'

export const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState(portfolioData.testimonials)
  const [filter, setFilter] = useState<'all' | 'academic' | 'industry'>('all')
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Fetch testimonials with AbortController for request cancellation
  useEffect(() => {
    const controller = new AbortController()

    fetch(apiUrl('/api/testimonials'), { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (json?.success && Array.isArray(json.data) && json.data.length > 0) {
          setTestimonials(json.data)
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          // Fallback cleanly to static portfolioData.testimonials
        }
      })

    return () => controller.abort()
  }, [])

  const filteredTestimonials = testimonials.filter(t => {
    if (filter === 'all') return true
    return t.category === filter || t.category === 'both'
  })

  // Track scroll position to update progress bar and card index
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    if (maxScroll <= 0) {
      setScrollProgress(100)
      setCurrentIndex(0)
      return
    }
    const current = el.scrollLeft
    const progress = Math.min(100, Math.max(0, Math.round((current / maxScroll) * 100)))
    setScrollProgress(progress)

    const cardWidth = 460
    const activeIndex = Math.min(
      filteredTestimonials.length - 1,
      Math.max(0, Math.round(current / cardWidth))
    )
    setCurrentIndex(activeIndex)
  }, [filteredTestimonials.length])

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const handleManualScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current
    if (!el) return
    const cardWidth = 460
    const scrollDelta = direction === 'right' ? cardWidth : -cardWidth
    el.scrollBy({ left: scrollDelta, behavior: 'smooth' })
  }

  return (
    <section 
      id="testimonials" 
      className="py-10 sm:py-16 bg-[var(--color-surface-base)] relative overflow-hidden flex flex-col justify-center"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20 w-full">
        <div className="border-t border-[#233554] pt-8 sm:pt-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--color-surface-card)] text-[var(--color-primary)] text-xs font-mono font-bold border border-[var(--color-border)] mb-2">
              <Code className="w-3.5 h-3.5" />
              <span>peer_endorsements.ts</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-mono font-bold text-[var(--color-text-main)] tracking-tight">
              <AnimatedWords text="<Peer Recommendations />" />
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

            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-[var(--color-text-subtle)]">
                {String(currentIndex + 1).padStart(2, '0')} / {String(filteredTestimonials.length).padStart(2, '0')}
              </span>
              <div className="w-24 sm:w-32 h-1 bg-[var(--color-surface-elevated)] rounded-full overflow-hidden border border-[var(--color-border)]">
                <div 
                  className="h-full bg-[var(--color-primary)] transition-all duration-150 ease-out rounded-full"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
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
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-none py-2 snap-x snap-mandatory scroll-smooth"
        >
          <div className="flex gap-4 sm:gap-6 items-stretch w-max pb-2">
            {filteredTestimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="w-[280px] sm:w-[440px] lg:w-[480px] shrink-0 snap-start flex flex-col"
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        </div>

        </div>
      </div>
    </section>
  )
}
