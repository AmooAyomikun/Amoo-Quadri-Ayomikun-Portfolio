import React from 'react'
import { Brain, Code2, Database, Microscope } from 'lucide-react'
import { portfolioData } from '../content/portfolioData'
import { SectionHeader } from '../components/SectionHeader'
import { Badge } from '../components/Badge'

export const SkillsSection: React.FC = () => {
  const categories = [
    {
      title: "Artificial Intelligence & Data",
      icon: <Brain className="w-5 h-5 text-[var(--color-primary)]" />,
      skills: portfolioData.skills.aiAndData
    },
    {
      title: "Software Eng & Web Development",
      icon: <Code2 className="w-5 h-5 text-[var(--color-primary)]" />,
      skills: portfolioData.skills.softwareAndWeb
    },
    {
      title: "Databases & Development Tools",
      icon: <Database className="w-5 h-5 text-[var(--color-primary)]" />,
      skills: portfolioData.skills.databasesAndTools
    },
    {
      title: "Research & Analytical Tools",
      icon: <Microscope className="w-5 h-5 text-[var(--color-primary)]" />,
      skills: portfolioData.skills.researchAndMethodology
    }
  ]

  return (
    <section className="py-20 bg-[var(--color-surface-card)] border-y border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          eyebrow="Technical Core & Competencies"
          title="Skills & Methodological Toolkit"
          description="A comprehensive toolkit spanning artificial intelligence, full-stack web engineering, database architecture, and empirical research evaluation."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, idx) => (
            <div key={idx} className="card-elevated p-6 bg-[var(--color-surface-base)]">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[var(--color-border)]">
                {cat.icon}
                <h3 className="text-lg font-serif font-bold text-[var(--color-text-main)]">
                  {cat.title}
                </h3>
              </div>

              <div className="space-y-4">
                {cat.skills.map((skill, sIdx) => (
                  <div key={sIdx} className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[var(--color-text-main)]">
                          {skill.name}
                        </span>
                        <Badge variant="subtle" size="sm">
                          {skill.level}
                        </Badge>
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] font-mono mt-0.5">
                        {skill.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
