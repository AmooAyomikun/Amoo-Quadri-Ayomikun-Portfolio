import React, { useState } from 'react'
import { Briefcase, BookOpen, MapPin, Calendar, CheckCircle2 } from 'lucide-react'
import { portfolioData } from '../content/portfolioData'
import { Badge } from '../components/Badge'

export const ExperienceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'industry' | 'teaching'>('all')

  const filteredExperience = portfolioData.experience.filter(exp => {
    if (activeTab === 'all') return true
    return exp.type === activeTab
  })

  return (
    <section id="experience" className="w-full">
      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 mb-10">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer border select-none ${
            activeTab === 'all'
              ? 'bg-[var(--color-primary)] text-[#0a192f] border-[var(--color-primary)] font-bold shadow-xs'
              : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]/30 font-medium'
          }`}
        >
          All Track Record ({portfolioData.experience.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('industry')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer border select-none ${
            activeTab === 'industry'
              ? 'bg-[var(--color-primary)] text-[#0a192f] border-[var(--color-primary)] font-bold shadow-xs'
              : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]/30 font-medium'
          }`}
        >
          Industrial Development
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('teaching')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer border select-none ${
            activeTab === 'teaching'
              ? 'bg-[var(--color-primary)] text-[#0a192f] border-[var(--color-primary)] font-bold shadow-xs'
              : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]/30 font-medium'
          }`}
        >
          Teaching &amp; Mentorship
        </button>
      </div>

      {/* Experience Timeline Cards */}
      <div className="space-y-6">
        {filteredExperience.map((exp) => (
          <div 
            key={exp.id} 
            className="bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 rounded-2xl p-6 transition-all duration-300 shadow-xs hover:shadow-md"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant={exp.type === 'industry' ? 'primary' : 'accent'} size="sm">
                    {exp.type === 'industry' ? 'Industrial Development' : 'Academic Teaching'}
                  </Badge>
                  <span className="text-xs font-mono text-[var(--color-text-subtle)] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {exp.period}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-[var(--color-text-main)]">
                  {exp.role}
                </h3>
                <p className="text-xs font-mono text-[var(--color-primary)] font-semibold flex items-center gap-1.5 mt-0.5">
                  {exp.type === 'industry' ? <Briefcase className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                  {exp.company}
                  <span className="text-[var(--color-text-subtle)] font-normal flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {exp.location}
                  </span>
                </p>
              </div>
            </div>

            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4 font-sans">
              {exp.summary}
            </p>

            {/* Achievements List */}
            <div className="mb-4">
              <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-[var(--color-text-main)] mb-2.5">
                Key Achievements &amp; Responsibilities:
              </h4>
              <ul className="space-y-2">
                {exp.achievements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[var(--color-text-muted)] leading-relaxed font-sans">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack / Skill Pills */}
            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[var(--color-border)]">
              {exp.techStack.map((tech, idx) => (
                <span 
                  key={idx} 
                  className="text-[11px] font-mono text-[var(--color-text-muted)] bg-[var(--color-surface-base)] border border-[var(--color-border)] px-2.5 py-1 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>

          </div>
        ))}
      </div>
    </section>
  )
}
