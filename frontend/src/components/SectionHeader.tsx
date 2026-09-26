import React from 'react'

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  centered?: boolean
  className?: string
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  centered = false,
  className = ''
}) => {
  return (
    <div className={`mb-10 ${centered ? 'text-center max-w-2xl mx-auto' : 'max-w-3xl'} ${className}`}>
      {eyebrow && (
        <span className="inline-block text-xs uppercase tracking-widest font-mono font-semibold text-[var(--color-primary)] mb-2">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[var(--color-text-main)] tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base text-[var(--color-text-muted)] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}
