import React from 'react'
import { Badge } from '../components/Badge'
import {
  Award,
  BookOpen,
  GraduationCap,
  Users,
  Sparkles,
  Code
} from 'lucide-react'

export const NumberedAboutFlow: React.FC = () => {
  const items = [
    {
      num: '01',
      codeTag: '// 01. IDENTITY',
      tabLabel: '01. IDENTITY',
      shortLabel: 'IDENTITY',
      accentColor: '#C4FA4C',
      tabBg: 'bg-[#C4FA4C]',
      tabText: 'text-black',
      title: 'Software Engineer & Researcher',
      icon: <Sparkles className="w-4 h-4 shrink-0" />,
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
      tabLabel: '02. ACADEMICS',
      shortLabel: 'ACADEMICS',
      accentColor: '#C4FA4C',
      tabBg: 'bg-[#C4FA4C]',
      tabText: 'text-black',
      title: 'Academic Excellence',
      icon: <GraduationCap className="w-4 h-4 shrink-0" />,
      textHtml: (
        <>
          I hold a <strong>Bachelor of Science in Software Engineering</strong> with <strong>First-Class Honors (5.0/5.0 Major GPA, 4.45/5.00 Final CGPA)</strong> from Abiola Ajimobi Technical University, graduating in the <strong>Top 10% of my class</strong>. I was recognized with <strong>4 Best Graduating Student Subject Honors</strong> in Operating Systems I, HCI, Software Engineering Practice, and Data Structures. Additionally, I hold <strong>Diplomas in French and Entrepreneurship (Upper Credit)</strong>.
        </>
      ),
      highlights: ['5.0/5.0 Major GPA', 'Top 10% Class Honors', '4 Subject Excellence Awards']
    },
    {
      num: '03',
      codeTag: '// 03. RESEARCH',
      tabLabel: '03. RESEARCH',
      shortLabel: 'RESEARCH',
      accentColor: '#C4FA4C',
      tabBg: 'bg-[#C4FA4C]',
      tabText: 'text-black',
      title: 'Research Focus & Systems',
      icon: <BookOpen className="w-4 h-4 shrink-0" />,
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
      tabLabel: '04. LEADERSHIP',
      shortLabel: 'LEADERSHIP',
      accentColor: '#C4FA4C',
      tabBg: 'bg-[#C4FA4C]',
      tabText: 'text-black',
      title: 'Community Leadership & Teaching',
      icon: <Users className="w-4 h-4 shrink-0" />,
      textHtml: (
        <>
          Beyond research and engineering, I am passionate about mentoring the next generation of software engineers. I tutored <strong>~350 undergraduate computer science students weekly</strong> in <strong>Algorithms, Data Structures, and Programming</strong>. Additionally, as <strong>NASSA Asst. Academic Support Officer</strong>, I taught 100 students Mathematics and Python logic.
        </>
      ),
      highlights: ['350+ Students Tutored Weekly', 'NASSA Support Officer', 'Algorithms & Data Structures']
    },
    {
      num: '05',
      codeTag: '// 05. VISION',
      tabLabel: '05. VISION',
      shortLabel: 'VISION',
      accentColor: '#C4FA4C',
      tabBg: 'bg-[#C4FA4C]',
      tabText: 'text-black',
      title: 'Looking Forward',
      icon: <Award className="w-4 h-4 shrink-0" />,
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
    <section
      className="relative z-10 bg-[var(--color-surface-base)] pt-4 pb-10 sm:pt-8 sm:pb-16"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(var(--color-primary)_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Developer Styled Section Header: <About Me /> */}
        <div className="sticky top-[70px] z-40 bg-[var(--color-surface-base)]/95 backdrop-blur-sm py-4 -my-4 mb-4 sm:mb-8 border-b border-transparent">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[var(--color-surface-card)] text-[var(--color-primary)] text-[10px] sm:text-xs font-mono font-bold border border-[var(--color-border)] mb-1 shadow-xs">
                <Code className="w-3 h-3" />
                <span>developer_bio.ts</span>
              </div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-mono font-bold text-[var(--color-text-main)] tracking-tight">
                  &lt;About Me /&gt;
                </h2>
                <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[11px] font-mono font-bold border border-[var(--color-primary)]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
                  Scroll to explore
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- MOBILE VERTICAL STACKED CARDS FLOW (< md) --- */}
        <div className="md:hidden flex flex-col gap-[15vh] mt-4">
          {items.map((item, idx) => {
            return (
              <div 
                key={item.num} 
                className="sticky w-full"
                style={{
                  top: `calc(150px + ${idx * 0.8}rem)`, // Safely below header
                  zIndex: 10 + idx
                }}
              >
                <div 
                  className="p-4 sm:p-5 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.4)] flex flex-col transition-all"
                  style={{
                    borderTopWidth: '4px',
                    borderTopColor: item.accentColor,
                    minHeight: '260px'
                  }}
                >
                  {/* Code Tag Header */}
                  <div className="text-xs font-mono font-bold tracking-wider flex items-center justify-between" style={{ color: item.accentColor }}>
                    <span>{item.codeTag}</span>
                    <span className="text-[10px] text-[var(--color-text-subtle)] uppercase">CARD {item.num} / 05</span>
                  </div>

                  {/* Number & Title Header */}
                  <div className="flex items-start justify-between gap-3 pb-2 border-b border-[var(--color-border)] mt-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-extrabold text-2xl shrink-0" style={{ color: item.accentColor }}>
                        {item.num}
                      </span>
                      <h3 className="text-lg font-serif font-bold text-[var(--color-text-main)] leading-tight">
                        {item.title}
                      </h3>
                    </div>
                    <div className="p-1.5 rounded-xl shrink-0 border border-white/10" style={{ backgroundColor: `${item.accentColor}18`, color: item.accentColor }}>
                      {item.icon}
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed font-sans flex-grow mt-3 mb-4">
                    {item.textHtml}
                  </div>

                  {/* Highlights & Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-[var(--color-border)]/60">
                    {item.highlights.map((h, i) => (
                      <Badge key={i} variant={i === 0 ? 'primary' : 'subtle'} size="sm">
                        {h}
                      </Badge>
                    ))}
                    {item.tags?.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider text-black"
                        style={{ backgroundColor: item.accentColor }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* --- DESKTOP STACKED CARDS FLOW (>= md) --- */}
        <div className="hidden md:flex flex-col gap-[20vh] mt-8">
          {items.map((item, idx) => {
            const isFirst = idx === 0
            const slantPx = 22
            const clipPolygon = isFirst
              ? `polygon(0 0, calc(100% - ${slantPx}px) 0, 100% 100%, 0 100%)`
              : `polygon(${slantPx}px 0, calc(100% - ${slantPx}px) 0, 100% 100%, 0 100%)`

            return (
              <div 
                key={item.num}
                className="sticky w-full"
                style={{
                  top: '180px', // Safely below the <About Me /> header
                  zIndex: 10 + idx, // Ensure subsequent cards stack on top
                }}
              >
                {/* Tab Container */}
                <div className="relative w-full h-[46px]">
                  <div
                    className="absolute top-0 flex items-center justify-center gap-2 px-4 h-[46px] font-mono text-sm font-extrabold tracking-wider uppercase transition-all duration-300 shadow-2xl"
                    style={{
                      width: '175px',
                      left: `${idx * 153}px`,
                      clipPath: clipPolygon,
                      backgroundColor: item.accentColor,
                      color: '#000' // Keeping text black for high contrast
                    }}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="truncate">{item.tabLabel}</span>
                  </div>
                </div>

                {/* Card Body Container */}
                <div 
                  className="relative z-20 p-6 md:p-8 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] flex flex-col transition-all duration-300"
                  style={{
                    borderTopWidth: '3px',
                    borderTopColor: item.accentColor,
                    borderTopLeftRadius: idx === 0 ? '0' : '1rem', // Sharp corner only for the first card matching its tab
                    minHeight: '280px' // Tightly fit so bottom tags are visible on laptop screens
                  }}
                >
                  <div
                    className="text-xs font-mono font-bold tracking-wider flex items-center justify-between"
                    style={{ color: item.accentColor }}
                  >
                    <span>{item.codeTag}</span>
                    <span className="text-[10px] font-mono text-[var(--color-text-subtle)] uppercase">
                      CARD {item.num} / 05
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-2 mb-4 pb-3 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-3">
                      <span
                        className="font-mono font-extrabold text-4xl tracking-tight shrink-0"
                        style={{ color: item.accentColor }}
                      >
                        {item.num}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-text-main)] leading-tight">
                        {item.title}
                      </h3>
                    </div>
                    <div
                      className="p-2.5 rounded-2xl shrink-0 border border-white/10"
                      style={{
                        backgroundColor: `${item.accentColor}18`,
                        color: item.accentColor
                      }}
                    >
                      {item.icon}
                    </div>
                  </div>

                  <div className="text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed font-sans flex-grow mb-6">
                    {item.textHtml}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[var(--color-border)]/60">
                    {item.highlights.map((h, i) => (
                      <Badge key={i} variant={i === 0 ? 'primary' : 'subtle'} size="sm">
                        {h}
                      </Badge>
                    ))}
                    {item.tags?.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider"
                        style={{
                          backgroundColor: item.accentColor,
                          color: '#000000'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}



