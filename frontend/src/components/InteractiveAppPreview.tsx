import React, { useState, useRef, useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ExternalLink,
  RotateCcw,
  Maximize2,
  Lock,
  Play,
  Pause,
  Monitor,
  Smartphone,
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
  defaultDeviceMode?: 'desktop' | 'mobile'
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
  defaultDeviceMode = 'desktop',
}) => {
  const [isInteractive, setIsInteractive] = useState(initialInteractive)
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>(defaultDeviceMode)
  const [isTourActive, setIsTourActive] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const [currentRouteIndex, setCurrentRouteIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [viewportWidth, setViewportWidth] = useState(580)

  // Measure actual viewport container width dynamically
  useEffect(() => {
    if (!viewportRef.current) return
    const updateWidth = () => {
      if (viewportRef.current) {
        setViewportWidth(viewportRef.current.clientWidth)
      }
    }
    updateWidth()
    const ro = new ResizeObserver(updateWidth)
    ro.observe(viewportRef.current)
    return () => ro.disconnect()
  }, [])

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

        {/* Viewport: Supports Desktop Mode (scaled 1180px) and Mobile/Responsive Mode (100%) */}
        <div ref={viewportRef} className="w-full h-full overflow-hidden relative bg-white">
          {deviceMode === 'desktop' ? (
            <div
              style={{
                width: '1180px',
                height: `${(1 / (viewportWidth > 0 ? Math.min(1, viewportWidth / 1180) : 0.5)) * 100}%`,
                transform: `scale(${viewportWidth > 0 ? Math.min(1, viewportWidth / 1180) : 0.5})`,
                transformOrigin: 'top left',
              }}
              className="relative"
            >
              <iframe
                key={`${iframeKey}-desktop`}
                src={effectiveSrc}
                title={`${title} - ${currentSubRoute} (Desktop)`}
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
            <div className="w-full h-full relative">
              <iframe
                key={`${iframeKey}-mobile`}
                src={effectiveSrc}
                title={`${title} - ${currentSubRoute} (Mobile)`}
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

          {/* Interactive Mode Non-blocking Badge */}
          {isInteractive && (
            <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 font-mono text-[9px] font-bold shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Interactive App</span>
            </div>
          )}
        </div>

        {/* Tour Mode Indicator Badge */}
        {isTourActive && !isInteractive && (
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-emerald-500/40 text-emerald-400 font-mono text-[9px] font-bold shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>TOUR ACTIVE</span>
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
          
          {/* Traffic light window dots & LIVE badge */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            {hasLiveDemo && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] font-bold flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">LIVE</span>
              </span>
            )}
          </div>

          {/* Center Address Pill */}
          <div className="flex items-center justify-center max-w-[170px] sm:max-w-xs flex-1 mx-1.5">
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--color-surface-card)] border border-[var(--color-border)] text-[10px] font-mono text-[var(--color-text-muted)] w-full justify-center truncate shadow-inner">
              <Lock className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
              <span className="truncate">{displayAddress}</span>
            </div>
          </div>

          {/* Right Action Toolbar */}
          <div className="flex items-center gap-1 shrink-0">
            {hasLiveDemo && (
              <>
                {/* Device Mode Switcher (Desktop / Mobile Mode) */}
                <div className="flex items-center bg-[var(--color-surface-card)] rounded-md p-0.5 border border-[var(--color-border)] mr-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeviceMode('desktop')
                    }}
                    className={`px-1.5 py-0.5 rounded flex items-center gap-1 text-[9px] font-mono transition-colors cursor-pointer ${
                      deviceMode === 'desktop'
                        ? 'bg-[var(--color-primary)] text-[var(--color-primary-text)] font-bold shadow-xs'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                    }`}
                    title="Desktop Mode (Full desktop layout)"
                  >
                    <Monitor className="w-2.5 h-2.5" />
                    <span className="hidden sm:inline">Desktop</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeviceMode('mobile')
                    }}
                    className={`px-1.5 py-0.5 rounded flex items-center gap-1 text-[9px] font-mono transition-colors cursor-pointer ${
                      deviceMode === 'mobile'
                        ? 'bg-[var(--color-primary)] text-[var(--color-primary-text)] font-bold shadow-xs'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                    }`}
                    title="Mobile Mode (Responsive mobile layout)"
                  >
                    <Smartphone className="w-2.5 h-2.5" />
                    <span className="hidden sm:inline">Mobile</span>
                  </button>
                </div>

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
