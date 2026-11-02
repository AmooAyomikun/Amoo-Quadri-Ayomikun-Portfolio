import React, { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  canonicalUrl?: string
  ogImage?: string
  type?: 'website' | 'article'
  noIndex?: boolean
}

const DEFAULT_TITLE = 'Quadri Ayomikun Amoo — Software Engineer & Researcher'
const DEFAULT_DESC = 'Full-Stack Software Engineer & Machine Learning Researcher. B.Sc. Software Engineering (4.45/5.00 Final CGPA, Second-Class Upper Honors, Top 10%). Explore projects, publications, and experience.'
const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://amoo-quadri.vercel.app').replace(/\/$/, '')
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESC,
  canonicalUrl,
  ogImage = DEFAULT_IMAGE,
  type = 'website',
  noIndex = false
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

    // 2. Robots Directives
    if (noIndex) {
      setMetaTag('name', 'robots', 'noindex, nofollow')
    } else {
      setMetaTag('name', 'robots', 'index, follow')
    }

    // 3. Primary Meta Tags
    setMetaTag('name', 'description', description)

    // 4. Open Graph
    setMetaTag('property', 'og:title', fullTitle)
    setMetaTag('property', 'og:description', description)
    setMetaTag('property', 'og:type', type)
    setMetaTag('property', 'og:image', ogImage)
    if (canonicalUrl) {
      const fullUrl = canonicalUrl.startsWith('http') ? canonicalUrl : `${SITE_URL}${canonicalUrl}`
      setMetaTag('property', 'og:url', fullUrl)
    }

    // 5. Twitter Cards
    setMetaTag('name', 'twitter:title', fullTitle)
    setMetaTag('name', 'twitter:description', description)
    setMetaTag('name', 'twitter:image', ogImage)

    // 6. Canonical Link
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
    // 7. Structured Data (Schema.org JSON-LD) (Issue 5.1)
    if (!noIndex) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]#seo-structured-data')
      if (!scriptTag) {
        scriptTag = document.createElement('script')
        scriptTag.setAttribute('type', 'application/ld+json')
        scriptTag.setAttribute('id', 'seo-structured-data')
        document.head.appendChild(scriptTag)
      }

      const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Person',
            '@id': `${SITE_URL}/#person`,
            'name': 'Quadri Ayomikun Amoo',
            'alternateName': ['Amoo Quadri', 'Quadri Amoo'],
            'url': SITE_URL,
            'image': DEFAULT_IMAGE,
            'jobTitle': 'Full-Stack Software Engineer & Machine Learning Researcher',
            'alumniOf': {
              '@type': 'EducationalOrganization',
              'name': 'Babcock University'
            },
            'sameAs': [
              'https://github.com/AmooAyomikun',
              'https://linkedin.com/in/quadri-amoo',
              'https://x.com/AmooAyomikun'
            ]
          },
          {
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            'url': SITE_URL,
            'name': 'Quadri Ayomikun Amoo Portfolio',
            'description': DEFAULT_DESC,
            'publisher': {
              '@id': `${SITE_URL}/#person`
            }
          }
        ]
      }

      scriptTag.textContent = JSON.stringify(structuredData)
    }
  }, [fullTitle, description, canonicalUrl, ogImage, type, noIndex])

  return null
}
