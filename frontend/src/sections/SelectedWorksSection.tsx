import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { portfolioData } from '../content/portfolioData'
import { ProjectCard } from '../components/ProjectCard'
import { AnimatedWords } from '../components/AnimatedWords'

const FEATURED_IDS = [
  'cleanreport-pwa',
  'hotel-recommendation-system',
  'dispatchlane',
]

export const SelectedWorksSection: React.FC = () => {
  const selectedProjects = FEATURED_IDS.map((id) =>
    portfolioData.projects.find((p) => p.id === id)
  ).filter((p): p is NonNullable<typeof p> => Boolean(p))

  return (
    <section
      id="selected-works"
      className="py-10 sm:py-16 bg-[var(--color-surface-base)] text-[var(--color-text-main)] scroll-mt-16 transition-colors duration-200"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-12 md:px-16 lg:px-20">
        <div className="border-t border-[var(--color-border)] pt-8 sm:pt-12">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-primary)] font-semibold">
                // SELECTED SYSTEMS &amp; RESEARCH
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[var(--color-text-main)] mt-1">
                <AnimatedWords text="Featured Engineering & Case Studies" />
              </h2>
            </div>

            <Link
              to="/projects"
              className="self-start sm:self-auto inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-semibold text-[var(--color-primary)] hover:underline group"
            >
              <span>View All {portfolioData.projects.length} Works</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 3 Flagship Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 sm:mb-14">
            {selectedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Editorial Research Ledger — Clean hairline rows for published papers */}
          <div className="border-t border-[var(--color-border)] pt-7 sm:pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)] font-semibold">
                  Published Academic Papers
                </span>
                <span className="text-xs font-mono text-[var(--color-text-subtle)]">
                  ({portfolioData.publications.length})
                </span>
              </div>
              <Link
                to="/research"
                className="text-xs font-mono text-[var(--color-primary)] hover:underline inline-flex items-center gap-1.5 font-semibold"
              >
                <span>Explore Research Archive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
              {portfolioData.publications.map((pub) => (
                <div
                  key={pub.id}
                  className="py-4 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-6 group"
                >
                  <div className="space-y-1 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-[var(--color-text-subtle)]">
                      <span className="text-[var(--color-primary)] font-semibold uppercase">
                        {pub.type}
                      </span>
                      {pub.journal && (
                        <>
                          <span>·</span>
                          <span>{pub.journal}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>{pub.date}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-serif font-bold text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors leading-snug">
                      {pub.link ? (
                        <a
                          href={pub.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {pub.title}
                        </a>
                      ) : (
                        <span>{pub.title}</span>
                      )}
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] font-sans">
                      {pub.authors}
                    </p>
                  </div>

                  {pub.link && (
                    <div className="flex items-center gap-4 shrink-0 self-start md:self-center">
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--color-primary)] hover:underline"
                      >
                        <span>Read on {pub.journal || 'Zenodo'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
