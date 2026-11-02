import React from 'react'

export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2.5 focus:rounded-lg focus:bg-[var(--color-primary-base)] focus:text-white focus:font-medium focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-base)] transition-all"
    >
      Skip to main content
    </a>
  )
}

export default SkipLink
