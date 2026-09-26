import React from 'react'
import { GraduationCap, Award, BookOpen, CheckCircle2, Trophy } from 'lucide-react'
import { portfolioData } from '../content/portfolioData'
import { SectionHeader } from '../components/SectionHeader'
import { Badge } from '../components/Badge'

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-[var(--color-surface-card)] border-y border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          eyebrow="Academic Background & Statement of Purpose"
          title="Bridging Theoretical Excellence with Applied Engineering"
          description="A dedicated scholar committed to building a long-term research and professional career at the intersection of software engineering, artificial intelligence, and intelligent computing."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Statement of Purpose */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-xl bg-[var(--color-surface-base)] border border-[var(--color-border)]">
              <h3 className="text-xl font-serif font-bold text-[var(--color-text-main)] mb-3">
                Statement of Purpose & Career Trajectory
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
                I am a highly motivated Software Engineering graduate with a strong academic record (4.45/5.00 Final CGPA). I am passionate about applying software engineering principles and emerging technologies to develop practical solutions to real-world problems.
              </p>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
                Pursuing my MSc in Computer Science at Delta State University enables me to deepen my knowledge of software quality, artificial intelligence, data-driven systems, and advanced computing. As a NYSC Research Assistant under Prof. Jude Sinebe, I focus on empirical validation, machine learning, and software reliability.
              </p>
              <div className="pt-4 border-t border-[var(--color-border)] flex flex-wrap gap-2">
                <Badge variant="primary">4.45/5.00 CGPA</Badge>
                <Badge variant="accent">Top 10% Class Rank</Badge>
                <Badge variant="outline">MSc Scholar @ DSU</Badge>
              </div>
            </div>
          </div>

          {/* Research Interests Tags */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-xl bg-[var(--color-surface-base)] border border-[var(--color-border)]">
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
            <div className="p-6 rounded-xl bg-[var(--color-primary-light)] border border-[var(--color-primary)]/30 text-center">
              <GraduationCap className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-3" />
              <h3 className="text-sm font-bold text-[var(--color-primary)] mb-2">Detailed Academic History</h3>
              <p className="text-xs text-[var(--color-primary)]/80 mb-4">View full details of my degrees, diplomas, and academic awards.</p>
              <a href="/education" className="inline-block px-4 py-2 bg-[var(--color-primary)] text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity">
                View Education Profile
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
