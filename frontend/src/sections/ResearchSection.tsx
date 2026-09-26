import React from 'react'
import { BookOpen, ExternalLink, Activity, FileText, Trophy } from 'lucide-react'
import { portfolioData } from '../content/portfolioData'

export const ResearchSection: React.FC = () => {
  return (
    <section id="research" className="py-12 bg-[var(--color-surface-base)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Research Focus - Redesigned to be unique */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start py-8">
          <div className="md:w-1/3 shrink-0">
            <h2 className="text-3xl font-serif font-bold text-[var(--color-text-main)] relative inline-block">
              Research Focus
              <div className="absolute -bottom-3 left-0 w-12 h-1 bg-[var(--color-primary)] rounded-full"></div>
            </h2>
          </div>
          <div className="md:w-2/3">
            <p className="text-lg text-[var(--color-text-muted)] leading-relaxed font-sans border-l-4 border-[var(--color-border)] pl-6">
              My research focuses on developing intelligent and reliable software systems that address real-world challenges, particularly in applied data science and location-aware recommendation systems. I explore the application of artificial intelligence, machine learning, and software engineering to build scalable systems. My work includes developing geospatial algorithms for recommendation engines, evaluating the performance of machine learning models on financial data, and creating intelligent frameworks to reduce algorithmic bias. Through empirical evaluation and rigorous software engineering practices, my goal is to deploy data-driven solutions that provide measurable improvements in reliability and system intelligence.
            </p>
          </div>
        </div>

        {/* Unified Metrics Panel (Redesigned from 4 separate cards) */}
        <div className="bg-[var(--color-surface-card)] rounded-3xl border border-[var(--color-border)] shadow-sm overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border)]">
            
            <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center hover:bg-[var(--color-surface-elevated)] transition-colors">
              <div className="text-5xl sm:text-6xl font-sans font-black text-[var(--color-primary)] mb-3">2</div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--color-text-main)] uppercase tracking-widest">
                <BookOpen className="w-4 h-4 text-[var(--color-text-muted)]" />
                Publications
              </div>
            </div>

            <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center hover:bg-[var(--color-surface-elevated)] transition-colors">
              <div className="text-5xl sm:text-6xl font-sans font-black text-[var(--color-primary)] mb-3">1</div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--color-text-main)] uppercase tracking-widest">
                <FileText className="w-4 h-4 text-[var(--color-text-muted)]" />
                B.Sc Thesis
              </div>
            </div>

            <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center hover:bg-[var(--color-surface-elevated)] transition-colors">
              <div className="text-5xl sm:text-6xl font-sans font-black text-[var(--color-primary)] mb-3">
                10<span className="text-3xl sm:text-4xl text-[var(--color-primary)]/70">+</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--color-text-main)] uppercase tracking-widest">
                <Activity className="w-4 h-4 text-[var(--color-text-muted)]" />
                ML Models
              </div>
            </div>

            <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center hover:bg-[var(--color-surface-elevated)] transition-colors">
              <div className="text-5xl sm:text-6xl font-sans font-black text-[var(--color-primary)] mb-3">4</div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--color-text-main)] uppercase tracking-widest">
                <Trophy className="w-4 h-4 text-[var(--color-text-muted)]" />
                Awards
              </div>
            </div>

          </div>
        </div>

        {/* Selected Publications -> Featured Academic Works */}
        <div className="pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h3 className="text-2xl font-bold text-[var(--color-text-main)] flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-[var(--color-primary)]" />
              Featured Academic Works
            </h3>
            <a 
              href={portfolioData.personal.googleScholar}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a1a2e] text-white rounded-xl text-sm font-bold hover:bg-[#111122] transition-colors shadow-sm self-start"
            >
              Google Scholar
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="space-y-6">
            {portfolioData.publications.map((pub) => (
              <div key={pub.id} className="bg-[var(--color-surface-card)] rounded-3xl p-6 sm:p-8 border border-[var(--color-border)] shadow-sm group hover:border-[var(--color-primary)]/50 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-gray-800 text-white text-[10px] font-bold tracking-wider rounded-md uppercase">
                      {pub.type}
                    </span>
                    <span className="px-3 py-1 bg-gray-900 text-white text-[10px] font-bold tracking-wider rounded-md uppercase">
                      {pub.status}
                    </span>
                  </div>
                  <span className="text-sm font-mono font-bold text-[var(--color-text-muted)]">
                    {pub.date}
                  </span>
                </div>
                
                <h4 className="text-lg sm:text-xl font-bold text-[var(--color-text-main)] mb-3 leading-snug font-sans">
                  {pub.title}
                </h4>
                
                <p className="text-sm text-[var(--color-text-muted)] mb-5">
                  {pub.authors}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-[var(--color-border)]">
                  <span className="text-sm font-serif italic text-[var(--color-text-muted)]">
                    {pub.journal}
                  </span>
                  
                  {pub.link && (
                    <a 
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider group-hover:underline"
                    >
                      VIEW LINK
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Research and Development Experience -> Academic & Professional Track */}
        <div className="pt-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-[var(--color-primary-light)] rounded-lg border border-[var(--color-primary)]/20">
              <BookOpen className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text-main)]">
              Academic & Professional Track
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. NYSC Research Assistant */}
            <div className="bg-[var(--color-surface-card)] rounded-3xl p-6 sm:p-8 border border-[var(--color-border)] shadow-sm relative overflow-hidden flex flex-col">
              <div className="absolute top-6 right-6 bg-gray-100 dark:bg-gray-800 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md text-gray-700 dark:text-gray-300">
                APPLIED AI RESEARCH
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-5">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-[var(--color-text-main)] mb-1">Research Assistant</h4>
              <p className="text-sm text-[var(--color-text-muted)] mb-4">Delta State University, Asaba</p>
              
              <div className="flex flex-wrap items-center gap-2 mb-6 text-[11px] font-mono font-bold tracking-wider">
                <span className="px-3 py-1.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md flex items-center gap-1.5 text-[var(--color-text-muted)]">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Sept 2025 - Sept 2026
                </span>
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-md">
                  Full Time, NYSC
                </span>
              </div>

              <ul className="space-y-4 flex-grow">
                {portfolioData.research[0].contributions.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
                    <span className="text-gray-300 dark:text-gray-600 mt-1">&gt;</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Thesis Lead */}
            <div className="bg-[var(--color-surface-card)] rounded-3xl p-6 sm:p-8 border border-[var(--color-border)] shadow-sm relative overflow-hidden flex flex-col">
              <div className="absolute top-6 right-6 bg-gray-100 dark:bg-gray-800 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md text-gray-700 dark:text-gray-300">
                THESIS RESEARCH
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-[var(--color-text-main)] mb-1">Research Assistant & Thesis Lead</h4>
              <p className="text-sm text-[var(--color-text-muted)] mb-4">First Technical University</p>
              
              <div className="flex flex-wrap items-center gap-2 mb-6 text-[11px] font-mono font-bold tracking-wider">
                <span className="px-3 py-1.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md flex items-center gap-1.5 text-[var(--color-text-muted)]">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Sept 2024 - April 2025
                </span>
              </div>

              <div className="mb-6 p-4 bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-xl">
                <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-text-muted)] mb-1">THESIS TOPIC</div>
                <div className="text-sm font-bold text-[var(--color-text-main)] leading-snug">
                  {portfolioData.research[1].thesisTitle}
                </div>
              </div>

              <ul className="space-y-4 flex-grow">
                {portfolioData.research[1].contributions.slice(0, 3).map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
                    <span className="text-gray-300 dark:text-gray-600 mt-1">&gt;</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Data Analyst Intern */}
            <div className="bg-[var(--color-surface-card)] rounded-3xl p-6 sm:p-8 border border-[var(--color-border)] shadow-sm relative overflow-hidden flex flex-col">
              <div className="absolute top-6 right-6 bg-gray-100 dark:bg-gray-800 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md text-gray-700 dark:text-gray-300">
                INDUSTRIAL EXPERIENCE
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-5">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-[var(--color-text-main)] mb-1">Data Analyst Intern</h4>
              <p className="text-sm text-[var(--color-text-muted)] mb-4">Coast Research Technology, Ibadan</p>
              
              <div className="flex flex-wrap items-center gap-2 mb-6 text-[11px] font-mono font-bold tracking-wider">
                <span className="px-3 py-1.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md flex items-center gap-1.5 text-[var(--color-text-muted)]">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  April 2023 - Sept 2023
                </span>
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-md">
                  Part Time, SIWES
                </span>
              </div>

              <ul className="space-y-4 flex-grow">
                {portfolioData.experience.find(e => e.id === 'coast-tech-analyst')?.achievements.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
                    <span className="text-gray-300 dark:text-gray-600 mt-1">&gt;</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Full Stack / Frontend Intern */}
            <div className="bg-[var(--color-surface-card)] rounded-3xl p-6 sm:p-8 border border-[var(--color-border)] shadow-sm relative overflow-hidden flex flex-col">
              <div className="absolute top-6 right-6 bg-gray-100 dark:bg-gray-800 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md text-gray-700 dark:text-gray-300">
                INDUSTRIAL EXPERIENCE
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </div>
              <h4 className="text-xl font-bold text-[var(--color-text-main)] mb-1">Frontend / Full-Stack Engineer Intern</h4>
              <p className="text-sm text-[var(--color-text-muted)] mb-4">Circo Digital Academy & CodeAlpha</p>
              
              <div className="flex flex-wrap items-center gap-2 mb-6 text-[11px] font-mono font-bold tracking-wider">
                <span className="px-3 py-1.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md flex items-center gap-1.5 text-[var(--color-text-muted)]">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  April 2026 - Aug 2026
                </span>
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-md">
                  Remote Internship
                </span>
              </div>

              <ul className="space-y-4 flex-grow">
                {portfolioData.experience.find(e => e.id === 'circo-cleanreport')?.achievements.slice(0, 3).map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[var(--color-text-muted)] leading-relaxed">
                    <span className="text-gray-300 dark:text-gray-600 mt-1">&gt;</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Core Research Interests -> Primary Focus Areas */}
        <div className="pt-20 pb-12 text-center">
          <h3 className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-8">
            Primary Focus Areas
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {portfolioData.personal.researchInterests.map((interest, idx) => (
              <div 
                key={idx}
                className="px-6 py-3 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-full text-sm font-sans font-medium text-[var(--color-text-main)] shadow-sm flex items-center gap-2 hover:border-[var(--color-primary)] transition-colors"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] opacity-60"></div>
                {interest}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
