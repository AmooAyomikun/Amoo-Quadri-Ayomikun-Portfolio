import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselProps {
  children: React.ReactNode[]
  autoPlay?: boolean
  interval?: number
  itemsPerPageDesktop?: number
  className?: string
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  autoPlay = false,
  interval = 5000,
  itemsPerPageDesktop = 3,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageDesktop)
  const containerRef = useRef<HTMLDivElement>(null)

  // Responsive items count calculation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1)
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(Math.min(2, itemsPerPageDesktop))
      } else {
        setItemsPerPage(itemsPerPageDesktop)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [itemsPerPageDesktop])

  const maxIndex = Math.max(0, children.length - itemsPerPage)

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1))
  }

  // Auto play effect
  useEffect(() => {
    if (!autoPlay || maxIndex === 0) return
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1))
    }, interval)
    return () => clearInterval(timer)
  }, [autoPlay, interval, maxIndex])

  if (children.length === 0) return null

  return (
    <div className={`relative w-full ${className}`}>
      {/* Navigation Controls Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1.5 items-center">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? 'w-6 bg-[var(--color-primary)]'
                  : 'w-2 bg-[var(--color-border-hover)] hover:bg-[var(--color-text-subtle)]'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Previous slide"
            className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-main)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Next slide"
            className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-main)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Carousel Track */}
      <div ref={containerRef} className="overflow-hidden py-2 -mx-2 px-2">
        <div
          className="flex transition-transform duration-500 ease-out gap-6"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`
          }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="shrink-0 flex"
              style={{
                width: `calc(${100 / itemsPerPage}% - ${(6 * (itemsPerPage - 1)) / itemsPerPage}px)`
              }}
            >
              <div className="w-full">{child}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
