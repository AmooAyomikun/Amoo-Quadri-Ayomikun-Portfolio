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
import { motion } from 'framer-motion'

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
      title: 'Full-Stack Engineer & AI Enthusiast',
      icon: <Sparkles className="w-4 h-4 shrink-0" />,
      textHtml: (
        <>
          Hi, I'm <strong>Quadri Ayomikun Amoo</strong>. I specialize in architecting scalable software solutions and exploring advanced data analytics. I am deeply fascinated by how intelligent systems can be leveraged to streamline complex engineering workflows. My core mission is bridging the gap between theoretical AI research and robust, production-ready applications.
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
      title: 'Academic Milestones',
      icon: <GraduationCap className="w-4 h-4 shrink-0" />,
      textHtml: (
        <>
          I recently graduated in the top 10% of my cohort with a <strong>B.Sc. in Software Engineering (Second-Class Honors, Upper Division)</strong> from Abiola Ajimobi Technical University. During my studies, I maintained a <strong>4.45 / 5.00 Final CGPA</strong> alongside a perfect <strong>5.0/5.0 Major GPA</strong>, and earned four subject-specific excellence awards (including OS and Data Structures). I also broadened my skill set by completing diplomas in both French and Entrepreneurship.
        </>
      ),
      highlights: ['4.45 / 5.00 CGPA', '5.0/5.0 Major GPA', '4 Subject Excellence Awards']
    },
    {
      num: '03',
      codeTag: '// 03. RESEARCH',
      tabLabel: '03. RESEARCH',
      shortLabel: 'RESEARCH',
      accentColor: '#C4FA4C',
      tabBg: 'bg-[#C4FA4C]',
      tabText: 'text-black',
      title: 'Applied Research',
      icon: <BookOpen className="w-4 h-4 shrink-0" />,
      textHtml: (
        <>
          My academic investigations primarily revolve around Natural Language Processing and software reliability. For my undergraduate thesis, supervised by Dr. J.E.T. Akinsola, I engineered a highly precise location-based recommendation engine. I am constantly looking for ways to apply machine learning to improve software quality assurance and operational workflows.
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
      title: 'Mentorship & Impact',
      icon: <Users className="w-4 h-4 shrink-0" />,
      textHtml: (
        <>
          Knowledge sharing is a cornerstone of my professional ethos. I spent significant time during my undergraduate years breaking down complex topics like Data Structures and Algorithms for over <strong>350 peers</strong> on a weekly basis. In my role as an Academic Support Officer, I also designed and led foundational Python and Mathematics tutorials for over 100 students.
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
      title: 'Next Steps',
      icon: <Award className="w-4 h-4 shrink-0" />,
      textHtml: (
        <>
          Looking ahead, I am actively seeking postgraduate <strong>(MSc/PhD) placements</strong> where I can dive deeper into the mechanics of Artificial Intelligence and advanced Computer Science. I am particularly drawn to research groups that tackle hard engineering problems and strive to create technologies that deliver tangible, positive changes to society.
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
        <div className="sticky top-16 md:top-20 z-40 bg-[var(--color-surface-base)]/95 backdrop-blur-sm py-4 mb-4 sm:mb-8 border-b border-transparent">
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
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
                key={item.num} 
                className="sticky w-full"
                style={{
                  top: `calc(150px + ${idx * 0.8}rem)`, // Safely below header
                  zIndex: 10 + idx
                }}
              >
                <motion.div 
                  whileHover={{ scale: 1.02 }}
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
                </motion.div>
              </motion.div>
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
              <motion.div 
                initial={{ opacity: 0, y: 70 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-150px" }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
                key={item.num}
                className="sticky w-full"
                style={{
                  top: '180px', // Safely below the <About Me /> header
                  zIndex: 10 + idx, // Ensure subsequent cards stack on top
                }}
              >
                {/* Tab Container */}
                <div className="relative w-full h-[46px]">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="absolute top-0 flex items-center justify-center gap-2 px-4 h-[46px] font-mono text-sm font-extrabold tracking-wider uppercase transition-all duration-300 shadow-2xl cursor-pointer"
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
                  </motion.div>
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
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}



