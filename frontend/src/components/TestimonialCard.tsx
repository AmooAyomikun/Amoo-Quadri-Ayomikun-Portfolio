import React from 'react'
import { Quote, Star } from 'lucide-react'
import type { TestimonialItem } from '../content/portfolioData'
import { Badge } from './Badge'

interface TestimonialCardProps {
  testimonial: TestimonialItem
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="card-elevated p-6 flex flex-col justify-between h-full bg-[var(--color-surface-card)]">
      <div>
        {/* Header & Avatar */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] font-serif font-bold text-sm flex items-center justify-center border border-[var(--color-primary)]/20 shrink-0">
              {testimonial.avatarInitials}
            </div>
            <div>
              <h3 className="font-semibold text-base text-[var(--color-text-main)] leading-tight">
                {testimonial.name}
              </h3>
              <p className="text-xs text-[var(--color-text-subtle)] font-medium">
                {testimonial.role}
              </p>
              <p className="text-xs text-[var(--color-primary)] font-mono font-medium">
                {testimonial.organization}
              </p>
            </div>
          </div>
          <Quote className="w-6 h-6 text-[var(--color-text-subtle)]/30 shrink-0" />
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-3 text-amber-500">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-500 stroke-none" />
          ))}
        </div>

        {/* Quote Content */}
        <p className="text-sm text-[var(--color-text-muted)] italic leading-relaxed mb-6">
          "{testimonial.quote}"
        </p>
      </div>

      {/* Highlights & Category Pill */}
      <div className="pt-4 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-2 mt-auto">
        <span className="text-xs font-mono text-[var(--color-text-subtle)]">
          {testimonial.relationship}
        </span>
        <div className="flex flex-wrap gap-1">
          {testimonial.highlights.map((item, idx) => (
            <Badge key={idx} variant="subtle" size="sm">
              {item}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
