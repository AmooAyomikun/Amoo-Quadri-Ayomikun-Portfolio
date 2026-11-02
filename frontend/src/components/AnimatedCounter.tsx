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
  const [displayValue, setDisplayValue] = useState<string>(
    decimals > 0 ? (0).toFixed(decimals) : '0'
  )

  useEffect(() => {
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
        setDisplayValue(decimals > 0 ? value.toFixed(decimals) : value.toString())
      }
    }

    animationFrameId = requestAnimationFrame(step)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [isInView, value, decimals, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}
