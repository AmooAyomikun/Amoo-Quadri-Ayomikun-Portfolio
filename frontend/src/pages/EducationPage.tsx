import React, { useRef, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Award, Sparkles, Code2, Layers } from 'lucide-react'
import { SEO } from '../components/SEO'
import { EducationHero } from '../components/PageHeroes'
import { AnimatedCounter } from '../components/AnimatedCounter'
import { AcademicJourneyTimeline } from '../components/AcademicJourneyTimeline'
import { PageContainer } from '../components/PageContainer'
import { EducationDesktopDeck } from '../components/EducationDesktopDeck'
import { EducationMobileDeck } from '../components/EducationMobileDeck'
import { educationCards, tabConfigs, curriculumModules } from '../content/educationData'

export default function EducationPage() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeMobileCard, setActiveMobileCard] = useState<number>(0)

  const jumpToCard = (index: number) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const scrollTop = window.pageYOffset + rect.top
    const targets = [0.06, 0.38, 0.67, 0.94]
    const targetProgress = targets[index]
    const scrollDistance = rect.height - window.innerHeight
    window.scrollTo({
      top: scrollTop + targetProgress * scrollDistance,
      behavior: 'smooth'
    })
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)] flex flex-col justify-between selection:bg-[#64ffda] selection:text-[#0a192f]">
      <SEO 
        title="Education & Academic Background" 
        description="Academic credentials, certifications, coursework, and honors of Quadri Ayomikun Amoo. B.Sc. Software Engineering (4.45/5.00 Final CGPA, Top 10%)."
        canonicalUrl="/education"
      />
      <Navbar />
      
      <PageContainer as="main" id="main-content" className="pb-28 sm:pb-32">
        {/* Page Hero Header */}
        <EducationHero />

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 my-4 sm:my-8">
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] p-2.5 sm:p-3.5 rounded-xl text-center shadow-xs">
            <span className="text-base sm:text-xl font-bold font-serif text-[var(--color-primary)] block">
              <AnimatedCounter value={5.0} decimals={1} duration={1.2} /> / 5.0
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-[var(--color-text-muted)]">Peak Term GPA</span>
          </div>
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] p-2.5 sm:p-3.5 rounded-xl text-center shadow-xs">
            <span className="text-base sm:text-xl font-bold font-serif text-[var(--color-primary)] block">
              <AnimatedCounter value={4.45} decimals={2} duration={1.2} /> / 5.0
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-[var(--color-text-muted)]">Final CGPA (Top 10%)</span>
          </div>
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] p-2.5 sm:p-3.5 rounded-xl text-center shadow-xs">
            <span className="text-base sm:text-xl font-bold font-serif text-[var(--color-primary)] block">
              Top <AnimatedCounter value={10} duration={1.2} suffix="%" />
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-[var(--color-text-muted)]">Graduating Honor</span>
          </div>
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] p-2.5 sm:p-3.5 rounded-xl text-center shadow-xs">
            <span className="text-base sm:text-xl font-bold font-serif text-[var(--color-primary)] block">
              <AnimatedCounter value={4} duration={1.2} suffix=" Awards" />
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono text-[var(--color-text-muted)]">Subject Excellence</span>
          </div>
        </div>

        {/* Mobile Tabbed Deck View */}
        <EducationMobileDeck
          educationCards={educationCards}
          tabConfigs={tabConfigs}
          activeMobileCard={activeMobileCard}
          setActiveMobileCard={setActiveMobileCard}
        />

        {/* Scroll Cue (Desktop) */}
        <div className="hidden md:flex items-center justify-center gap-2 mb-6 text-xs font-mono text-[var(--color-primary)] select-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]"></span>
          </span>
          <span className="tracking-wider uppercase text-[11px] text-[var(--color-text-muted)]">
            Scroll to reveal &amp; stack credentials
          </span>
        </div>

        {/* Desktop Accordion Deck View */}
        <EducationDesktopDeck
          educationCards={educationCards}
          tabConfigs={tabConfigs}
          trackRef={trackRef}
          jumpToCard={jumpToCard}
        />

        {/* Academic & Career Journey Timeline */}
        <div className="mb-14">
          <AcademicJourneyTimeline />
        </div>

        {/* Subject Excellence Awards */}
        <div id="academic-awards" className="mb-14 max-w-4xl mx-auto scroll-mt-24">
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#64ffda]/10 border border-[#64ffda]/30 flex items-center justify-center text-[#64ffda]">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[var(--color-text-main)]">
                  Subject Excellence Awards
                </h3>
                <p className="text-xs font-mono text-[var(--color-text-muted)]">
                  Four Departmental First-Place Honors in Software Engineering
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-[#64ffda] bg-[#64ffda]/10 px-2.5 py-0.5 rounded-full border border-[#64ffda]/30 font-semibold hidden sm:inline-block">
              Top Rank
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              {
                title: "Best Grade Student in Operating System I",
                field: "Operating Systems, Kernel Architectures & Process Scheduling",
                badge: "Operating Systems"
              },
              {
                title: "Best Grade Student in Human Computer Interaction",
                field: "UI/UX Heuristics, User-Centered Design & Accessibility Standards",
                badge: "HCI & UI Design"
              },
              {
                title: "Best Grade Student in Software Engineering Practice",
                field: "System Architecture, Design Patterns & Enterprise Engineering",
                badge: "SE Practice"
              },
              {
                title: "Best Grade Student in Fundamentals of Data Structure",
                field: "Data Structures, Algorithmic Efficiency & Complexity Bounds",
                badge: "Data Structures"
              }
            ].map((award, i) => (
              <div 
                key={i}
                className="bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[#64ffda]/50 rounded-xl p-4 transition-colors relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#64ffda]/10 text-[#64ffda] border border-[#64ffda]/25 font-semibold">
                    {award.badge}
                  </span>
                  <span className="text-[#64ffda] font-bold text-base">★</span>
                </div>
                <h4 className="text-sm font-serif font-bold text-[var(--color-text-main)] mb-1">
                  {award.title}
                </h4>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed font-sans">
                  {award.field}
                </p>
                <div className="mt-2.5 pt-2 border-t border-[var(--color-border)] text-[10px] font-mono text-[var(--color-text-muted)] flex items-center justify-between">
                  <span>First Technical University</span>
                  <span className="text-[#64ffda]/80 font-medium">Rank 1</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Software Engineering Curriculum */}
        <div className="mb-14 max-w-4xl mx-auto">
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#64ffda]/10 border border-[#64ffda]/30 flex items-center justify-center text-[#64ffda]">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[var(--color-text-main)]">
                  Core Software Engineering Curriculum
                </h3>
                <p className="text-xs font-mono text-[var(--color-text-muted)]">
                  Seven Core Technical Pillars (Curriculum Excellence)
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {curriculumModules.map((mod, i) => (
              <div 
                key={i}
                className="bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[#64ffda]/40 rounded-xl p-3.5 transition-colors"
              >
                <div className="flex items-start gap-1.5 mb-1">
                  <Code2 className="w-3.5 h-3.5 text-[#64ffda] shrink-0 mt-0.5" />
                  <span className="text-xs font-mono font-bold text-[var(--color-text-main)] leading-snug">
                    {mod.name}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed font-sans">
                  {mod.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Distinctions & Summary */}
        <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 max-w-4xl mx-auto shadow-sm">
          <h3 className="text-base font-serif font-bold text-[var(--color-text-main)] mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#64ffda]" /> Academic Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[var(--color-text-muted)] font-mono">
            <div className="bg-[var(--color-surface-base)] p-3 rounded-xl border border-[var(--color-border)]">
              <span className="text-[#64ffda] font-bold block mb-0.5">4.45 / 5.00 Final CGPA</span>
              <span>Second-Class Honours (Upper Division) with a 5.0 / 5.0 peak term GPA at Technical University.</span>
            </div>
            <div className="bg-[var(--color-surface-base)] p-3 rounded-xl border border-[var(--color-border)]">
              <span className="text-[#64ffda] font-bold block mb-0.5">Top 10% Graduating Class</span>
              <span>Top decile graduating standing with 4 departmental first-place subject excellence awards.</span>
            </div>
          </div>
        </div>
      </PageContainer>
      
      <Footer />
    </div>
  )
}
