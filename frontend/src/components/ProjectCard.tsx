import React from 'react'
import { Link } from 'react-router-dom'
import type { ProjectItem } from '../content/portfolioData'
import { BookOpen } from 'lucide-react'
import { InteractiveAppPreview } from './InteractiveAppPreview'

interface ProjectCardProps {
  project: ProjectItem
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="flex flex-col h-full group">
      {/* Interactive Live & Auto Tour Mockup Frame */}
      <div className="mb-5 relative">
        <InteractiveAppPreview
          demoUrl={project.previewType !== 'image' ? project.demoUrl : undefined}
          imageUrl={project.imageUrl}
          title={project.title}
          aspectRatio="aspect-[4/3]"
          autoPlayTourDefault={true}
          tourRoutes={project.tourRoutes}
        />

        {/* Case study tag overlay */}
        {project.caseStudyPath && (
          <div className="absolute top-12 right-3 z-30 bg-black/80 backdrop-blur-xs text-[var(--color-primary)] border border-[var(--color-primary)]/40 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-lg pointer-events-none">
            <BookOpen className="w-3 h-3" /> Case Study
          </div>
        )}
      </div>

      {/* Minimalist Text Block Below Mockup Frame */}
      <div className="flex flex-col flex-grow px-1">
        <Link to={`/projects/${project.id}`} className="block group/link">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl md:text-2xl font-sans font-bold text-[var(--color-text-main)] group-hover/link:text-[var(--color-primary)] transition-colors">
              {project.title}
            </h3>
            <span className="text-[var(--color-primary)] opacity-0 group-hover/link:opacity-100 transition-opacity duration-300 transform group-hover/link:translate-x-1 font-mono">
              →
            </span>
          </div>

          <p className="text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed mb-4">
            {project.summary}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
            <p className="text-xs font-mono text-[var(--color-text-subtle)]">
              {project.category.replace('-', ' ').toUpperCase()} · {project.technologies.slice(0, 2).join(' / ')}
            </p>
            <span className="text-xs font-mono text-[var(--color-primary)] group-hover/link:underline flex items-center gap-1 font-semibold">
              Read Study ↗
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}
