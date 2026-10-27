import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, CheckCircle2, Layers, Cpu, Compass } from 'lucide-react'
import { portfolioData } from '../content/portfolioData'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Badge } from '../components/Badge'
import { SEO } from '../components/SEO'
import { InteractiveAppPreview } from '../components/InteractiveAppPreview'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const project = portfolioData.projects.find(p => p.id === id)

  // Find next/previous project for smooth bottom navigation
  const currentIndex = portfolioData.projects.findIndex(p => p.id === id)
  const prevProject = currentIndex > 0 ? portfolioData.projects[currentIndex - 1] : null
  const nextProject = currentIndex < portfolioData.projects.length - 1 ? portfolioData.projects[currentIndex + 1] : null

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!project) {
    return (
      <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)] flex flex-col items-center justify-center">
        <SEO title="Project Not Found" canonicalUrl="/projects" />
        <h1 className="text-3xl font-serif font-bold mb-4">Project Not Found</h1>
        <Link to="/projects" className="text-[var(--color-primary)] hover:underline flex items-center gap-2 font-mono text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)] flex flex-col">
      <SEO 
        title={`${project.title} — Architecture & Case Study`}
        description={project.summary}
        canonicalUrl={`/projects/${project.id}`}
      />
      <Navbar />

      <main className="flex-grow pt-20 sm:pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Navigation Breadcrumb */}
          <div className="mb-4">
            <Link 
              to="/projects" 
              className="inline-flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to all projects</span>
            </Link>
          </div>

          {/* Two-Column Layout: Scrollable Words on Left, Sticky Non-Scrolling Preview on Right (leerob style) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Fully Scrollable Project Story & Architecture Details */}
            <div className="order-2 lg:order-1 lg:col-span-6 xl:col-span-6 flex flex-col space-y-8 pb-16">
              
              {/* Header Info */}
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                  <Badge variant="primary" size="sm">{project.category.replace('-', ' ').toUpperCase()}</Badge>
                  <span className="text-xs font-mono text-[var(--color-text-muted)]">
                    {project.period}
                  </span>
                  {project.role && (
                    <span className="text-xs font-mono text-[var(--color-text-subtle)]">
                      · {project.role}
                    </span>
                  )}
                  {project.organization && (
                    <span className="text-xs font-mono text-[var(--color-text-subtle)]">
                      ({project.organization})
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold text-[var(--color-text-main)] leading-tight mb-3">
                  {project.title}
                </h1>
                
                {project.subtitle && (
                  <p className="text-base sm:text-lg font-serif italic text-[var(--color-primary)] font-medium">
                    {project.subtitle}
                  </p>
                )}
              </div>

              {/* Executive Summary */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-sm">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-subtle)] mb-2.5 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span>Overview</span>
                </h3>
                <p className="text-base sm:text-lg text-[var(--color-text-main)] leading-relaxed font-sans">
                  {project.summary}
                </p>
              </div>

              {/* In-Depth Description */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-subtle)] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span>Architecture &amp; Engineering Narrative</span>
                </h3>
                <div className="prose prose-base dark:prose-invert prose-p:text-[var(--color-text-muted)] prose-p:leading-relaxed max-w-none">
                  <p className="text-[var(--color-text-muted)] leading-relaxed text-sm sm:text-base">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Key Features & System Capabilities */}
              {project.keyFeatures && project.keyFeatures.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-subtle)] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    <span>Key Features &amp; Capabilities</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.keyFeatures.map((feat, idx) => (
                      <div 
                        key={idx}
                        className="p-3.5 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] flex items-start gap-2.5 shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-[var(--color-text-main)] leading-snug">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Impact Metrics */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">
                    Project Parameters &amp; Highlights
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {project.metrics.map((metric, idx) => (
                      <div 
                        key={idx}
                        className="p-3.5 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] flex flex-col"
                      >
                        <span className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                          {metric.label}
                        </span>
                        <span className="text-base font-bold font-sans text-[var(--color-primary)]">
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Core Technologies Used */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-subtle)] flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span>Core Technologies &amp; Tools</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <Badge 
                      key={idx} 
                      variant="subtle" 
                      size="sm" 
                      className="bg-[var(--color-surface-elevated)] border-[var(--color-border)] text-xs font-mono"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons (Live Demo & Case Study - NO Source Code link) */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-text)] font-mono text-xs font-bold shadow-md hover:bg-[var(--color-primary-hover)] transition-all cursor-pointer"
                  >
                    <span>Visit Live Application</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {project.caseStudyPath && (
                  <Link
                    to={project.caseStudyPath}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-main)] font-mono text-xs font-medium transition-colors"
                  >
                    <span>Read Deep-Dive Case Study</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  </Link>
                )}
              </div>

              {/* Bottom Project-to-Project Navigation */}
              <div className="pt-8 border-t border-[var(--color-border)] flex items-center justify-between">
                {prevProject ? (
                  <Link 
                    to={`/projects/${prevProject.id}`}
                    className="flex flex-col text-left group"
                  >
                    <span className="text-[10px] font-mono text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]">
                      ← Previous Project
                    </span>
                    <span className="text-xs font-bold text-[var(--color-text-main)] truncate max-w-[160px] sm:max-w-[220px]">
                      {prevProject.title}
                    </span>
                  </Link>
                ) : <div />}

                {nextProject && (
                  <Link 
                    to={`/projects/${nextProject.id}`}
                    className="flex flex-col text-right group ml-auto"
                  >
                    <span className="text-[10px] font-mono text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]">
                      Next Project →
                    </span>
                    <span className="text-xs font-bold text-[var(--color-text-main)] truncate max-w-[160px] sm:max-w-[220px]">
                      {nextProject.title}
                    </span>
                  </Link>
                )}
              </div>

            </div>

            {/* Right Column: Sticky Non-Scrolling Live Application Preview (leerob style) */}
            <div className="order-1 lg:order-2 lg:col-span-6 xl:col-span-6 lg:sticky lg:top-20 self-start w-full">
              <InteractiveAppPreview
                demoUrl={project.previewType !== 'image' ? project.demoUrl : undefined}
                imageUrl={project.imageUrl}
                title={project.title}
                aspectRatio="aspect-auto h-[360px] sm:h-[400px] lg:h-[430px] max-h-[calc(100vh-8.5rem)]"
                tourRoutes={project.tourRoutes}
                initialInteractive={true}
                scaleMode="full"
                showInteractiveBadge={false}
              />
              {/* Interactive Status Callout */}
              <div className="mt-2.5 px-3 py-2 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] flex items-center justify-between gap-2 font-mono text-xs shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-semibold text-[11px] text-[var(--color-text-main)]">Live Sandbox:</span>
                  <span className="text-[11px] text-[var(--color-text-muted)]">Click &amp; test directly · Toggle Desktop / Mobile</span>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span>FULLY INTERACTIVE</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
