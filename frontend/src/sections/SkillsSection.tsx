import React from 'react'
import { Brain, Code2, Database, Microscope, Terminal, CheckCircle2 } from 'lucide-react'

export const SkillsSection: React.FC = () => {
  const domains = [
    {
      index: '01',
      title: 'Artificial Intelligence & Data Science',
      icon: Brain,
      color: '#64ffda',
      focus: 'Recommender systems, predictive modeling, algorithmic fairness, and LLM applications.',
      groups: [
        {
          label: 'Languages & Core',
          skills: [
            { name: 'Python', level: 'Expert' },
            { name: 'SQL', level: 'Advanced' }
          ]
        },
        {
          label: 'Machine Learning',
          skills: [
            { name: 'Scikit-Learn' },
            { name: 'Ensemble Models' },
            { name: 'Predictive Analytics' },
            { name: 'Model Evaluation' }
          ]
        },
        {
          label: 'Data & Applied AI',
          skills: [
            { name: 'Pandas & NumPy' },
            { name: 'Generative AI (LLMs)' },
            { name: 'Prompt Engineering & RAG' },
            { name: 'NLP / Text Mining' }
          ]
        }
      ],
      appliedNote: 'Built 10 financial ML predictive models (+25% accuracy boost); completed B.Sc. thesis in location-based recommendation heuristics; co-authored open-access preprint on reducing algorithmic bias.'
    },
    {
      index: '02',
      title: 'Full-Stack & Web Engineering',
      icon: Code2,
      color: '#38bdf8',
      focus: 'Responsive web applications, Progressive Web Apps (PWA) with offline sync, and modular REST services.',
      groups: [
        {
          label: 'Frontend Core',
          skills: [
            { name: 'React', level: 'Expert' },
            { name: 'TypeScript', level: 'Advanced' },
            { name: 'JavaScript (ES6+)', level: 'Expert' }
          ]
        },
        {
          label: 'Styling & UI',
          skills: [
            { name: 'Tailwind CSS' },
            { name: 'HTML5 & CSS3', level: 'Expert' },
            { name: 'Responsive Layouts' }
          ]
        },
        {
          label: 'Backend & APIs',
          skills: [
            { name: 'Node.js', level: 'Advanced' },
            { name: 'Express.js', level: 'Advanced' },
            { name: 'Django REST API' },
            { name: 'RESTful Architecture' }
          ]
        }
      ],
      appliedNote: 'Sole frontend engineer for CleanReport PWA with offline IndexedDB queueing; developed DispatchLane logistics tracker; built full-stack applications with DRY, component-driven architectures.'
    },
    {
      index: '03',
      title: 'Database Systems & Architecture',
      icon: Database,
      color: '#a78bfa',
      focus: 'Relational database architecture, cloud storage persistence, API contract testing, and version control.',
      groups: [
        {
          label: 'Databases & ORM',
          skills: [
            { name: 'PostgreSQL', level: 'Advanced' },
            { name: 'MySQL', level: 'Advanced' },
            { name: 'Supabase & Prisma' }
          ]
        },
        {
          label: 'Dev & Build Tooling',
          skills: [
            { name: 'Git & GitHub', level: 'Expert' },
            { name: 'Postman API Testing' },
            { name: 'Vite Bundler' },
            { name: 'Monorepo & CI Basics' }
          ]
        }
      ],
      appliedNote: 'Designed normalized schemas, optimized multi-table join indexing, built secure RESTful endpoints, and managed Git multi-branch collaborative repositories.'
    },
    {
      index: '04',
      title: 'Empirical Research & Methodology',
      icon: Microscope,
      color: '#f59e0b',
      focus: 'Quantitative software evaluation, statistical testing, visual data storytelling, and academic documentation.',
      groups: [
        {
          label: 'Research & QA Methods',
          skills: [
            { name: 'Statistical Analysis', level: 'Advanced' },
            { name: 'Empirical Testing' },
            { name: 'Software Quality & QA', level: 'Advanced' },
            { name: 'Reliability Audits' }
          ]
        },
        {
          label: 'Visualization & Writing',
          skills: [
            { name: 'Power BI & Tableau' },
            { name: 'Matplotlib' },
            { name: 'Technical Documentation', level: 'Expert' },
            { name: 'Peer-Reviewed Writing' }
          ]
        }
      ],
      appliedNote: 'NYSC CS Research Assistant under Assoc. Prof. Jude Sinebe; 4 First-Place Departmental Awards (OS I, HCI, SE Practice, Data Structures); comprehensive academic thesis documentation.'
    }
  ]

  return (
    <section id="skills" className="w-full mt-12 sm:mt-20 pt-10 sm:pt-16 border-t border-[var(--color-border)] scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
            <span className="text-xs font-mono font-bold tracking-wider text-[var(--color-primary)] uppercase">
              Technical Stack &amp; Competencies
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-text-main)] tracking-tight">
            Core Technical Tooling
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1.5 max-w-2xl font-sans">
            A structured breakdown of languages, frameworks, database architectures, and empirical research methodologies applied across production platforms and academic publications.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 font-mono text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-card)] border border-[var(--color-border)] px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <Terminal className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <span>4 Domain Clusters</span>
        </div>
      </div>

      {/* 4 Clean Domain Panels (2x2 Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {domains.map((domain) => {
          const Icon = domain.icon
          return (
            <div
              key={domain.index}
              className="bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)]/40 rounded-2xl p-4 sm:p-7 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md"
            >
              <div>
                {/* Header: Index, Title & Category Icon */}
                <div className="flex items-start justify-between gap-3 pb-4 mb-4 border-b border-[var(--color-border)]">
                  <div>
                    <span 
                      style={{ color: domain.color }}
                      className="text-xs font-mono font-bold tracking-wider block mb-1"
                    >
                      {domain.index} // DOMAIN
                    </span>
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-[var(--color-text-main)] leading-snug">
                      {domain.title}
                    </h3>
                  </div>
                  <div 
                    style={{ backgroundColor: `${domain.color}15`, color: domain.color, borderColor: `${domain.color}35` }}
                    className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0"
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Focus Scope */}
                <p className="text-xs sm:text-[13px] text-[var(--color-text-muted)] leading-relaxed font-sans mb-5">
                  {domain.focus}
                </p>

                {/* Skill Groups */}
                <div className="space-y-4 mb-6">
                  {domain.groups.map((group, gIdx) => (
                    <div key={gIdx}>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-subtle)] block mb-2 font-semibold">
                        {group.label}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {group.skills.map((skill, sIdx) => (
                          <div
                            key={sIdx}
                            className="inline-flex items-center gap-1.5 bg-[var(--color-surface-base)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)]/30 px-2.5 py-1 rounded-lg text-xs font-mono transition-colors"
                          >
                            <span className="text-[var(--color-text-main)] font-medium">
                              {skill.name}
                            </span>
                            {skill.level && (
                              <span 
                                style={{ 
                                  backgroundColor: skill.level === 'Expert' ? 'rgba(100, 255, 218, 0.1)' : 'rgba(56, 189, 248, 0.1)',
                                  color: skill.level === 'Expert' ? '#64ffda' : '#38bdf8',
                                  borderColor: skill.level === 'Expert' ? 'rgba(100, 255, 218, 0.25)' : 'rgba(56, 189, 248, 0.25)'
                                }}
                                className="text-[9px] uppercase px-1.5 py-0.2 rounded border font-bold"
                              >
                                {skill.level}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applied Evidence Footer */}
              <div className="pt-4 border-t border-[var(--color-border)]/80 bg-[var(--color-surface-base)]/50 -mx-4 -mb-4 sm:-mx-7 sm:-mb-7 p-3.5 sm:p-5 rounded-b-2xl">
                <div className="flex items-start gap-2 text-[11px] text-[var(--color-text-muted)] leading-relaxed font-sans">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0 mt-0.5" />
                  <span><strong className="text-[var(--color-text-main)] font-mono font-medium">Applied Track:</strong> {domain.appliedNote}</span>
                </div>
              </div>

            </div>
          )
        })}
      </div>
    </section>
  )
}
