import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

interface PreloaderProps {
  onComplete?: () => void
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0)
  const [isPushing, setIsPushing] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const curtainRef = useRef<HTMLDivElement>(null)
  const characterRef = useRef<HTMLDivElement>(null)
  const bgTextRef = useRef<HTMLDivElement>(null)
  const counterTextRef = useRef<HTMLDivElement>(null)
  const progressLineRef = useRef<HTMLDivElement>(null)

  // Motion reveal refs for clean staggered entrance
  const letterQRef = useRef<HTMLSpanElement>(null)
  const letterARef = useRef<HTMLSpanElement>(null)
  const letterA2Ref = useRef<HTMLSpanElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const nameTextRef = useRef<HTMLHeadingElement>(null)
  const roleTextRef = useRef<HTMLParagraphElement>(null)

  // 1. Counter simulation interval - Paced smoothly over ~2.4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        const remaining = 100 - prev
        const step = Math.max(1, Math.min(Math.floor(Math.random() * 3) + 1, Math.ceil(remaining / 4)))
        return Math.min(100, prev + step)
      })
    }, 40)

    return () => clearInterval(interval)
  }, [])

  // 2. Initial state setup with GSAP
  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.set(bgTextRef.current, { opacity: 0, scale: 0.98 })
      gsap.set(characterRef.current, { opacity: 0, scale: 0.95 })

      gsap.to(bgTextRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.1
      })

      gsap.to(characterRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.2
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // 3. Trigger Synchronized Push Wipe & Staggered Brand Reveal on 100%
  useEffect(() => {
    if (count < 100) return
    setIsPushing(true)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete()
        }
      })

      // Anticipation strain before pushing curtain
      tl.to(characterRef.current, {
        rotate: -3,
        scale: 0.97,
        duration: 0.18,
        ease: 'power1.in'
      })
      .to(characterRef.current, {
        rotate: 0,
        scale: 1,
        duration: 0.18,
        ease: 'power1.out'
      })

      // Main push animation: Curtain and character translate 100vw together in 1:1 sync
      tl.to(curtainRef.current, {
        xPercent: 100,
        duration: 1.5,
        ease: 'power3.inOut'
      }, 'pushStart')

      tl.to(characterRef.current, {
        x: '100vw',
        duration: 1.5,
        ease: 'power3.inOut'
      }, 'pushStart')

      // Step-walking vertical bounce on character
      tl.to(characterRef.current, {
        y: -10,
        repeat: 6,
        yoyo: true,
        duration: 0.12,
        ease: 'sine.inOut'
      }, 'pushStart')

      // STAGGERED ELEVATED TYPOGRAPHY REVEAL ANIMATION AS CURTAIN OPENS
      tl.fromTo([letterQRef.current, letterARef.current, letterA2Ref.current],
        { opacity: 0, y: 25, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: 'back.out(1.5)' },
        'pushStart+=0.3'
      )

      tl.fromTo(dividerRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power2.out' },
        'pushStart+=0.7'
      )

      tl.fromTo(nameTextRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        'pushStart+=0.8'
      )

      tl.fromTo(roleTextRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        'pushStart+=0.95'
      )

      // HOLD REVEALED BRAND EMBLEM ON SCREEN SO IT IS EASY TO APPRECIATE
      tl.to({}, { duration: 1.2 })

      // Smooth exit fade out of the container
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut'
      })

    }, containerRef)

    return () => ctx.revert()
  }, [count, onComplete])

  const handleSkip = () => {
    setCount(100)
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#050505] text-white flex items-center justify-center overflow-hidden select-none"
    >
      {/* 1. Base Revealed Dark Canvas (Clean Pure Black - Zero AI Glow Blobs) */}
      <div 
        ref={bgTextRef} 
        className="absolute inset-0 flex flex-col items-center justify-center p-6 select-none pointer-events-none bg-[#050505] overflow-hidden"
      >
        {/* Minimalist Monogram & Typography Lockup */}
        <div className="flex flex-col items-center justify-center text-center max-w-2xl px-4 space-y-4 sm:space-y-6">
          
          {/* Custom Monogram Emblem (QAA in Serif with Lime Accent) */}
          <div className="flex items-center justify-center gap-1 sm:gap-2 font-serif text-6xl xs:text-7xl sm:text-9xl tracking-tighter leading-none select-none">
            <span ref={letterQRef} className="text-neutral-100 font-light">Q</span>
            <span ref={letterARef} className="text-[#C4FA4C] font-normal italic px-0.5">A</span>
            <span ref={letterA2Ref} className="text-neutral-100 font-light">A</span>
          </div>

          {/* Minimalist Divider Line with Accent Dot */}
          <div ref={dividerRef} className="flex items-center justify-center gap-3 w-32 sm:w-48 my-1 sm:my-2">
            <span className="h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4FA4C] shrink-0" />
            <span className="h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
          </div>

          {/* Full Name in Spaced Serif */}
          <h2 ref={nameTextRef} className="font-serif text-xs xs:text-sm sm:text-xl md:text-2xl text-neutral-200 tracking-[0.25em] xs:tracking-[0.3em] uppercase font-medium">
            Quadri Ayomikun Amoo
          </h2>

          {/* Subtitle Role */}
          <p ref={roleTextRef} className="font-mono text-[9px] xs:text-[10px] sm:text-xs text-neutral-400 tracking-[0.2em] uppercase font-normal">
            Software Engineer & Researcher
          </p>

        </div>
      </div>

      {/* 2. Dark Curtain Overlay Panel */}
      <div
        ref={curtainRef}
        className="absolute inset-0 z-10 bg-[#050505] text-white flex flex-col justify-between p-4 sm:p-8 md:p-14 shadow-[20px_0_50px_rgba(0,0,0,0.9)] border-r border-neutral-800/50 overflow-hidden"
      >
        {/* Header Bar */}
        <div className="flex justify-between items-center w-full z-20 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C4FA4C] animate-pulse shrink-0 shadow-[0_0_8px_#C4FA4C]" />
            <span className="font-mono text-[10px] xs:text-xs md:text-sm tracking-widest uppercase text-neutral-300 font-semibold truncate">
              <span className="sm:hidden">Quadri Amoo</span>
              <span className="hidden sm:inline">Quadri Ayomikun Amoo</span> — Portfolio
            </span>
          </div>
          <button 
            onClick={handleSkip}
            className="font-mono text-[10px] xs:text-xs uppercase tracking-widest text-neutral-400 hover:text-[#C4FA4C] transition-colors cursor-pointer border border-neutral-800 hover:border-[#C4FA4C]/40 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full shrink-0 whitespace-nowrap bg-neutral-950/60"
          >
            Skip Intro →
          </button>
        </div>

        {/* Counter Display */}
        <div 
          ref={counterTextRef}
          className="flex flex-col items-end justify-end my-auto sm:my-0 sm:mb-10 md:mb-16 z-20 self-end max-w-[210px] xs:max-w-[260px] sm:max-w-md w-full py-6 sm:py-0"
        >
          <div className="font-mono text-4xl xs:text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-white">
            {count.toString().padStart(3, '0')}<span className="text-[#C4FA4C]">%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-900 rounded-full mt-2 sm:mt-4 overflow-hidden border border-neutral-800/80">
            <div
              ref={progressLineRef}
              className="h-full bg-[#C4FA4C] transition-all duration-100 ease-out rounded-full shadow-[0_0_12px_rgba(196,250,76,0.6)]"
              style={{ width: `${count}%` }}
            />
          </div>
          <p className="font-mono text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs text-neutral-400 uppercase tracking-wider mt-2 sm:mt-3">
            {isPushing ? 'Revealing Portfolio...' : 'Loading Experience...'}
          </p>
        </div>

        {/* Footer Bar */}
        <div className="flex justify-between items-center w-full font-mono text-[9px] xs:text-[10px] md:text-xs text-neutral-400 uppercase tracking-widest z-40 border-t border-neutral-900/80 pt-3 sm:pt-4 gap-2 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent">
          <span className="truncate">AI & Software Engineering</span>
          <span className="shrink-0">© 2026</span>
        </div>
      </div>

      {/* 3. Character Pushing at the Curtain Boundary */}
      <div
        ref={characterRef}
        className="absolute z-30 pointer-events-none left-0 bottom-[3.5vh] sm:bottom-[5vh] md:bottom-[6vh]"
        style={{
          transform: 'translateX(-86%)' // Aligns hands flat against curtain's left edge
        }}
      >
        <div className="relative">
          {/* Subtle ambient glow behind character body for contrast */}
          <div className="absolute inset-0 bg-[#C4FA4C]/10 rounded-full blur-xl -z-10 scale-90" />
          <img
            src="/character-push.png"
            alt="Character pushing curtain"
            className="h-[32vh] xs:h-[40vh] sm:h-[62vh] md:h-[76vh] w-auto max-w-none object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
          />
        </div>
      </div>
    </div>
  )
}







