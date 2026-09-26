import React from 'react'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'

export default function CaseStudyHotel() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)]">
      <Navbar />
      <main id="main-content" className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Button href="/#projects" variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} className="mb-6">
            Back to Projects
          </Button>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="md">B.Sc Thesis Project</Badge>
              <span className="text-xs font-mono text-[var(--color-text-subtle)]">First Technical University — Supervised by Dr. J.E.T. Akinsola</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[var(--color-text-main)] mb-4">
              Location-Based Hotel Recommendation & Reservation System
            </h1>
            <p className="text-lg text-[var(--color-text-muted)] leading-relaxed">
              An empirical research and web software engineering project formulating geospatial recommendation algorithms to optimize hotel discovery and reservation workflows.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] mb-10">
            <div>
              <div className="text-xs font-mono text-[var(--color-text-subtle)] uppercase">Grade</div>
              <div className="text-sm font-bold text-[var(--color-primary)]">5.0 / 5.0 Major GPA</div>
            </div>
            <div>
              <div className="text-xs font-mono text-[var(--color-text-subtle)] uppercase">Supervisor</div>
              <div className="text-sm font-bold text-[var(--color-primary)]">Dr. J.E.T. Akinsola</div>
            </div>
            <div>
              <div className="text-xs font-mono text-[var(--color-text-subtle)] uppercase">Domain</div>
              <div className="text-sm font-bold text-[var(--color-primary)]">Spatial Algorithms</div>
            </div>
            <div>
              <div className="text-xs font-mono text-[var(--color-text-subtle)] uppercase">Tech</div>
              <div className="text-sm font-bold text-[var(--color-primary)]">React, Node, Postgres</div>
            </div>
          </div>

          <div className="space-y-8 text-sm text-[var(--color-text-muted)] leading-relaxed">
            <div className="card-elevated p-6 bg-[var(--color-surface-card)]">
              <h2 className="text-xl font-serif font-bold text-[var(--color-text-main)] mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[var(--color-primary)]" />
                Research Objectives & Methodology
              </h2>
              <p className="mb-3">
                Traditional hotel reservation platforms often prioritize static popularity metrics over dynamic geographic proximity and multi-criteria user preferences.
              </p>
              <p>
                My thesis project investigated a location-aware recommendation model that dynamically balances geographic distance calculations, user price sensitivities, amenity filters, and historical review ratings to present optimal lodging recommendations.
              </p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
