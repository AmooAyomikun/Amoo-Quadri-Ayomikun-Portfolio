import React, { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { 
  GraduationCap, 
  Award, 
  Calendar, 
  BookOpen, 
  Medal, 
  Sparkles, 
  Code2, 
  Layers, 
  ArrowDown 
} from 'lucide-react'
import { SEO } from '../components/SEO'
import { EducationHero } from '../components/PageHeroes'
import { AnimatedCounter } from '../components/AnimatedCounter'
import { AcademicJourneyTimeline } from '../components/AcademicJourneyTimeline'

export default function EducationPage() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeMobileCard, setActiveMobileCard] = useState<number>(0)

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end']
  })

  // Kush Bothra Accordion Transforms (Desktop):
  // Card 0: Anchored at y: 0.
  // Card 1: Peeks at bottom 'calc(100% - 44px)' during Card 0, then slides up to '0%' to dock Tab 1 at Slot 1!
  // Card 2: Starts at '100%', glides to 'calc(100% - 44px)' as Card 1 settles, then slides up to '0%' to dock Tab 2 at Slot 2!
  // Card 3: Starts at '100%', glides to 'calc(100% - 44px)' as Card 2 settles, then slides up to '0%' to dock Tab 3 at Slot 3!
  const y1 = useTransform(
    scrollYProgress,
    [0.00, 0.18, 0.30, 1.00],
    ['calc(100% - 44px)', 'calc(100% - 44px)', '0%', '0%']
  )

  const y2 = useTransform(
    scrollYProgress,
    [0.00, 0.18, 0.30, 0.48, 0.60, 1.00],
    ['100%', '100%', 'calc(100% - 44px)', 'calc(100% - 44px)', '0%', '0%']
  )

  const y3 = useTransform(
    scrollYProgress,
    [0.00, 0.48, 0.60, 0.78, 0.90, 1.00],
    ['100%', '100%', 'calc(100% - 44px)', 'calc(100% - 44px)', '0%', '0%']
  )

  const cardTransforms = [
    { y: 0 },
    { y: y1 },
    { y: y2 },
    { y: y3 }
  ]

  const tabConfigs = [
    {
      label: 'CREDENTIAL 01',
      mobileLabel: '01. B.Sc',
      title: 'B.Sc. Software Engineering',
      icon: <GraduationCap className="w-3.5 h-3.5 shrink-0" />,
      color: {
        bg: '#00b4d8',
        text: '#0a192f',
        border: '#00b4d8',
        cardBg: '#071526',
        accent: '#38bdf8',
        tagBg: 'rgba(0, 180, 216, 0.12)',
        tagBorder: 'rgba(0, 180, 216, 0.35)',
        tagText: '#38bdf8',
      },
      clipPath: 'polygon(0 0, calc(100% - 22px) 0, 100% 100%, 0 100%)'
    },
    {
      label: 'CREDENTIAL 02',
      mobileLabel: '02. Entrep',
      title: 'Entrepreneurship Diploma',
      icon: <Award className="w-3.5 h-3.5 shrink-0" />,
      color: {
        bg: '#18181b',
        text: '#ffffff',
        border: '#e4e4e7',
        cardBg: '#0f141c',
        accent: '#f4f4f5',
        tagBg: 'rgba(244, 244, 245, 0.1)',
        tagBorder: 'rgba(244, 244, 245, 0.25)',
        tagText: '#f4f4f5',
      },
      clipPath: 'polygon(22px 0, calc(100% - 22px) 0, 100% 100%, 0 100%)'
    },
    {
      label: 'CREDENTIAL 03',
      mobileLabel: '03. French',
      title: 'French Language Diploma',
      icon: <BookOpen className="w-3.5 h-3.5 shrink-0" />,
      color: {
        bg: '#f59e0b',
        text: '#0a192f',
        border: '#f59e0b',
        cardBg: '#16130b',
        accent: '#fbbf24',
        tagBg: 'rgba(245, 158, 11, 0.12)',
        tagBorder: 'rgba(245, 158, 11, 0.35)',
        tagText: '#fbbf24',
      },
      clipPath: 'polygon(22px 0, calc(100% - 22px) 0, 100% 100%, 0 100%)'
    },
    {
      label: 'CREDENTIAL 04',
      mobileLabel: '04. High Sch',
      title: 'Secondary Education',
      icon: <Medal className="w-3.5 h-3.5 shrink-0" />,
      color: {
        bg: '#e11d48',
        text: '#ffffff',
        border: '#e11d48',
        cardBg: '#190d14',
        accent: '#fb7185',
        tagBg: 'rgba(225, 29, 72, 0.14)',
        tagBorder: 'rgba(225, 29, 72, 0.35)',
        tagText: '#fb7185',
      },
      clipPath: 'polygon(22px 0, 100% 0, 100% 100%, 0 100%)'
    }
  ]

  const educationCards = [
    {
      degree: "Bachelor of Science in Software Engineering",
      institution: "First Technical University (now Abiola Ajimobi Technical University), Ibadan",
      location: "Ibadan, Nigeria",
      period: "2021 – 2024",
      badge: "Undergraduate Degree",
      imageUrl: "/abiola-ajimobi-1.png",
      imageCaption: "First Technical University Senate & Engineering Complex",
      metrics: [
        { label: "Final CGPA", value: "4.45 / 5.00", note: "Second-Class Upper (Top 10%)" },
        { label: "Peak Term", value: "5.0 / 5.0", note: "Single Term Peak GPA" },
        { label: "Honors", value: "4 Subject Awards", note: "OS, SE Practice, HCI, Data Structures" }
      ],
      description: "Graduated in the top 10% of cohort with a B.Sc. in Software Engineering (Second-Class Honours, Upper Division, 4.45 / 5.00 Final CGPA). Achieved a 5.0 / 5.0 peak term GPA along with four departmental subject excellence awards. Supervised thesis on intelligent location-based recommendation systems combining spatial distance heuristics with real-time hotel reservation engines under Dr. J.E.T. Akinsola.",
      tags: ["Software Engineering", "Algorithmic Foundations", "Intelligent Systems"]
    },
    {
      degree: "Diploma in Entrepreneurship",
      institution: "First Technical University, Ibadan",
      location: "Ibadan, Nigeria",
      period: "2021 – 2024",
      badge: "Professional Diploma",
      imageUrl: "/abiola-ajimobi-2.png",
      imageCaption: "Abiola Ajimobi Technical University Innovation Hub",
      metrics: [
        { label: "Academic Standing", value: "Upper Credit", note: "Graduating Distinction" },
        { label: "Faculty Rank", value: "Top 10%", note: "Faculty of Entrepreneurship" },
        { label: "Venture Focus", value: "Commercialization", note: "Tech Lean Strategy" }
      ],
      description: "Completed an intensive professional diploma in Entrepreneurship alongside engineering coursework at Abiola Ajimobi Technical University. Rigorously trained in technology enterprise creation, lean venture validation, financial modeling, and digital product commercialization strategies for scalable software platforms.",
      tags: ["Venture Creation", "Lean Strategy", "Market Economics"]
    },
    {
      degree: "Diploma in French Language",
      institution: "First Technical University, Ibadan",
      location: "Ibadan, Nigeria",
      period: "2021 – 2024",
      badge: "Language Diploma",
      imageUrl: "/abiola-ajimobi.png",
      imageCaption: "Centre for Language & General Studies",
      metrics: [
        { label: "Academic Grade", value: "Lower Credit", note: "Centre for Language Studies" },
        { label: "Curriculum Lens", value: "Technical French", note: "Professional Vocabulary" },
        { label: "Competence", value: "Bilingual Communication", note: "Reading & Spoken Fluency" }
      ],
      description: "Completed a diploma program in French Language at the Centre for Language and General Studies alongside undergraduate studies. Developed reading comprehension, conversational fluency, and professional translation skills in technical and academic French.",
      tags: ["Bilingual Studies", "Technical French", "Language Foundations"]
    },
    {
      degree: "Secondary School Education",
      institution: "David Joel Model College, Ibadan",
      location: "Ibadan, Nigeria",
      period: "2013 – 2019",
      badge: "Secondary Education",
      imageUrl: "/david-joel.png",
      imageCaption: "David Joel Model College Academic Campus",
      metrics: [
        { label: "Qualification", value: "SSCE / WASSCE", note: "Senior Secondary Certificate" },
        { label: "Academic Track", value: "Pure Sciences", note: "Physics, Math & Chemistry" },
        { label: "Core Focus", value: "Math & Computing", note: "Analytical Base" }
      ],
      description: "Completed senior secondary school education in Pure Sciences at David Joel Model College. Built strong foundational knowledge in advanced mathematics, physical sciences, and introductory computer studies that paved the way for university studies in software engineering.",
      tags: ["Science Track", "Mathematics", "Foundational Studies"]
    }
  ]

  const curriculumModules = [
    { name: "Algorithms & Complexity", desc: "Big-O analysis, dynamic programming & graph theory" },
    { name: "Artificial Intelligence", desc: "Expert systems, inference logic & heuristic models" },
    { name: "Data Structures & Algorithms", desc: "Trees, heaps, graph search & algorithmic optimization" },
    { name: "Discrete Structures", desc: "Combinatorics, Boolean algebra & formal logic" },
    { name: "Human Computer Interaction", desc: "Interface design heuristics, usability & accessibility" },
    { name: "Modelling & Simulation", desc: "Stochastic process modeling & state simulations" },
    { name: "Research Methodology in CS", desc: "Empirical software testing & quantitative studies" }
  ]

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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-28 sm:pb-32">
        
        {/* Page Hero Header */}
        <EducationHero />

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 max-w-2xl mx-auto">
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] p-3.5 rounded-xl text-center shadow-xs">
            <span className="text-lg sm:text-xl font-bold font-serif text-[var(--color-primary)] block">
              <AnimatedCounter value={4.45} decimals={2} duration={1.6} /> / 5.00
            </span>
            <span className="text-[10px] font-mono text-[var(--color-text-muted)]">Final CGPA (Top 10%)</span>
          </div>
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] p-3.5 rounded-xl text-center shadow-xs">
            <span className="text-lg sm:text-xl font-bold font-serif text-[var(--color-primary)] block">
              Top <AnimatedCounter value={10} duration={1.2} suffix="%" />
            </span>
            <span className="text-[10px] font-mono text-[var(--color-text-muted)]">Graduating Honor</span>
          </div>
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] p-3.5 rounded-xl text-center shadow-xs">
            <span className="text-lg sm:text-xl font-bold font-serif text-[var(--color-primary)] block">
              <AnimatedCounter value={4} duration={1.2} suffix=" Awards" />
            </span>
            <span className="text-[10px] font-mono text-[var(--color-text-muted)]">Subject Excellence</span>
          </div>
        </div>

        {/* =========================================================================
            MOBILE VIEW (< md): Responsive Tabbed Card Viewer
            Eliminates cramped tabs, awkward scroll-traps, and vertical cutoffs on mobile
        ========================================================================= */}
        <div className="block md:hidden mb-12">
          {/* Mobile Tab Selector */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {tabConfigs.map((config, idx) => {
              const isActive = activeMobileCard === idx
              const color = config.color
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveMobileCard(idx)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-mono text-xs font-bold transition-all border ${
                    isActive 
                      ? 'shadow-lg ring-1 ring-white/20' 
                      : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] border-[var(--color-border)] opacity-75 hover:opacity-100'
                  }`}
                  style={isActive ? { backgroundColor: color.bg, color: color.text, borderColor: color.border } : {}}
                >
                  {config.icon}
                  <span className="truncate">{config.mobileLabel}</span>
                </button>
              )
            })}
          </div>

          {/* Active Mobile Card Display */}
          {(() => {
            const card = educationCards[activeMobileCard]
            const config = tabConfigs[activeMobileCard]
            const color = config.color

            return (
              <motion.div
                key={activeMobileCard}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  backgroundColor: color.cardBg,
                  borderColor: color.border
                }}
                className="border-2 rounded-2xl p-4 relative backdrop-blur-xl flex flex-col gap-4 shadow-xl overflow-hidden"
              >
                {/* Meta badge & Degree Title */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span 
                      style={{ backgroundColor: color.bg }} 
                      className="w-2.5 h-2.5 rounded-full inline-block shrink-0" 
                    />
                    <span className="text-[11px] font-mono font-bold tracking-wider text-neutral-400 uppercase">
                      {card.period} · {card.badge}
                    </span>
                  </div>
                  <h2 className="text-xl font-serif font-bold text-white tracking-tight leading-snug mb-1">
                    {card.degree}
                  </h2>
                  <p className="text-xs text-neutral-300 font-medium">
                    {card.institution}
                  </p>
                </div>

                {/* Campus Photo */}
                <div className="relative overflow-hidden rounded-xl border border-white/20 bg-black/60 aspect-[16/10] w-full">
                  <img 
                    src={card.imageUrl} 
                    alt={card.institution} 
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-black/85 backdrop-blur-md text-white border border-white/20 block truncate">
                      {card.imageCaption}
                    </span>
                  </div>
                </div>

                {/* Narrative Description */}
                <p className="text-xs text-neutral-200 leading-relaxed font-sans">
                  {card.description}
                </p>

                {/* Academic Metrics */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-black/40 border border-white/10">
                  {card.metrics.map((m, mi) => (
                    <div key={mi} className="min-w-0">
                      <span className="text-[9px] font-mono uppercase text-neutral-400 block tracking-wider truncate">
                        {m.label}
                      </span>
                      <span 
                        style={{ color: color.accent }}
                        className="text-xs font-mono font-bold block mt-0.5 truncate"
                      >
                        {m.value}
                      </span>
                      {m.note && (
                        <span className="text-[9px] text-neutral-400 block mt-0.5 font-sans truncate">
                          {m.note}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-white/10">
                  {card.tags.map((tag, ti) => (
                    <span 
                      key={ti} 
                      style={{ 
                        backgroundColor: color.tagBg, 
                        borderColor: color.tagBorder,
                        color: color.tagText 
                      }}
                      className="text-[10px] font-mono border px-2 py-0.5 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })()}
        </div>

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

        {/* =========================================================================
            DESKTOP VIEW (md+): KUSH BOTHRA SCROLL-DRIVEN STACKING DECK
            - Pinned stage: each card slides up over the previous one.
            - Tabs dock across the top into an inverted V-notch row as cards stack.
            - Subsequent tabs peek at the bottom of the card before rising up.
        ========================================================================= */}
        <div ref={trackRef} className="hidden md:block relative h-[360vh] mb-14">
          
          {/* Pinned Sticky Stage */}
          <div className="sticky top-12 sm:top-14 max-w-5xl mx-auto w-full px-2 sm:px-0">
            <div className="relative w-full h-[470px] sm:h-[450px] overflow-hidden rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
              {educationCards.map((card, cardIdx) => {
                const config = tabConfigs[cardIdx]
                const color = config.color
                const transform = cardTransforms[cardIdx]

                const CardMotionWrapper = cardIdx === 0 ? 'div' : motion.div
                const motionProps = cardIdx === 0 
                  ? { className: 'absolute inset-0 w-full h-full' } 
                  : { 
                      style: { y: transform.y },
                      className: 'absolute inset-0 w-full h-full' 
                    }

                return (
                  <CardMotionWrapper
                    key={cardIdx}
                    {...(motionProps as any)}
                    style={{
                      ...(motionProps as any).style,
                      zIndex: 10 + cardIdx * 10
                    }}
                  >
                    {/* 
                      Kush Bothra V-Notch Tab Row:
                      - Slot 0: Left vertical, Right slants down '\'
                      - Slot 1: Left slants up '/', Right slants down '\' -> forms 'V' notch with Slot 0!
                      - Slot 2: Left slants up '/', Right slants down '\' -> forms 'V' notch with Slot 1!
                      - Slot 3: Left slants up '/', Right vertical -> forms 'V' notch with Slot 2!
                    */}
                    <div className="relative h-11 select-none pointer-events-none w-full">
                      <button
                        type="button"
                        onClick={() => jumpToCard(cardIdx)}
                        style={{
                          left: `${cardIdx * 25}%`,
                          width: '25%',
                          backgroundColor: color.bg,
                          color: color.text,
                          clipPath: config.clipPath,
                        }}
                        className="pointer-events-auto absolute top-0 h-11 px-1.5 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 font-mono text-[11px] sm:text-xs md:text-sm tracking-wider uppercase font-black cursor-pointer shadow-md transition-all hover:brightness-110 select-none z-10"
                        title={`Jump to: ${config.title}`}
                      >
                        {config.icon}
                        <span className="hidden sm:inline truncate">{config.label}</span>
                        <span className="sm:hidden truncate">{config.mobileLabel}</span>
                      </button>
                    </div>

                    {/* Card Body with matching border and background */}
                    <div 
                      style={{
                        backgroundColor: color.cardBg,
                        borderColor: color.border
                      }}
                      className="h-[calc(100%-44px)] border-2 rounded-b-2xl p-4 sm:p-5 sm:px-6 relative backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-2xl"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center h-full">
                        
                        {/* Left Column (58%): Real Typography & Narrative */}
                        <div className="lg:col-span-7 flex flex-col justify-between h-full min-w-0 py-0.5">
                          <div>
                            {/* Meta badge */}
                            <div className="flex items-center gap-2 mb-1.5">
                              <span 
                                style={{ backgroundColor: color.bg }} 
                                className="w-2.5 h-2.5 rounded-full inline-block shrink-0" 
                              />
                              <span className="text-[11px] font-mono font-bold tracking-wider text-neutral-400 uppercase">
                                {card.period} · {card.badge}
                              </span>
                            </div>

                            {/* Title */}
                            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight leading-snug mb-1">
                              {card.degree}
                            </h2>

                            {/* Institution Name */}
                            <p className="text-xs text-neutral-300 font-medium mb-2 truncate">
                              {card.institution} {card.location && <span className="text-neutral-400">· {card.location}</span>}
                            </p>

                            {/* Rich Editorial Narrative */}
                            <p className="text-xs sm:text-[13px] text-neutral-200 leading-relaxed font-sans line-clamp-3 mb-2.5">
                              {card.description}
                            </p>
                          </div>

                          {/* 3 Academic Metrics */}
                          <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-black/40 border border-white/10 mb-2.5">
                            {card.metrics.map((m, mi) => (
                              <div key={mi} className="min-w-0">
                                <span className="text-[9px] font-mono uppercase text-neutral-400 block tracking-wider truncate">
                                  {m.label}
                                </span>
                                <span 
                                  style={{ color: color.accent }}
                                  className="text-xs sm:text-sm font-mono font-bold block mt-0.5 truncate"
                                >
                                  {m.value}
                                </span>
                                {m.note && (
                                  <span className="text-[9px] text-neutral-400 block mt-0.5 font-sans truncate" title={m.note}>
                                    {m.note}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Topic Tags */}
                          <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-white/10">
                            {card.tags.map((tag, ti) => (
                              <span 
                                key={ti} 
                                style={{ 
                                  backgroundColor: color.tagBg, 
                                  borderColor: color.tagBorder,
                                  color: color.tagText 
                                }}
                                className="text-[10px] sm:text-[11px] font-mono border px-2.5 py-0.5 rounded-full font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Right Column (42%): Real School Campus Photograph */}
                        <div className="lg:col-span-5 flex flex-col justify-between h-full min-w-0 py-0.5">
                          <div className="relative group/photo overflow-hidden rounded-xl border-2 border-white/20 bg-black/60 shadow-lg h-[240px] sm:h-[260px] w-full">
                            {/* Real Campus Photograph */}
                            <img 
                              src={card.imageUrl} 
                              alt={card.institution} 
                              className="w-full h-full object-cover object-center group-hover/photo:scale-105 transition-transform duration-700"
                            />

                            {/* Bottom shadow overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                            {/* Top corner institutional badge */}
                            <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-white flex items-center gap-1.5 shadow-sm">
                              <Calendar className="w-3 h-3 text-neutral-300" />
                              <span>{card.period}</span>
                            </div>

                            {/* Bottom caption bar */}
                            <div className="absolute bottom-2.5 left-2.5 right-2.5">
                              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-black/85 backdrop-blur-md text-white border border-white/20 block truncate">
                                {card.imageCaption}
                              </span>
                            </div>
                          </div>

                          {/* Sub-bar below photo */}
                          <div className="pt-2 flex items-center justify-between text-xs font-mono">
                            {cardIdx === 0 ? (
                              <a 
                                href="#academic-awards"
                                style={{ color: color.accent }}
                                className="hover:underline flex items-center gap-1 font-semibold text-xs transition-colors ml-auto"
                              >
                                <span>View 4 Subject Awards Below</span>
                                <ArrowDown className="w-3.5 h-3.5" />
                              </a>
                            ) : (
                              <span className="text-[11px] text-neutral-400 font-mono ml-auto">
                                {card.badge} · Verified Academic Record
                              </span>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  </CardMotionWrapper>
                )
              })}
            </div>
          </div>
        </div>

        {/* =========================================================================
            ACADEMIC & CAREER JOURNEY TIMELINE
            Interactive milestone cable with horizontal navigation & filter tabs
        ========================================================================= */}
        <div className="mb-14">
          <AcademicJourneyTimeline />
        </div>

        {/* =========================================================================
            SECTION 2: SUBJECT EXCELLENCE AWARDS
        ========================================================================= */}
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

        {/* =========================================================================
            SECTION 3: CORE SOFTWARE ENGINEERING CURRICULUM
        ========================================================================= */}
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
                <div className="flex items-center gap-1.5 mb-1">
                  <Code2 className="w-3 h-3 text-[#64ffda] shrink-0" />
                  <span className="text-xs font-mono font-bold text-[var(--color-text-main)] truncate">
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

        {/* =========================================================================
            SECTION 4: ACADEMIC DISTINCTIONS & SUMMARY
        ========================================================================= */}
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

      </main>
      
      <Footer />
    </div>
  )
}
