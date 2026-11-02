import React, { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  decimals?: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  decimals = 0,
  duration = 1.8,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  // Check prefers-reduced-motion for accessibility (Issue 4.8)
  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const finalString = decimals > 0 ? value.toFixed(decimals) : value.toString()

  // Initialize directly to finalString for reduced-motion or SSR, otherwise 0
  const [displayValue, setDisplayValue] = useState<string>(() => {
    if (prefersReducedMotion) return finalString
    return decimals > 0 ? (0).toFixed(decimals) : '0'
  })

  useEffect(() => {
    // If user prefers reduced motion, skip the animation loop entirely
    if (prefersReducedMotion) {
      setDisplayValue(finalString)
      return
    }

    if (!isInView) return

    let startTime: number | null = null
    let animationFrameId: number

    const easeOutExpo = (t: number): number => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
    }

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = (timestamp - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutExpo(progress)

      const current = easedProgress * value
      setDisplayValue(decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString())

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step)
      } else {
        setDisplayValue(finalString)
      }
    }

    animationFrameId = requestAnimationFrame(step)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [isInView, value, decimals, duration, prefersReducedMotion, finalString])

  return (
    <span
      ref={ref}
      className={className}
      aria-label={`${prefix}${finalString}${suffix}`}
      role="text"
    >
      <span aria-hidden="true">{prefix}</span>
      <span aria-hidden="true">{displayValue}</span>
      <span aria-hidden="true">{suffix}</span>
    </span>
  )
}
