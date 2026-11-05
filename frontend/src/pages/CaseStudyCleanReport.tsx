import React from 'react'
import { ArrowLeft, CheckCircle2, WifiOff, MapPin } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { SEO } from '../components/SEO'
import { PageContainer } from '../components/PageContainer'

export default function CaseStudyCleanReport() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] text-[var(--color-text-main)]">
      <SEO 
        title="CleanReport PWA Case Study" 
        description="Case study of CleanReport: An offline-first civic sanitation Progressive Web App built with IndexedDB, Service Workers, and Geolocation by Quadri Ayomikun Amoo."
        canonicalUrl="/case-study/clean-report"
      />
      <Navbar />
      <PageContainer as="main" id="main-content" className="pt-32 pb-20">
        <Button href="/projects" variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} className="mb-6">
            Back to Projects
          </Button>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="primary" size="md">Civic Technology PWA</Badge>
              <span className="text-xs font-mono text-[var(--color-text-subtle)]">Circo Digital Academy — Orange Internship (2026)</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[var(--color-text-main)] mb-4">
              CleanReport: PWA Civic Sanitation Platform
            </h1>
            <p className="text-lg text-[var(--color-text-muted)] leading-relaxed">
              As the sole frontend engineer on a 5-person cross-functional team, I designed and built CleanReport—a civic-tech Progressive Web App enabling communities to report environmental hazards with offline sync capabilities.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] mb-10">
            <div>
              <div className="text-xs font-mono text-[var(--color-text-subtle)] uppercase">Role</div>
              <div className="text-sm font-bold text-[var(--color-primary)]">Sole Frontend Engineer</div>
            </div>
            <div>
              <div className="text-xs font-mono text-[var(--color-text-subtle)] uppercase">Architecture</div>
              <div className="text-sm font-bold text-[var(--color-primary)]">PWA + ServiceWorkers</div>
            </div>
            <div>
              <div className="text-xs font-mono text-[var(--color-text-subtle)] uppercase">Impact</div>
              <div className="text-sm font-bold text-[var(--color-primary)]">100% Offline Resilience</div>
            </div>
            <div>
              <div className="text-xs font-mono text-[var(--color-text-subtle)] uppercase">Tech</div>
              <div className="text-sm font-bold text-[var(--color-primary)]">React, TS, Leaflet</div>
            </div>
          </div>

          <div className="space-y-8 text-sm text-[var(--color-text-muted)] leading-relaxed">
            <div className="card-elevated p-6 bg-[var(--color-surface-card)]">
              <h2 className="text-xl font-serif font-bold text-[var(--color-text-main)] mb-3 flex items-center gap-2">
                <WifiOff className="w-5 h-5 text-[var(--color-primary)]" />
                The Problem & Offline Resilience Challenge
              </h2>
              <p className="mb-3">
                In many developing urban centers, network coverage drops frequently. When citizens spot environmental issues like clogged drainages or trash accumulation, poor connectivity often prevents submitting reports immediately.
              </p>
              <p>
                To overcome this barrier, I architected a PWA offline queueing workflow. Reports captured offline are stored in IndexedDB via ServiceWorkers and automatically synchronized with the live API server as soon as connection is re-established.
              </p>
            </div>

            {/* System Architecture Blueprint: Offline-to-Online Report Lifecycle */}
            <div className="card-elevated p-6 bg-[var(--color-surface-card)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-[var(--color-border)]">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-primary)] font-semibold block">
                    // SYSTEM ARCHITECTURE SPECIFICATION
                  </span>
                  <h2 className="text-xl font-serif font-bold text-[var(--color-text-main)] mt-0.5">
                    Offline-First Ingestion &amp; Synchronization Pipeline
                  </h2>
                </div>
                <span className="text-xs font-mono text-[var(--color-text-subtle)]">
                  4-Stage State Machine
                </span>
              </div>

              {/* 4-Stage Pipeline Schematic */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="p-4 rounded-lg bg-[var(--color-surface-base)] border border-[var(--color-border)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-primary)] mb-2">
                      <span>STAGE 01</span>
                      <span>CLIENT CAPTURE</span>
                    </div>
                    <h3 className="text-sm font-sans font-bold text-[var(--color-text-main)] mb-1.5">
                      Sensor &amp; Media Acquisition
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                      Locks GPS coordinates (`coords.latitude`, `coords.longitude`, `accuracy`) at capture time and downsamples raw camera images via HTML5 Canvas.
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[var(--color-border)] font-mono text-[10px] text-[var(--color-text-subtle)]">
                    Out: WebP Blob (&lt;350 KB) + UUID
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[var(--color-surface-base)] border border-[var(--color-border)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-primary)] mb-2">
                      <span>STAGE 02</span>
                      <span>NETWORK ROUTER</span>
                    </div>
                    <h3 className="text-sm font-sans font-bold text-[var(--color-text-main)] mb-1.5">
                      Connectivity Probe
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                      Evaluates `navigator.onLine` paired with a lightweight `/health` fetch timeout to detect captive portals or dead cellular links.
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[var(--color-border)] font-mono text-[10px] text-[var(--color-text-subtle)]">
                    Branch: Direct POST | Local Queue
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[var(--color-surface-base)] border border-[var(--color-border)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-primary)] mb-2">
                      <span>STAGE 03</span>
                      <span>INDEXEDDB QUEUE</span>
                    </div>
                    <h3 className="text-sm font-sans font-bold text-[var(--color-text-main)] mb-1.5">
                      Persistent Outbox Store
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                      Serializes payload and idempotency key into IndexedDB `pending_reports`. Service Worker listens for `online` restoration events.
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[var(--color-border)] font-mono text-[10px] text-[var(--color-text-subtle)]">
                    Retry: Exponential Backoff
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[var(--color-surface-base)] border border-[var(--color-border)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-primary)] mb-2">
                      <span>STAGE 04</span>
                      <span>MUNICIPAL TRIAGE</span>
                    </div>
                    <h3 className="text-sm font-sans font-bold text-[var(--color-text-main)] mb-1.5">
                      Spatial Index &amp; Resolution
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                      Deduplicates incoming reports by UUID, renders spatial pins on the Leaflet admin cluster map, and updates citizen status feeds.
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[var(--color-border)] font-mono text-[10px] text-[var(--color-text-subtle)]">
                    State: Pending → Dispatched → Fixed
                  </div>
                </div>
              </div>

              {/* Concrete Engineering Trade-offs */}
              <div className="border-t border-[var(--color-border)] pt-5">
                <div className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-main)] font-semibold mb-3">
                  Engineering Trade-offs &amp; Edge Cases Solved
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg bg-[var(--color-surface-base)] border border-[var(--color-border)]">
                    <div className="font-mono font-bold text-[var(--color-text-main)] mb-1">
                      Idempotent Replay Guard
                    </div>
                    <p className="text-[var(--color-text-muted)] leading-relaxed">
                      Flaky 3G connections often drop TCP ACKs after the server has already stored a report. Attaching a client-generated UUID ensures background sync retries never create duplicate hazard pins.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[var(--color-surface-base)] border border-[var(--color-border)]">
                    <div className="font-mono font-bold text-[var(--color-text-main)] mb-1">
                      Storage Quota Protection
                    </div>
                    <p className="text-[var(--color-text-muted)] leading-relaxed">
                      Storing raw 10 MB camera photos in IndexedDB quickly exhausts mobile browser quotas. Compressing images client-side before persistence reduced average record size by 94%.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[var(--color-surface-base)] border border-[var(--color-border)]">
                    <div className="font-mono font-bold text-[var(--color-text-main)] mb-1">
                      Capture-Time vs. Sync-Time GPS
                    </div>
                    <p className="text-[var(--color-text-muted)] leading-relaxed">
                      Citizens often walk away from a hazard before cellular signal returns. Coordinates and accuracy radius are bound immutably at shutter press rather than when the queue flushes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-elevated p-6 bg-[var(--color-surface-card)]">
              <h2 className="text-xl font-serif font-bold text-[var(--color-text-main)] mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                Key Technical Implementations
              </h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                  <span><strong>Geolocation & Map Marker Tagging:</strong> Integrated HTML5 Geolocation API with Leaflet maps to automatically pin hazard coordinates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                  <span><strong>Image Compression & Preview:</strong> Built image compression utilities to reduce payload size before local storage and API transmission.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                  <span><strong>Admin Triage Dashboard:</strong> Developed administrative status workflow views allowing municipal teams to update report status in real time.</span>
                </li>
              </ul>
            </div>
          </div>

      </PageContainer>
      <Footer />
    </div>
  )
}
