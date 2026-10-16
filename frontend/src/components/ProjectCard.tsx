import React from 'react'
import { Link } from 'react-router-dom'
import type { ProjectItem } from '../content/portfolioData'
import { apiUrl } from '../lib/api'
import { BookOpen } from 'lucide-react'

interface ProjectCardProps {
  project: ProjectItem
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="flex flex-col h-full group">
      <Link to={`/projects/${project.id}`} className="flex flex-col h-full block cursor-pointer">
        
        {/* Screenshot / Visual Preview Block (Issue 5.7: use screenshots from /public, no cold proxy iframes) */}
        <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--color-surface-elevated)] to-[var(--color-surface-card)] mb-6 relative border border-[var(--color-border)]/50">
          {project.imageUrl ? (
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out" 
            />
          ) : project.demoUrl && project.previewType === 'iframe' ? (
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <iframe 
                src={apiUrl(`/api/proxy?url=${encodeURIComponent(project.demoUrl)}`)}
                title={project.title} 
                className="absolute top-0 left-0 w-[400%] h-[400%] origin-top-left scale-[0.25] border-none pointer-events-none"
                scrolling="no"
                tabIndex={-1}
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center group-hover:scale-105 transition-transform duration-700 ease-out">
              <h3 className="text-2xl font-serif font-bold text-[var(--color-text-main)] drop-shadow-md mb-2">{project.title}</h3>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-primary)] opacity-80">{project.category}</span>
            </div>
          )}

          {/* Issue 5.6: Case study tag overlay */}
          {project.caseStudyPath && (
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-xs text-[var(--color-primary)] border border-[var(--color-primary)]/40 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-lg">
              <BookOpen className="w-3 h-3" /> Case Study
            </div>
          )}
        </div>

        {/* Minimalist Text Block Below Image */}
        <div className="flex flex-col flex-grow px-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl md:text-2xl font-sans font-bold text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors">
              {project.title}
            </h3>
            <span className="text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1">
              →
            </span>
          </div>
          
          <p className="text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed mb-4 flex-grow">
            {project.summary}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]/50">
            <p className="text-xs font-mono text-[var(--color-text-subtle)]">
              {project.category.replace('-', ' ').toUpperCase()} · {project.technologies.slice(0, 2).join(' / ')}
            </p>
            {project.caseStudyPath && (
              <span className="text-xs font-mono text-[var(--color-primary)] hover:underline flex items-center gap-1 font-semibold">
                Read Study ↗
              </span>
            )}
          </div>
        </div>
        
      </Link>
    </div>
  )
}
