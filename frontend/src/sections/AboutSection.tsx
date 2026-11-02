import React from 'react'
import { GraduationCap, Award, BookOpen, CheckCircle2, Trophy } from 'lucide-react'
import { portfolioData } from '../content/portfolioData'
import { SectionHeader } from '../components/SectionHeader'
import { Badge } from '../components/Badge'

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="w-full mt-8">
      <SectionHeader
        eyebrow="Academic Background & Statement of Purpose"
        title="Bridging Theoretical Excellence with Applied Engineering"
        description="A dedicated scholar committed to building a long-term research and professional career at the intersection of software engineering, artificial intelligence, and intelligent computing."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Statement of Purpose */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs">
            <h3 className="text-xl font-serif font-bold text-[var(--color-text-main)] mb-3">
              Statement of Purpose &amp; Career Trajectory
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4 font-sans">
              I am a highly motivated Software Engineering graduate with a strong academic record (4.45/5.00 Final CGPA, Top 10% of cohort). I am passionate about applying software engineering principles and emerging technologies to develop practical solutions to real-world problems.
            </p>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4 font-sans">
              My ongoing research in Computer Science enables me to deepen my knowledge of software quality, artificial intelligence, data-driven systems, and advanced computing. As a NYSC Research Assistant under Assoc. Prof. Jude Sinebe, I focus on empirical validation, machine learning, and software reliability.
            </p>
            <div className="pt-4 border-t border-[var(--color-border)] flex flex-wrap gap-2">
              <Badge variant="primary">5.0/5.0 Peak Term GPA</Badge>
              <Badge variant="accent">Top 10% Class Rank</Badge>
              <Badge variant="outline">AI &amp; SE Scholar</Badge>
            </div>
          </div>
        </div>

        {/* Research Interests Tags */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs">
            <h3 className="text-base font-serif font-bold text-[var(--color-text-main)] mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[var(--color-primary)]" />
              <span>Primary Research Interests</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {portfolioData.personal.researchInterests.map((interest, idx) => (
                <Badge key={idx} variant="subtle" size="sm">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* CTA to Education Page */}
          <div className="p-6 rounded-2xl bg-[var(--color-primary-light)] border border-[var(--color-primary)]/30 text-center">
            <GraduationCap className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-3" />
            <h3 className="text-sm font-bold text-[var(--color-primary)] mb-2">Detailed Academic History</h3>
            <p className="text-xs text-[var(--color-primary)]/80 mb-4 font-sans">View full details of my degrees, diplomas, and academic awards.</p>
            <a
              href="/education"
              className="inline-block px-4 py-2 bg-[var(--color-primary)] text-[#0a192f] text-xs font-mono font-bold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors shadow-xs"
            >
              Explore Education Deck →
            </a>
          </div>

        </div>

      </div>
    </section>
  )
}
