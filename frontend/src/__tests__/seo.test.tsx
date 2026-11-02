import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { SEO } from '../components/SEO'

describe('<SEO /> component', () => {
  beforeEach(() => {
    document.title = ''
  })

  it('sets the document title when title prop is provided', () => {
    render(<SEO title="About Quadri" />)
    expect(document.title).toBe('About Quadri | Quadri Ayomikun Amoo')
  })

  it('uses default title when title prop is omitted', () => {
    render(<SEO />)
    expect(document.title).toBe('Quadri Ayomikun Amoo — Software Engineer & Researcher')
  })

  it('updates description meta tag and canonical link tag', () => {
    render(
      <SEO 
        title="Projects" 
        description="Exploration of software engineering systems" 
        canonicalUrl="/projects" 
      />
    )
    
    const descMeta = document.querySelector('meta[name="description"]')
    expect(descMeta?.getAttribute('content')).toBe('Exploration of software engineering systems')

    const canonical = document.querySelector('link[rel="canonical"]')
    expect(canonical?.getAttribute('href')).toBe('https://amoo-quadri.vercel.app/projects')
  })

  it('injects Schema.org JSON-LD structured data when noIndex is false', () => {
    render(<SEO title="Home" />)
    const script = document.querySelector('script#seo-structured-data')
    expect(script).not.toBeNull()
    const json = JSON.parse(script?.textContent || '{}')
    expect(json['@context']).toBe('https://schema.org')
    expect(json['@graph'][0]['@type']).toBe('Person')
    expect(json['@graph'][0]['name']).toBe('Quadri Ayomikun Amoo')
  })
})
