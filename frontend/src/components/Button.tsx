import React from 'react'
import { cx } from '../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  children: React.ReactNode
  href?: string
  target?: string
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  href,
  target,
  className = '',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5"
  }

  const variantStyles = {
    primary: "bg-[var(--color-primary)] text-[var(--color-primary-text)] hover:bg-[var(--color-primary-hover)] shadow-sm",
    secondary: "bg-[var(--color-surface-elevated)] text-[var(--color-text-main)] hover:bg-[var(--color-border)] border border-[var(--color-border)]",
    outline: "border border-[var(--color-border)] text-[var(--color-text-main)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] bg-transparent",
    ghost: "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-elevated)]"
  }

  const combinedClasses = cx(baseStyles, sizeStyles[size], variantStyles[variant], className)

  if (href) {
    return (
      <a href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} className={combinedClasses}>
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </a>
    )
  }

  return (
    <button className={combinedClasses} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  )
}
