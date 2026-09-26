import React from 'react'
import { ArrowLeft, CheckCircle2, WifiOff, MapPin } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'

export default function CaseStudyCleanReport() {
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

        </div>
      </main>
      <Footer />
    </div>
  )
}
