import React from 'react'
import { BookOpen, UserCheck, CheckCircle2 } from 'lucide-react'
import type { ResearchItem } from '../content/portfolioData'
import { Badge } from './Badge'

interface ResearchCardProps {
  research: ResearchItem
}

export const ResearchCard: React.FC<ResearchCardProps> = ({ research }) => {
  return (
    <div className="card-elevated p-6 bg-[var(--color-surface-card)]">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <Badge variant="accent" size="md">
          {research.role}
        </Badge>
        <span className="text-xs font-mono text-[var(--color-text-subtle)] font-medium">
          {research.period}
        </span>
      </div>

      <h3 className="text-xl font-serif font-bold text-[var(--color-text-main)] mb-2">
        {research.title}
      </h3>

      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--color-text-muted)] mb-4">
        <span className="flex items-center gap-1 font-semibold text-[var(--color-primary)]">
          <BookOpen className="w-3.5 h-3.5" />
          {research.institution}
        </span>
        <span className="flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5" />
          Supervisor: {research.supervisor}
        </span>
      </div>

      {research.thesisTitle && (
        <div className="mb-4 p-3 rounded-lg bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 text-xs font-mono text-[var(--color-primary)]">
          <span className="font-bold">Thesis Title: </span>"{research.thesisTitle}"
        </div>
      )}

      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
        {research.abstract}
      </p>

      {/* Contributions Bullet List */}
      <div className="mb-6">
        <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-[var(--color-text-main)] mb-2">
          Key Research Contributions & Methodology:
        </h4>
        <ul className="space-y-1.5">
          {research.contributions.map((c, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-[var(--color-text-muted)]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0 mt-0.5" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[var(--color-border)]">
        {research.tags.map((tag, idx) => (
          <Badge key={idx} variant="subtle" size="sm">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}
