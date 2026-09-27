import React from 'react'
import { Link } from 'react-router-dom'
import type { ProjectItem } from '../content/portfolioData'

interface ProjectCardProps {
  project: ProjectItem
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link to={`/projects/${project.id}`} className="flex flex-col h-full group block cursor-pointer">
      
      {/* Huge Image / Placeholder Block */}
      <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--color-surface-elevated)] to-[var(--color-surface-card)] mb-6 relative">
        {project.demoUrl && project.previewType !== 'image' ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <iframe 
              src={`https://portfolio-backend-st78.onrender.com/api/proxy?url=${encodeURIComponent(project.demoUrl)}`}
              title={project.title} 
              className="absolute top-0 left-0 w-[400%] h-[400%] origin-top-left scale-[0.25] border-none pointer-events-none"
              scrolling="no"
              tabIndex={-1}
            />
          </div>
        ) : project.imageUrl ? (
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="absolute -top-[10%] -bottom-[8%] left-0 right-0 w-full h-[118%] max-w-none object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center group-hover:scale-105 transition-transform duration-700 ease-out">
            <h3 className="text-2xl font-serif font-bold text-[var(--color-text-main)] drop-shadow-md mb-2">{project.title}</h3>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--color-primary)] opacity-80">{project.category}</span>
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

        <p className="text-xs font-mono text-[var(--color-text-subtle)]">
          {project.category.replace('-', ' ').toUpperCase()} · {project.technologies.slice(0, 2).join(' / ')}
        </p>
      </div>
      
    </Link>
  )
}
