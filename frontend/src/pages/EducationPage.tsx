import React, { useEffect, useRef } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { portfolioData } from '../content/portfolioData'
import { BookOpen, GraduationCap, Award, MapPin, Calendar, Medal } from 'lucide-react'
import gsap from 'gsap'

export default function EducationPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-edu-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const getIcon = (degree: string) => {
    if (degree.includes('Secondary')) return <BookOpen className="w-6 h-6 text-blue-500" />
    if (degree.includes('Diploma')) return <Medal className="w-6 h-6 text-amber-500" />
    return <GraduationCap className="w-6 h-6 text-[var(--color-primary)]" />
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)]">
      <Navbar />
      
      <main ref={containerRef} className="pt-28 pb-20">
        
        {/* Page Header */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center gsap-edu-card">
          <span className="text-xs font-mono uppercase tracking-widest font-semibold text-[var(--color-primary)] mb-4 block">
            Academic Background
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[var(--color-text-main)] tracking-tight mb-6">
            Education History
          </h1>
          <p className="text-base sm:text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
            A comprehensive overview of my academic journey, degrees, and scholarly achievements.
          </p>
        </div>

        {/* Education Timeline */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Vertical Timeline Line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-[var(--color-border)] to-transparent hidden sm:block"></div>

          <div className="space-y-12">
            {portfolioData.education.map((edu, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div 
                  key={idx} 
                  className={`gsap-edu-card relative flex flex-col sm:flex-row items-center gap-8 group ${isEven ? 'sm:flex-row-reverse' : ''}`}
                >
                  
                  {/* Timeline Dot */}
                  <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[var(--color-surface-base)] border-[3px] border-[var(--color-primary)] items-center justify-center z-10 shadow-sm transition-transform group-hover:scale-125">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                  </div>

                  {/* Card Content */}
                  <div className={`w-full sm:w-[calc(50%-2rem)] flex ${isEven ? 'justify-start' : 'justify-end'}`}>
                    <div className="w-full bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 hover:border-[var(--color-primary)]/50 transition-all duration-300 shadow-sm hover:shadow-lg relative overflow-hidden">
                      
                      {/* Top Header: Logo + School Name */}
                      <div className="flex items-start gap-4 mb-5 border-b border-[var(--color-border)] pb-5">
                        {edu.imageUrl ? (
                          <img 
                            src={edu.imageUrl} 
                            alt={edu.institution} 
                            className="w-14 h-14 rounded-2xl object-cover border border-[var(--color-border)] shrink-0" 
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                            {getIcon(edu.degree)}
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-bold text-[var(--color-text-main)] leading-snug font-sans">
                            {edu.institution}
                          </h3>
                          <div className="flex items-center gap-2 mt-1.5 text-xs font-mono font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {edu.period}</span>
                            {edu.location && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-[var(--color-border)]"></span>
                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {edu.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Degree & Academic Standing */}
                      <div className="mb-5">
                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-text-main)] mb-2">
                          {edu.degree}
                        </h2>
                        
                        {(edu.finalCgpa || edu.honors || edu.majorGpa) && (
                          <div className="flex flex-col gap-1 mt-3">
                            {edu.finalCgpa && <span className="text-sm font-bold text-[var(--color-primary)]">CGPA: {edu.finalCgpa}</span>}
                            {edu.honors && <span className="text-sm font-semibold text-[var(--color-text-main)]">{edu.honors}</span>}
                            {edu.majorGpa && <span className="text-xs text-[var(--color-text-muted)]">Major GPA: {edu.majorGpa}</span>}
                          </div>
                        )}
                      </div>

                      {/* Highlights & Awards as sleek bullets/badges */}
                      <div className="space-y-4">
                        {edu.awards && edu.awards.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {edu.awards.map((award, i) => (
                              <span key={`award-${i}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 text-xs font-bold">
                                <Award className="w-3.5 h-3.5" />
                                {award}
                              </span>
                            ))}
                          </div>
                        )}

                        <ul className="space-y-2">
                          {edu.highlights.map((highlight, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-muted)] leading-relaxed">
                              <span className="text-[var(--color-primary)] mt-1 font-bold">&gt;</span>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
