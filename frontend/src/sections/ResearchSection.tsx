import React, { useState } from 'react'
import { 
  BookOpen, 
  ExternalLink, 
  Activity, 
  FileText, 
  Trophy, 
  Calendar,
  GraduationCap,
  Copy,
  Check,
  ChevronDown
} from 'lucide-react'
import { portfolioData } from '../content/portfolioData'
import { AnimatedCounter } from '../components/AnimatedCounter'

export const ResearchSection: React.FC = () => {
  const [openAbstractId, setOpenAbstractId] = useState<string | null>(null)
  const [openBibtexId, setOpenBibtexId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyBibtex = (id: string, bibtex: string) => {
    navigator.clipboard.writeText(bibtex)
    setCopiedId(id)
    setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 2000)
  }

  return (
    <section id="research" className="py-4 sm:py-8 bg-transparent">
      <div className="w-full space-y-12 sm:space-y-16">
        
        {/* =========================================================================
            1. RESEARCH FOCUS (Complete, Unabridged Verbatim Narrative)
        ========================================================================= */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-14 items-start py-4 sm:py-6">
          <div className="md:w-1/3 shrink-0">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-text-main)] relative inline-block">
              Research Focus
              <div className="absolute -bottom-2.5 left-0 w-12 h-1 bg-[var(--color-primary)] rounded-full" />
            </h2>
          </div>
          <div className="md:w-2/3">
            <p className="text-sm sm:text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed font-sans border-l-3 sm:border-l-4 border-[var(--color-primary)]/50 pl-4 sm:pl-6">
              My research focuses on developing intelligent and reliable software systems that address real-world challenges, particularly in applied data science and location-aware recommendation systems. I explore the application of artificial intelligence, machine learning, and software engineering to build scalable systems. My work includes developing geospatial algorithms for recommendation engines, evaluating the performance of machine learning models on financial data, and creating intelligent frameworks to reduce algorithmic bias. Through empirical evaluation and rigorous software engineering practices, my goal is to deploy data-driven solutions that provide measurable improvements in reliability and system intelligence.
            </p>
          </div>
        </div>

        {/* =========================================================================
            2. UNIFIED METRICS PANEL (Clean, High-Density on Mobile)
        ========================================================================= */}
        <div className="bg-[var(--color-surface-card)] rounded-2xl sm:rounded-3xl border border-[var(--color-border)] shadow-xs overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border)]">
            
            <div className="p-5 sm:p-8 flex flex-col items-center justify-center text-center hover:bg-[var(--color-surface-elevated)] transition-colors">
              <AnimatedCounter value={2} className="text-3xl sm:text-5xl font-sans font-black text-[var(--color-primary)] mb-1.5 sm:mb-2 block leading-none" />
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[var(--color-text-main)] uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                <span>Publications</span>
              </div>
            </div>

            <div className="p-5 sm:p-8 flex flex-col items-center justify-center text-center hover:bg-[var(--color-surface-elevated)] transition-colors">
              <AnimatedCounter value={1} className="text-3xl sm:text-5xl font-sans font-black text-[var(--color-primary)] mb-1.5 sm:mb-2 block leading-none" />
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[var(--color-text-main)] uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                <span>B.Sc Thesis</span>
              </div>
            </div>

            <div className="p-5 sm:p-8 flex flex-col items-center justify-center text-center hover:bg-[var(--color-surface-elevated)] transition-colors">
              <AnimatedCounter value={10} suffix="+" className="text-3xl sm:text-5xl font-sans font-black text-[var(--color-primary)] mb-1.5 sm:mb-2 block leading-none" />
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[var(--color-text-main)] uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                <span>ML Models</span>
              </div>
            </div>

            <div className="p-5 sm:p-8 flex flex-col items-center justify-center text-center hover:bg-[var(--color-surface-elevated)] transition-colors">
              <AnimatedCounter value={4} className="text-3xl sm:text-5xl font-sans font-black text-[var(--color-primary)] mb-1.5 sm:mb-2 block leading-none" />
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[var(--color-text-main)] uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                <span>Awards</span>
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
            3. FEATURED ACADEMIC WORKS (Publications & Preprints)
        ========================================================================= */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-border)]">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-text-main)] flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-[var(--color-primary)]" />
              <span>Featured Academic Works</span>
            </h3>

            <a 
              href={portfolioData.personal.googleScholar}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-main)] hover:text-[var(--color-primary)] rounded-xl text-xs font-mono font-semibold transition-colors shadow-xs self-start sm:self-center"
            >
              <span>Google Scholar Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {portfolioData.publications.map((pub) => (
              <div 
                key={pub.id} 
                className="bg-[var(--color-surface-card)] rounded-xl sm:rounded-3xl p-4 sm:p-7 border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 shadow-xs transition-colors group"
              >
                {/* Meta Row: Type, Status, Date */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase text-[var(--color-text-muted)]">
                      {pub.type}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase text-[var(--color-primary)]">
                      {pub.status}
                    </span>
                  </div>
                  <span className="text-[11px] sm:text-xs font-mono font-bold text-[var(--color-primary)]">
                    {pub.date}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-sm sm:text-lg md:text-xl font-serif font-bold text-[var(--color-text-main)] mb-2 leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                  {pub.link ? (
                    <a href={pub.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {pub.title}
                    </a>
                  ) : (
                    pub.title
                  )}
                </h4>

                {/* Authors */}
                <p className="text-[11px] sm:text-sm text-[var(--color-text-muted)] mb-3 sm:mb-5 font-sans leading-relaxed">
                  {pub.authors.split(';').map((author, aIdx, arr) => {
                    const trimmed = author.trim()
                    const isMain = trimmed.includes('Amoo')
                    return (
                      <span key={aIdx}>
                        <span className={isMain ? 'text-[var(--color-text-main)] font-semibold' : 'text-[var(--color-text-muted)]'}>
                          {trimmed}
                        </span>
                        {aIdx < arr.length - 1 && '; '}
                      </span>
                    )
                  })}
                </p>

                {/* Footer: Venue, Academic Controls & Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 sm:pt-4 border-t border-[var(--color-border)] text-xs">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-serif italic text-[var(--color-text-muted)] text-xs sm:text-sm">
                      {pub.journal}
                    </span>
                    {pub.doi && (
                      <>
                        <span className="text-[var(--color-border)]">·</span>
                        <span className="font-mono text-[11px] text-[var(--color-text-subtle)]">
                          DOI: {pub.doi}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    {pub.abstract && (
                      <button
                        type="button"
                        onClick={() =>
                          setOpenAbstractId((prev) => (prev === pub.id ? null : pub.id))
                        }
                        className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-mono font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                      >
                        <span>Abstract &amp; Findings</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            openAbstractId === pub.id ? 'rotate-180 text-[var(--color-primary)]' : ''
                          }`}
                        />
                      </button>
                    )}

                    {pub.bibtex && (
                      <button
                        type="button"
                        onClick={() =>
                          setOpenBibtexId((prev) => (prev === pub.id ? null : pub.id))
                        }
                        className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-mono font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                      >
                        <span>Cite (.bib)</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            openBibtexId === pub.id ? 'rotate-180 text-[var(--color-primary)]' : ''
                          }`}
                        />
                      </button>
                    )}

                    {pub.link && (
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono font-bold text-[var(--color-primary)] uppercase tracking-wider hover:underline"
                      >
                        <span>VIEW PUBLICATION</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Expandable Abstract & Key Findings Panel */}
                {openAbstractId === pub.id && pub.abstract && (
                  <div className="mt-4 pt-4 border-t border-[var(--color-border)] space-y-3 text-xs sm:text-sm text-[var(--color-text-muted)] font-sans leading-relaxed">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-subtle)] font-semibold mb-1">
                        Abstract
                      </div>
                      <p>{pub.abstract}</p>
                    </div>

                    {pub.keyFindings && pub.keyFindings.length > 0 && (
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-subtle)] font-semibold mb-1.5">
                          Key Empirical Contributions
                        </div>
                        <ul className="space-y-1.5 list-disc list-inside text-[var(--color-text-main)]/90">
                          {pub.keyFindings.map((finding, fIdx) => (
                            <li key={fIdx} className="leading-relaxed">
                              {finding}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Expandable BibTeX Citation Drawer */}
                {openBibtexId === pub.id && pub.bibtex && (
                  <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-subtle)] font-semibold">
                        BibTeX Citation Record
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyBibtex(pub.id, pub.bibtex!)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-primary)] text-[11px] font-mono text-[var(--color-text-main)] transition-colors cursor-pointer"
                      >
                        {copiedId === pub.id ? (
                          <>
                            <Check className="w-3 h-3 text-[var(--color-primary)]" />
                            <span className="text-[var(--color-primary)]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-[var(--color-text-muted)]" />
                            <span>Copy .bib</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3.5 rounded-lg bg-[var(--color-surface-base)] border border-[var(--color-border)] font-mono text-[11px] sm:text-xs text-[var(--color-text-muted)] overflow-x-auto leading-relaxed">
                      <code>{pub.bibtex}</code>
                    </pre>
                  </div>
                )}
              </div>
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
            
            {/* 1. NYSC Research Assistant */}
            <div className="bg-[var(--color-surface-card)] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 shadow-xs flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)]">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
                    APPLIED AI RESEARCH
                  </span>
                </div>

                <h4 className="text-lg sm:text-xl font-serif font-bold text-[var(--color-text-main)] mb-1 leading-snug">
                  Research Assistant
                </h4>
                <p className="text-xs sm:text-sm text-[var(--color-text-muted)] font-medium mb-3">
                  Postgraduate Computer Science Lab · Delta State University, Asaba
                </p>

                <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[10px] font-mono font-bold">
                  <span className="px-2.5 py-1 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md flex items-center gap-1.5 text-[var(--color-text-muted)]">
                    <Calendar className="w-3 h-3 text-[var(--color-primary)]" />
                    Sept 2025 – Sept 2026
                  </span>
                  <span className="px-2.5 py-1 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md text-[var(--color-primary)]">
                    Full Time, NYSC
                  </span>
                </div>

                <ul className="space-y-2.5 my-2">
                  {portfolioData.research[0].contributions.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[var(--color-text-muted)] leading-relaxed font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {portfolioData.research[0].tags && (
                <div className="mt-4 pt-3 border-t border-[var(--color-border)]/60 flex flex-wrap gap-1.5">
                  {portfolioData.research[0].tags.map((tag, tIdx) => (
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

            {/* 2. Thesis Lead */}
            <div className="bg-[var(--color-surface-card)] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 shadow-xs flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
                    THESIS RESEARCH
                  </span>
                </div>

                <h4 className="text-lg sm:text-xl font-serif font-bold text-[var(--color-text-main)] mb-1 leading-snug">
                  Research Assistant &amp; Thesis Lead
                </h4>
                <p className="text-xs sm:text-sm text-[var(--color-text-muted)] font-medium mb-3">
                  First Technical University, Ibadan
                </p>

                <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[10px] font-mono font-bold">
                  <span className="px-2.5 py-1 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md flex items-center gap-1.5 text-[var(--color-text-muted)]">
                    <Calendar className="w-3 h-3 text-[var(--color-primary)]" />
                    Sept 2024 – April 2025
                  </span>
                  <span className="px-2.5 py-1 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md text-[var(--color-primary)]">
                    B.Sc. Thesis
                  </span>
                </div>

                <div className="mb-4 p-3 bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-xl">
                  <div className="text-[9px] font-mono font-bold tracking-widest uppercase text-[var(--color-primary)] mb-0.5">
                    THESIS TOPIC
                  </div>
                  <div className="text-xs font-serif font-bold text-[var(--color-text-main)] leading-snug">
                    {portfolioData.research[1].thesisTitle}
                  </div>
                </div>

                <ul className="space-y-2.5 my-2">
                  {portfolioData.research[1].contributions.slice(0, 3).map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[var(--color-text-muted)] leading-relaxed font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {portfolioData.research[1].tags && (
                <div className="mt-4 pt-3 border-t border-[var(--color-border)]/60 flex flex-wrap gap-1.5">
                  {portfolioData.research[1].tags.map((tag, tIdx) => (
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

            {/* 3. Data Analyst Intern */}
            <div className="bg-[var(--color-surface-card)] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 shadow-xs flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)]">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
                    INDUSTRIAL EXPERIENCE
                  </span>
                </div>

                <h4 className="text-lg sm:text-xl font-serif font-bold text-[var(--color-text-main)] mb-1 leading-snug">
                  Data Analyst Intern
                </h4>
                <p className="text-xs sm:text-sm text-[var(--color-text-muted)] font-medium mb-3">
                  Coast Research Technology, Ibadan
                </p>

                <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[10px] font-mono font-bold">
                  <span className="px-2.5 py-1 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md flex items-center gap-1.5 text-[var(--color-text-muted)]">
                    <Calendar className="w-3 h-3 text-[var(--color-primary)]" />
                    April 2023 – Sept 2023
                  </span>
                  <span className="px-2.5 py-1 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md text-[var(--color-primary)]">
                    Part Time, SIWES
                  </span>
                </div>

                <ul className="space-y-2.5 my-2">
                  {portfolioData.experience.find(e => e.id === 'coast-tech-analyst')?.achievements.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[var(--color-text-muted)] leading-relaxed font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--color-border)]/60 flex flex-wrap gap-1.5">
                {['Data Analytics', 'Python', 'ETL Pipelines', 'Statistical Modeling'].map((tag, tIdx) => (
                  <span 
                    key={tIdx} 
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--color-surface-elevated)] text-[var(--color-text-subtle)] border border-[var(--color-border)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 4. Full Stack / Frontend Intern */}
            <div className="bg-[var(--color-surface-card)] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 shadow-xs flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)]">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
                    CIVIC TECH PWA
                  </span>
                </div>

                <h4 className="text-lg sm:text-xl font-serif font-bold text-[var(--color-text-main)] mb-1 leading-snug">
                  Frontend / Full-Stack Engineer Intern
                </h4>
                <p className="text-xs sm:text-sm text-[var(--color-text-muted)] font-medium mb-3">
                  Circo Digital Academy &amp; CodeAlpha
                </p>

                <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[10px] font-mono font-bold">
                  <span className="px-2.5 py-1 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md flex items-center gap-1.5 text-[var(--color-text-muted)]">
                    <Calendar className="w-3 h-3 text-[var(--color-primary)]" />
                    April 2026 – Aug 2026
                  </span>
                  <span className="px-2.5 py-1 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md text-[var(--color-primary)]">
                    Remote Internship
                  </span>
                </div>

                <ul className="space-y-2.5 my-2">
                  {portfolioData.experience.find(e => e.id === 'circo-cleanreport')?.achievements.slice(0, 3).map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[var(--color-text-muted)] leading-relaxed font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--color-border)]/60 flex flex-wrap gap-1.5">
                {['React', 'TypeScript', 'PWA / Offline', 'Geolocation API'].map((tag, tIdx) => (
                  <span 
                    key={tIdx} 
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--color-surface-elevated)] text-[var(--color-text-subtle)] border border-[var(--color-border)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
            5. PRIMARY FOCUS AREAS (Clean Wrap & Clearance)
        ========================================================================= */}
        <div className="pt-8 sm:pt-12 pb-16 sm:pb-24 text-center">
          <h3 className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-6">
            Primary Focus Areas
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-2.5 sm:gap-3 max-w-3xl mx-auto px-2">
            {portfolioData.personal.researchInterests.map((interest, idx) => (
              <div 
                key={idx}
                className="px-4 py-2 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-full text-xs font-sans font-medium text-[var(--color-text-main)] shadow-xs flex items-center gap-2 hover:border-[var(--color-primary)] transition-colors cursor-default"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] opacity-70 shrink-0" />
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
