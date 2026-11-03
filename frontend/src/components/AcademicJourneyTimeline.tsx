import React, { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  Medal, 
  Briefcase, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles
} from 'lucide-react'

export interface MilestoneItem {
  id: string
  period: string
  year: string
  category: 'degree' | 'scholarship' | 'leadership' | 'research' | 'teaching'
  categoryLabel: string
  title: string
  institution: string
  highlight: string
  icon: React.ReactNode
  badgeColor: string
  nodePosition?: 'top' | 'bottom'
}

export const AcademicJourneyTimeline: React.FC = () => {
  const [filter, setFilter] = useState<string>('all')

  const milestones: MilestoneItem[] = [
    {
      id: 'm1',
      period: '2013 – 2019',
      year: '2019',
      category: 'degree',
      categoryLabel: 'Secondary Education',
      title: 'Secondary School Education (WASSCE)',
      institution: 'David Joel Model College, Ibadan',
      highlight: 'Senior secondary curriculum with Pure Sciences & Mathematics focus',
      icon: <Medal className="w-4 h-4" />,
      badgeColor: '#e11d48',
      nodePosition: 'top'
    },
    {
      id: 'm2',
      period: '2021 – 2024',
      year: '2021',
      category: 'scholarship',
      categoryLabel: 'State Scholarship',
      title: 'Oyo State Government Tuition Scholarship',
      institution: 'Ministry of Education, Oyo State',
      highlight: 'Full merit scholarship award (Valued over US$10,000)',
      icon: <Award className="w-4 h-4" />,
      badgeColor: '#f59e0b',
      nodePosition: 'bottom'
    },
    {
      id: 'm3',
      period: '2021 – 2024',
      year: '2024',
      category: 'degree',
      categoryLabel: 'Undergraduate Degree',
      title: 'B.Sc. in Software Engineering',
      institution: 'First Technical University (Abiola Ajimobi Technical Univ.)',
      highlight: '4.45 / 5.00 Final CGPA · Second-Class Upper (Top 10% of Cohort)',
      icon: <GraduationCap className="w-4 h-4" />,
      badgeColor: '#64ffda',
      nodePosition: 'top'
    },
    {
      id: 'm4',
      period: '2021 – 2024',
      year: '2024',
      category: 'degree',
      categoryLabel: 'Professional Diploma',
      title: 'Diploma in Entrepreneurship',
      institution: 'First Technical University, Ibadan',
      highlight: 'Upper Credit Distinction (Top 10% of Graduating Class)',
      icon: <Award className="w-4 h-4" />,
      badgeColor: '#38bdf8',
      nodePosition: 'bottom'
    },
    {
      id: 'm5',
      period: '2021 – 2024',
      year: '2024',
      category: 'degree',
      categoryLabel: 'Language Diploma',
      title: 'Diploma in French Language',
      institution: 'Centre for Language & General Studies',
      highlight: 'Lower Credit · Professional bilingual & technical French curriculum',
      icon: <BookOpen className="w-4 h-4" />,
      badgeColor: '#a855f7',
      nodePosition: 'top'
    },
    {
      id: 'm6',
      period: '2021 – 2024',
      year: '2023',
      category: 'teaching',
      categoryLabel: 'Academic Instruction',
      title: 'Undergraduate Computer Science Tutor',
      institution: 'Dept. of Computer Sciences, First Technical University',
      highlight: 'Tutored 350+ undergraduates weekly in algorithms & data structures',
      icon: <Users className="w-4 h-4" />,
      badgeColor: '#06b6d4',
      nodePosition: 'bottom'
    },
    {
      id: 'm7',
      period: '2023 – 2024',
      year: '2024',
      category: 'leadership',
      categoryLabel: 'Executive Leadership',
      title: 'Welfare Director & Sports/Academics Director',
      institution: 'NACOS & NASSA Student Chapters',
      highlight: 'Executive leadership; co-organized NACOS x GDSC Intro to Tech',
      icon: <Users className="w-4 h-4" />,
      badgeColor: '#10b981',
      nodePosition: 'top'
    },
    {
      id: 'm8',
      period: '2024',
      year: '2024',
      category: 'scholarship',
      categoryLabel: 'Departmental Honors',
      title: '4 Subject Excellence Awards',
      institution: 'First Technical University Senate',
      highlight: 'Best Student: Operating Systems, HCI, SE Practice, Data Structures',
      icon: <Award className="w-4 h-4" />,
      badgeColor: '#f59e0b',
      nodePosition: 'bottom'
    },
    {
      id: 'm9',
      period: '2025 – 2026',
      year: '2025',
      category: 'research',
      categoryLabel: 'Research Fellowship',
      title: 'Research Assistant (NYSC)',
      institution: 'Delta State University, Asaba',
      highlight: 'AI & computational research supervised by Assoc. Prof. Jude Sinebe',
      icon: <Briefcase className="w-4 h-4" />,
      badgeColor: '#64ffda',
      nodePosition: 'top'
    },
    {
      id: 'm10',
      period: '2026',
      year: '2026',
      category: 'research',
      categoryLabel: 'Peer-Reviewed Science',
      title: '2 Published Research Papers',
      institution: 'Zenodo Open Research Repository',
      highlight: 'Algorithmic bias reduction & geospatial recommender systems',
      icon: <Sparkles className="w-4 h-4" />,
      badgeColor: '#38bdf8',
      nodePosition: 'bottom'
    }
  ]

  const categories = [
    { id: 'all', label: 'All Milestones', count: milestones.length },
    { id: 'degree', label: 'Degrees & Diplomas', count: milestones.filter(m => m.category === 'degree').length },
    { id: 'scholarship', label: 'Scholarships & Awards', count: milestones.filter(m => m.category === 'scholarship').length },
    { id: 'teaching', label: 'Instruction & Teaching', count: milestones.filter(m => m.category === 'teaching').length },
    { id: 'leadership', label: 'Leadership', count: milestones.filter(m => m.category === 'leadership').length },
    { id: 'research', label: 'Research', count: milestones.filter(m => m.category === 'research').length }
  ]

  const filteredMilestones = milestones.filter(m => filter === 'all' || m.category === filter)

  const desktopTrackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [maxScroll, setMaxScroll] = useState<number>(2200)

  // Measure content scroll width vs container width dynamically
  useEffect(() => {
    const updateMaxScroll = () => {
      if (contentRef.current && containerRef.current) {
        const scrollDist = Math.max(0, contentRef.current.scrollWidth - containerRef.current.clientWidth)
        setMaxScroll(scrollDist)
      }
    }
    updateMaxScroll()
    window.addEventListener('resize', updateMaxScroll)
    return () => window.removeEventListener('resize', updateMaxScroll)
  }, [filteredMilestones.length])

  // Scroll progress through the desktop track (pinned once it reaches top-[70px] under navbar)
  const { scrollYProgress } = useScroll({
    target: desktopTrackRef as React.RefObject<HTMLElement>,
    offset: ['start 70px', 'end end']
  })

  // Smooth transform: buffer at start (0.0 to 0.08) and end (0.92 to 1.0)
  // so the section shows FULLY in place before horizontal scrolling begins,
  // and stays in place before unpinning!
  const x = useTransform(scrollYProgress, (progress) => {
    if (progress <= 0.08) return 0
    if (progress >= 0.92) return -maxScroll
    const t = (progress - 0.08) / (0.92 - 0.08)
    return -t * maxScroll
  })

  // Track height based on number of milestones: 280vh for full deck, 180vh for filtered subsets
  const trackHeight = filteredMilestones.length <= 4 ? '180vh' : '280vh'

  // Drag-to-scroll support that smoothly shifts page vertical scroll
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragStartX.current = e.clientX
  }

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !desktopTrackRef.current) return
    const deltaX = dragStartX.current - e.clientX
    const totalTravel = desktopTrackRef.current.offsetHeight - window.innerHeight + 70
    if (totalTravel <= 0 || maxScroll <= 0) return

    const scrollRatio = (totalTravel * 0.84) / maxScroll
    window.scrollBy({ top: deltaX * scrollRatio })
    dragStartX.current = e.clientX
  }

  // Trackpad horizontal swipe / shift-wheel translation
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      const absX = Math.abs(e.deltaX)
      const absY = Math.abs(e.deltaY)
      // Only intercept if user is intentionally swiping horizontally with trackpad
      if (absX > absY && absX > 2 && desktopTrackRef.current) {
        e.preventDefault()
        const totalTravel = desktopTrackRef.current.offsetHeight - window.innerHeight + 70
        if (totalTravel > 0 && maxScroll > 0) {
          const scrollRatio = (totalTravel * 0.84) / maxScroll
          window.scrollBy({ top: e.deltaX * scrollRatio })
        }
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [maxScroll])

  const scrollStep = (direction: 'left' | 'right') => {
    if (!desktopTrackRef.current) return
    const rect = desktopTrackRef.current.getBoundingClientRect()
    const pinTop = window.pageYOffset + rect.top - 70
    const totalTravel = desktopTrackRef.current.offsetHeight - window.innerHeight + 70
    if (totalTravel <= 0) return

    const cardStep = (totalTravel * 0.84) / Math.max(1, filteredMilestones.length - 1)
    const currentProgress = Math.max(0, Math.min(1, (window.pageYOffset - pinTop) / totalTravel))

    if (direction === 'right') {
      if (currentProgress < 0.08) {
        window.scrollTo({ top: pinTop + totalTravel * 0.08 + cardStep, behavior: 'smooth' })
      } else {
        window.scrollTo({ top: Math.min(pinTop + totalTravel, window.pageYOffset + cardStep), behavior: 'smooth' })
      }
    } else {
      if (currentProgress > 0.92) {
        window.scrollTo({ top: pinTop + totalTravel * 0.92 - cardStep, behavior: 'smooth' })
      } else {
        window.scrollTo({ top: Math.max(pinTop, window.pageYOffset - cardStep), behavior: 'smooth' })
      }
    }
  }

  const scrollLeft = () => scrollStep('left')
  const scrollRight = () => scrollStep('right')

  return (
    <div className="w-full my-8 sm:my-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-[var(--color-border)] gap-3 sm:gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/25 text-[var(--color-primary)] text-[10px] sm:text-xs font-mono font-semibold uppercase mb-2 select-none">
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            <span>// CHRONOLOGICAL MILESTONES &amp; HONORS</span>
          </div>
          <h3 className="text-xl sm:text-3xl font-serif font-bold text-[var(--color-text-main)] leading-tight">
            Academic &amp; Leadership Journey
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1 leading-relaxed">
            Track of academic degrees, government scholarships, teaching fellowships, and honors from 2013 to 2026.
          </p>
        </div>

        {/* Desktop Track Navigation Buttons */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Scroll left in journey timeline"
            className="w-9 h-9 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-elevated)] hover:border-[var(--color-primary)] text-[var(--color-text-main)] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            aria-label="Scroll right in journey timeline"
            className="w-9 h-9 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-elevated)] hover:border-[var(--color-primary)] text-[var(--color-text-main)] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Category Pills & Horizontal Scroll Hint */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1.5 -mx-1 px-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-mono text-[11px] sm:text-xs flex items-center gap-1.5 sm:gap-2 shrink-0 transition-all cursor-pointer border ${
                filter === cat.id
                  ? 'bg-[var(--color-primary)] text-[var(--color-primary-text)] font-bold border-[var(--color-primary)] shadow-sm'
                  : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-elevated)]'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                filter === cat.id
                  ? 'bg-black/20 text-[var(--color-primary-text)]'
                  : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-mono text-[var(--color-text-subtle)] shrink-0">
          <span>← Scroll or drag to explore all {filteredMilestones.length} milestones →</span>
        </span>
      </div>

      {/* =========================================================================
          DESKTOP VIEW: Sticky-Pinned Horizontal Alternating Milestone Cable
      ========================================================================= */}
      <div 
        ref={desktopTrackRef} 
        className="hidden md:block relative w-full"
        style={{ height: trackHeight }}
      >
        {/* Sticky stage: locked under header at top-[70px], centering the 420px timeline */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          className={`sticky top-[70px] w-full overflow-hidden flex flex-col justify-center select-none group/timeline ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ height: 'calc(100vh - 74px)' }}
        >
          {/* Left / Right floating quick buttons */}
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Scroll timeline left"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-[var(--color-surface-card)]/90 backdrop-blur-md border border-[var(--color-border)] text-[var(--color-text-main)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] shadow-xl flex items-center justify-center opacity-0 group-hover/timeline:opacity-100 transition-all cursor-pointer hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            aria-label="Scroll timeline right"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-[var(--color-surface-card)]/90 backdrop-blur-md border border-[var(--color-border)] text-[var(--color-text-main)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] shadow-xl flex items-center justify-center opacity-0 group-hover/timeline:opacity-100 transition-all cursor-pointer hover:scale-105"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Animated Horizontal Cable */}
          <motion.div 
            ref={contentRef}
            style={{ x }}
            className="relative min-w-max px-12 py-4"
          >
            <div className="relative min-w-max" style={{ height: '420px' }}>
            
            {/* Central Backbone Cable at Y=210px */}
            <div 
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)]/20 via-[var(--color-primary)] to-[var(--color-primary)]/20 z-0"
              style={{ top: '210px' }}
            >
              <div className="absolute inset-0 border-b border-dashed border-white/20" />
            </div>

            {/* Alternating Milestone Nodes Along the Cable */}
            <div className="flex items-center gap-12 relative z-10">
              {filteredMilestones.map((item, index) => {
                const isTop = index % 2 === 0

                return (
                  <div 
                    key={item.id} 
                    className="relative flex flex-col items-center w-[275px] shrink-0"
                    style={{ height: '420px' }}
                  >
                    {/* TOP CARD (if isTop): Placed in upper half (top: 12px) */}
                    {isTop ? (
                      <>
                        <div 
                          className="absolute w-full flex flex-col items-center"
                          style={{ top: '12px' }}
                        >
                          <div className="w-full bg-[var(--color-surface-card)] border-2 border-[var(--color-border)] hover:border-[var(--color-primary)]/70 rounded-2xl p-3.5 shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span 
                                style={{ color: item.badgeColor, borderColor: `${item.badgeColor}40`, backgroundColor: `${item.badgeColor}15` }}
                                className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded border truncate"
                              >
                                {item.categoryLabel}
                              </span>
                              <span className="text-[11px] font-mono text-[var(--color-primary)] font-bold">
                                {item.period}
                              </span>
                            </div>

                            <h4 className="font-serif font-bold text-sm text-[var(--color-text-main)] mb-1 leading-snug line-clamp-2">
                              {item.title}
                            </h4>

                            <p className="text-xs text-[var(--color-text-muted)] font-medium mb-1.5 truncate">
                              {item.institution}
                            </p>

                            <div className="pt-1.5 border-t border-[var(--color-border)] text-[11px] font-sans text-neutral-300 leading-snug line-clamp-2">
                              {item.highlight}
                            </div>
                          </div>
                        </div>

                        {/* Top Connector Stem pointing down to central node */}
                        <div 
                          className="absolute w-0.5 border-r-2 border-dashed border-[var(--color-primary)]/60 z-10"
                          style={{ top: '168px', height: '24px' }}
                        />
                      </>
                    ) : null}

                    {/* CENTRAL CIRCULAR NODE on the timeline cable (Y=192px, height=36px) */}
                    <div 
                      className="absolute z-20 flex flex-col items-center"
                      style={{ top: '192px' }}
                    >
                      <div className="w-9 h-9 rounded-full bg-[var(--color-surface-base)] border-2 border-[var(--color-primary)] flex items-center justify-center text-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20 transition-transform hover:scale-110">
                        {item.icon}
                      </div>
                    </div>

                    {/* YEAR BADGE: Positioned on the OPPOSITE side so it NEVER touches connector lines */}
                    {isTop ? (
                      /* Top card -> Year badge is safely BELOW the node */
                      <div 
                        className="absolute z-20 flex flex-col items-center"
                        style={{ top: '232px' }}
                      >
                        <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-surface-card)] border border-[var(--color-border)] text-[10px] font-mono font-bold text-[var(--color-text-muted)] shadow-xs">
                          {item.year}
                        </span>
                      </div>
                    ) : (
                      /* Bottom card -> Year badge is safely ABOVE the node */
                      <div 
                        className="absolute z-20 flex flex-col items-center"
                        style={{ top: '160px' }}
                      >
                        <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-surface-card)] border border-[var(--color-border)] text-[10px] font-mono font-bold text-[var(--color-text-muted)] shadow-xs">
                          {item.year}
                        </span>
                      </div>
                    )}

                    {/* BOTTOM CARD (if !isTop): Placed in lower half (top: 252px) */}
                    {!isTop ? (
                      <>
                        {/* Bottom Connector Stem pointing up to central node */}
                        <div 
                          className="absolute w-0.5 border-r-2 border-dashed border-[var(--color-primary)]/60 z-10"
                          style={{ top: '228px', height: '24px' }}
                        />

                        <div 
                          className="absolute w-full flex flex-col items-center"
                          style={{ top: '252px' }}
                        >
                          <div className="w-full bg-[var(--color-surface-card)] border-2 border-[var(--color-border)] hover:border-[var(--color-primary)]/70 rounded-2xl p-3.5 shadow-xl transition-all duration-300 hover:translate-y-1 group">
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span 
                                style={{ color: item.badgeColor, borderColor: `${item.badgeColor}40`, backgroundColor: `${item.badgeColor}15` }}
                                className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded border truncate"
                              >
                                {item.categoryLabel}
                              </span>
                              <span className="text-[11px] font-mono text-[var(--color-primary)] font-bold">
                                {item.period}
                              </span>
                            </div>

                            <h4 className="font-serif font-bold text-sm text-[var(--color-text-main)] mb-1 leading-snug line-clamp-2">
                              {item.title}
                            </h4>

                            <p className="text-xs text-[var(--color-text-muted)] font-medium mb-1.5 truncate">
                              {item.institution}
                            </p>

                            <div className="pt-1.5 border-t border-[var(--color-border)] text-[11px] font-sans text-neutral-300 leading-snug line-clamp-2">
                              {item.highlight}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : null}

                  </div>
                )
              })}
            </div>

            </div>
          </motion.div>
        </div>
      </div>

      {/* =========================================================================
          MOBILE VIEW: Sequential Card Stream with Curved Dashed Connectors
          (Optimized for 375px+ screens, inspired by editorial research portfolios)
      ========================================================================= */}
      <div className="block md:hidden space-y-0 mt-6">
        {filteredMilestones.map((item, index) => {
          const isLast = index === filteredMilestones.length - 1

          return (
            <React.Fragment key={item.id}>
              {/* Milestone Card */}
              <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 rounded-2xl p-4 shadow-sm transition-all relative overflow-hidden">
                {/* Top Row: 01 badge, category pill & year */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/25 px-2 py-0.5 rounded-md shadow-xs">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span 
                      style={{ color: item.badgeColor, backgroundColor: `${item.badgeColor}15`, borderColor: `${item.badgeColor}35` }}
                      className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded border truncate"
                    >
                      {item.categoryLabel}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono font-bold text-[var(--color-primary)] shrink-0">
                    {item.year}
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-serif font-bold text-sm sm:text-base text-[var(--color-text-main)] mb-1 leading-snug">
                  {item.title}
                </h4>

                {/* Institution & Period */}
                <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-medium mb-2.5">
                  <span className="truncate">{item.institution}</span>
                  <span className="text-[10px] font-mono text-[var(--color-text-subtle)] shrink-0 ml-2">{item.period}</span>
                </div>

                {/* Highlight */}
                <p className="text-xs text-neutral-200 pt-2 border-t border-[var(--color-border)] leading-relaxed font-sans">
                  {item.highlight}
                </p>
              </div>

              {/* Curved Dashed Connector Arrow between cards */}
              {!isLast && (
                <div className="flex justify-center my-2 select-none pointer-events-none">
                  <svg
                    className={`w-12 h-10 text-[var(--color-primary)]/40 ${index % 2 === 1 ? '-scale-x-100' : ''}`}
                    viewBox="0 0 56 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M 16 0 V 14 C 16 28, 40 18, 40 34"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeDasharray="3 3"
                    />
                    <path
                      d="M 35 29 L 40 36 L 45 29"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>

    </div>
  )
}
