import React, { useRef } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { 
  GraduationCap, 
  Award, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Medal, 
  Sparkles, 
  Code2,
  Layers,
  ArrowDown
} from 'lucide-react'
import { SEO } from '../components/SEO'

export default function EducationPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  const tabConfigs = [
    {
      label: '01. B.SC. ENG',
      mobileLabel: '01. B.Sc',
      icon: <GraduationCap className="w-3.5 h-3.5 shrink-0" />
    },
    {
      label: '02. ENTREPRENEUR',
      mobileLabel: '02. Entrep',
      icon: <Award className="w-3.5 h-3.5 shrink-0" />
    },
    {
      label: '03. FRENCH LANG',
      mobileLabel: '03. French',
      icon: <BookOpen className="w-3.5 h-3.5 shrink-0" />
    },
    {
      label: '04. SECONDARY',
      mobileLabel: '04. High Sch',
      icon: <Medal className="w-3.5 h-3.5 shrink-0" />
    }
  ]

  const scrollToCard = (index: number) => {
    const el = document.getElementById(`edu-card-anchor-${index}`)
    if (el) {
      const topOffset = 80
      const elementPosition = el.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - topOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  // Refined, well-proportioned editorial card contents
  const educationCards = [
    {
      degree: "Bachelor of Science in Software Engineering",
      institution: "First Technical University (now Abiola Ajimobi Technical University), Ibadan",
      location: "Ibadan, Nigeria",
      period: "2021 – 2024",
      badge: "Undergraduate Degree",
      imageUrl: "/abiola-ajimobi-1.png",
      metrics: [
        { label: "Major GPA", value: "5.0 / 5.0", note: "Software Engineering Core" },
        { label: "Final CGPA", value: "4.45 / 5.00", note: "Second-Class Upper (Top 10%)" },
        { label: "Department Honors", value: "4 Subject Awards", note: "OS, SE Practice, HCI, Data Structures" }
      ],
      description: "Graduated in the top 10% of cohort with a B.Sc. in Software Engineering (Second-Class Honours, Upper Division) from First Technical University. Maintained an unblemished 5.0 / 5.0 Major GPA across all core software engineering courses, alongside 4 departmental first-place awards. Supervised undergraduate thesis on intelligent location-based recommendation systems under Dr. J.E.T. Akinsola, combining spatial distance heuristics with real-time room reservation engines.",
      tags: ["Software Engineering", "Algorithmic Foundations", "Intelligent Systems", "Recommender Systems"]
    },
    {
      degree: "Diploma in Entrepreneurship",
      institution: "First Technical University, Ibadan",
      location: "Ibadan, Nigeria",
      period: "2021 – 2024",
      badge: "Professional Diploma",
      imageUrl: "/abiola-ajimobi-2.png",
      metrics: [
        { label: "Academic Standing", value: "Upper Credit", note: "Graduating Distinction" },
        { label: "Faculty Rank", value: "Top 10%", note: "Faculty of Entrepreneurship" },
        { label: "Venture Focus", value: "Commercialization", note: "Tech Lean Strategy" }
      ],
      description: "Completed an intensive professional diploma in Entrepreneurship alongside engineering coursework at Abiola Ajimobi Technical University. Rigorously trained in technology enterprise creation, lean venture validation, financial modeling, and digital product commercialization strategies for scalable software platforms.",
      tags: ["Venture Creation", "Lean Validation", "Product Strategy", "Market Economics"]
    },
    {
      degree: "Diploma in French Language",
      institution: "First Technical University, Ibadan",
      location: "Ibadan, Nigeria",
      period: "2021 – 2024",
      badge: "Language Diploma",
      imageUrl: "/abiola-ajimobi.png",
      metrics: [
        { label: "Academic Grade", value: "Lower Credit", note: "Professional Bilingual Track" },
        { label: "Focus Lens", value: "Technical French", note: "Engineering Terminology" },
        { label: "Proficiency Track", value: "DELF Aligned", note: "Cross-Border Collaboration" }
      ],
      description: "Attained professional bilingual competence through an intensive diploma in French Language at the Centre for Language and General Studies. Focus areas included conversational fluency, technical vocabulary translation, cross-border engineering collaboration, and DELF-aligned international communication standards.",
      tags: ["Bilingual Proficiency", "Technical Translation", "Cross-Border Engineering", "Global Collaboration"]
    },
    {
      degree: "Secondary School Education",
      institution: "David Joel Model College, Ibadan",
      location: "Ibadan, Nigeria",
      period: "2013 – 2019",
      badge: "Secondary Education",
      imageUrl: "/david-joel.png",
      metrics: [
        { label: "Leadership Office", value: "Social Prefect", note: "Student Body Executive" },
        { label: "Academic Record", value: "Distinction", note: "WASSCE Pure Sciences Curriculum" },
        { label: "Core Foundation", value: "Math & Physics", note: "High Analytical Standing" }
      ],
      description: "Elected Social Prefect coordinating inter-school academic assemblies and student body representation. Graduated with distinctions across Pure Sciences, Mathematics, and Computer Studies, establishing the mathematical foundations that drove university software engineering achievements.",
      tags: ["Pure Sciences", "Advanced Mathematics", "Student Leadership", "Analytical Foundations"]
    }
  ]

  // Specialized course modules breakdown
  const curriculumModules = [
    { name: "Algorithms & Complexity", desc: "Big-O analysis, dynamic programming & graph theory" },
    { name: "Artificial Intelligence", desc: "Expert systems, inference logic & heuristic models" },
    { name: "Data Structures & Algorithms", desc: "Trees, heaps, graph search & algorithmic optimization" },
    { name: "Discrete Structures", desc: "Combinatorics, Boolean algebra & formal logic" },
    { name: "Human Computer Interaction", desc: "Interface design heuristics, usability & accessibility" },
    { name: "Modelling & Simulation", desc: "Stochastic process modeling & state simulations" },
    { name: "Research Methodology in CS", desc: "Empirical software testing & quantitative studies" }
  ]

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)] flex flex-col justify-between selection:bg-[#64ffda] selection:text-[#0a192f]">
      <SEO 
        title="Education & Academic Background" 
        description="Academic credentials, certifications, coursework, and honors of Quadri Ayomikun Amoo. B.Sc. Software Engineering with 5.0/5.0 Major GPA."
        canonicalUrl="/education"
      />
      <Navbar />
      
      <main ref={containerRef} className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Page Hero Header - Static, clean */}
        <div className="mb-6 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[var(--color-text-main)] tracking-tight mb-3">
            Education &amp; Certifications
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xl mx-auto">
            Academic degrees, certifications, subject honors, and core software engineering coursework.
          </p>
        </div>

        {/* Overview Stats Bar (3 clean metrics) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 max-w-2xl mx-auto">
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] p-3.5 rounded-xl text-center">
            <span className="text-lg sm:text-xl font-bold font-serif text-[#64ffda] block">5.0 / 5.0</span>
            <span className="text-[10px] font-mono text-[var(--color-text-muted)]">B.Sc. Major GPA</span>
          </div>
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] p-3.5 rounded-xl text-center">
            <span className="text-lg sm:text-xl font-bold font-serif text-[#64ffda] block">Top 10%</span>
            <span className="text-[10px] font-mono text-[var(--color-text-muted)]">Graduating Honor</span>
          </div>
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] p-3.5 rounded-xl text-center">
            <span className="text-lg sm:text-xl font-bold font-serif text-[#64ffda] block">4 Awards</span>
            <span className="text-[10px] font-mono text-[var(--color-text-muted)]">Subject Excellence</span>
          </div>
        </div>

        {/* Subtle Scroll Cue */}
        <div className="flex items-center justify-center gap-2 mb-8 text-xs font-mono text-[#64ffda] select-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#64ffda] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#64ffda]"></span>
          </span>
          <span className="tracking-wider uppercase text-[11px] text-neutral-300">
            Scroll to stack credentials &amp; explore
          </span>
        </div>

        {/* SCROLL-DRIVEN STACKING CARDS DECK (Natural 20-24vh flow, ample runway, generous typography) */}
        <div className="flex flex-col gap-[20vh] sm:gap-[24vh] max-w-4xl mx-auto pb-[75vh]">
          {educationCards.map((card, cardIdx) => {
            const config = tabConfigs[cardIdx]

            return (
              <div 
                key={cardIdx}
                id={`edu-card-anchor-${cardIdx}`}
                style={{
                  top: '5rem',
                  zIndex: 10 + cardIdx
                }}
                className="sticky scroll-mt-20"
              >
                {/* FOLDER TABS HEADER BAR (Mathematically interlocking trapezoid tabs) */}
                <div className="relative h-11 select-none pointer-events-none">
                  <button
                    type="button"
                    onClick={() => scrollToCard(cardIdx)}
                    style={{
                      left: `${cardIdx * 25}%`,
                      width: cardIdx === 3 ? '25%' : 'calc(25% + 14px)',
                      clipPath: cardIdx === 0
                        ? 'polygon(0 0, calc(100% - 14px) 0, 100% 100%, 0 100%)'
                        : cardIdx === 3
                          ? 'polygon(0 0, 100% 0, 100% 100%, 14px 100%)'
                          : 'polygon(0 0, calc(100% - 14px) 0, 100% 100%, 14px 100%)'
                    }}
                    className="pointer-events-auto absolute top-0 h-11 px-3 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 font-mono text-xs sm:text-sm tracking-wider uppercase transition-colors cursor-pointer border-t border-l border-white/20 bg-[#64ffda] text-[#0a192f] font-extrabold shadow-sm"
                    title={`Credential: ${config.label}`}
                  >
                    {config.icon}
                    <span className="hidden sm:inline truncate">{config.label}</span>
                    <span className="sm:hidden truncate">{config.mobileLabel}</span>
                  </button>
                </div>

                {/* CARD BODY - Rich typography, prominent logos, full academic narratives */}
                <div className="bg-[#0a192f] border-2 border-[#64ffda] rounded-b-2xl rounded-tr-none sm:rounded-tr-2xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_25px_rgba(100,255,218,0.1)] relative backdrop-blur-2xl flex flex-col justify-between">
                  
                  <div>
                    {/* Top Code Tag Meta Row */}
                    <div className="text-xs font-mono font-bold tracking-wider flex items-center justify-between text-[#64ffda] pb-3 border-b border-white/10 mb-4">
                      <span>// 0{cardIdx + 1}. {card.badge.toUpperCase()}</span>
                      <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
                        CREDENTIAL 0{cardIdx + 1} / 04
                      </span>
                    </div>

                    {/* Header Row: Institution Logo + Degree Title + Period Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                      <div className="flex items-start gap-4 min-w-0">
                        {/* Real Institution Logo */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white/5 border border-white/15 p-2 shrink-0 flex items-center justify-center shadow-inner overflow-hidden">
                          <img 
                            src={card.imageUrl} 
                            alt={card.institution} 
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-extrabold text-2xl sm:text-3xl text-[#64ffda] leading-none">
                              0{cardIdx + 1}
                            </span>
                            <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-wider">
                              {card.badge}
                            </span>
                          </div>
                          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white leading-tight">
                            {card.degree}
                          </h2>
                          <p className="text-xs sm:text-sm text-neutral-300 font-medium mt-1">
                            {card.institution} {card.location && <span className="text-neutral-400">· {card.location}</span>}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex sm:flex-col items-start sm:items-end gap-1">
                        <span className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-mono font-semibold bg-[#64ffda]/10 border border-[#64ffda]/30 text-[#64ffda] flex items-center gap-1.5 shadow-xs">
                          <Calendar className="w-4 h-4" /> {card.period}
                        </span>
                      </div>
                    </div>

                    {/* Academic Metrics Row */}
                    <div className={`grid grid-cols-1 sm:grid-cols-${card.metrics.length} gap-3 my-4`}>
                      {card.metrics.map((m, mi) => (
                        <div key={mi} className="p-3 sm:p-3.5 rounded-xl bg-[#030d1a] border border-[#64ffda]/25 shadow-xs">
                          <span className="text-[11px] font-mono uppercase text-neutral-400 font-semibold block tracking-wider">
                            {m.label}
                          </span>
                          <span className="text-base sm:text-lg font-mono font-bold text-[#64ffda] block mt-0.5">
                            {m.value}
                          </span>
                          {m.note && (
                            <span className="text-xs text-neutral-300 block mt-0.5 font-sans">
                              {m.note}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Rich Editorial Narrative Summary */}
                    <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-sans mb-5">
                      {card.description}
                    </p>
                  </div>

                  {/* Card Bottom Tag Row / Link */}
                  <div className="pt-4 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex flex-wrap gap-2">
                      {card.tags.map((tag, ti) => (
                        <span key={ti} className="text-xs font-mono text-[#64ffda] bg-[#64ffda]/10 border border-[#64ffda]/30 px-3 py-1 rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {cardIdx === 0 && (
                      <a 
                        href="#academic-awards"
                        className="text-[#64ffda] hover:underline flex items-center gap-1.5 font-semibold text-xs transition-colors py-1"
                      >
                        <span>View 4 Subject Awards Below</span>
                        <ArrowDown className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                </div>
              </div>
            )
          })}
        </div>

        {/* SECTION 2: SUBJECT EXCELLENCE AWARDS (Prominently featured right below the card deck) */}
        <div id="academic-awards" className="mb-14 max-w-4xl mx-auto scroll-mt-24">
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#64ffda]/10 border border-[#64ffda]/30 flex items-center justify-center text-[#64ffda]">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                  Subject Excellence Awards
                </h3>
                <p className="text-xs font-mono text-neutral-400">
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
                <h4 className="text-sm font-serif font-bold text-white mb-1">
                  {award.title}
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  {award.field}
                </p>
                <div className="mt-2.5 pt-2 border-t border-[var(--color-border)] text-[10px] font-mono text-neutral-500 flex items-center justify-between">
                  <span>First Technical University</span>
                  <span className="text-[#64ffda]/80 font-medium">Rank 1</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: CORE SOFTWARE ENGINEERING CURRICULUM */}
        <div className="mb-14 max-w-4xl mx-auto">
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#64ffda]/10 border border-[#64ffda]/30 flex items-center justify-center text-[#64ffda]">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                  Core Software Engineering Curriculum
                </h3>
                <p className="text-xs font-mono text-neutral-400">
                  Seven Core Technical Pillars (5.0 / 5.0 Major GPA)
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {curriculumModules.map((mod, i) => (
              <div 
                key={i}
                className="bg-[#0a192f] border border-[var(--color-border)] hover:border-[#64ffda]/40 rounded-xl p-3.5 transition-colors"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Code2 className="w-3 h-3 text-[#64ffda] shrink-0" />
                  <span className="text-xs font-mono font-bold text-white truncate">
                    {mod.name}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  {mod.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: ACADEMIC DISTINCTIONS & SUMMARY */}
        <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 max-w-4xl mx-auto shadow-sm">
          <h3 className="text-base font-serif font-bold text-[var(--color-text-main)] mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#64ffda]" /> Academic Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[var(--color-text-muted)] font-mono">
            <div className="bg-[#0a192f] p-3 rounded-xl border border-[var(--color-border)]">
              <span className="text-[#64ffda] font-bold block mb-0.5">5.0 / 5.0 Major GPA</span>
              <span>Perfect academic standing in core Software Engineering curriculum at Technical University.</span>
            </div>
            <div className="bg-[#0a192f] p-3 rounded-xl border border-[var(--color-border)]">
              <span className="text-[#64ffda] font-bold block mb-0.5">Top 10% Graduating Class</span>
              <span>Second-Class Upper Division honors with 4 departmental subject excellence awards.</span>
            </div>
          </div>
        </div>

      </main>
      
      <Footer />
    </div>
  )
}
