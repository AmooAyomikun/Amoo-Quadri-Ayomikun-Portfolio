import React, { useState, useRef, useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ExternalLink,
  RotateCcw,
  Maximize2,
  Lock,
  Play,
  Pause,
  MousePointer,
  X
} from 'lucide-react'

interface InteractiveAppPreviewProps {
  demoUrl?: string
  imageUrl?: string
  title: string
  aspectRatio?: string
  className?: string
  tourRoutes?: string[]
  initialInteractive?: boolean
  scaleMode?: 'scaled' | 'full'
  showInteractiveBadge?: boolean
}

export const InteractiveAppPreview: React.FC<InteractiveAppPreviewProps> = ({
  demoUrl,
  imageUrl,
  title,
  aspectRatio = 'aspect-[4/3]',
  className = '',
  tourRoutes = ['/'],
  initialInteractive = false,
  scaleMode = 'scaled',
  showInteractiveBadge = true,
}) => {
  const [isInteractive, setIsInteractive] = useState(initialInteractive)
  const [isTourActive, setIsTourActive] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialInteractive) {
      setIsInteractive(true)
    }
  }, [initialInteractive, demoUrl])

  const routes = useMemo(() => {
    return tourRoutes && tourRoutes.length > 0 ? tourRoutes : ['/']
  }, [tourRoutes])

  // Guided tour only runs when explicitly activated by the user
  useEffect(() => {
    if (!isTourActive || routes.length <= 1) return

    const interval = setInterval(() => {
      setCurrentRouteIndex((prev) => (prev + 1) % routes.length)
    }, 12000)

    return () => clearInterval(interval)
  }, [isTourActive, routes.length])

  const currentSubRoute = routes[currentRouteIndex] || '/'

  // Clean URL composition
  const currentFullUrl = useMemo(() => {
    if (!demoUrl) return ''
    try {
      const u = new URL(demoUrl)
      const cleanSub = currentSubRoute.startsWith('/') ? currentSubRoute : `/${currentSubRoute}`
      return `${u.origin}${cleanSub}`
    } catch {
      return demoUrl
    }
  }, [demoUrl, currentSubRoute])

  const displayAddress = useMemo(() => {
    if (!demoUrl) return 'localhost'
    try {
      const u = new URL(demoUrl)
      const cleanSub = currentSubRoute === '/' ? '' : currentSubRoute
      return `${u.hostname}${cleanSub}`
    } catch {
      return demoUrl.replace(/^https?:\/\//, '')
    }
  }, [demoUrl, currentSubRoute])

  const effectiveSrc = useMemo(() => {
    if (!currentFullUrl) return ''
    if (currentFullUrl.includes('cleanreport-frontend.vercel.app')) {
      return `/api/proxy?url=${encodeURIComponent(currentFullUrl)}`
    }
    return currentFullUrl
  }, [currentFullUrl])

  const handleReload = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLoading(true)
    setIframeError(false)
    setIframeKey((prev) => prev + 1)
  }

  const toggleInteractive = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setIsInteractive((prev) => !prev)
    if (!isInteractive) {
      setIsTourActive(false)
    }
  }

  const toggleTour = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsTourActive((prev) => !prev)
    if (!isTourActive) {
      setIsInteractive(false)
    }
  }

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFullscreen((prev) => !prev)
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    setHasLoadedOnce(true)
  }

  const hasLiveDemo = Boolean(demoUrl && !iframeError)

  const renderFrameContent = () => {
    if (!hasLiveDemo) {
      if (imageUrl) {
        return (
          <div className="relative w-full h-full bg-[var(--color-surface-card)] flex items-center justify-center overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover object-top"
            />
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-surface-base)]/90 backdrop-blur-md border border-[var(--color-border)] text-xs font-mono font-medium text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all shadow-lg"
              >
                <span>Launch Live App</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )
      }
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[var(--color-surface-card)] text-center">
          <h4 className="text-lg font-serif font-bold text-[var(--color-text-main)] mb-1">{title}</h4>
          <p className="text-xs font-mono text-[var(--color-text-muted)]">Preview unavailable</p>
        </div>
      )
    }

    return (
      <div className="relative w-full h-full overflow-hidden bg-white">
        {/* Loading Spinner on initial load only */}
        {isLoading && !hasLoadedOnce && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[var(--color-surface-card)]/95 backdrop-blur-xs transition-opacity duration-300">
            <div className="w-6 h-6 rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)] animate-spin mb-1.5" />
            <p className="font-mono text-[10px] text-[var(--color-text-muted)] tracking-wider">
              Connecting live preview...
            </p>
          </div>
        )}

        {/* Viewport: Full 100% natural scale for detail pages, or 200% / 0.5 scaled for compact cards */}
        <div className="w-full h-full overflow-hidden relative bg-white">
          {scaleMode === 'full' ? (
            <div className="w-full h-full relative">
              <iframe
                key={iframeKey}
                src={effectiveSrc}
                title={`${title} - ${currentSubRoute}`}
                loading="lazy"
                onLoad={handleIframeLoad}
                onError={() => setIframeError(true)}
                className={`w-full h-full border-none bg-white transition-opacity duration-300 ${
                  isLoading && !hasLoadedOnce ? 'opacity-0' : 'opacity-100'
                } ${isInteractive ? 'pointer-events-auto' : 'pointer-events-none select-none'}`}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              />
            </div>
          ) : (
            <div className="w-[200%] h-[200%] origin-top-left scale-[0.5] relative">
              <iframe
                key={iframeKey}
                src={effectiveSrc}
                title={`${title} - ${currentSubRoute}`}
                loading="lazy"
                onLoad={handleIframeLoad}
                onError={() => setIframeError(true)}
                className={`w-full h-full border-none bg-white transition-opacity duration-300 ${
                  isLoading && !hasLoadedOnce ? 'opacity-0' : 'opacity-100'
                } ${isInteractive ? 'pointer-events-auto' : 'pointer-events-none select-none'}`}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              />
            </div>
          )}
        </div>

        {/* Top Route Quick-Switch Tabs (when multiple pages exist) */}
        {routes.length > 1 && !isInteractive && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 p-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 shadow-lg">
            {routes.map((r, i) => (
              <button
                key={r}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentRouteIndex(i)
                }}
                className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold transition-all cursor-pointer ${
                  i === currentRouteIndex
                    ? 'bg-[var(--color-primary)] text-[var(--color-primary-text)] shadow-xs'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                title={`Switch to ${r}`}
              >
                {r === '/' ? 'Home' : r.replace('/', '')}
              </button>
            ))}
          </div>
        )}

        {/* Tour Mode Indicator Badge */}
        {isTourActive && !isInteractive && (
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-emerald-500/40 text-emerald-400 font-mono text-[9px] font-bold shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>TOUR ACTIVE</span>
          </div>
        )}

        {/* Bottom Scrim & Centered Action Button (Only when NOT interactive) */}
        {!isInteractive && (
          <div className="absolute inset-x-0 bottom-0 z-10 pb-2.5 pt-6 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-center pointer-events-none">
            <button
              onClick={toggleInteractive}
              className="pointer-events-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--color-surface-base)]/95 hover:bg-[var(--color-primary)] text-[var(--color-primary)] hover:text-[var(--color-primary-text)] backdrop-blur-md border border-[var(--color-primary)] font-mono text-xs font-bold shadow-2xl transition-all duration-200 cursor-pointer group/btn"
              title="Click to take control and interact directly with the app"
            >
              <MousePointer className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
              <span>Click to Interact &amp; Navigate App</span>
            </button>
          </div>
        )}

        {/* Interactive Mode Active Pill (Only when interactive AND showInteractiveBadge is enabled) */}
        {isInteractive && showInteractiveBadge && !initialInteractive && (
          <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/85 text-emerald-400 font-mono text-[10px] border border-emerald-500/30 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Interactive</span>
            </span>
            <button
              onClick={() => setIsInteractive(false)}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--color-surface-base)]/95 backdrop-blur-md border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] font-mono text-[10px] transition-all shadow-md cursor-pointer font-medium"
              title="Exit interactive mode"
            >
              <span>Done</span>
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mockup Window Container */}
      <div
        ref={containerRef}
        className={`relative w-full ${aspectRatio} rounded-2xl sm:rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-md group-hover:shadow-xl bg-[var(--color-surface-card)] flex flex-col transition-all ${className}`}
      >
        {/* macOS / Safari Inspired Window Header (Compact 32px height) */}
        <div className="w-full px-3 py-1.5 bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)] flex items-center justify-between gap-1.5 select-none shrink-0 h-8">
          
          {/* Traffic light window dots */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          </div>

          {/* Center Address Pill */}
          <div className="flex items-center justify-center max-w-[180px] sm:max-w-xs flex-1 mx-1.5">
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--color-surface-card)] border border-[var(--color-border)] text-[10px] font-mono text-[var(--color-text-muted)] w-full justify-center truncate shadow-inner">
              <Lock className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
              <span className="truncate">{displayAddress}</span>
            </div>
          </div>

          {/* Right Action Toolbar */}
          <div className="flex items-center gap-1 shrink-0">
            {hasLiveDemo && (
              <>
                {/* Guided Tour Toggle Button (when multiple routes exist and not in initialInteractive mode) */}
                {routes.length > 1 && !initialInteractive && (
                  <button
                    onClick={toggleTour}
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-medium border transition-colors cursor-pointer ${
                      isTourActive
                        ? 'bg-emerald-500 text-black border-emerald-500 font-bold'
                        : 'bg-[var(--color-surface-card)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)]'
                    }`}
                    title={isTourActive ? 'Pause Tour' : 'Start Multi-Page Tour'}
                  >
                    {isTourActive ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
                    <span className="hidden sm:inline">Tour</span>
                  </button>
                )}

                {/* Reload Button */}
                <button
                  onClick={handleReload}
                  aria-label="Reload preview"
                  className="p-1 rounded text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                  title="Reload preview"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>

                {/* Fullscreen Modal Toggle */}
                <button
                  onClick={toggleFullscreen}
                  aria-label="Expand preview"
                  className="p-1 rounded text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                  title="Full screen preview"
                >
                  <Maximize2 className="w-3 h-3" />
                </button>
              </>
            )}

            {/* Launch In New Tab Button */}
            {demoUrl && (
              <a
                href={currentFullUrl || demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                title="Open in new window"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Viewport Screen Content */}
        <div className="w-full flex-1 relative overflow-hidden">
          {renderFrameContent()}
        </div>
      </div>

      {/* Fullscreen Interactive Modal Window */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-6xl h-[90vh] bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Window Header */}
              <div className="px-4 py-3 bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 mr-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  </div>
                  <span className="text-xs font-mono font-bold text-[var(--color-text-main)] truncate max-w-[200px] sm:max-w-none">
                    {title} — Fullscreen Interactive Preview ({currentSubRoute})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {demoUrl && (
                    <a
                      href={currentFullUrl || demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-lg border border-[var(--color-border)] text-xs font-mono text-[var(--color-primary)] hover:border-[var(--color-primary)] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Open Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <button
                    onClick={() => setIsFullscreen(false)}
                    aria-label="Close fullscreen"
                    className="p-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Viewport Body */}
              <div className="w-full flex-1 relative bg-white">
                <iframe
                  key={`fs-${iframeKey}-${currentFullUrl}`}
                  src={effectiveSrc}
                  title={`${title} Fullscreen`}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
