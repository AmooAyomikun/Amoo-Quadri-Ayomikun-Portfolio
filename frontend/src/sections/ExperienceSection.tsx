import React, { useState } from 'react'
import { Briefcase, BookOpen, MapPin, Calendar, CheckCircle2 } from 'lucide-react'
import { portfolioData } from '../content/portfolioData'
import { SectionHeader } from '../components/SectionHeader'
import { Badge } from '../components/Badge'

export const ExperienceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'industry' | 'teaching'>('all')

  const filteredExperience = portfolioData.experience.filter(exp => {
    if (activeTab === 'all') return true
    return exp.type === activeTab
  })

  return (
    <section id="experience" className="py-20 bg-[var(--color-surface-card)] border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header has been moved to the page level */}
        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[var(--color-primary)] !text-black font-bold shadow-xs'
                : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border border-[var(--color-border)] font-medium'
            }`}
          >
            All Track Record ({portfolioData.experience.length})
          </button>
          <button
            onClick={() => setActiveTab('industry')}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'industry'
                ? 'bg-[var(--color-primary)] !text-black font-bold shadow-xs'
                : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border border-[var(--color-border)] font-medium'
            }`}
          >
            Industrial Experience
          </button>
          <button
            onClick={() => setActiveTab('teaching')}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'teaching'
                ? 'bg-[var(--color-primary)] !text-black font-bold shadow-xs'
                : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border border-[var(--color-border)] font-medium'
            }`}
          >
            Teaching & Mentorship
          </button>
        </div>

        {/* Experience Timeline Cards */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {filteredExperience.map((exp) => (
            <div key={exp.id} className="card-elevated p-6 bg-[var(--color-surface-base)]">
              
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
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

              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
                {exp.summary}
              </p>

              {/* Achievements List */}
              <div className="mb-4">
                <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-[var(--color-text-main)] mb-2">
                  Key Achievements & Responsibilities:
                </h4>
                <ul className="space-y-1.5">
                  {exp.achievements.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[var(--color-text-muted)]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack / Skill Pills */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[var(--color-border)]">
                {exp.techStack.map((tech, idx) => (
                  <Badge key={idx} variant="subtle" size="sm">
                    {tech}
                  </Badge>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
