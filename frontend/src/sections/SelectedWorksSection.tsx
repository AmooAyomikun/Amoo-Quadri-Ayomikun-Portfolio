import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { portfolioData } from '../content/portfolioData'
import { ProjectCard } from '../components/ProjectCard'
import { AnimatedWords } from '../components/AnimatedWords'

const DESKTOP_FEATURED_IDS = [
  'cleanreport-pwa',
  'hotel-recommendation-system',
  'dispatchlane',
]

export const SelectedWorksSection: React.FC = () => {
  const selectedProjects = DESKTOP_FEATURED_IDS.map((id) =>
    portfolioData.projects.find((p) => p.id === id)
  ).filter((p): p is NonNullable<typeof p> => Boolean(p))

  const totalSlides = selectedProjects.length
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % totalSlides)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    if (deltaX < -35) {
      nextSlide()
    } else if (deltaX > 35) {
      prevSlide()
    }
    touchStartX.current = null
  }

  // Compute circular relative offset (-1 = left peek, 0 = center active, 1 = right peek)
  const getRelativeOffset = (index: number) => {
    let diff = index - activeIndex
    if (diff > totalSlides / 2) diff -= totalSlides
    if (diff < -totalSlides / 2) diff += totalSlides
    return diff
  }

  return (
    <section
      id="selected-works"
      className="py-10 sm:py-16 bg-[var(--color-surface-base)] text-[var(--color-text-main)] scroll-mt-16 transition-colors duration-200 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-12 md:px-16 lg:px-20">
        <div className="border-t border-[var(--color-border)] pt-8 sm:pt-12">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-10 text-center sm:text-left items-center sm:items-end">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-primary)] font-semibold">
                // SELECTED SYSTEMS &amp; RESEARCH
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[var(--color-text-main)] mt-1">
                <AnimatedWords text="Featured Projects" />
              </h2>
            </div>

            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-semibold text-[var(--color-primary)] hover:underline group"
            >
              <span>View All {portfolioData.projects.length} Works</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* ===================================================================
              MOBILE & SMALLER SCREENS: Layered Peek / Coverflow Carousel
          =================================================================== */}
          <div className="lg:hidden mb-10">
            <div
              className="relative w-full h-[310px] sm:h-[350px] flex items-center justify-center select-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {selectedProjects.map((project, idx) => {
                const offset = getRelativeOffset(idx)
                const isCenter = offset === 0
                const isLeft = offset === -1
                const isRight = offset === 1
                const isVisible = isCenter || isLeft || isRight

                if (!isVisible) return null

                let transformClass = 'translate-x-0 scale-100 z-20 opacity-100'
                if (isLeft) {
                  transformClass =
                    '-translate-x-[18%] sm:-translate-x-[24%] scale-[0.88] z-10 opacity-45 cursor-pointer'
                } else if (isRight) {
                  transformClass =
                    'translate-x-[18%] sm:translate-x-[24%] scale-[0.88] z-10 opacity-45 cursor-pointer'
                }

                return (
                  <div
                    key={project.id}
                    onClick={() => {
                      if (isLeft) prevSlide()
                      if (isRight) nextSlide()
                    }}
                    aria-hidden={!isCenter}
                    className={`absolute w-[78%] max-w-[295px] sm:max-w-[340px] rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xl overflow-hidden transition-all duration-300 ease-out ${transformClass}`}
                  >
                    {/* Top Project Visual */}
                    <div className="relative aspect-[4/3] w-full bg-[var(--color-surface-elevated)] overflow-hidden border-b border-[var(--color-border)]">
                      {project.imageUrl ? (
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          loading="lazy"
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-mono text-xs text-[var(--color-text-subtle)]">
                          {project.title}
                        </div>
                      )}
                    </div>

                    {/* Bottom Card Bar: Title + Concise Subtitle on Left, Visit Pill on Right */}
                    <div className="p-4 bg-[var(--color-surface-card)] flex items-center justify-between gap-3">
                      <Link
                        to={`/projects/${project.id}`}
                        tabIndex={isCenter ? 0 : -1}
                        className="min-w-0 flex-1 group/title"
                        onClick={(e) => {
                          if (!isCenter) e.preventDefault()
                        }}
                      >
                        <h3 className="text-sm sm:text-base font-sans font-bold text-[var(--color-text-main)] group-hover/title:text-[var(--color-primary)] transition-colors truncate">
                          {project.title}
                        </h3>
                        <p className="text-xs text-[var(--color-text-muted)] truncate mt-0.5">
                          {project.subtitle || project.summary}
                        </p>
                      </Link>

                      {project.demoUrl ? (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={isCenter ? 0 : -1}
                          onClick={(e) => {
                            if (!isCenter) e.preventDefault()
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[var(--color-text-main)] text-[var(--color-surface-base)] font-sans text-xs font-bold inline-flex items-center gap-1.5 shrink-0 shadow-xs hover:opacity-90 transition-opacity"
                        >
                          <span>Visit</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <Link
                          to={`/projects/${project.id}`}
                          tabIndex={isCenter ? 0 : -1}
                          onClick={(e) => {
                            if (!isCenter) e.preventDefault()
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[var(--color-text-main)] text-[var(--color-surface-base)] font-sans text-xs font-bold inline-flex items-center gap-1.5 shrink-0 shadow-xs hover:opacity-90 transition-opacity"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination Indicator Dots (• ▬ •) */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {selectedProjects.map((project, idx) => {
                const isActive = idx === activeIndex
                return (
                  <button
                    key={project.id}
                    type="button"
                    aria-label={`View ${project.title}`}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'w-6 bg-[var(--color-text-main)]'
                        : 'w-2 bg-[var(--color-border)] hover:bg-[var(--color-text-muted)]'
                    }`}
                  />
                )
              })}
            </div>
          </div>

          {/* ===================================================================
              DESKTOP (lg+): 3 Flagship Project Cards Grid
          =================================================================== */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8 mb-14">
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
