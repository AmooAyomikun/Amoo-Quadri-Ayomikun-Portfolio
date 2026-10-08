import React from 'react'
import { cx } from '../lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'accent' | 'outline' | 'subtle'
  size?: 'sm' | 'md'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'subtle',
  size = 'sm',
  className = ''
}) => {
  const baseStyles = "inline-flex items-center font-mono font-medium rounded-full transition-colors"
  
  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-xs tracking-wide"
  }

  const variantStyles = {
    primary: "bg-[var(--color-primary)] !text-black font-bold border border-transparent shadow-[0_0_10px_rgba(196,250,76,0.3)]",
    accent: "bg-[var(--color-accent)] text-white border border-transparent",
    outline: "border border-[var(--color-border)] text-[var(--color-text-main)] bg-transparent",
    subtle: "bg-[var(--color-surface-card)] text-[var(--color-text-main)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
  }

  return (
    <span className={cx(baseStyles, sizeStyles[size], variantStyles[variant], className)}>
      {children}
    </span>
  )
}
