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
  const [isPaused, setIsPaused] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const touchStartXRef = useRef<number | null>(null)

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

  // Auto-play carousel timer (5.5s)
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % items.length)
    }, 5500)

    return () => clearInterval(timer)
  }, [isPaused, items.length])

  const selectTab = (idx: number) => {
    setActiveIdx(idx)
    setIsPaused(true) // pause auto-rotate on user interaction
  }

  const handlePrev = () => {
    selectTab(activeIdx === 0 ? items.length - 1 : activeIdx - 1)
  }

  const handleNext = () => {
    selectTab((activeIdx + 1) % items.length)
  }

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current
    touchStartXRef.current = null

    if (deltaX < -40) {
      handleNext() // Swipe left -> Next card
    } else if (deltaX > 40) {
      handlePrev() // Swipe right -> Prev card
    }
  }

  const currentItem = items[activeIdx]
  const nextItem = items[(activeIdx + 1) % items.length]
  const prevItem = items[(activeIdx - 1 + items.length) % items.length]

  return (
    <section
      ref={sectionRef}
      className="relative bg-[var(--color-surface-base)] py-10 sm:py-20"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(var(--color-primary)_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Developer Styled Section Header: <About Me /> */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[var(--color-surface-card)] text-[var(--color-primary)] text-[10px] sm:text-xs font-mono font-bold border border-[var(--color-border)] mb-1 shadow-xs">
              <Code className="w-3 h-3" />
              <span>developer_bio.ts</span>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-mono font-bold text-[var(--color-text-main)] tracking-tight">
                &lt;About Me /&gt;
              </h2>
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[11px] font-mono font-bold border border-[var(--color-primary)]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
                Auto-Playing (Tap/Swipe to explore)
              </span>
            </div>
          </div>

          {/* Quick Prev / Next Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-mono text-[var(--color-text-muted)] mr-1 font-semibold">
              CARD 0{activeIdx + 1} / 05
            </span>
            <button
              onClick={handlePrev}
              aria-label="Previous card"
              className="p-1.5 sm:p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-main)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all shadow-xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next card"
              className="p-1.5 sm:p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-main)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all shadow-xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* --- MOBILE VERTICAL CONNECTED CARDS FLOW (< md) --- */}
        <div className="md:hidden space-y-4">
          {items.map((item, idx) => (
            <React.Fragment key={item.num}>
              <div className="p-5 sm:p-6 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl shadow-xl space-y-4">
                {/* Code Tag Header */}
                <div className="text-xs font-mono font-bold text-[#C4FA4C] tracking-wider flex items-center justify-between">
                  <span>{item.codeTag}</span>
                  <span className="text-[10px] text-[var(--color-text-subtle)] uppercase">CARD {item.num} / 05</span>
                </div>

                {/* Number & Title Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--color-border)]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-extrabold text-3xl text-[#C4FA4C] shrink-0">
                      {item.num}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[var(--color-text-main)] leading-tight">
                      {item.title}
                    </h3>
                  </div>
                  <div className="p-2 rounded-xl bg-[#C4FA4C]/10 text-[#C4FA4C] shrink-0 border border-[#C4FA4C]/20">
                    {item.icon}
                  </div>
                </div>

                {/* Body Text */}
                <div className="text-sm text-[var(--color-text-muted)] leading-relaxed font-sans">
                  {item.textHtml}
                </div>

                {/* Highlights & Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-[var(--color-border)]/60">
                  {item.highlights.map((h, i) => (
                    <Badge key={i} variant={i === 0 ? 'primary' : 'subtle'} size="sm">
                      {h}
                    </Badge>
                  ))}
                  {item.tags?.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider bg-[#C4FA4C] text-black"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Curved SVG Connector Arrow between cards */}
              {idx < items.length - 1 && (
                <div className="flex justify-center py-2">
                  <svg className="w-8 h-10 text-[#C4FA4C]" viewBox="0 0 24 36" fill="none" stroke="currentColor">
                    <path
                      d="M12 2 C 22 12, 2 24, 12 32"
                      strokeDasharray="3 3"
                      strokeWidth="2"
                    />
                    <polyline points="7,27 12,33 17,27" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* --- DESKTOP INTERLOCKING TRAPEZOID TABS (>= md) --- */}
        <div className="hidden md:block">
          
          <div className="flex items-end overflow-x-auto scrollbar-none w-full pt-2 pb-0 -mb-[1px] relative z-20">
            {items.map((item, idx) => {
              const isActive = activeIdx === idx
              const isFirst = idx === 0

              const slantPx = 22

              const clipPolygon = isFirst
                ? `polygon(0 0, calc(100% - ${slantPx}px) 0, 100% 100%, 0 100%)`
                : `polygon(${slantPx}px 0, calc(100% - ${slantPx}px) 0, 100% 100%, 0 100%)`

              return (
                <button
                  key={idx}
                  onClick={() => selectTab(idx)}
                  aria-label={`Select section ${item.tabLabel}`}
                  className={`w-[175px] shrink-0 relative flex items-center justify-center gap-2 h-[46px] px-4 font-mono text-xs md:text-sm font-extrabold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#C4FA4C] !text-black z-30 shadow-2xl scale-[1.02] ring-1 ring-[#C4FA4C]/40'
                      : 'bg-[#141414] text-[var(--color-text-muted)] border-t border-x border-[var(--color-border)] z-10 opacity-80 hover:opacity-100 hover:text-[#C4FA4C] scale-100'
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

          {/* MAIN CARD CONTAINER FRAME */}
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative z-10 p-8 md:p-10 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-b-2xl rounded-t-none shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-300 overflow-hidden"
            style={{
              borderTopColor: currentItem.accentColor,
              borderTopWidth: '3px',
              boxShadow: `0 4px 25px ${currentItem.accentColor}20`
            }}
          >
            {/* Top Auto-Rotation Progress Line */}
            {!isPaused && (
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#C4FA4C]/20 z-20">
                <div key={activeIdx} className="h-full bg-[#C4FA4C] animate-[progress_5.5s_linear]" />
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {/* Code Tag Header Line */}
                <div
                  className="text-xs font-mono font-bold mb-4 tracking-wider flex items-center justify-between"
                  style={{ color: currentItem.accentColor }}
                >
                  <span>{currentItem.codeTag}</span>
                  <span className="text-[10px] font-mono text-[var(--color-text-subtle)] uppercase">
                    CARD 0{activeIdx + 1} / 05
                  </span>
                </div>

                {/* Header with Large Number & Title */}
                <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-[var(--color-border)]">
                  <div className="flex items-center gap-3">
                    <span
                      className="font-mono font-extrabold text-5xl tracking-tight shrink-0"
                      style={{ color: currentItem.accentColor }}
                    >
                      {currentItem.num}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-[var(--color-text-main)] leading-tight">
                      {currentItem.title}
                    </h3>
                  </div>
                  <div
                    className="p-3.5 rounded-2xl shrink-0 border border-white/10"
                    style={{
                      backgroundColor: `${currentItem.accentColor}18`,
                      color: currentItem.accentColor
                    }}
                  >
                    {currentItem.icon}
                  </div>
                </div>

                {/* Body Content */}
                <div className="text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed mb-8 font-sans">
                  {currentItem.textHtml}
                </div>

                {/* Highlights & Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[var(--color-border)]/60 mb-6">
                  {currentItem.highlights.map((h, i) => (
                    <Badge key={i} variant={i === 0 ? 'primary' : 'subtle'} size="sm">
                      {h}
                    </Badge>
                  ))}
                  {currentItem.tags?.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider"
                      style={{
                        backgroundColor: currentItem.accentColor,
                        color: currentItem.tabText === 'text-black' ? '#000000' : '#FFFFFF'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Interactive Footer Action Controls (Next/Prev Cards) */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--color-border)] text-xs font-mono">
                  <button
                    onClick={handlePrev}
                    className="px-3 py-1.5 rounded-lg bg-[var(--color-surface-base)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-white hover:border-[#C4FA4C] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev: {prevItem.shortLabel}</span>
                  </button>

                  <button
                    onClick={handleNext}
                    className="px-3.5 py-1.5 rounded-lg bg-[#C4FA4C] text-black font-extrabold hover:bg-lime-400 transition-colors flex items-center gap-1 cursor-pointer shadow-md"
                  >
                    <span>Next: {nextItem.shortLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  )
}



