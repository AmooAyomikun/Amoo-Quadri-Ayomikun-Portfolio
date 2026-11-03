import React, { useState } from 'react'
import { 
  BookOpen, 
  ExternalLink, 
  Activity, 
  FileText, 
  Trophy, 
  Sparkles, 
  Copy, 
  Check, 
  Compass, 
  Scale, 
  Code2, 
  Calendar,
  GraduationCap,
  Building2,
  ChevronRight
} from 'lucide-react'
import { portfolioData } from '../content/portfolioData'
import { AnimatedCounter } from '../components/AnimatedCounter'

export const ResearchSection: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyCitation = (pub: typeof portfolioData.publications[0]) => {
    const citation = `${pub.authors} (${pub.date}). "${pub.title}". ${pub.journal}. ${pub.link || ''}`
    navigator.clipboard.writeText(citation)
    setCopiedId(pub.id)
    setTimeout(() => setCopiedId(null), 2200)
  }

  // Research pillars breaking down the dense focus text into clear, scannable domains
  const researchPillars = [
    {
      icon: <Scale className="w-5 h-5 text-emerald-400" />,
      badge: "Empirical ML",
      title: "Algorithmic Fairness & Bias Mitigation",
      desc: "Investigating data quality-aware frameworks and rebalancing architectures to detect and mitigate algorithmic bias across severely skewed datasets.",
      tag: "Zenodo Preprint · 2026"
    },
    {
      icon: <Compass className="w-5 h-5 text-sky-400" />,
      badge: "Spatial Algorithms",
      title: "Location-Aware Recommender Systems",
      desc: "Formulating geospatial recommendation engines that combine spatial distance calculations with personalized user behavioral profiles for high-precision discovery.",
      tag: "B.Sc. Thesis · Zenodo Paper"
    },
    {
      icon: <Code2 className="w-5 h-5 text-[var(--color-primary)]" />,
      badge: "System Engineering",
      title: "Empirical Evaluation & Software Reliability",
      desc: "Applying rigorous software engineering practices and benchmark suites across 10+ machine learning models to guarantee reproducible, production-ready system intelligence.",
      tag: "Postgraduate Lab · NYSC Fellow"
    }
  ]

  // Track milestones data
  const trackItems = [
    {
      id: 'nysc-ra',
      category: 'APPLIED AI RESEARCH',
      categoryColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
      icon: <Activity className="w-5 h-5 text-purple-400" />,
      title: 'Research Assistant (NYSC)',
      affiliation: 'Delta State University, Asaba',
      lab: 'Postgraduate Computer Science Research Lab',
      period: 'Sept 2025 – Sept 2026',
      type: 'Full Time, NYSC',
      bullets: portfolioData.research[0].contributions,
      tags: portfolioData.research[0].tags
    },
    {
      id: 'thesis-lead',
      category: 'THESIS RESEARCH',
      categoryColor: 'border-sky-500/30 text-sky-400 bg-sky-500/10',
      icon: <FileText className="w-5 h-5 text-sky-400" />,
      title: 'Research Assistant & Thesis Lead',
      affiliation: 'First Technical University, Ibadan',
      lab: 'Supervised by Dr. J.E.T. Akinsola',
      period: 'Sept 2024 – April 2025',
      type: 'B.Sc. Thesis Lead',
      thesisTopic: portfolioData.research[1].thesisTitle,
      bullets: portfolioData.research[1].contributions.slice(0, 3),
      tags: portfolioData.research[1].tags
    },
    {
      id: 'coast-tech',
      category: 'DATA SCIENCE INTERNSHIP',
      categoryColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
      icon: <Activity className="w-5 h-5 text-amber-400" />,
      title: 'Data Analyst Intern',
      affiliation: 'Coast Research Technology, Ibadan',
      lab: 'Applied Machine Learning & Analytics Unit',
      period: 'April 2023 – Sept 2023',
      type: 'SIWES Internship',
      bullets: portfolioData.experience.find(e => e.id === 'coast-tech-analyst')?.achievements || [],
      tags: ['Data Analytics', 'Python', 'Exploratory Modeling', 'ETL Pipelines']
    },
    {
      id: 'circo-cleanreport',
      category: 'CIVIC TECH PWA',
      categoryColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
      icon: <Code2 className="w-5 h-5 text-emerald-400" />,
      title: 'Frontend / Full-Stack Engineer Intern',
      affiliation: 'Circo Digital Academy & CodeAlpha',
      lab: 'CleanReport Product Engineering Team',
      period: 'April 2026 – Aug 2026',
      type: 'Remote Internship',
      bullets: portfolioData.experience.find(e => e.id === 'circo-cleanreport')?.achievements.slice(0, 3) || [],
      tags: ['React', 'TypeScript', 'PWA / Offline', 'Geolocation API']
    }
  ]

  return (
    <section id="research" className="py-4 sm:py-8 bg-transparent">
      <div className="w-full space-y-10 sm:space-y-16">
        
        {/* =========================================================================
            1. RESEARCH FOCUS & SCIENTIFIC PILLARS
        ========================================================================= */}
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[var(--color-primary)] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>// EMPIRICAL INQUIRY &amp; DOMAINS</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-serif font-bold text-[var(--color-text-main)] tracking-tight">
              Core Research Focus &amp; Methodology
            </h2>
          </div>

          {/* Editorial Pull Quote */}
          <div className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-7 bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-sm overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--color-primary)]/40 via-[var(--color-primary)] to-transparent" />
            <div className="border-l-3 border-[var(--color-primary)] pl-4 sm:pl-6 my-1">
              <p className="text-xs sm:text-base text-[var(--color-text-main)] font-sans leading-relaxed">
                My research bridges <strong className="text-[var(--color-primary)] font-semibold">empirical machine learning</strong> with <strong className="text-[var(--color-text-main)] font-semibold">scalable software engineering</strong>. I investigate location-aware recommendation algorithms, evaluate performance dynamics across financial datasets, and develop architectural frameworks to detect and reduce algorithmic bias.
              </p>
            </div>
          </div>

          {/* 3 Pillar Cards (Responsive Stack on Mobile, 3-Col on Desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 pt-1">
            {researchPillars.map((pillar, idx) => (
              <div 
                key={idx}
                className="bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/60 rounded-2xl p-4 sm:p-5 shadow-xs transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="p-2 rounded-xl bg-white/[0.04] border border-[var(--color-border)] group-hover:scale-105 transition-transform">
                      {pillar.icon}
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm sm:text-base text-[var(--color-text-main)] leading-snug mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-[var(--color-text-muted)] font-sans leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--color-border)]/60 flex items-center justify-between text-[10px] font-mono text-[var(--color-text-subtle)]">
                  <span>{pillar.tag}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--color-primary)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            2. UNIFIED METRICS PANEL (High-Density, Sleek on Mobile)
        ========================================================================= */}
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Metric 1 */}
            <div className="bg-[var(--color-surface-card)] rounded-2xl p-4 sm:p-6 border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 transition-colors shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--color-primary)]/40 to-transparent" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-subtle)] font-semibold">Scholarship</span>
                <BookOpen className="w-3.5 h-3.5 text-[var(--color-primary)] opacity-80" />
              </div>
              <AnimatedCounter value={2} className="text-3xl sm:text-4xl lg:text-5xl font-mono font-black text-[var(--color-primary)] leading-none my-1" />
              <div className="text-xs font-serif font-bold text-[var(--color-text-main)] mt-1">
                Peer-Reviewed Papers
              </div>
              <p className="text-[10px] font-mono text-[var(--color-text-muted)] mt-0.5 truncate">
                Zenodo Open Repository
              </p>
            </div>

            {/* Metric 2 */}
            <div className="bg-[var(--color-surface-card)] rounded-2xl p-4 sm:p-6 border border-[var(--color-border)] hover:border-sky-400/40 transition-colors shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-subtle)] font-semibold">Capstone</span>
                <FileText className="w-3.5 h-3.5 text-sky-400 opacity-80" />
              </div>
              <AnimatedCounter value={1} className="text-3xl sm:text-4xl lg:text-5xl font-mono font-black text-sky-400 leading-none my-1" />
              <div className="text-xs font-serif font-bold text-[var(--color-text-main)] mt-1">
                B.Sc. Honors Thesis
              </div>
              <p className="text-[10px] font-mono text-[var(--color-text-muted)] mt-0.5 truncate">
                Top Grade Distinction
              </p>
            </div>

            {/* Metric 3 */}
            <div className="bg-[var(--color-surface-card)] rounded-2xl p-4 sm:p-6 border border-[var(--color-border)] hover:border-emerald-400/40 transition-colors shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-subtle)] font-semibold">Modeling</span>
                <Activity className="w-3.5 h-3.5 text-emerald-400 opacity-80" />
              </div>
              <AnimatedCounter value={10} suffix="+" className="text-3xl sm:text-4xl lg:text-5xl font-mono font-black text-emerald-400 leading-none my-1" />
              <div className="text-xs font-serif font-bold text-[var(--color-text-main)] mt-1">
                ML Models Evaluated
              </div>
              <p className="text-[10px] font-mono text-[var(--color-text-muted)] mt-0.5 truncate">
                +25% Accuracy Gains
              </p>
            </div>

            {/* Metric 4 */}
            <div className="bg-[var(--color-surface-card)] rounded-2xl p-4 sm:p-6 border border-[var(--color-border)] hover:border-amber-400/40 transition-colors shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-subtle)] font-semibold">Distinctions</span>
                <Trophy className="w-3.5 h-3.5 text-amber-400 opacity-80" />
              </div>
              <AnimatedCounter value={4} className="text-3xl sm:text-4xl lg:text-5xl font-mono font-black text-amber-400 leading-none my-1" />
              <div className="text-xs font-serif font-bold text-[var(--color-text-main)] mt-1">
                Departmental Awards
              </div>
              <p className="text-[10px] font-mono text-[var(--color-text-muted)] mt-0.5 truncate">
                OS, HCI, SE &amp; Data Struct
              </p>
            </div>

          </div>
        </div>

        {/* =========================================================================
            3. FEATURED ACADEMIC WORKS (Publications & Preprints)
        ========================================================================= */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-border)]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>// PEER-REVIEWED CORPUS</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-text-main)] tracking-tight mt-0.5">
                Featured Academic Works
              </h3>
            </div>

            <a 
              href={portfolioData.personal.googleScholar}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-main)] hover:text-[var(--color-primary)] rounded-xl text-xs font-mono font-semibold transition-all shadow-xs self-start sm:self-center"
            >
              <span>Google Scholar Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {portfolioData.publications.map((pub, idx) => (
              <article 
                key={pub.id} 
                className="bg-[var(--color-surface-card)] rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 shadow-sm transition-all duration-300 relative overflow-hidden group"
              >
                {/* Subtle top hairline */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)]/40 to-transparent" />

                {/* Top Meta Header: Status Pills & Year */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/30 text-[10px] font-mono font-bold tracking-wider rounded-md uppercase">
                      {pub.type}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-mono font-bold tracking-wider rounded-md uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {pub.status}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-[var(--color-primary)] px-2 py-0.5 rounded-md bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
                    {pub.date}
                  </span>
                </div>

                {/* Paper Title */}
                <h4 className="text-base sm:text-xl font-serif font-bold text-[var(--color-text-main)] mb-2 leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                  {pub.link ? (
                    <a href={pub.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {pub.title}
                    </a>
                  ) : (
                    pub.title
                  )}
                </h4>

                {/* Authors Line */}
                <div className="text-xs font-mono text-[var(--color-text-muted)] mb-3 flex flex-wrap items-center gap-1.5">
                  <span className="text-[var(--color-text-subtle)]">Authors:</span>
                  <span>
                    {pub.authors.split(';').map((author, aIdx, arr) => {
                      const trimmed = author.trim()
                      const isMainAuthor = trimmed.includes('Amoo')
                      return (
                        <span key={aIdx}>
                          <span className={isMainAuthor ? 'text-[var(--color-primary)] font-bold' : 'text-[var(--color-text-main)]'}>
                            {trimmed}
                          </span>
                          {aIdx < arr.length - 1 && ', '}
                        </span>
                      )
                    })}
                  </span>
                </div>

                {/* Key Discovery / Abstract Dispatch */}
                <div className="border-l-2 border-[var(--color-primary)]/50 pl-3.5 my-3.5 text-xs text-neutral-300 font-sans leading-relaxed bg-[var(--color-surface-base)]/50 py-2 pr-3 rounded-r-xl">
                  {pub.id === 'pub-hotel' ? (
                    <span>
                      <strong className="text-[var(--color-primary)]">Key Finding:</strong> Developed a hybrid geospatial recommendation architecture combining spatial distance metrics with collaborative preference weighting, reducing search latency while improving hotel recommendation relevance.
                    </span>
                  ) : (
                    <span>
                      <strong className="text-[var(--color-primary)]">Key Finding:</strong> Proposed an empirical data-quality audit framework addressing systematic representation loss in severely imbalanced clinical and financial datasets, achieving quantifiable fairness gains without sacrificing macro accuracy.
                    </span>
                  )}
                </div>

                {/* Footer: Venue & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3.5 border-t border-[var(--color-border)] text-xs">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--color-text-muted)]">
                    <Building2 className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    <span className="font-semibold text-[var(--color-text-main)]">{pub.journal}</span>
                    <span>· Open Research Repository</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyCitation(pub)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-primary)] text-[var(--color-text-main)] text-[11px] font-mono transition-colors cursor-pointer"
                    >
                      {copiedId === pub.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Citation</span>
                        </>
                      )}
                    </button>

                    {pub.link && (
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-text)] text-[11px] font-mono font-bold hover:opacity-90 transition-opacity"
                      >
                        <span>View on Zenodo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* =========================================================================
            4. ACADEMIC & PROFESSIONAL RESEARCH TRACK
        ========================================================================= */}
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--color-border)]">
            <div className="p-1.5 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-text-main)] tracking-tight">
                Academic &amp; Professional Track
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] font-sans">
                Laboratory appointments, thesis lead responsibilities, and industry analytics fellowships.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {trackItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-[var(--color-surface-card)] rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 shadow-sm flex flex-col justify-between transition-all duration-300 relative group"
              >
                <div>
                  {/* Category Pill & Icon */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md border ${item.categoryColor}`}>
                      {item.category}
                    </span>
                    <div className="p-1.5 rounded-lg bg-white/[0.04] border border-[var(--color-border)]">
                      {item.icon}
                    </div>
                  </div>

                  {/* Title & Organization */}
                  <h4 className="text-base sm:text-lg font-serif font-bold text-[var(--color-text-main)] mb-1 leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs font-sans font-medium text-[var(--color-text-muted)] mb-1">
                    {item.affiliation}
                  </p>
                  <p className="text-[11px] font-mono text-[var(--color-text-subtle)] mb-3">
                    {item.lab}
                  </p>

                  {/* Date & Mode Badge */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[10px] font-mono">
                    <span className="px-2.5 py-1 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md flex items-center gap-1.5 text-[var(--color-text-muted)]">
                      <Calendar className="w-3 h-3 text-[var(--color-primary)]" />
                      {item.period}
                    </span>
                    <span className="px-2.5 py-1 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md text-[var(--color-text-muted)] font-semibold">
                      {item.type}
                    </span>
                  </div>

                  {/* Thesis Topic Callout if present */}
                  {item.thesisTopic && (
                    <div className="mb-4 p-3 bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-xl">
                      <div className="text-[9px] font-mono font-bold tracking-widest uppercase text-[var(--color-primary)] mb-0.5">
                        THESIS TOPIC
                      </div>
                      <div className="text-xs font-serif font-bold text-[var(--color-text-main)] leading-snug">
                        {item.thesisTopic}
                      </div>
                    </div>
                  )}

                  {/* Bullet Contributions */}
                  <ul className="space-y-2.5 my-2">
                    {item.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5 text-xs text-[var(--color-text-muted)] leading-relaxed font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]/80 mt-1.5 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags Footer */}
                {item.tags && (
                  <div className="mt-4 pt-3 border-t border-[var(--color-border)]/60 flex flex-wrap gap-1.5">
                    {item.tags.map((tag, tIdx) => (
                      <span 
                        key={tIdx} 
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--color-surface-elevated)] text-[var(--color-text-subtle)] border border-[var(--color-border)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            5. PRIMARY FOCUS AREAS (Mobile-Optimized Clean Wrap & Dock Clearance)
        ========================================================================= */}
        <div className="pt-6 sm:pt-10 pb-8 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span>PRIMARY FOCUS AREAS</span>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 max-w-3xl mx-auto px-2">
            {portfolioData.personal.researchInterests.map((interest, idx) => (
              <div 
                key={idx}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-full text-xs font-sans font-medium text-[var(--color-text-main)] shadow-2xs flex items-center gap-2 transition-all hover:scale-105 cursor-default"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0" />
                <span>{interest}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default ResearchSection
