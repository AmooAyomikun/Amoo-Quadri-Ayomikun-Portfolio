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
      badgeColor: '#d4a359'
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
      badgeColor: '#d4a359'
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

  // Track height based on number of milestones: 280vh for desktop, 240vh for mobile
  const desktopTrackHeight = filteredMilestones.length <= 4 ? '180vh' : '280vh'
  const mobileTrackHeight = filteredMilestones.length <= 4 ? '160vh' : '240vh'

  // =========================================================================
  // DESKTOP HORIZONTAL SCROLL CONTROLLER
  // =========================================================================
  const desktopTrackRef = useRef<HTMLDivElement>(null)
  const desktopContainerRef = useRef<HTMLDivElement>(null)
  const desktopContentRef = useRef<HTMLDivElement>(null)
  const [desktopMaxScroll, setDesktopMaxScroll] = useState<number>(2200)

  const { scrollYProgress: desktopProgress } = useScroll({
    target: desktopTrackRef as React.RefObject<HTMLElement>,
    offset: ['start 70px', 'end end']
  })

  const desktopX = useTransform(desktopProgress, (progress) => {
    if (progress <= 0.08) return 0
    if (progress >= 0.92) return -desktopMaxScroll
    const t = (progress - 0.08) / (0.92 - 0.08)
    return -t * desktopMaxScroll
  })

  // Desktop drag-to-scroll support
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
    if (totalTravel <= 0 || desktopMaxScroll <= 0) return

    const scrollRatio = (totalTravel * 0.84) / desktopMaxScroll
    window.scrollBy({ top: deltaX * scrollRatio })
    dragStartX.current = e.clientX
  }

  // Desktop trackpad horizontal swipe translation
  useEffect(() => {
    const el = desktopContainerRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      const absX = Math.abs(e.deltaX)
      const absY = Math.abs(e.deltaY)
      if (absX > absY && absX > 2 && desktopTrackRef.current) {
        e.preventDefault()
        const totalTravel = desktopTrackRef.current.offsetHeight - window.innerHeight + 70
        if (totalTravel > 0 && desktopMaxScroll > 0) {
          const scrollRatio = (totalTravel * 0.84) / desktopMaxScroll
          window.scrollBy({ top: e.deltaX * scrollRatio })
        }
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [desktopMaxScroll])

  const desktopScrollStep = (direction: 'left' | 'right') => {
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

  const scrollLeft = () => desktopScrollStep('left')
  const scrollRight = () => desktopScrollStep('right')

  // =========================================================================
  // MOBILE HORIZONTAL SCROLL CONTROLLER (Compact, Integrated, Zero Dead Voids)
  // =========================================================================
  const mobileTrackRef = useRef<HTMLDivElement>(null)
  const mobileContainerRef = useRef<HTMLDivElement>(null)
  const mobileContentRef = useRef<HTMLDivElement>(null)
  const [mobileMaxScroll, setMobileMaxScroll] = useState<number>(2200)
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0)

  const { scrollYProgress: mobileProgress } = useScroll({
    target: mobileTrackRef as React.RefObject<HTMLElement>,
    offset: ['start 65px', 'end end']
  })

  useEffect(() => {
    return mobileProgress.on('change', (progress) => {
      if (progress <= 0.08) {
        setCurrentMobileIndex(0)
      } else if (progress >= 0.92) {
        setCurrentMobileIndex(filteredMilestones.length - 1)
      } else {
        const t = (progress - 0.08) / (0.92 - 0.08)
        const idx = Math.round(t * (filteredMilestones.length - 1))
        setCurrentMobileIndex(Math.max(0, Math.min(filteredMilestones.length - 1, idx)))
      }
    })
  }, [mobileProgress, filteredMilestones.length])

  const mobileX = useTransform(mobileProgress, (progress) => {
    if (progress <= 0.08) return 0
    if (progress >= 0.92) return -mobileMaxScroll
    const t = (progress - 0.08) / (0.92 - 0.08)
    return -t * mobileMaxScroll
  })

  const touchStartX = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!mobileTrackRef.current) return
    const deltaX = touchStartX.current - e.touches[0].clientX
    const totalTravel = mobileTrackRef.current.offsetHeight - window.innerHeight + 65
    if (totalTravel <= 0 || mobileMaxScroll <= 0) return

    const scrollRatio = (totalTravel * 0.84) / mobileMaxScroll
    window.scrollBy({ top: deltaX * scrollRatio })
    touchStartX.current = e.touches[0].clientX
  }

  const jumpToMobileCard = (index: number) => {
    if (!mobileTrackRef.current) return
    const rect = mobileTrackRef.current.getBoundingClientRect()
    const pinTop = window.pageYOffset + rect.top - 65
    const totalTravel = mobileTrackRef.current.offsetHeight - window.innerHeight + 65
    if (totalTravel <= 0) return

    const targetT = index / Math.max(1, filteredMilestones.length - 1)
    const targetProgress = 0.08 + targetT * (0.92 - 0.08)
    window.scrollTo({
      top: pinTop + targetProgress * totalTravel,
      behavior: 'smooth'
    })
  }

  // Update dynamic scroll dimensions for both viewports
  useEffect(() => {
    const updateDimensions = () => {
      if (desktopContentRef.current && desktopContainerRef.current) {
        const dDist = Math.max(0, desktopContentRef.current.scrollWidth - desktopContainerRef.current.clientWidth)
        setDesktopMaxScroll(dDist)
      }
      if (mobileContentRef.current && mobileContainerRef.current) {
        const mDist = Math.max(0, mobileContentRef.current.scrollWidth - mobileContainerRef.current.clientWidth)
        setMobileMaxScroll(mDist)
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [filteredMilestones.length])

  return (
    <div id="academic-journey" className="w-full my-6 sm:my-16 scroll-mt-20">
      
      {/* =========================================================================
          DESKTOP VIEW: Preserved Exact Alternating Cable & Floating Nodes Design
      ========================================================================= */}
      <div className="hidden md:block">
        {/* Desktop Section Header */}
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-[var(--color-border)] gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/25 text-[var(--color-primary)] text-xs font-mono font-semibold uppercase mb-2 select-none">
              <Sparkles className="w-3.5 h-3.5" />
              <span>// CHRONOLOGICAL MILESTONES &amp; HONORS</span>
            </div>
            <h3 className="text-3xl font-serif font-bold text-[var(--color-text-main)] leading-tight">
              Academic &amp; Leadership Journey
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] mt-1 leading-relaxed">
              Track of academic degrees, government scholarships, teaching fellowships, and honors from 2013 to 2026.
            </p>
          </div>

          {/* Desktop Track Navigation Buttons */}
          <div className="flex items-center gap-2 shrink-0">
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
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1.5 -mx-1 px-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-2 shrink-0 transition-all cursor-pointer border ${
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

          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[var(--color-text-subtle)] shrink-0">
            <span>← Scroll or drag to explore all {filteredMilestones.length} milestones →</span>
          </span>
        </div>

        {/* Sticky-Pinned Horizontal Alternating Milestone Cable */}
        <div 
          ref={desktopTrackRef} 
          className="relative w-full"
          style={{ height: desktopTrackHeight }}
        >
          <div 
            ref={desktopContainerRef}
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
              ref={desktopContentRef}
              style={{ x: desktopX }}
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

                        {/* YEAR BADGE */}
                        {isTop ? (
                          <div 
                            className="absolute z-20 flex flex-col items-center"
                            style={{ top: '232px' }}
                          >
                            <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-surface-card)] border border-[var(--color-border)] text-[10px] font-mono font-bold text-[var(--color-text-muted)] shadow-xs">
                              {item.year}
                            </span>
                          </div>
                        ) : (
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
      </div>

      {/* =========================================================================
          MOBILE VIEW: Organic, Compact Horizontal Scroll Track (Zero Dead Voids)
      ========================================================================= */}
      <div 
        ref={mobileTrackRef} 
        className="block md:hidden relative w-full"
        style={{ height: mobileTrackHeight }}
      >
        <div 
          ref={mobileContainerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className="sticky top-[60px] w-full overflow-hidden flex flex-col justify-between py-2 select-none"
          style={{ height: 'calc(100vh - 68px)' }}
        >
          {/* Integrated Compact Header */}
          <div className="w-full">
            <div className="flex items-center justify-between gap-2 mb-2 px-1">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>// CHRONOLOGICAL MILESTONES</span>
                </div>
                <h3 className="text-base font-serif font-bold text-[var(--color-text-main)] leading-tight mt-0.5">
                  Academic &amp; Leadership Journey
                </h3>
              </div>

              <span className="font-mono text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 px-2 py-0.5 rounded-lg shrink-0">
                {String(currentMobileIndex + 1).padStart(2, '0')} / {String(filteredMilestones.length).padStart(2, '0')}
              </span>
            </div>

            {/* Filter Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1.5 -mx-1 px-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setFilter(cat.id)
                    setCurrentMobileIndex(0)
                  }}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[10px] flex items-center gap-1.5 shrink-0 transition-all cursor-pointer border ${
                    filter === cat.id
                      ? 'bg-[var(--color-primary)] text-[var(--color-primary-text)] font-bold border-[var(--color-primary)] shadow-xs'
                      : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:text-[var(--color-text-main)]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="opacity-60 text-[9px]">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Organic Editorial Cards */}
          <motion.div 
            ref={mobileContentRef}
            style={{ x: mobileX }}
            className="flex items-stretch gap-3 px-2 my-auto py-2"
          >
            {filteredMilestones.map((item, index) => (
              <div 
                key={item.id}
                className="w-[82vw] max-w-[310px] shrink-0 bg-gradient-to-b from-[#1e1d1a] to-[#141412] border border-white/[0.08] rounded-2xl p-4 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)] flex flex-col justify-between relative overflow-hidden transition-all"
              >
                {/* Subtle top hairline */}
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--color-primary)]/40 to-transparent" />

                <div>
                  {/* Organic Meta Header: Year + Step & Category */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-sm font-bold text-[var(--color-primary)] shrink-0">
                        {item.year}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--color-text-subtle)] uppercase tracking-wider truncate">
                        · {item.categoryLabel}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] font-medium text-[var(--color-text-subtle)] px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] shrink-0">
                      {String(index + 1).padStart(2, '0')}/{String(filteredMilestones.length).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Title & Affiliation */}
                  <div className="my-1.5">
                    <h4 className="font-serif font-bold text-base text-white leading-snug tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[var(--color-text-muted)] font-sans mt-1">
                      {item.institution}
                    </p>
                  </div>

                  {/* Organic Editorial Highlight Dispatch */}
                  <div className="border-l-2 border-[var(--color-primary)]/40 pl-3 my-3 text-xs text-neutral-300 font-sans leading-relaxed">
                    {item.highlight}
                  </div>
                </div>

                {/* Organic Footer: Period & Icon Accent */}
                <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]/70" />
                    <span>{item.period}</span>
                  </div>

                  <div 
                    style={{ color: item.badgeColor }}
                    className="w-6 h-6 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0"
                  >
                    {item.icon}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Mobile Bottom Navigation Controls */}
          <div className="flex items-center justify-between px-4 max-w-xs mx-auto w-full pt-1">
            <button
              type="button"
              onClick={() => jumpToMobileCard(Math.max(0, currentMobileIndex - 1))}
              disabled={currentMobileIndex === 0}
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
                  onClick={() => jumpToMobileCard(i)}
                  aria-label={`Jump to milestone ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentMobileIndex === i 
                      ? 'w-6 bg-[var(--color-primary)]' 
                      : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => jumpToMobileCard(Math.min(filteredMilestones.length - 1, currentMobileIndex + 1))}
              disabled={currentMobileIndex === filteredMilestones.length - 1}
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
