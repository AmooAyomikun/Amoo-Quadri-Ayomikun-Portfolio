import React, { useState } from 'react'
import { Briefcase, BookOpen, MapPin, Calendar, CheckCircle2 } from 'lucide-react'
import { portfolioData } from '../content/portfolioData'

export const ExperienceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'industry' | 'teaching'>('all')

  const filteredExperience = portfolioData.experience.filter(exp => {
    if (activeTab === 'all') return true
    return exp.type === activeTab
  })

  return (
    <section id="experience" className="w-full">
      {/* Filter Tabs - Horizontal scrollable on mobile with zero clipping, centered on desktop */}
      <div className="flex items-center sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 sm:pb-0 mb-6 sm:mb-10">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-mono shrink-0 transition-all cursor-pointer border select-none ${
            activeTab === 'all'
              ? 'bg-[var(--color-primary)] text-[#0a192f] border-[var(--color-primary)] font-bold shadow-xs'
              : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]/30 font-medium'
          }`}
        >
          <span className="sm:hidden">All ({portfolioData.experience.length})</span>
          <span className="hidden sm:inline">All Track Record ({portfolioData.experience.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('industry')}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-mono shrink-0 transition-all cursor-pointer border select-none ${
            activeTab === 'industry'
              ? 'bg-[var(--color-primary)] text-[#0a192f] border-[var(--color-primary)] font-bold shadow-xs'
              : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]/30 font-medium'
          }`}
        >
          <span className="sm:hidden">Industry</span>
          <span className="hidden sm:inline">Industrial Development</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('teaching')}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-mono shrink-0 transition-all cursor-pointer border select-none ${
            activeTab === 'teaching'
              ? 'bg-[var(--color-primary)] text-[#0a192f] border-[var(--color-primary)] font-bold shadow-xs'
              : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]/30 font-medium'
          }`}
        >
          <span className="sm:hidden">Teaching</span>
          <span className="hidden sm:inline">Teaching &amp; Mentorship</span>
        </button>
      </div>

      {/* Experience Timeline Cards */}
      <div className="space-y-4 sm:space-y-6">
        {filteredExperience.map((exp) => (
          <article 
            key={exp.id} 
            className="bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 rounded-2xl p-4 sm:p-7 transition-all duration-300 shadow-xs hover:shadow-md"
          >
            {/* Top Meta Header: Badge & Calendar Date */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider border ${
                exp.type === 'industry'
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/30'
                  : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
              }`}>
                {exp.type === 'industry' ? 'Industrial Development' : 'Academic Teaching'}
              </span>

              <span className="text-[11px] sm:text-xs font-mono text-[var(--color-text-muted)] flex items-center gap-1.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] px-2 py-0.5 rounded-md">
                <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <span>{exp.period}</span>
              </span>
            </div>

            {/* Role Title */}
            <h3 className="text-lg sm:text-2xl font-serif font-bold text-[var(--color-text-main)] leading-snug">
              {exp.role}
            </h3>

            {/* Company & Location - Responsive flex wrap so they never collide on small screens */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs font-mono text-[var(--color-primary)] font-semibold mb-3">
              <span className="flex items-center gap-1.5">
                {exp.type === 'industry' ? <Briefcase className="w-3.5 h-3.5 shrink-0" /> : <BookOpen className="w-3.5 h-3.5 shrink-0" />}
                <span>{exp.company}</span>
              </span>
              <span className="text-[var(--color-text-subtle)] font-normal flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" /> 
                <span>{exp.location}</span>
              </span>
            </div>

            {/* Role Summary */}
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed mb-4 font-sans">
              {exp.summary}
            </p>

            {/* Achievements List */}
            <div className="mb-4">
              <h4 className="text-[11px] sm:text-xs font-mono uppercase tracking-wider font-semibold text-[var(--color-text-main)] mb-2.5">
                Key Achievements &amp; Responsibilities:
              </h4>
              <ul className="space-y-2">
                {exp.achievements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-[var(--color-text-muted)] leading-relaxed font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack / Skill Pills */}
            <div className="flex flex-wrap gap-1.5 pt-3.5 border-t border-[var(--color-border)]">
              {exp.techStack.map((tech, idx) => (
                <span 
                  key={idx} 
                  className="text-[10px] sm:text-[11px] font-mono text-[var(--color-text-muted)] bg-[var(--color-surface-base)] border border-[var(--color-border)] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>

          </article>
        ))}
      </div>
    </section>
  )
}
