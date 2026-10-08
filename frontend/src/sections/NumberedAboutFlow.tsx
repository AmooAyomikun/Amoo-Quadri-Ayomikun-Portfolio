import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '../components/Badge'
import {
  Award,
  BookOpen,
  GraduationCap,
  Users,
  Sparkles,
  Code,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

export const NumberedAboutFlow: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const isManualClickRef = useRef(false)

  const items = [
    {
      num: '01',
      codeTag: '// 01. IDENTITY',
      tabLabel: '01. IDENTITY',
      shortLabel: 'IDENTITY',
      accentColor: '#C4FA4C',
      tabBg: 'bg-[#C4FA4C]',
      tabText: 'text-black',
      title: 'Software Engineer & Researcher',
      icon: <Sparkles className="w-4 h-4 shrink-0" />,
      textHtml: (
        <>
          I am <strong>Quadri Ayomikun Amoo</strong>, a software engineer and researcher interested in the intersection of <strong>artificial intelligence</strong>, <strong>software engineering</strong>, <strong>intelligent computing systems</strong>, and <strong>data analytics</strong>. My work focuses on using AI to solve practical software-centric problems and developing intelligent systems that are <strong>practical, reliable, and accessible</strong>.
        </>
      ),
      highlights: ['Artificial Intelligence', 'Software Engineering', 'Intelligent Systems']
    },
    {
      num: '02',
      codeTag: '// 02. ACADEMICS',
      tabLabel: '02. ACADEMICS',
      shortLabel: 'ACADEMICS',
      accentColor: '#C4FA4C',
      tabBg: 'bg-[#C4FA4C]',
      tabText: 'text-black',
      title: 'Academic Excellence',
      icon: <GraduationCap className="w-4 h-4 shrink-0" />,
      textHtml: (
        <>
          I hold a <strong>Bachelor of Science in Software Engineering</strong> with <strong>First-Class Honors (5.0/5.0 Major GPA, 4.45/5.00 Final CGPA)</strong> from Abiola Ajimobi Technical University, graduating in the <strong>Top 10% of my class</strong>. I was recognized with <strong>4 Best Graduating Student Subject Honors</strong> in Operating Systems I, HCI, Software Engineering Practice, and Data Structures. Additionally, I hold <strong>Diplomas in French and Entrepreneurship (Upper Credit)</strong>.
        </>
      ),
      highlights: ['5.0/5.0 Major GPA', 'Top 10% Class Honors', '4 Subject Excellence Awards']
    },
    {
      num: '03',
      codeTag: '// 03. RESEARCH',
      tabLabel: '03. RESEARCH',
      shortLabel: 'RESEARCH',
      accentColor: '#C4FA4C',
      tabBg: 'bg-[#C4FA4C]',
      tabText: 'text-black',
      title: 'Research Focus & Systems',
      icon: <BookOpen className="w-4 h-4 shrink-0" />,
      textHtml: (
        <>
          My research interests include <strong>AI for Software Engineering</strong>, <strong>intelligent software systems</strong>, <strong>Natural Language Processing</strong>, and <strong>software quality & reliability</strong>. Previously, under <strong>Dr. J.E.T. Akinsola</strong>, I developed a <strong>location-based recommendation and reservation system</strong> for my B.Sc. thesis, achieving high recommendation precision and seamless operational workflows.
        </>
      ),
      highlights: ['Applied Data Science', 'Recommender Systems', 'Software Quality & QA']
    },
    {
      num: '04',
      codeTag: '// 04. LEADERSHIP',
      tabLabel: '04. LEADERSHIP',
      shortLabel: 'LEADERSHIP',
      accentColor: '#C4FA4C',
      tabBg: 'bg-[#C4FA4C]',
      tabText: 'text-black',
      title: 'Community Leadership & Teaching',
      icon: <Users className="w-4 h-4 shrink-0" />,
      textHtml: (
        <>
          Beyond research and engineering, I am passionate about mentoring the next generation of software engineers. I tutored <strong>~350 undergraduate computer science students weekly</strong> in <strong>Algorithms, Data Structures, and Programming</strong>. Additionally, as <strong>NASSA Asst. Academic Support Officer</strong>, I taught 100 students Mathematics and Python logic.
        </>
      ),
      highlights: ['350+ Students Tutored Weekly', 'NASSA Support Officer', 'Algorithms & Data Structures']
    },
    {
      num: '05',
      codeTag: '// 05. VISION',
      tabLabel: '05. VISION',
      shortLabel: 'VISION',
      accentColor: '#C4FA4C',
      tabBg: 'bg-[#C4FA4C]',
      tabText: 'text-black',
      title: 'Looking Forward',
      icon: <Award className="w-4 h-4 shrink-0" />,
      textHtml: (
        <>
          I am interested in <strong>MSc and PhD research opportunities</strong> in <strong>Artificial Intelligence, Software Engineering, and Computer Science</strong>—particularly projects combining intelligent software systems with practical engineering challenges and real-world societal impact.
        </>
      ),
      highlights: ['MSc & PhD Research', 'Postgraduate Scholarships', 'Intelligent Systems Research'],
      tags: ['ARTIFICIAL INTELLIGENCE', 'SOFTWARE ENGINEERING']
    }
  ]

  // Handle scroll syncing through sticky section container
  useEffect(() => {
    const handleScroll = () => {
      if (isManualClickRef.current || !sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const totalScrollableHeight = rect.height - window.innerHeight
      if (totalScrollableHeight <= 0) return

      // Progress through section: 0 to 1
      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollableHeight))
      const targetIndex = Math.min(items.length - 1, Math.floor(progress * items.length))
      setActiveIdx(targetIndex)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [items.length])

  const selectTab = (idx: number) => {
    setActiveIdx(idx)
    isManualClickRef.current = true
    setTimeout(() => {
      isManualClickRef.current = false
    }, 800)
  }

  const handlePrev = () => {
    selectTab(Math.max(0, activeIdx - 1))
  }

  const handleNext = () => {
    selectTab(Math.min(items.length - 1, activeIdx + 1))
  }

  const currentItem = items[activeIdx]

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[250vh] sm:min-h-[220vh] bg-[var(--color-surface-base)] py-8 sm:py-16"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(var(--color-primary)_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Unified Sticky Wrapper that holds Title + Tab Bar + Card */}
      <div className="sticky top-4 sm:top-10 max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 z-20">
        
        {/* Developer Styled Section Header: <About Me /> */}
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[var(--color-surface-card)] text-[var(--color-primary)] text-[10px] sm:text-xs font-mono font-bold border border-[var(--color-border)] mb-1 shadow-xs">
              <Code className="w-3 h-3" />
              <span>developer_bio.ts</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-mono font-bold text-[var(--color-text-main)] tracking-tight">
              &lt;About Me /&gt;
            </h2>
          </div>

          {/* Quick Prev / Next Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-mono text-[var(--color-text-muted)] mr-1 hidden sm:inline">
              CARD 0{activeIdx + 1} / 05
            </span>
            <button
              onClick={handlePrev}
              disabled={activeIdx === 0}
              aria-label="Previous card"
              className="p-1.5 sm:p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-main)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={activeIdx === items.length - 1}
              aria-label="Next card"
              className="p-1.5 sm:p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-main)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* --- HORIZONTAL ONE-BY-ONE STACKING COLORFUL TRAPEZOID TABS (KUSH BOTHRA EXACT REPLICA) --- */}
        <div className="relative z-20 flex items-end overflow-x-auto no-scrollbar w-full pt-2 pb-0 -mb-[1px]">
          {items.slice(0, activeIdx + 1).map((item, idx) => {
            const isActive = activeIdx === idx
            const isFirst = idx === 0

            // Slant width in px: 22px on desktop, 16px on mobile
            const slantPx = 22

            // Clip path polygon for each interlocking trapezoid
            const clipPolygon = isFirst
              ? `polygon(0 0, calc(100% - ${slantPx}px) 0, 100% 100%, 0 100%)`
              : `polygon(${slantPx}px 0, calc(100% - ${slantPx}px) 0, 100% 100%, 0 100%)`

            return (
              <button
                key={idx}
                onClick={() => selectTab(idx)}
                aria-label={`Select section ${item.tabLabel}`}
                className={`w-[135px] sm:w-[185px] shrink-0 relative flex items-center justify-center gap-1.5 sm:gap-2 h-[38px] sm:h-[46px] px-2 sm:px-4 font-mono text-[10px] sm:text-xs md:text-sm font-extrabold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-[#C4FA4C] !text-black z-30 shadow-2xl scale-[1.02] ring-1 ring-[#C4FA4C]/40'
                    : 'bg-[#171717] text-[var(--color-text-muted)] border-t border-x border-[var(--color-border)] z-10 opacity-80 hover:opacity-100 hover:text-[#C4FA4C] scale-100'
                }`}
                style={{
                  clipPath: clipPolygon,
                  marginLeft: idx > 0 ? `-${slantPx}px` : '0px'
                }}
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="truncate">{item.tabLabel}</span>
              </button>
            )
          })}
        </div>

        {/* --- MAIN CARD CONTAINER FRAME --- */}
        <div
          className="relative z-10 p-4 sm:p-8 md:p-10 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-b-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-300"
          style={{
            borderTopColor: currentItem.accentColor,
            borderTopWidth: '3px',
            boxShadow: `0 4px 25px ${currentItem.accentColor}20`
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {/* Code Tag Header Line */}
              <div
                className="text-[11px] sm:text-xs font-mono font-bold mb-2 sm:mb-4 tracking-wider flex items-center justify-between"
                style={{ color: currentItem.accentColor }}
              >
                <span>{currentItem.codeTag}</span>
                <span className="text-[10px] font-mono text-[var(--color-text-subtle)] uppercase">
                  CARD 0{activeIdx + 1} / 05
                </span>
              </div>

              {/* Header with Large Number & Title */}
              <div className="flex items-start justify-between gap-3 mb-3 sm:mb-6 pb-3 sm:pb-4 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono font-extrabold text-3xl sm:text-5xl tracking-tight"
                    style={{ color: currentItem.accentColor }}
                  >
                    {currentItem.num}
                  </span>
                  <h3 className="text-lg sm:text-3xl md:text-4xl font-serif font-bold text-[var(--color-text-main)] leading-tight">
                    {currentItem.title}
                  </h3>
                </div>
                <div
                  className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shrink-0 border border-white/10"
                  style={{
                    backgroundColor: `${currentItem.accentColor}18`,
                    color: currentItem.accentColor
                  }}
                >
                  {currentItem.icon}
                </div>
              </div>

              {/* Body Content */}
              <div className="text-xs sm:text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed mb-4 sm:mb-8 font-sans">
                {currentItem.textHtml}
              </div>

              {/* Highlights & Tags */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-3 sm:pt-4 border-t border-[var(--color-border)]/60">
                {currentItem.highlights.map((h, i) => (
                  <Badge key={i} variant={i === 0 ? 'primary' : 'subtle'} size="sm">
                    {h}
                  </Badge>
                ))}
                {currentItem.tags?.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-wider"
                    style={{
                      backgroundColor: currentItem.accentColor,
                      color: currentItem.tabText === 'text-black' ? '#000000' : '#FFFFFF'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}



