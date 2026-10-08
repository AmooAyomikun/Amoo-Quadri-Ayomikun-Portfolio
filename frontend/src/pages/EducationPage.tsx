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
    return <GraduationCap className="w-5 h-5 text-[#C4FA4C]" />
  }

  const getDegreeBadge = (degree: string) => {
    if (degree.includes('Master')) return "Postgraduate"
    if (degree.includes('Bachelor')) return "Undergraduate"
    if (degree.includes('Diploma')) return "Diploma"
    return "Secondary Education"
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between">
      <Navbar />
      
      <main ref={containerRef} className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Page Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto gsap-edu-card">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C4FA4C] font-semibold mb-3 inline-flex items-center gap-2 bg-[#C4FA4C]/10 px-3 py-1 rounded-full border border-[#C4FA4C]/20">
            <Sparkles className="w-4 h-4 text-[#C4FA4C]" /> Academic Qualifications
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight mb-4">
            Education & Certifications
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
            A comprehensive record of my academic degrees, honors, subject excellence awards, and core software engineering coursework.
          </p>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 gsap-edu-card max-w-4xl mx-auto">
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-4 rounded-xl text-center">
            <span className="text-xl sm:text-2xl font-bold font-serif text-[#C4FA4C] block">M.Sc.</span>
            <span className="text-[11px] font-mono text-neutral-400">Current Postgraduate</span>
          </div>
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-4 rounded-xl text-center">
            <span className="text-xl sm:text-2xl font-bold font-serif text-[#C4FA4C] block">5.0 / 5.0</span>
            <span className="text-[11px] font-mono text-neutral-400">B.Sc. Major GPA</span>
          </div>
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-4 rounded-xl text-center">
            <span className="text-xl sm:text-2xl font-bold font-serif text-[#C4FA4C] block">Top 10%</span>
            <span className="text-[11px] font-mono text-neutral-400">Graduating Honor</span>
          </div>
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-4 rounded-xl text-center">
            <span className="text-xl sm:text-2xl font-bold font-serif text-[#C4FA4C] block">4 Awards</span>
            <span className="text-[11px] font-mono text-neutral-400">Subject Excellence</span>
          </div>
        </div>

        {/* View Mode Switcher Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 pb-4 border-b border-neutral-900 gsap-edu-card">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider font-semibold">View Mode:</span>
            <div className="bg-neutral-950 p-1 rounded-xl border border-neutral-800 flex items-center gap-1">
              <button
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  viewMode === 'timeline'
                    ? 'bg-[#C4FA4C] text-black font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" /> Timeline (Standard)
              </button>
              
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#C4FA4C] text-black font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Grid Stack
              </button>

              <button
                onClick={() => setViewMode('carousel')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  viewMode === 'carousel'
                    ? 'bg-[#C4FA4C] text-black font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Carousel Slider
              </button>
            </div>
          </div>

          <div className="text-xs font-mono text-neutral-500">
            Showing {portfolioData.education.length} Institutions (2013 – Present)
          </div>
        </div>

        {/* 1. TIMELINE VIEW (STANDARD & DEFAULT) */}
        {viewMode === 'timeline' && (
          <div className="relative max-w-4xl mx-auto pl-4 sm:pl-8 border-l border-neutral-800 space-y-10 mb-16">
            {portfolioData.education.map((edu, idx) => (
              <div key={idx} className="relative group gsap-edu-card">
                {/* Node Bullet on Timeline Line */}
                <div className="absolute -left-[21px] sm:-left-[37px] top-1.5 w-4 h-4 rounded-full bg-[#050505] border-2 border-[#C4FA4C] group-hover:scale-125 transition-transform flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C4FA4C]" />
                </div>

                {/* Card Container */}
                <div className="bg-[#0A0A0A] border border-[#1A1A1A] group-hover:border-neutral-700 rounded-2xl p-6 sm:p-8 transition-all duration-300">
                  
                  {/* Top Metadata Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-neutral-900">
                    <span className="text-xs font-mono text-[#C4FA4C] bg-[#C4FA4C]/10 border border-[#C4FA4C]/20 px-3 py-1 rounded-full font-semibold inline-flex items-center gap-1.5">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 p-4 bg-neutral-950 rounded-xl border border-neutral-900 text-xs font-mono">
                      {edu.majorGpa && (
                        <div>
                          <span className="text-neutral-500 block text-[10px] uppercase">Major GPA</span>
                          <span className="text-[#C4FA4C] font-bold text-sm sm:text-base">{edu.majorGpa}</span>
                        </div>
                      )}
                      {edu.finalCgpa && (
                        <div>
                          <span className="text-neutral-500 block text-[10px] uppercase">Final CGPA</span>
                          <span className="text-neutral-200 font-bold text-xs sm:text-sm">{edu.finalCgpa}</span>
                        </div>
                      )}
                      {edu.honors && (
                        <div className="sm:col-span-2 pt-2 border-t border-neutral-900 text-neutral-300">
                          <span className="text-amber-400 font-semibold">Honors: </span>
                          <span>{edu.honors}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Subject Excellence Awards */}
                  {edu.awards && edu.awards.length > 0 && (
                    <div className="mb-5">
                      <span className="text-xs font-mono uppercase text-neutral-400 tracking-wider block mb-2 font-semibold flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-400" /> Subject Excellence Awards
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {edu.awards.map((award, i) => (
                          <div key={i} className="text-xs font-sans text-amber-300 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg flex items-start gap-2">
                            <span className="text-amber-400 font-bold">★</span>
                            <span>{award}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Accomplishments */}
                  <div className="mb-5">
                    <span className="text-xs font-mono uppercase text-neutral-400 tracking-wider block mb-2 font-semibold">
                      Key Accomplishments & Focus
                    </span>
                    <ul className="space-y-2">
                      {edu.highlights.map((highlight, i) => (
                        <li key={i} className="text-xs sm:text-sm text-neutral-300 leading-relaxed flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#C4FA4C] shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Coursework Modules Tags */}
                  {edu.courses && edu.courses.length > 0 && (
                    <div className="pt-4 border-t border-neutral-900">
                      <span className="text-xs font-mono uppercase text-neutral-500 tracking-wider block mb-2">
                        Core Modules & Curriculum
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {edu.courses.map((course, i) => (
                          <span key={i} className="text-xs font-mono text-neutral-300 bg-neutral-950 border border-neutral-800 px-2.5 py-1 rounded-md">
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
                className="bg-[#0A0A0A] border border-[#1A1A1A] hover:border-neutral-700 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 gsap-edu-card"
              >
                <div>
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-neutral-900 text-xs font-mono">
                    <span className="text-[#C4FA4C] font-semibold">{edu.period}</span>
                    <span className="text-neutral-500 uppercase">{getDegreeBadge(edu.degree)}</span>
                  </div>

                  <div className="flex items-center gap-3.5 mb-4">
                    {edu.imageUrl ? (
                      <img 
                        src={edu.imageUrl} 
                        alt={edu.institution} 
                        className="w-12 h-12 rounded-xl object-cover border border-neutral-800 shrink-0 bg-neutral-900 p-0.5" 
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                        {getIcon(edu.degree)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-xs font-semibold text-neutral-300 truncate">{edu.institution}</h3>
                      {edu.location && <span className="text-[11px] font-mono text-neutral-500 block">{edu.location}</span>}
                    </div>
                  </div>

                  <h2 className="text-base sm:text-lg font-serif font-bold text-white mb-3 leading-snug">
                    {edu.degree}
                  </h2>

                  {(edu.majorGpa || edu.finalCgpa) && (
                    <div className="mb-4 text-xs font-mono bg-neutral-950 p-3 rounded-xl border border-neutral-900">
                      {edu.majorGpa && <div className="text-[#C4FA4C] font-semibold">Major GPA: {edu.majorGpa}</div>}
                      {edu.finalCgpa && <div className="text-neutral-400 mt-0.5">CGPA: {edu.finalCgpa}</div>}
                      {edu.honors && <div className="text-neutral-400 text-[11px] mt-1 pt-1 border-t border-neutral-900">{edu.honors}</div>}
                    </div>
                  )}

                  {edu.awards && edu.awards.length > 0 && (
                    <div className="mb-4">
                      <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1.5 font-semibold">Excellence Awards</span>
                      <ul className="space-y-1">
                        {edu.awards.map((award, i) => (
                          <li key={i} className="text-xs text-amber-300 bg-amber-500/5 p-1.5 rounded border border-amber-500/20">
                            ★ {award}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mb-4">
                    <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1.5 font-semibold">Highlights</span>
                    <ul className="space-y-1.5">
                      {edu.highlights.map((h, i) => (
                        <li key={i} className="text-xs text-neutral-400 flex items-start gap-1.5">
                          <span className="text-[#C4FA4C]">›</span> {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {edu.courses && edu.courses.length > 0 && (
                  <div className="pt-3 border-t border-neutral-900 mt-2">
                    <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1.5">Modules</span>
                    <div className="flex flex-wrap gap-1">
                      {edu.courses.map((c, i) => (
                        <span key={i} className="text-[10px] font-mono text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-900">
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
              <div className="flex items-center gap-2 font-mono text-xs text-neutral-400">
                <span className="text-[#C4FA4C] font-bold">{activeIndex + 1}</span>
                <span>/</span>
                <span>{portfolioData.education.length} Institutions</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  aria-label="Previous card"
                  className={`p-2.5 rounded-xl border border-neutral-800 transition-all cursor-pointer ${
                    canScrollLeft
                      ? 'bg-neutral-900 text-white hover:border-[#C4FA4C] hover:text-[#C4FA4C]'
                      : 'bg-neutral-950 text-neutral-700 border-neutral-900 cursor-not-allowed opacity-40'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  aria-label="Next card"
                  className={`p-2.5 rounded-xl border border-neutral-800 transition-all cursor-pointer ${
                    canScrollRight
                      ? 'bg-neutral-900 text-white hover:border-[#C4FA4C] hover:text-[#C4FA4C]'
                      : 'bg-neutral-950 text-neutral-700 border-neutral-900 cursor-not-allowed opacity-40'
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
                      className="snap-start shrink-0 w-[88vw] xs:w-[340px] sm:w-[380px] md:w-[420px] bg-[#0A0A0A] border border-[#1A1A1A] hover:border-neutral-700 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative group"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-neutral-900 font-mono text-xs">
                          <span className="text-neutral-500 font-medium">{cardNum} / {totalNum}</span>
                          <span className="text-[#C4FA4C] uppercase font-semibold">{edu.period}</span>
                        </div>

                        <div className="flex items-center gap-3.5 mb-4">
                          {edu.imageUrl ? (
                            <img 
                              src={edu.imageUrl} 
                              alt={edu.institution} 
                              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-neutral-800 shrink-0 bg-neutral-900 p-0.5" 
                            />
                          ) : (
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                              {getIcon(edu.degree)}
                            </div>
                          )}

                          <div className="min-w-0">
                            <span className="text-[10px] font-mono text-neutral-500 uppercase block">{getDegreeBadge(edu.degree)}</span>
                            <h3 className="text-xs sm:text-sm font-semibold text-neutral-300 truncate">{edu.institution}</h3>
                            {edu.location && (
                              <span className="text-[11px] font-mono text-neutral-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 shrink-0" /> {edu.location}
                              </span>
                            )}
                          </div>
                        </div>

                        <h2 className="text-base sm:text-xl font-serif font-bold text-white leading-snug mb-3">
                          {edu.degree}
                        </h2>

                        {(edu.finalCgpa || edu.honors || edu.majorGpa) && (
                          <div className="space-y-1.5 mb-4 text-xs font-mono bg-neutral-950 p-3 rounded-xl border border-neutral-900">
                            {edu.majorGpa && (
                              <div className="text-[#C4FA4C] font-semibold flex justify-between">
                                <span>Major GPA:</span>
                                <span>{edu.majorGpa}</span>
                              </div>
                            )}
                            {edu.finalCgpa && (
                              <div className="text-neutral-300 flex justify-between">
                                <span>Final CGPA:</span>
                                <span>{edu.finalCgpa}</span>
                              </div>
                            )}
                            {edu.honors && (
                              <div className="text-neutral-400 text-[11px] pt-1 border-t border-neutral-900 mt-1">
                                {edu.honors}
                              </div>
                            )}
                          </div>
                        )}

                        {edu.awards && edu.awards.length > 0 && (
                          <div className="mb-4">
                            <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-2 font-semibold">Subject Excellence Awards</span>
                            <ul className="space-y-1.5">
                              {edu.awards.map((award, i) => (
                                <li key={i} className="text-xs font-sans text-amber-300 flex items-start gap-2 bg-amber-500/5 p-2 rounded-lg border border-amber-500/20">
                                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                  <span>{award}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="mb-4">
                          <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-2 font-semibold">Key Accomplishments</span>
                          <ul className="space-y-2">
                            {edu.highlights.map((highlight, i) => (
                              <li key={i} className="text-xs sm:text-sm text-neutral-400 leading-relaxed flex items-start gap-2">
                                <span className="text-[#C4FA4C] font-bold mt-0.5 shrink-0">›</span>
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {edu.courses && edu.courses.length > 0 && (
                        <div className="pt-3 border-t border-neutral-900 mt-4">
                          <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-2">Core Modules</span>
                          <div className="flex flex-wrap gap-1.5">
                            {edu.courses.map((course, i) => (
                              <span key={i} className="text-[10px] font-mono text-neutral-400 bg-neutral-950 border border-neutral-900 px-2 py-0.5 rounded-md">
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
                    activeIndex === i ? 'w-8 bg-[#C4FA4C]' : 'w-2 bg-neutral-800 hover:bg-neutral-700'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Academic Highlights Overview Block */}
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto gsap-edu-card">
          <h3 className="text-lg font-serif font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#C4FA4C]" /> Academic Summary & Distinctions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-neutral-400 font-mono">
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900">
              <span className="text-[#C4FA4C] font-bold block mb-1">5.0 / 5.0 Major GPA</span>
              <span>Perfect academic standing in core Software Engineering curriculum at Technical University.</span>
            </div>
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900">
              <span className="text-[#C4FA4C] font-bold block mb-1">Top 10% Graduating Class</span>
              <span>Second-Class Upper Division honors with 4 subject excellence awards in OS, SE, HCI & Data Structures.</span>
            </div>
          </div>
        </div>

      </main>
      
      <Footer />
    </div>
  )
}





