import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreloaderProps {
  onComplete?: () => void
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0)
  const [isPushing, setIsPushing] = useState(false)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // 1. Counter simulation interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        const remaining = 100 - prev
        const step = Math.max(1, Math.min(Math.floor(Math.random() * 4) + 2, Math.ceil(remaining / 3)))
        return Math.min(100, prev + step)
      })
    }, 30)

    return () => clearInterval(interval)
  }, [])

  // 2. Trigger push wipe when counter reaches 100%
  const isFinishedCount = count >= 100
  useEffect(() => {
    if (!isFinishedCount) return
    setIsPushing(true)

    // Hold brand reveal and complete transition after 2.6s
    const timer = setTimeout(() => {
      onCompleteRef.current?.()
    }, 2600)

    return () => clearTimeout(timer)
  }, [isFinishedCount])

  const handleSkip = () => {
    onCompleteRef.current?.()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isPushing ? [1, 1, 0] : 1 }}
        transition={{ times: [0, 0.84, 1], duration: 2.6, ease: 'easeInOut' }}
        className="fixed inset-0 z-[9999] bg-[#111110] text-[#edeae4] flex items-center justify-center overflow-hidden select-none"
      >
        {/* 1. Base Revealed Dark Canvas (Warm Obsidian) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 py-6 select-none pointer-events-none bg-[#111110] overflow-hidden"
        >
          {/* Minimalist Monogram & Typography Lockup */}
          <div className="flex flex-col items-center justify-center text-center w-full max-w-2xl px-2 space-y-3 sm:space-y-5">
            {/* Custom Monogram Emblem (QAA in Serif with Burnished Gold Accent) */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 font-serif text-5xl sm:text-8xl md:text-9xl tracking-tighter leading-none select-none">
              <motion.span
                initial={{ opacity: 0, y: 18, scale: 0.92 }}
                animate={isPushing ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0.25, y: 0, scale: 1 }}
                transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
                className="text-[#edeae4] font-light"
              >
                Q
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 18, scale: 0.92 }}
                animate={isPushing ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0.25, y: 0, scale: 1 }}
                transition={{ duration: 0.55, delay: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
                className="text-[#d4a359] font-normal italic px-0.5"
              >
                A
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 18, scale: 0.92 }}
                animate={isPushing ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0.25, y: 0, scale: 1 }}
                transition={{ duration: 0.55, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
                className="text-[#edeae4] font-light"
              >
                A
              </motion.span>
            </div>

            {/* Minimalist Divider Line with Accent Dot */}
            <motion.div
              initial={{ scaleX: 0.4, opacity: 0 }}
              animate={isPushing ? { scaleX: 1, opacity: 1 } : { scaleX: 0.4, opacity: 0.2 }}
              transition={{ duration: 0.45, delay: 0.35, ease: 'easeOut' }}
              className="flex items-center justify-center gap-3 w-28 sm:w-48 my-1"
            >
              <span className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#2a2926] to-transparent" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4a359] shrink-0" />
              <span className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#2a2926] to-transparent" />
            </motion.div>

            {/* Full Name in Spaced Serif — always fits on a single line on mobile */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={isPushing ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
              className="font-serif text-[13px] xs:text-sm sm:text-xl md:text-2xl text-[#edeae4] tracking-[0.14em] sm:tracking-[0.28em] uppercase font-medium whitespace-nowrap"
            >
              Quadri Ayomikun Amoo
            </motion.h2>

            {/* Subtitle Role */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={isPushing ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 0 }}
              transition={{ duration: 0.45, delay: 0.5, ease: 'easeOut' }}
              className="font-mono text-[10px] sm:text-xs text-[#a19d95] tracking-[0.16em] sm:tracking-[0.22em] uppercase font-normal whitespace-nowrap"
            >
              Software Engineer &amp; Researcher
            </motion.p>
          </div>
        </motion.div>

        {/* 2. Dark Curtain Overlay Panel */}
        <motion.div
          animate={isPushing ? { x: '100%' } : { x: '0%' }}
          transition={{ duration: 1.15, delay: 0.15, ease: [0.65, 0, 0.35, 1] as const }}
          className="absolute inset-0 z-10 bg-[#111110] text-[#edeae4] flex flex-col justify-between p-4 sm:p-8 md:p-14 shadow-[-20px_0_50px_rgba(10,10,9,0.95)] border-l border-[#2a2926] overflow-hidden"
        >
          {/* Header Bar — Full Name on All Screens */}
          <div className="flex justify-between items-center w-full z-20 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#d4a359] animate-pulse shrink-0 shadow-[0_0_8px_#d4a359]" />
              <span className="font-mono text-[10px] xs:text-[11px] sm:text-xs md:text-sm tracking-[0.08em] sm:tracking-widest uppercase text-[#edeae4] font-semibold whitespace-nowrap">
                Quadri Ayomikun Amoo
              </span>
            </div>
            <button
              onClick={handleSkip}
              className="font-mono text-[10px] xs:text-xs uppercase tracking-wider text-[#a19d95] hover:text-[#d4a359] transition-colors cursor-pointer border border-[#2a2926] hover:border-[#d4a359]/40 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full shrink-0 whitespace-nowrap bg-[#181816]/90"
            >
              Skip →
            </button>
          </div>

          {/* Center-Balanced Brand + Counter Display on Mobile & Desktop */}
          <div className="flex flex-col items-center sm:items-end justify-center sm:justify-end my-auto sm:my-0 sm:mb-10 md:mb-16 z-20 w-full sm:max-w-md sm:self-end px-2 sm:px-0">
            <div className="sm:hidden mb-4 text-center space-y-1">
              <div className="font-serif text-3xl tracking-tight leading-none">
                <span className="text-[#edeae4] font-light">Q</span>
                <span className="text-[#d4a359] italic px-0.5">A</span>
                <span className="text-[#edeae4] font-light">A</span>
              </div>
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#a19d95]">
                Quadri Ayomikun Amoo
              </p>
            </div>

            <div className="font-mono text-6xl xs:text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter text-[#edeae4] leading-none">
              {count.toString().padStart(3, '0')}
              <span className="text-[#d4a359]">%</span>
            </div>
            <div className="w-full max-w-[260px] sm:max-w-full h-1.5 bg-[#181816] rounded-full mt-3 sm:mt-4 overflow-hidden border border-[#2a2926]">
              <div
                className="h-full bg-[#d4a359] transition-all duration-100 ease-out rounded-full shadow-[0_0_12px_rgba(212,163,89,0.5)]"
                style={{ width: `${count}%` }}
              />
            </div>
            <p className="font-mono text-[10px] sm:text-xs text-[#a19d95] uppercase tracking-widest mt-2.5 sm:mt-3">
              {isPushing ? 'Revealing Portfolio...' : 'Loading Experience...'}
            </p>
          </div>

          {/* Footer Bar */}
          <div className="flex justify-between items-center w-full font-mono text-[9px] xs:text-[10px] md:text-xs text-[#a19d95] uppercase tracking-widest z-40 border-t border-[#2a2926] pt-3 sm:pt-4 gap-2 bg-gradient-to-t from-[#111110] via-[#111110]/80 to-transparent">
            <span className="truncate">AI &amp; Software Engineering</span>
            <span className="shrink-0">© {new Date().getFullYear()}</span>
          </div>
        </motion.div>

        {/* 3. Character Pushing at the Left Curtain Seam (wrapped so -translate-x is never overwritten by Framer Motion) */}
        <motion.div
          initial={{ x: '0vw', opacity: 0 }}
          animate={
            isPushing
              ? {
                  x: ['0vw', '100vw'],
                  opacity: [1, 1, 0],
                  y: [0, -6, 0, -6, 0]
                }
              : {
                  x: '0vw',
                  opacity: 0,
                  y: 0
                }
          }
          transition={{
            duration: isPushing ? 1.15 : 0.3,
            delay: isPushing ? 0.15 : 0,
            ease: [0.65, 0, 0.35, 1] as const
          }}
          className="absolute z-30 pointer-events-none left-0 bottom-[6vh] sm:bottom-[6vh]"
        >
          <div className="relative -translate-x-[78%] sm:-translate-x-[84%]">
            <div className="absolute inset-0 bg-[#d4a359]/10 rounded-full blur-xl -z-10 scale-90" />
            <img
              src="/character-push.webp"
              alt="Character pushing curtain"
              width={400}
              height={700}
              className="h-[26vh] sm:h-[58vh] md:h-[72vh] w-auto max-w-none object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
