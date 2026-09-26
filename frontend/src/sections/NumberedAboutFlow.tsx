import React, { useEffect, useRef } from 'react'
import { Badge } from '../components/Badge'
import { Award, BookOpen, GraduationCap, Users, Sparkles, ArrowDownRight, ArrowUpRight, Code } from 'lucide-react'
import gsap from 'gsap'

export const NumberedAboutFlow: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      // Animate left cards from left
      gsap.fromTo(
        '.gsap-flow-left',
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          stagger: 0.2,
          ease: 'power3.out'
        }
      )
      // Animate right cards from right
      gsap.fromTo(
        '.gsap-flow-right',
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          stagger: 0.2,
          ease: 'power3.out'
        }
      )
      // Animate center card from bottom
      gsap.fromTo(
        '.gsap-flow-center',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out'
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const items = [
    {
      num: '01',
      codeTag: '// 01. IDENTITY',
      side: 'left',
      title: 'Software Engineer & Researcher',
      icon: <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />,
      textHtml: (
        <>
          I am <strong>Quadri Ayomikun Amoo</strong>, a software engineer and researcher interested in the intersection of <strong>artificial intelligence</strong>, <strong>software engineering</strong>, <strong>intelligent computing systems</strong>, and <strong>data analytics</strong>. My work focuses on using AI to solve practical software-centric problems and developing intelligent systems that are <strong>practical, reliable, and accessible</strong>.
        </>
      ),
      highlights: ['Artificial Intelligence', 'Software Engineering', 'Intelligent Systems']
    },
    {
      num: '02',
      codeTag: '// 02. ACADEMICS',
      side: 'right',
      title: 'Academic Excellence',
      icon: <GraduationCap className="w-5 h-5 text-[var(--color-primary)]" />,
      textHtml: (
        <>
          I hold a <strong>Bachelor of Science in Software Engineering</strong> with <strong>First-Class Honors (5.0/5.0 Major GPA, 4.45/5.00 Final CGPA)</strong> from First Technical University (now Abiola Ajimobi Technical University), graduating in the <strong>Top 10% of my class</strong>. I was recognized with <strong>4 Best Graduating Student Subject Honors</strong> in Operating Systems I, HCI, Software Engineering Practice, and Data Structures. Additionally, I hold <strong>Diplomas in French and Entrepreneurship (Upper Credit)</strong>.
        </>
      ),
      highlights: ['5.0/5.0 Major GPA', 'Top 10% Class Honors', '4 Subject Excellence Awards']
    },
    {
      num: '03',
      codeTag: '// 03. RESEARCH',
      side: 'left',
      title: 'Research Focus & Systems',
      icon: <BookOpen className="w-5 h-5 text-[var(--color-primary)]" />,
      textHtml: (
        <>
          My research interests include <strong>AI for Software Engineering</strong>, <strong>intelligent software systems</strong>, <strong>Natural Language Processing</strong>, and <strong>software quality & reliability</strong>. Previously, under <strong>Dr. J.E.T. Akinsola</strong>, I developed a <strong>location-based recommendation and reservation system</strong> for my B.Sc. thesis, achieving high recommendation precision and seamless operational workflows.
        </>
      ),
      highlights: ['Applied Data Science', 'Recommender Systems', 'Software Quality & QA']
    },
    {
      num: '04',
      codeTag: '// 04. LEADERSHIP',
      side: 'right',
      title: 'Community Leadership & Teaching',
      icon: <Users className="w-5 h-5 text-[var(--color-primary)]" />,
      textHtml: (
        <>
          Beyond research and engineering, I am passionate about mentoring the next generation of software engineers. I tutored <strong>~350 undergraduate computer science students weekly</strong> in <strong>Algorithms, Data Structures, and Programming</strong> at First Technical University. Additionally, as <strong>NASSA Asst. Academic Support Officer</strong>, I taught 100 students Mathematics and Python logic.
        </>
      ),
      highlights: ['350+ Students Tutored Weekly', 'NASSA Academic Support Officer', 'Algorithms & Data Structures']
    },
    {
      num: '05',
      codeTag: '// 05. VISION',
      side: 'center',
      title: 'Looking Forward',
      icon: <Award className="w-5 h-5 text-[var(--color-primary)]" />,
      textHtml: (
        <>
          I am interested in <strong>MSc and PhD research opportunities</strong> in <strong>Artificial Intelligence, Software Engineering, and Computer Science</strong>—particularly projects combining intelligent software systems with practical engineering challenges and real-world societal impact.
        </>
      ),
      highlights: ['MSc & PhD Research', 'Postgraduate Scholarships', 'Intelligent Systems Research'],
      tags: ['ARTIFICIAL INTELLIGENCE', 'SOFTWARE ENGINEERING']
    }
  ]

  return (
    <section ref={containerRef} className="py-14 sm:py-16 bg-[var(--color-surface-base)] relative overflow-hidden">
      
      {/* Background Decorative Ambient Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(var(--color-primary)_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Developer Styled Section Header: <About Me /> */}
        <div className="text-center md:text-left mb-14 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--color-surface-card)] text-[var(--color-primary)] text-xs font-mono font-bold border border-[var(--color-border)] mb-3">
            <Code className="w-3.5 h-3.5" />
            <span>developer_bio.ts</span>
          </div>
          
          <h2 className="text-4xl sm:text-6xl font-mono font-bold text-[var(--color-text-main)] tracking-tight">
            &lt;About Me /&gt;
          </h2>
          
          <p className="text-sm sm:text-base text-[var(--color-text-muted)] mt-4 leading-relaxed font-sans">
            An interconnected overview of my academic foundation, software engineering focus, mentorship, and career vision.
          </p>
        </div>

        {/* Interwoven Timeline Container */}
        <div className="relative">
          
          {/* Central Connecting Thread Spine (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-16 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[var(--color-primary)]/40 via-[var(--color-primary)]/20 to-transparent -z-10" />

          <div className="space-y-12 md:space-y-16">
            {items.map((item, idx) => {
              const isLeft = item.side === 'left'
              const isRight = item.side === 'right'
              const isCenter = item.side === 'center'

              const cardAnimClass = isLeft
                ? 'gsap-flow-left'
                : isRight
                ? 'gsap-flow-right'
                : 'gsap-flow-center'

              return (
                <div key={idx} id={`about-card-${idx}`} className={`relative flex flex-col ${cardAnimClass}`}>
                  
                  {/* Container Alignment for Interwoven Left/Right Grid */}
                  <div
                    className={`w-full ${
                      isLeft
                        ? 'md:w-[54%] md:mr-auto md:pr-6'
                        : isRight
                        ? 'md:w-[54%] md:ml-auto md:pl-6'
                        : 'md:w-[88%] md:mx-auto'
                    }`}
                  >
                    
                    {/* Main Interwoven Card */}
                    <div className="group relative p-7 sm:p-9 bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-1.5">
                      
                      {/* Code Tag Header Line */}
                      <div className="text-xs font-mono text-[var(--color-primary)] font-bold mb-3 tracking-wider">
                        {item.codeTag}
                      </div>

                      {/* Decorative Linking Connector Node on Desktop */}
                      {!isCenter && idx < items.length - 1 && (
                        <button
                          onClick={() => {
                            const nextCard = document.getElementById(`about-card-${idx + 1}`)
                            if (nextCard) {
                              nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
                            }
                          }}
                          className={`hidden md:flex absolute top-1/2 -translate-y-1/2 items-center justify-center w-8 h-8 rounded-full bg-[var(--color-surface-card)] border-2 border-[var(--color-primary)] text-[var(--color-primary)] shadow-md z-20 transition-transform duration-300 hover:scale-125 cursor-pointer hover:bg-[var(--color-primary)] hover:text-white ${
                            isLeft
                              ? '-right-10 transform translate-x-1/2'
                              : '-left-10 transform -translate-x-1/2'
                          }`}
                          aria-label="Scroll to next section"
                        >
                          <ArrowDownRight className="w-4 h-4" />
                        </button>
                      )}

                      {/* Header with Large Number Badge */}
                      <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-[var(--color-border)]">
                        <div className="flex items-center gap-4">
                          <span className="font-mono font-extrabold text-3xl sm:text-4xl text-[var(--color-primary)] tracking-tight">
                            {item.num}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors">
                            {item.title}
                          </h3>
                        </div>
                        <div className="p-3 rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)] shrink-0 border border-[var(--color-primary)]/15">
                          {item.icon}
                        </div>
                      </div>

                      {/* Body Content */}
                      <div className="text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed mb-6 font-sans">
                        {item.textHtml}
                      </div>

                      {/* Highlights & Tags */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--color-border)]/60">
                        {item.highlights.map((h, i) => (
                          <Badge key={i} variant={i === 0 ? 'primary' : 'subtle'} size="sm">
                            {h}
                          </Badge>
                        ))}
                        {item.tags?.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-3.5 py-1.5 rounded-full bg-[var(--color-primary)] text-[#111111] text-xs font-mono font-bold tracking-wider"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                    </div>

                  </div>

                </div>
              )
            })}
          </div>

        </div>

      </div>

    </section>
  )
}


