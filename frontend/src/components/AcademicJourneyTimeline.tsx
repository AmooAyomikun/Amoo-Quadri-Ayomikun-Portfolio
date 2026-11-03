import React, { useState, useRef } from 'react'
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
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

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

  // Drag-to-scroll state
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeftPos, setScrollLeftPos] = useState(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeftPos(scrollContainerRef.current.scrollLeft)
  }

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    scrollContainerRef.current.scrollLeft = scrollLeftPos - walk
  }

  // Wheel horizontal scroll:
  // Must show fully first before scrolling horizontally!
  // Once the section has scrolled fully into position (rect.top <= 100),
  // scrolling down scrolls the timeline horizontally until the end.
  // Once it reaches the end, vertical page scroll seamlessly resumes down!
  // When scrolling up, it scrolls the timeline backwards, and once at start resumes vertical scroll up.
  React.useEffect(() => {
    const sectionEl = sectionRef.current
    const el = scrollContainerRef.current
    if (!sectionEl || !el) return

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0 || e.shiftKey) return
      const maxScroll = el.scrollWidth - el.clientWidth
      if (maxScroll <= 0) return

      const rect = sectionEl.getBoundingClientRect()

      if (e.deltaY > 0) {
        // Scrolling DOWN:
        // Must show fully first (rect.top <= 100px means section is at top of viewport under sticky header)
        // If rect.top > 100px, it is still coming into view vertically — allow natural vertical scroll!
        const isFullyInView = rect.top <= 100 && rect.bottom >= window.innerHeight * 0.4
        const canScrollRight = el.scrollLeft < maxScroll - 4

        if (isFullyInView && canScrollRight) {
          e.preventDefault()
          el.scrollLeft += e.deltaY * 1.15
          return
        }
        // At the end or before showing fully, allow default vertical scroll!
      } else if (e.deltaY < 0) {
        // Scrolling UP:
        const isInView = rect.top <= 120 && rect.bottom >= window.innerHeight * 0.35
        const canScrollLeft = el.scrollLeft > 4

        if (isInView && canScrollLeft) {
          e.preventDefault()
          el.scrollLeft += e.deltaY * 1.15
          return
        }
        // At the beginning or out of view, allow default vertical scroll!
      }
    }

    sectionEl.addEventListener('wheel', onWheel, { passive: false })
    return () => sectionEl.removeEventListener('wheel', onWheel)
  }, [filteredMilestones.length])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' })
    }
  }

  return (
    <div ref={sectionRef} className="w-full my-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[var(--color-border)] gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/25 text-[var(--color-primary)] text-xs font-mono font-semibold uppercase mb-2 select-none">
            <Sparkles className="w-3.5 h-3.5" />
            <span>// CHRONOLOGICAL MILESTONES &amp; HONORS</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-text-main)]">
            Academic &amp; Leadership Journey
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
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
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl font-mono text-xs flex items-center gap-2 shrink-0 transition-all cursor-pointer border ${
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
          DESKTOP VIEW: Non-clashing Horizontal Alternating Milestone Cable
      ========================================================================= */}
      <div className="hidden md:block relative group/timeline">
        {/* Left / Right floating quick buttons */}
        <button
          type="button"
          onClick={scrollLeft}
          aria-label="Scroll timeline left"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-[var(--color-surface-card)]/90 backdrop-blur-md border border-[var(--color-border)] text-[var(--color-text-main)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] shadow-xl flex items-center justify-center opacity-0 group-hover/timeline:opacity-100 transition-opacity cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={scrollRight}
          aria-label="Scroll timeline right"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-[var(--color-surface-card)]/90 backdrop-blur-md border border-[var(--color-border)] text-[var(--color-text-main)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] shadow-xl flex items-center justify-center opacity-0 group-hover/timeline:opacity-100 transition-opacity cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div 
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          className={`overflow-x-auto py-4 select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--color-primary) transparent'
          }}
        >
          <div className="relative min-w-max px-12" style={{ height: '420px' }}>
            
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
        </div>
      </div>

      {/* =========================================================================
          MOBILE VIEW: Vertical Clean Tree Timeline (Optimized for 375px+ screens)
      ========================================================================= */}
      <div className="block md:hidden relative pl-6 border-l-2 border-[var(--color-primary)]/40 ml-4 space-y-6">
        {filteredMilestones.map((item) => (
          <div key={item.id} className="relative group">
            {/* Glowing Node Dot on the left spine */}
            <div className="absolute -left-[31px] top-3.5 w-6 h-6 rounded-full bg-[var(--color-surface-base)] border-2 border-[var(--color-primary)] flex items-center justify-center text-[var(--color-primary)] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
            </div>

            {/* Mobile Card */}
            <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 rounded-xl p-4 shadow-md transition-colors">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span 
                  style={{ color: item.badgeColor, backgroundColor: `${item.badgeColor}15`, borderColor: `${item.badgeColor}35` }}
                  className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded border"
                >
                  {item.categoryLabel}
                </span>
                <span className="text-[10px] font-mono font-bold text-[var(--color-primary)]">
                  {item.period}
                </span>
              </div>

              <h4 className="font-serif font-bold text-sm sm:text-base text-[var(--color-text-main)] mb-1 leading-snug">
                {item.title}
              </h4>

              <p className="text-xs text-[var(--color-text-muted)] font-medium mb-2">
                {item.institution}
              </p>

              <p className="text-xs text-neutral-200 pt-2 border-t border-[var(--color-border)] leading-relaxed">
                {item.highlight}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
