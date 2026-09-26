import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

interface PreloaderProps {
  onComplete?: () => void
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0)
  const preloaderRef = useRef<HTMLDivElement>(null)
  const emblemRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Counter 0 -> 100
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 45)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!preloaderRef.current) return

    const ctx = gsap.context(() => {
      // Entry GSAP sequence
      gsap.fromTo(emblemRef.current,
        { opacity: 0, scale: 0.85, rotate: -5 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1.1, ease: 'power3.out' }
      )
      gsap.fromTo(nameRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.9, delay: 0.3, ease: 'power3.out' }
      )
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: 'power3.out' }
      )
    }, preloaderRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (count === 100 && preloaderRef.current) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            if (onComplete) onComplete()
          }
        })

        tl.to([emblemRef.current, nameRef.current, titleRef.current, counterRef.current], {
          opacity: 0,
          scale: 0.95,
          duration: 0.5,
          ease: 'power2.in'
        })
        .to(preloaderRef.current, {
          yPercent: -100,
          duration: 0.9,
          ease: 'power4.inOut'
        }, "-=0.1")

      }, preloaderRef)

      return () => ctx.revert()
    }
  }, [count, onComplete])

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[100] bg-[#070A10] text-[#F8FAFC] flex flex-col justify-between p-8 sm:p-12 overflow-hidden select-none"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto text-[11px] font-mono text-slate-500 uppercase tracking-widest">
        <span>EST. 2026</span>
        <span>PORTFOLIO ENTRY</span>
      </div>

      {/* Center Luxury Emblem Composition */}
      <div className="max-w-xl mx-auto w-full text-center space-y-6 my-auto flex flex-col items-center justify-center">
        
        {/* Name Above */}
        <div
          ref={nameRef}
          className="font-serif uppercase tracking-[0.35em] text-xs sm:text-sm text-slate-300 font-medium"
        >
          QUADRI AYOMIKUN AMOO
        </div>

        {/* Circular Monogram Emblem */}
        <div
          ref={emblemRef}
          className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-[var(--color-primary)]/40 flex items-center justify-center my-2 shadow-2xl bg-[#090E18]"
        >
          {/* Inner Decorative Ring */}
          <div className="absolute inset-1.5 rounded-full border border-emerald-500/20" />
          
          {/* Monogram QA */}
          <span
            className="font-serif font-bold text-4xl sm:text-6xl text-white tracking-tight leading-none"
            style={{ fontFamily: "'Fraunces Variable', Georgia, serif" }}
          >
            QA
          </span>
        </div>

        {/* Subtitle Below */}
        <div
          ref={titleRef}
          className="text-xs font-mono uppercase tracking-[0.25em] text-[var(--color-primary)] font-semibold"
        >
          SOFTWARE ENGINEERING & AI RESEARCH
        </div>

      </div>

      {/* Bottom Counter */}
      <div ref={counterRef} className="flex items-center justify-between w-full max-w-7xl mx-auto text-xs font-mono text-slate-500 border-t border-slate-800/80 pt-4">
        <span>5.0/5.0 MAJOR GPA • RESEARCH SCHOLAR</span>
        <span className="font-bold text-[var(--color-primary)]">
          [ {String(count).padStart(3, '0')} ]
        </span>
      </div>
    </div>
  )
}
