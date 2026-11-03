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
      badgeColor: '#e11d48'
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
      badgeColor: '#f59e0b'
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
      badgeColor: '#64ffda'
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
      badgeColor: '#38bdf8'
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
      badgeColor: '#a855f7'
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
      badgeColor: '#06b6d4'
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
      badgeColor: '#10b981'
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
      badgeColor: '#f59e0b'
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
      badgeColor: '#64ffda'
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
      badgeColor: '#38bdf8'
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

  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [maxScroll, setMaxScroll] = useState<number>(2200)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

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

  // Scroll progress through the track (pinned once it reaches top-[70px] under navbar)
  const { scrollYProgress } = useScroll({
    target: trackRef as React.RefObject<HTMLElement>,
    offset: ['start 70px', 'end end']
  })

  // Synchronize active card index with scroll progress
  useEffect(() => {
    return scrollYProgress.on('change', (progress) => {
      if (progress <= 0.08) {
        setCurrentCardIndex(0)
      } else if (progress >= 0.92) {
        setCurrentCardIndex(filteredMilestones.length - 1)
      } else {
        const t = (progress - 0.08) / (0.92 - 0.08)
        const idx = Math.round(t * (filteredMilestones.length - 1))
        setCurrentCardIndex(Math.max(0, Math.min(filteredMilestones.length - 1, idx)))
      }
    })
  }, [scrollYProgress, filteredMilestones.length])

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

  // Drag & Touch support that smoothly shifts page vertical scroll
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const touchStartX = useRef(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragStartX.current = e.clientX
  }

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return
    const deltaX = dragStartX.current - e.clientX
    const totalTravel = trackRef.current.offsetHeight - window.innerHeight + 70
    if (totalTravel <= 0 || maxScroll <= 0) return

    const scrollRatio = (totalTravel * 0.84) / maxScroll
    window.scrollBy({ top: deltaX * scrollRatio })
    dragStartX.current = e.clientX
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!trackRef.current) return
    const deltaX = touchStartX.current - e.touches[0].clientX
    const totalTravel = trackRef.current.offsetHeight - window.innerHeight + 70
    if (totalTravel <= 0 || maxScroll <= 0) return

    const scrollRatio = (totalTravel * 0.84) / maxScroll
    window.scrollBy({ top: deltaX * scrollRatio })
    touchStartX.current = e.touches[0].clientX
  }

  // Trackpad horizontal swipe / shift-wheel translation
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      const absX = Math.abs(e.deltaX)
      const absY = Math.abs(e.deltaY)
      // Only intercept if user is intentionally swiping horizontally with trackpad
      if (absX > absY && absX > 2 && trackRef.current) {
        e.preventDefault()
        const totalTravel = trackRef.current.offsetHeight - window.innerHeight + 70
        if (totalTravel > 0 && maxScroll > 0) {
          const scrollRatio = (totalTravel * 0.84) / maxScroll
          window.scrollBy({ top: e.deltaX * scrollRatio })
        }
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [maxScroll])

  const jumpToCard = (index: number) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const pinTop = window.pageYOffset + rect.top - 70
    const totalTravel = trackRef.current.offsetHeight - window.innerHeight + 70
    if (totalTravel <= 0) return

    const targetT = index / Math.max(1, filteredMilestones.length - 1)
    const targetProgress = 0.08 + targetT * (0.92 - 0.08)
    window.scrollTo({
      top: pinTop + targetProgress * totalTravel,
      behavior: 'smooth'
    })
  }

  const scrollLeft = () => jumpToCard(Math.max(0, currentCardIndex - 1))
  const scrollRight = () => jumpToCard(Math.min(filteredMilestones.length - 1, currentCardIndex + 1))

  return (
    <div id="academic-journey" className="w-full my-8 sm:my-16 scroll-mt-20">
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

        {/* Track Navigation Buttons */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={scrollLeft}
            disabled={currentCardIndex === 0}
            aria-label="Scroll left in journey timeline"
            className="w-9 h-9 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-elevated)] hover:border-[var(--color-primary)] text-[var(--color-text-main)] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            disabled={currentCardIndex === filteredMilestones.length - 1}
            aria-label="Scroll right in journey timeline"
            className="w-9 h-9 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-elevated)] hover:border-[var(--color-primary)] text-[var(--color-text-main)] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-xs cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Category Pills & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1.5 -mx-1 px-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setFilter(cat.id)
                setCurrentCardIndex(0)
              }}
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

        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 px-2.5 py-1 rounded-lg">
            {String(currentCardIndex + 1).padStart(2, '0')} / {String(filteredMilestones.length).padStart(2, '0')}
          </span>
          <span className="hidden lg:inline-flex items-center gap-1.5 text-[11px] font-mono text-[var(--color-text-subtle)]">
            <span>← Scroll to explore all milestones →</span>
          </span>
        </div>
      </div>

      {/* =========================================================================
          HORIZONTAL SCROLL MILESTONES: Pinned scroll across all screen sizes
          - Renders the exact requested card layout with watermark year, tags, and summary
          - Locks under navbar and scrolls horizontally as the user scrolls vertically
          - Also supports direct touch-swiping, mouse-drag, and quick arrow/dot navigation
      ========================================================================= */}
      <div 
        ref={trackRef} 
        className="relative w-full"
        style={{ height: trackHeight }}
      >
        {/* Sticky stage: locked under header at top-[70px] */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className={`sticky top-[70px] w-full overflow-hidden flex flex-col justify-center select-none group/timeline ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ height: 'calc(100vh - 74px)' }}
        >
          {/* Animated Horizontal Cards Row */}
          <motion.div 
            ref={contentRef}
            style={{ x }}
            className="flex items-stretch gap-3.5 sm:gap-6 px-4 sm:px-12 py-3"
          >
            {filteredMilestones.map((item, index) => (
              <div 
                key={item.id}
                className="w-[84vw] max-w-[320px] sm:w-[330px] shrink-0 bg-[var(--color-surface-card)] border-2 border-[var(--color-border)] hover:border-[var(--color-primary)]/50 rounded-2xl p-4 shadow-xl flex flex-col justify-between relative overflow-hidden transition-colors"
              >
                {/* Watermark Year Background Accent */}
                <div className="absolute -right-2 -top-2 text-6xl font-black font-mono text-white/[0.04] select-none pointer-events-none">
                  {item.year}
                </div>

                <div>
                  {/* Top Row: Milestone 01 of 10, Category Pill */}
                  <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
                    <span className="font-mono text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 px-2 py-0.5 rounded-md">
                      {String(index + 1).padStart(2, '0')} of {String(filteredMilestones.length).padStart(2, '0')}
                    </span>
                    <span 
                      style={{ color: item.badgeColor, backgroundColor: `${item.badgeColor}15`, borderColor: `${item.badgeColor}35` }}
                      className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded border truncate"
                    >
                      {item.categoryLabel}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-2.5 my-2.5">
                    <div 
                      style={{ borderColor: item.badgeColor }}
                      className="w-9 h-9 rounded-xl bg-[var(--color-surface-base)] border flex items-center justify-center text-[var(--color-text-main)] shrink-0 shadow-sm"
                    >
                      <span style={{ color: item.badgeColor }}>
                        {item.icon}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-sm sm:text-base text-[var(--color-text-main)] leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[var(--color-text-muted)] font-medium truncate mt-0.5">
                        {item.institution}
                      </p>
                    </div>
                  </div>

                  {/* Highlight Box */}
                  <div className="p-3 rounded-xl bg-[var(--color-surface-base)] border border-[var(--color-border)] text-xs text-neutral-200 leading-relaxed font-sans mb-3">
                    {item.highlight}
                  </div>
                </div>

                {/* Period Footer */}
                <div className="pt-2 border-t border-[var(--color-border)] text-[10px] font-mono text-[var(--color-text-muted)] flex items-center justify-between">
                  <span>Timeline Period</span>
                  <span className="text-[var(--color-primary)] font-bold">{item.period}</span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Navigation Controls: Arrows & Progress Dots */}
          <div className="flex items-center justify-between mt-4 px-4 max-w-xs mx-auto w-full">
            <button
              type="button"
              onClick={scrollLeft}
              disabled={currentCardIndex === 0}
              aria-label="Previous milestone"
              className="w-8 h-8 rounded-lg bg-[var(--color-surface-card)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-main)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--color-primary)] cursor-pointer transition-colors shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Progress Dots */}
            <div className="flex items-center gap-1.5">
              {filteredMilestones.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => jumpToCard(i)}
                  aria-label={`Jump to milestone ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentCardIndex === i 
                      ? 'w-6 bg-[var(--color-primary)]' 
                      : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={scrollRight}
              disabled={currentCardIndex === filteredMilestones.length - 1}
              aria-label="Next milestone"
              className="w-8 h-8 rounded-lg bg-[var(--color-surface-card)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-main)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--color-primary)] cursor-pointer transition-colors shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
