import React from 'react'

export interface PageContainerProps {
  children: React.ReactNode
  className?: string
  id?: string
  as?: 'div' | 'section' | 'main' | 'article'
}

/**
 * Unified PageContainer component ensuring consistent max-width and side padding
 * that reliably clears the fixed social and email sidebars across all pages and views.
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  id,
  as: Component = 'div'
}) => {
  return (
    <Component
      id={id}
      className={`max-w-6xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20 w-full ${className}`}
    >
      {children}
    </Component>
  )
}

export default PageContainer
