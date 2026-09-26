import React, { useState } from 'react'
import { portfolioData } from '../content/portfolioData'
import { SectionHeader } from '../components/SectionHeader'
import { ProjectCard } from '../components/ProjectCard'
import { Carousel } from '../components/Carousel'

export const ProjectsSection: React.FC = () => {
  const [filter, setFilter] = useState<string>('all')

  const filteredProjects = portfolioData.projects.filter(p => {
    if (filter === 'all') return true
    return p.category === filter
  })

  return (
    <section id="projects" className="py-20 bg-[var(--color-surface-base)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          eyebrow="Portfolio & Software Engineering Works"
          title="Featured Projects & Case Studies"
          description="A selection of civic technology platforms, location-aware recommendation systems, machine learning pipelines, and intelligent educational tools."
        />

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'civic-tech', label: 'Civic Tech & PWA' },
            { id: 'fullstack', label: 'Frontend / Fullstack' },
            { id: 'recommendation', label: 'Recommendation Systems' },
            { id: 'ai-data', label: 'AI & Data Science' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                filter === cat.id
                  ? 'bg-[var(--color-primary)] text-black font-bold shadow-xs'
                  : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border border-[var(--color-border)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Frontend / Software Engineering Projects */}
        {filteredProjects.filter(p => p.lens !== 'research').length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-serif font-bold text-[var(--color-text-main)] mb-8 border-b border-[var(--color-border)] pb-4">Software Engineering & Frontend</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.filter(p => p.lens !== 'research').map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* Research Projects */}
        {filteredProjects.filter(p => p.lens === 'research').length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-serif font-bold text-[var(--color-text-main)] mb-8 border-b border-[var(--color-border)] pb-4">Research & Thesis Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.filter(p => p.lens === 'research').map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
