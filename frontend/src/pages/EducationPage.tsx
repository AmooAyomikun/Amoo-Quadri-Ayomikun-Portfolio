import React, { useEffect, useRef, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { portfolioData } from '../content/portfolioData'
import { 
  GraduationCap, 
  Award, 
  MapPin, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Medal, 
  Sparkles, 
  CheckCircle2, 
  LayoutList, 
  LayoutGrid, 
  SlidersHorizontal 
} from 'lucide-react'
import gsap from 'gsap'
import { SEO } from '../components/SEO'

type ViewMode = 'timeline' | 'grid' | 'carousel'

export default function EducationPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('timeline')
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  // Carousel scroll listener
  const updateScrollState = () => {
    if (!scrollContainerRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 15)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15)

    const children = Array.from(scrollContainerRef.current.children)
    if (children.length > 0) {
      let closestIdx = 0
      let minDist = Infinity
      const containerLeft = scrollContainerRef.current.getBoundingClientRect().left

      children.forEach((child, idx) => {
        const dist = Math.abs(child.getBoundingClientRect().left - containerLeft)
        if (dist < minDist) {
          minDist = dist
          closestIdx = idx
        }
      })
      setActiveIndex(closestIdx)
    }
  }

  useEffect(() => {
    if (viewMode !== 'carousel') return
    const el = scrollContainerRef.current
    if (!el) return
    el.addEventListener('scroll', updateScrollState, { passive: true })
    updateScrollState()
    return () => el.removeEventListener('scroll', updateScrollState)
  }, [viewMode])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    const amount = scrollContainerRef.current.clientWidth * 0.85
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth'
    })
  }

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return
    const cardElements = scrollContainerRef.current.children
    if (cardElements[index]) {
      cardElements[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      })
    }
  }

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-edu-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [viewMode])

  const getIcon = (degree: string) => {
    if (degree.includes('Secondary')) return <BookOpen className="w-5 h-5 text-blue-400" />
    if (degree.includes('Diploma')) return <Medal className="w-5 h-5 text-amber-400" />
    return <GraduationCap className="w-5 h-5 text-[#64ffda]" />
  }

  const getDegreeBadge = (degree: string) => {
    if (degree.includes('Master')) return "Postgraduate"
    if (degree.includes('Bachelor')) return "Undergraduate"
    if (degree.includes('Diploma')) return "Diploma"
    return "Secondary Education"
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)] flex flex-col justify-between">
      <SEO 
        title="Education & Academic Background" 
        description="Academic credentials, certifications, coursework, and honors of Quadri Ayomikun Amoo. B.Sc. Software Engineering with 5.0/5.0 Major GPA."
        canonicalUrl="/education"
      />
      <Navbar />
      
      <main ref={containerRef} className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Page Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto gsap-edu-card">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#64ffda] font-semibold mb-3 inline-flex items-center gap-2 bg-[#64ffda]/10 px-3 py-1 rounded-full border border-[#64ffda]/20">
            <Sparkles className="w-4 h-4 text-[#64ffda]" /> Academic Qualifications
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[var(--color-text-main)] tracking-tight mb-4">
            Education & Certifications
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed">
            A comprehensive record of my academic degrees, honors, subject excellence awards, and core software engineering coursework.
          </p>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 gsap-edu-card max-w-4xl mx-auto">
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] p-4 rounded-xl text-center">
            <span className="text-xl sm:text-2xl font-bold font-serif text-[#64ffda] block">M.Sc.</span>
            <span className="text-[11px] font-mono text-[var(--color-text-muted)]">Current Postgraduate</span>
          </div>
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] p-4 rounded-xl text-center">
            <span className="text-xl sm:text-2xl font-bold font-serif text-[#64ffda] block">5.0 / 5.0</span>
            <span className="text-[11px] font-mono text-[var(--color-text-muted)]">B.Sc. Major GPA</span>
          </div>
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] p-4 rounded-xl text-center">
            <span className="text-xl sm:text-2xl font-bold font-serif text-[#64ffda] block">Top 10%</span>
            <span className="text-[11px] font-mono text-[var(--color-text-muted)]">Graduating Honor</span>
          </div>
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] p-4 rounded-xl text-center">
            <span className="text-xl sm:text-2xl font-bold font-serif text-[#64ffda] block">4 Awards</span>
            <span className="text-[11px] font-mono text-[var(--color-text-muted)]">Subject Excellence</span>
          </div>
        </div>

        {/* View Mode Switcher Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 pb-4 border-b border-[var(--color-border)] gsap-edu-card">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">View Mode:</span>
            <div className="bg-[#020c1b] p-1 rounded-xl border border-[var(--color-border)] flex items-center gap-1">
              <button
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  viewMode === 'timeline'
                    ? 'bg-[#64ffda] text-[#0a192f] font-semibold shadow-sm'
                    : 'text-[var(--color-text-muted)] hover:text-white hover:bg-[#112240]'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" /> Timeline (Standard)
              </button>
              
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#64ffda] text-[#0a192f] font-semibold shadow-sm'
                    : 'text-[var(--color-text-muted)] hover:text-white hover:bg-[#112240]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Grid Stack
              </button>

              <button
                onClick={() => setViewMode('carousel')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  viewMode === 'carousel'
                    ? 'bg-[#64ffda] text-[#0a192f] font-semibold shadow-sm'
                    : 'text-[var(--color-text-muted)] hover:text-white hover:bg-[#112240]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Carousel Slider
              </button>
            </div>
          </div>

          <div className="text-xs font-mono text-[var(--color-text-subtle)]">
            Showing {portfolioData.education.length} Institutions (2013 – Present)
          </div>
        </div>

        {/* 1. TIMELINE VIEW (STANDARD & DEFAULT) */}
        {viewMode === 'timeline' && (
          <div className="relative max-w-4xl mx-auto pl-4 sm:pl-8 border-l border-[var(--color-border)] space-y-10 mb-16">
            {portfolioData.education.map((edu, idx) => (
              <div key={idx} className="relative group gsap-edu-card">
                {/* Node Bullet on Timeline Line */}
                <div className="absolute -left-[21px] sm:-left-[37px] top-1.5 w-4 h-4 rounded-full bg-[#0a192f] border-2 border-[#64ffda] group-hover:scale-125 transition-transform flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#64ffda]" />
                </div>

                {/* Card Container */}
                <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] group-hover:border-[#64ffda]/40 rounded-2xl p-6 sm:p-8 transition-all duration-300">
                  
                  {/* Top Metadata Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[var(--color-border)]">
                    <span className="text-xs font-mono text-[#64ffda] bg-[#64ffda]/10 border border-[#64ffda]/20 px-3 py-1 rounded-full font-semibold inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {edu.period}
                    </span>
                    <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider font-medium">
                      {getDegreeBadge(edu.degree)}
                    </span>
                  </div>

                  {/* Header: Logo + Degree + Institution */}
                  <div className="flex items-start gap-4 mb-5">
                    {edu.imageUrl ? (
                      <img 
                        src={edu.imageUrl} 
                        alt={edu.institution} 
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-neutral-800 shrink-0 bg-neutral-900 p-0.5" 
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                        {getIcon(edu.degree)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-2xl font-serif font-bold text-white leading-snug mb-1">
                        {edu.degree}
                      </h2>
                      <p className="text-xs sm:text-sm font-semibold text-neutral-300">
                        {edu.institution}
                      </p>
                      {edu.location && (
                        <p className="text-xs font-mono text-neutral-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" /> {edu.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Academic Metrics Highlights Box */}
                  {(edu.finalCgpa || edu.honors || edu.majorGpa) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 p-4 bg-[#0a192f] rounded-xl border border-[var(--color-border)] text-xs font-mono">
                      {edu.majorGpa && (
                        <div>
                          <span className="text-[var(--color-text-subtle)] block text-[10px] uppercase">Major GPA</span>
                          <span className="text-[#64ffda] font-bold text-sm sm:text-base">{edu.majorGpa}</span>
                        </div>
                      )}
                      {edu.finalCgpa && (
                        <div>
                          <span className="text-[var(--color-text-subtle)] block text-[10px] uppercase">Final CGPA</span>
                          <span className="text-[var(--color-text-main)] font-bold text-xs sm:text-sm">{edu.finalCgpa}</span>
                        </div>
                      )}
                      {edu.honors && (
                        <div className="sm:col-span-2 pt-2 border-t border-[var(--color-border)] text-[var(--color-text-muted)]">
                          <span className="text-[#64ffda] font-semibold">Honors: </span>
                          <span>{edu.honors}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Subject Excellence Awards */}
                  {edu.awards && edu.awards.length > 0 && (
                    <div className="mb-5">
                      <span className="text-xs font-mono uppercase text-[var(--color-text-muted)] tracking-wider block mb-2 font-semibold flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-[#64ffda]" /> Subject Excellence Awards
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {edu.awards.map((award, i) => (
                          <div key={i} className="text-xs font-sans text-[#64ffda] bg-[#64ffda]/10 border border-[#64ffda]/20 p-2.5 rounded-lg flex items-start gap-2">
                            <span className="text-[#64ffda] font-bold">★</span>
                            <span>{award}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Accomplishments */}
                  <div className="mb-5">
                    <span className="text-xs font-mono uppercase text-[var(--color-text-muted)] tracking-wider block mb-2 font-semibold">
                      Key Accomplishments & Focus
                    </span>
                    <ul className="space-y-2">
                      {edu.highlights.map((highlight, i) => (
                        <li key={i} className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#64ffda] shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Coursework Modules Tags */}
                  {edu.courses && edu.courses.length > 0 && (
                    <div className="pt-4 border-t border-[var(--color-border)]">
                      <span className="text-xs font-mono uppercase text-[var(--color-text-subtle)] tracking-wider block mb-2">
                        Core Modules & Curriculum
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {edu.courses.map((course, i) => (
                          <span key={i} className="text-xs font-mono text-[var(--color-text-muted)] bg-[#0a192f] border border-[var(--color-border)] px-2.5 py-1 rounded-md">
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. GRID VIEW */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {portfolioData.education.map((edu, idx) => (
              <div 
                key={idx} 
                className="bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[#64ffda]/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 gsap-edu-card"
              >
                <div>
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-[var(--color-border)] text-xs font-mono">
                    <span className="text-[#64ffda] font-semibold">{edu.period}</span>
                    <span className="text-[var(--color-text-subtle)] uppercase">{getDegreeBadge(edu.degree)}</span>
                  </div>

                  <div className="flex items-center gap-3.5 mb-4">
                    {edu.imageUrl ? (
                      <img 
                        src={edu.imageUrl} 
                        alt={edu.institution} 
                        className="w-12 h-12 rounded-xl object-cover border border-[var(--color-border)] shrink-0 bg-[#0a192f] p-0.5" 
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#0a192f] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                        {getIcon(edu.degree)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-xs font-semibold text-[var(--color-text-main)] truncate">{edu.institution}</h3>
                      {edu.location && <span className="text-[11px] font-mono text-[var(--color-text-subtle)] block">{edu.location}</span>}
                    </div>
                  </div>

                  <h2 className="text-base sm:text-lg font-serif font-bold text-[var(--color-text-main)] mb-3 leading-snug">
                    {edu.degree}
                  </h2>

                  {(edu.majorGpa || edu.finalCgpa) && (
                    <div className="mb-4 text-xs font-mono bg-[#0a192f] p-3 rounded-xl border border-[var(--color-border)]">
                      {edu.majorGpa && <div className="text-[#64ffda] font-semibold">Major GPA: {edu.majorGpa}</div>}
                      {edu.finalCgpa && <div className="text-[var(--color-text-muted)] mt-0.5">CGPA: {edu.finalCgpa}</div>}
                      {edu.honors && <div className="text-[var(--color-text-muted)] text-[11px] mt-1 pt-1 border-t border-[var(--color-border)]">{edu.honors}</div>}
                    </div>
                  )}

                  {edu.awards && edu.awards.length > 0 && (
                    <div className="mb-4">
                      <span className="text-[10px] font-mono uppercase text-[var(--color-text-subtle)] block mb-1.5 font-semibold">Excellence Awards</span>
                      <ul className="space-y-1">
                        {edu.awards.map((award, i) => (
                          <li key={i} className="text-xs text-[#64ffda] bg-[#64ffda]/10 p-1.5 rounded border border-[#64ffda]/20">
                            ★ {award}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mb-4">
                    <span className="text-[10px] font-mono uppercase text-[var(--color-text-subtle)] block mb-1.5 font-semibold">Highlights</span>
                    <ul className="space-y-1.5">
                      {edu.highlights.map((h, i) => (
                        <li key={i} className="text-xs text-[var(--color-text-muted)] flex items-start gap-1.5">
                          <span className="text-[#64ffda]">›</span> {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {edu.courses && edu.courses.length > 0 && (
                  <div className="pt-3 border-t border-[var(--color-border)] mt-2">
                    <span className="text-[10px] font-mono uppercase text-[var(--color-text-subtle)] block mb-1.5">Modules</span>
                    <div className="flex flex-wrap gap-1">
                      {edu.courses.map((c, i) => (
                        <span key={i} className="text-[10px] font-mono text-[var(--color-text-muted)] bg-[#0a192f] px-2 py-0.5 rounded border border-[var(--color-border)]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 3. CAROUSEL SLIDER VIEW */}
        {viewMode === 'carousel' && (
          <div className="mb-16">
            <div className="flex justify-between items-center mb-4 px-2 gsap-edu-card">
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-text-muted)]">
                <span className="text-[#64ffda] font-bold">{activeIndex + 1}</span>
                <span>/</span>
                <span>{portfolioData.education.length} Institutions</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  aria-label="Previous card"
                  className={`p-2.5 rounded-xl border border-[var(--color-border)] transition-all cursor-pointer ${
                    canScrollLeft
                      ? 'bg-[var(--color-surface-card)] text-white hover:border-[#64ffda] hover:text-[#64ffda]'
                      : 'bg-[#0a192f] text-neutral-700 border-[var(--color-border)] cursor-not-allowed opacity-40'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  aria-label="Next card"
                  className={`p-2.5 rounded-xl border border-[var(--color-border)] transition-all cursor-pointer ${
                    canScrollRight
                      ? 'bg-[var(--color-surface-card)] text-white hover:border-[#64ffda] hover:text-[#64ffda]'
                      : 'bg-[#0a192f] text-neutral-700 border-[var(--color-border)] cursor-not-allowed opacity-40'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative mb-6 gsap-edu-card">
              <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-6 py-2 scrollbar-none scroll-smooth items-stretch"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {portfolioData.education.map((edu, idx) => {
                  const cardNum = (idx + 1).toString().padStart(2, '0')
                  const totalNum = portfolioData.education.length.toString().padStart(2, '0')

                  return (
                    <div 
                      key={idx} 
                      className="snap-start shrink-0 w-[88vw] xs:w-[340px] sm:w-[380px] md:w-[420px] bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[#64ffda]/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative group"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-[var(--color-border)] font-mono text-xs">
                          <span className="text-[var(--color-text-subtle)] font-medium">{cardNum} / {totalNum}</span>
                          <span className="text-[#64ffda] uppercase font-semibold">{edu.period}</span>
                        </div>

                        <div className="flex items-center gap-3.5 mb-4">
                          {edu.imageUrl ? (
                            <img 
                              src={edu.imageUrl} 
                              alt={edu.institution} 
                              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-[var(--color-border)] shrink-0 bg-[#0a192f] p-0.5" 
                            />
                          ) : (
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#0a192f] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                              {getIcon(edu.degree)}
                            </div>
                          )}

                          <div className="min-w-0">
                            <span className="text-[10px] font-mono text-[var(--color-text-subtle)] uppercase block">{getDegreeBadge(edu.degree)}</span>
                            <h3 className="text-xs sm:text-sm font-semibold text-[var(--color-text-main)] truncate">{edu.institution}</h3>
                            {edu.location && (
                              <span className="text-[11px] font-mono text-[var(--color-text-subtle)] flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 shrink-0" /> {edu.location}
                              </span>
                            )}
                          </div>
                        </div>

                        <h2 className="text-base sm:text-xl font-serif font-bold text-[var(--color-text-main)] leading-snug mb-3">
                          {edu.degree}
                        </h2>

                        {(edu.finalCgpa || edu.honors || edu.majorGpa) && (
                          <div className="space-y-1.5 mb-4 text-xs font-mono bg-[#0a192f] p-3 rounded-xl border border-[var(--color-border)]">
                            {edu.majorGpa && (
                              <div className="text-[#64ffda] font-semibold flex justify-between">
                                <span>Major GPA:</span>
                                <span>{edu.majorGpa}</span>
                              </div>
                            )}
                            {edu.finalCgpa && (
                              <div className="text-[var(--color-text-muted)] flex justify-between">
                                <span>Final CGPA:</span>
                                <span>{edu.finalCgpa}</span>
                              </div>
                            )}
                            {edu.honors && (
                              <div className="text-[var(--color-text-muted)] text-[11px] pt-1 border-t border-[var(--color-border)] mt-1">
                                {edu.honors}
                              </div>
                            )}
                          </div>
                        )}

                        {edu.awards && edu.awards.length > 0 && (
                          <div className="mb-4">
                            <span className="text-[10px] font-mono uppercase text-[var(--color-text-subtle)] block mb-2 font-semibold">Subject Excellence Awards</span>
                            <ul className="space-y-1.5">
                              {edu.awards.map((award, i) => (
                                <li key={i} className="text-xs font-sans text-[#64ffda] flex items-start gap-2 bg-[#64ffda]/10 p-2 rounded-lg border border-[#64ffda]/20">
                                  <Award className="w-3.5 h-3.5 text-[#64ffda] shrink-0 mt-0.5" />
                                  <span>{award}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="mb-4">
                          <span className="text-[10px] font-mono uppercase text-[var(--color-text-subtle)] block mb-2 font-semibold">Key Accomplishments</span>
                          <ul className="space-y-2">
                            {edu.highlights.map((highlight, i) => (
                              <li key={i} className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed flex items-start gap-2">
                                <span className="text-[#64ffda] font-bold mt-0.5 shrink-0">›</span>
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {edu.courses && edu.courses.length > 0 && (
                        <div className="pt-3 border-t border-[var(--color-border)] mt-4">
                          <span className="text-[10px] font-mono uppercase text-[var(--color-text-subtle)] block mb-2">Core Modules</span>
                          <div className="flex flex-wrap gap-1.5">
                            {edu.courses.map((course, i) => (
                              <span key={i} className="text-[10px] font-mono text-[var(--color-text-muted)] bg-[#0a192f] border border-[var(--color-border)] px-2 py-0.5 rounded-md">
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-center items-center gap-2 gsap-edu-card">
              {portfolioData.education.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  aria-label={`Go to item ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === i ? 'w-8 bg-[#64ffda]' : 'w-2 bg-[#233554] hover:bg-[#324b74]'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Academic Highlights Overview Block */}
        <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto gsap-edu-card">
          <h3 className="text-lg font-serif font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#64ffda]" /> Academic Summary & Distinctions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[var(--color-text-muted)] font-mono">
            <div className="bg-[#0a192f] p-4 rounded-xl border border-[var(--color-border)]">
              <span className="text-[#64ffda] font-bold block mb-1">5.0 / 5.0 Major GPA</span>
              <span>Perfect academic standing in core Software Engineering curriculum at Technical University.</span>
            </div>
            <div className="bg-[#0a192f] p-4 rounded-xl border border-[var(--color-border)]">
              <span className="text-[#64ffda] font-bold block mb-1">Top 10% Graduating Class</span>
              <span>Second-Class Upper Division honors with 4 subject excellence awards in OS, SE, HCI & Data Structures.</span>
            </div>
          </div>
        </div>

      </main>
      
      <Footer />
    </div>
  )
}





