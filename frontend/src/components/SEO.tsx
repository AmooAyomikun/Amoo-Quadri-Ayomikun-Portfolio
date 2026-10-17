import React, { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  canonicalUrl?: string
  ogImage?: string
  type?: 'website' | 'article'
}

const DEFAULT_TITLE = 'Quadri Ayomikun Amoo — Software Engineer & Researcher'
const DEFAULT_DESC = 'Full-Stack Software Engineer & Machine Learning Researcher. B.Sc. Software Engineering (5.0/5.0 Major GPA, Second-Class Upper Honors). Explore projects, publications, and experience.'
const SITE_URL = 'https://amoo-quadri.vercel.app'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESC,
  canonicalUrl,
  ogImage = DEFAULT_IMAGE,
  type = 'website'
}) => {
  const fullTitle = title 
    ? `${title} | Quadri Ayomikun Amoo` 
    : DEFAULT_TITLE

  useEffect(() => {
    // 1. Update Title
    document.title = fullTitle

    // Helper function to safely update or append meta tag
    const setMetaTag = (attribute: 'name' | 'property', attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, attrValue)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    // 2. Primary Meta Tags
    setMetaTag('name', 'description', description)

    // 3. Open Graph
    setMetaTag('property', 'og:title', fullTitle)
    setMetaTag('property', 'og:description', description)
    setMetaTag('property', 'og:type', type)
    setMetaTag('property', 'og:image', ogImage)
    if (canonicalUrl) {
      const fullUrl = canonicalUrl.startsWith('http') ? canonicalUrl : `${SITE_URL}${canonicalUrl}`
      setMetaTag('property', 'og:url', fullUrl)
    }

    // 4. Twitter Cards
    setMetaTag('name', 'twitter:title', fullTitle)
    setMetaTag('name', 'twitter:description', description)
    setMetaTag('name', 'twitter:image', ogImage)

    // 5. Canonical Link
    if (canonicalUrl) {
      const fullUrl = canonicalUrl.startsWith('http') ? canonicalUrl : `${SITE_URL}${canonicalUrl}`
      let linkCanonical = document.querySelector('link[rel="canonical"]')
      if (!linkCanonical) {
        linkCanonical = document.createElement('link')
        linkCanonical.setAttribute('rel', 'canonical')
        document.head.appendChild(linkCanonical)
      }
      linkCanonical.setAttribute('href', fullUrl)
    }
  }, [fullTitle, description, canonicalUrl, ogImage, type])

  return null
}
