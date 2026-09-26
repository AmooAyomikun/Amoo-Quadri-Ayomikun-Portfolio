import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Code } from 'lucide-react'
import { portfolioData } from '../content/portfolioData'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Badge } from '../components/Badge'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const project = portfolioData.projects.find(p => p.id === id)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!project) {
    return (
      <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-serif font-bold mb-4">Project Not Found</h1>
        <Link to="/projects" className="text-[var(--color-primary)] hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)] flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12">
            <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-mono text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to Projects
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            
            {/* Left Column: Text Description */}
            <div className="lg:col-span-5 flex flex-col items-start sticky top-32 h-fit">
              <div className="flex items-center gap-3 mb-6">
                <Badge variant="primary">{project.category.replace('-', ' ').toUpperCase()}</Badge>
                <span className="text-sm font-mono text-[var(--color-text-muted)]">{project.period}</span>
              </div>

              <h4 className="text-sm font-bold tracking-widest uppercase text-[var(--color-text-muted)] mb-2">The product</h4>
              <h1 className="text-5xl md:text-6xl font-sans font-extrabold text-[var(--color-text-main)] mb-8 leading-tight">
                What we built
              </h1>

              <div className="prose prose-lg dark:prose-invert prose-p:text-[var(--color-text-muted)] prose-p:leading-relaxed max-w-none mb-10">
                <p className="text-xl font-medium text-[var(--color-text-main)] mb-6">
                  {project.summary}
                </p>
                <p>
                  {project.description}
                </p>
              </div>

              <div className="mb-10 w-full">
                <h4 className="text-sm font-bold tracking-widest uppercase text-[var(--color-text-muted)] mb-4">Core Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <Badge key={idx} variant="subtle" size="sm" className="bg-[var(--color-surface-elevated)] border-[var(--color-border)]">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
                  >
                    Visit Live Demo <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[var(--color-surface-card)] text-[var(--color-text-main)] border border-[var(--color-border)] rounded-xl font-medium hover:border-[var(--color-primary)] transition-colors"
                  >
                    Source Code <Code className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Image Display */}
            <div className="lg:col-span-7">
              <div className="w-full h-full min-h-[60vh] rounded-3xl overflow-hidden relative border border-[var(--color-border)] shadow-2xl bg-[var(--color-surface-card)]">
                {project.demoUrl && project.previewType !== 'image' ? (
                  <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <iframe 
                      src={`http://localhost:5000/api/proxy?url=${encodeURIComponent(project.demoUrl)}`}
                      title={project.title} 
                      className="absolute top-0 left-0 w-[150%] h-[150%] origin-top-left scale-[0.66] border-none"
                      allowFullScreen
                    />
                  </div>
                ) : project.imageUrl ? (
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="absolute -top-[10%] -bottom-[8%] left-0 right-0 w-full h-[118%] max-w-none object-cover object-center" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-br from-[var(--color-surface-elevated)] to-[var(--color-surface-card)]">
                    <h3 className="text-3xl font-serif font-bold text-[var(--color-text-muted)] opacity-50">{project.title}</h3>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
