import React from 'react'
import { Quote, Star } from 'lucide-react'
import type { TestimonialItem } from '../content/portfolioData'
import { Badge } from './Badge'

interface TestimonialCardProps {
  testimonial: TestimonialItem
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="card-elevated p-5 flex flex-col justify-between h-full bg-[var(--color-surface-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 transition-all duration-300">
      <div>
        {/* Header & Avatar */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] font-serif font-bold text-xs flex items-center justify-center border border-[var(--color-primary)]/30 shrink-0">
              {testimonial.avatarInitials}
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-[var(--color-text-main)] leading-tight">
                {testimonial.name}
              </h3>
              <p className="text-xs text-[var(--color-text-subtle)] font-medium">
                {testimonial.role}
              </p>
              <p className="text-xs text-[var(--color-primary)] font-mono font-medium mt-0.5">
                {testimonial.organization}
              </p>
            </div>
          </div>
          <Quote className="w-5 h-5 text-[var(--color-primary)]/30 shrink-0" />
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-2.5 text-amber-400">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
          ))}
        </div>

        {/* Quote Content */}
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] italic leading-relaxed mb-3 font-sans">
          "{testimonial.quote}"
        </p>
      </div>

      {/* Highlights & Category Pill */}
      <div className="pt-3 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-2 mt-auto">
        <span className="text-[11px] font-mono text-[var(--color-text-subtle)] font-medium">
          {testimonial.relationship}
        </span>
        <div className="flex flex-wrap gap-1">
          {testimonial.highlights.map((item, idx) => (
            <Badge key={idx} variant={idx === 0 ? 'primary' : 'subtle'} size="sm">
              {item}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
