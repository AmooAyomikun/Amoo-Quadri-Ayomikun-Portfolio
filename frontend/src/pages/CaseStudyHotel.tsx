import React from 'react'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { SEO } from '../components/SEO'
import { PageContainer } from '../components/PageContainer'

export default function CaseStudyHotel() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)]">
      <SEO 
        title="Hotel Recommendation Engine Case Study" 
        description="B.Sc. Thesis Case Study: Location-Based Hotel Recommendation & Reservation System with collaborative filtering and distance metrics by Quadri Ayomikun Amoo."
        canonicalUrl="/case-study/hotel-recommendation"
      />
      <Navbar />
      <PageContainer as="main" id="main-content" className="pt-32 pb-20">
        <Button href="/projects" variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} className="mb-6">
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
              <div className="text-xs font-mono text-[var(--color-text-subtle)] uppercase">Evaluation</div>
              <div className="text-sm font-bold text-[var(--color-primary)]">Distinction / Approved</div>
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
                Research Objectives &amp; Methodology
              </h2>
              <p className="mb-3">
                Traditional hotel reservation platforms often prioritize static popularity metrics over dynamic geographic proximity and multi-criteria user preferences.
              </p>
              <p>
                My thesis project investigated a location-aware recommendation model that dynamically balances geographic distance calculations, user price sensitivities, amenity filters, and historical review ratings to present optimal lodging recommendations.
              </p>
            </div>

            {/* System Architecture Blueprint: Spatial Recommendation & Reservation Pipeline */}
            <div className="card-elevated p-6 bg-[var(--color-surface-card)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-[var(--color-border)]">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-primary)] font-semibold block">
                    // SYSTEM ARCHITECTURE SPECIFICATION
                  </span>
                  <h2 className="text-xl font-serif font-bold text-[var(--color-text-main)] mt-0.5">
                    Spatial Recommendation &amp; Transactional Booking Pipeline
                  </h2>
                </div>
                <span className="text-xs font-mono text-[var(--color-text-subtle)]">
                  4-Stage Execution Graph
                </span>
              </div>

              {/* 4-Stage Pipeline Schematic */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="p-4 rounded-lg bg-[var(--color-surface-base)] border border-[var(--color-border)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-primary)] mb-2">
                      <span>STAGE 01</span>
                      <span>QUERY VECTOR</span>
                    </div>
                    <h3 className="text-sm font-sans font-bold text-[var(--color-text-main)] mb-1.5">
                      Spatial &amp; Preference Input
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                      Captures user origin coordinates `(φ₁, λ₁)`, maximum search radius `R_max`, target nightly budget range, and required amenity bitmask.
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[var(--color-border)] font-mono text-[10px] text-[var(--color-text-subtle)]">
                    In: (φ₁, λ₁, R_max, B_max, A_req)
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[var(--color-surface-base)] border border-[var(--color-border)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-primary)] mb-2">
                      <span>STAGE 02</span>
                      <span>SPATIAL PRUNING</span>
                    </div>
                    <h3 className="text-sm font-sans font-bold text-[var(--color-text-main)] mb-1.5">
                      Bounding-Box &amp; Haversine
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                      Applies indexed latitude/longitude bounding-box filtering in PostgreSQL followed by exact spherical Haversine distance computation.
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[var(--color-border)] font-mono text-[10px] text-[var(--color-text-subtle)]">
                    Filter: d(u, h) ≤ R_max (km)
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[var(--color-surface-base)] border border-[var(--color-border)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-primary)] mb-2">
                      <span>STAGE 03</span>
                      <span>RANKING ENGINE</span>
                    </div>
                    <h3 className="text-sm font-sans font-bold text-[var(--color-text-main)] mb-1.5">
                      Multi-Criteria Scoring
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                      Computes normalized utility scores across spatial proximity decay, price fit, amenity intersection ratio, and verified guest ratings.
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[var(--color-border)] font-mono text-[10px] text-[var(--color-text-subtle)]">
                    Out: Sorted Top-K Candidates
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[var(--color-surface-base)] border border-[var(--color-border)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-primary)] mb-2">
                      <span>STAGE 04</span>
                      <span>RESERVATION LOCK</span>
                    </div>
                    <h3 className="text-sm font-sans font-bold text-[var(--color-text-main)] mb-1.5">
                      Atomic Room Allocation
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                      Executes transactional room inventory check (`SELECT ... FOR UPDATE`) to prevent double-booking during concurrent date-range reservations.
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[var(--color-border)] font-mono text-[10px] text-[var(--color-text-subtle)]">
                    State: Reserved + Confirmation ID
                  </div>
                </div>
              </div>

              {/* Mathematical Formulation & Engineering Decisions */}
              <div className="border-t border-[var(--color-border)] pt-5 space-y-4">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-main)] font-semibold mb-2">
                    Scoring Formulation
                  </div>
                  <pre className="p-3.5 rounded-lg bg-[var(--color-surface-base)] border border-[var(--color-border)] font-mono text-[11px] sm:text-xs text-[var(--color-text-muted)] overflow-x-auto leading-relaxed">
                    <code>{`d(u, h) = 2r · arcsin( sqrt( sin²(Δφ / 2) + cos(φ₁) · cos(φ₂) · sin²(Δλ / 2) ) )
Score(u, h) = w_d · exp(-λ · d(u, h)) + w_p · S_price(u, h) + w_a · (|A_u ∩ A_h| / |A_u|) + w_r · (R_h / 5.0)`}</code>
                  </pre>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg bg-[var(--color-surface-base)] border border-[var(--color-border)]">
                    <div className="font-mono font-bold text-[var(--color-text-main)] mb-1">
                      Two-Phase Spatial Indexing
                    </div>
                    <p className="text-[var(--color-text-muted)] leading-relaxed">
                      Evaluating trigonometric Haversine formulas across every hotel row scales poorly. Pre-filtering with an indexed B-tree latitude/longitude bounding box eliminates &gt;85% of distant rows before exact spherical distance is computed.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[var(--color-surface-base)] border border-[var(--color-border)]">
                    <div className="font-mono font-bold text-[var(--color-text-main)] mb-1">
                      Exponential Distance Decay vs. Hard Cutoffs
                    </div>
                    <p className="text-[var(--color-text-muted)] leading-relaxed">
                      Hard radius cutoffs penalize high-value hotels sitting just 100 meters outside a boundary. Using exponential distance decay `exp(-λ·d)` allows a significantly higher-rated or lower-priced hotel slightly further away to remain competitive.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

      </PageContainer>
      <Footer />
    </div>
  )
}
