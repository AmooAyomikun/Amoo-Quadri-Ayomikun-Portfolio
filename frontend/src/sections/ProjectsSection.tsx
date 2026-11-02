import React, { useState } from 'react'
import { portfolioData } from '../content/portfolioData'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectsHero } from '../components/PageHeroes'

export const ProjectsSection: React.FC = () => {
  const [filter, setFilter] = useState<string>('all')

  const categories = [
    { id: 'all', label: 'All Works', count: portfolioData.projects.length },
    { 
      id: 'web-apps', 
      label: 'Web Platforms & PWAs', 
      count: portfolioData.projects.filter(p => ['frontend', 'ecommerce', 'fullstack', 'civic-tech'].includes(p.category)).length 
    },
    { 
      id: 'civic-tech', 
      label: 'Civic Tech & Offline', 
      count: portfolioData.projects.filter(p => p.category === 'civic-tech').length 
    },
    { 
      id: 'ai-data', 
      label: 'AI & Data Science', 
      count: portfolioData.projects.filter(p => p.category === 'ai-data').length 
    },
    { 
      id: 'recommendation', 
      label: 'Geospatial Systems', 
      count: portfolioData.projects.filter(p => p.category === 'recommendation').length 
    },
  ]

  const filteredProjects = portfolioData.projects.filter(p => {
    if (filter === 'all') return true
    if (filter === 'web-apps') return ['frontend', 'ecommerce', 'fullstack', 'civic-tech'].includes(p.category)
    return p.category === filter
  })

  const engineeringProjects = filteredProjects.filter(p => p.lens !== 'research')
  const researchProjects = filteredProjects.filter(p => p.lens === 'research')

  return (
    <section id="projects" className="pb-6 sm:pb-10 bg-[var(--color-surface-base)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ProjectsHero />

        {/* Tactile Category Filter Dock */}
        <div className="flex items-center justify-between gap-4 p-2 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] mb-12 shadow-xs overflow-hidden">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto py-0.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  filter === cat.id
                    ? 'bg-[var(--color-primary)] text-[var(--color-primary-text)] font-bold shadow-xs'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-elevated)] font-medium'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  filter === cat.id
                    ? 'bg-black/15 text-[var(--color-primary-text)] font-extrabold'
                    : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-subtle)]'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 text-[11px] font-mono text-[var(--color-text-subtle)] shrink-0">
            <span>Showing {filteredProjects.length} of {portfolioData.projects.length} Works</span>
          </div>
        </div>

        {/* Frontend / Software Engineering Projects */}
        {engineeringProjects.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8 border-b border-[var(--color-border)] pb-4">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-text-main)] flex items-center gap-2">
                <span>02.1 · Production Web Applications &amp; PWAs</span>
              </h3>
              <span className="text-xs font-mono text-[var(--color-text-subtle)]">
                {engineeringProjects.length} {engineeringProjects.length === 1 ? 'System' : 'Systems'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {engineeringProjects.map((project) => (
                <div key={project.id} id={`project-${project.id}`} className="scroll-mt-28"><ProjectCard project={project} /></div>
              ))}
            </div>
          </div>
        )}

        {/* Research Projects */}
        {researchProjects.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8 border-b border-[var(--color-border)] pb-4">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-text-main)] flex items-center gap-2">
                <span>02.2 · Geospatial Intelligence &amp; Research Frameworks</span>
              </h3>
              <span className="text-xs font-mono text-[var(--color-text-subtle)]">
                {researchProjects.length} {researchProjects.length === 1 ? 'Work' : 'Works'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {researchProjects.map((project) => (
                <div key={project.id} id={`project-${project.id}`} className="scroll-mt-28"><ProjectCard project={project} /></div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
