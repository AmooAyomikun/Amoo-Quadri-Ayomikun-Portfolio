import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent, useSpring } from 'framer-motion'
import profileImg from '../assets/profile.png'

interface PhotoCardProps {
  imgSrc: string
  alt: string
  tilt: 'left' | 'right'
}

const PhotoCard: React.FC<PhotoCardProps> = ({ imgSrc, alt, tilt }) => {
  const isLeft = tilt === 'left'
  return (
    <div className="relative w-fit group cursor-pointer select-none">
      {/* Background sleeve/holder slot */}
      <div className="rounded-[20px] sm:rounded-[22px] border border-[var(--color-border)] p-2 w-[185px] h-[260px] sm:w-[210px] sm:h-[295px] bg-[var(--color-surface-card)] backdrop-blur-sm shadow-xl transition-all duration-300 group-hover:border-[var(--color-primary)]/40">
        <div className="w-full h-full rounded-xl border border-[var(--color-border)]/50 bg-[var(--color-surface-elevated)] flex items-center justify-center">
          <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-[var(--color-text-subtle)] uppercase font-semibold">
            AQA • ARCHIVE
          </span>
        </div>
      </div>

      {/* Foreground tilted photograph */}
      <img
        src={imgSrc}
        alt={alt}
        className={`absolute left-0 top-0 w-[178px] h-[252px] sm:w-[202px] sm:h-[287px] rounded-xl object-cover object-top shadow-2xl border border-[var(--color-border)] transition-all duration-500 ease-out filter contrast-[1.05] group-hover:rotate-0 group-hover:scale-[1.02] group-hover:border-[var(--color-primary)]/50 ${
          isLeft ? 'rotate-[-5deg] sm:rotate-[-6deg]' : 'rotate-[5deg] sm:rotate-[6deg]'
        }`}
      />
    </div>
  )
}

export const AboutJourneySection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  // Interactive dot coordinates calculated along the serpentine SVG path
  const [dotPos, setDotPos] = useState<{ x: number; y: number }>({ x: 145, y: 0.5 })

  // Track scroll progress through this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 35%', 'end 85%'],
  })

  // Calibrated smooth spring physics for natural scroll dot movement
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 24,
    mass: 0.5,
    restDelta: 0.001,
  })

  // Synchronize dot movement with user scroll along the winding SVG path
  useMotionValueEvent(smoothProgress, 'change', (latest: number) => {
    if (pathRef.current) {
      try {
        const totalLength = pathRef.current.getTotalLength()
        const clamped = Math.max(0, Math.min(1, latest))
        const point = pathRef.current.getPointAtLength(clamped * totalLength)
        setDotPos({ x: point.x, y: point.y })
      } catch {
        // Fallback gracefully
      }
    }
  })

  // Initialize dot position on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pathRef.current) {
        try {
          const point = pathRef.current.getPointAtLength(0)
          setDotPos({ x: point.x, y: point.y })
        } catch {
          // ignore
        }
      }
    }, 150)
    return () => clearTimeout(timer)
  }, [])

  // Braydon Coyer Serpentine Circuit Path:
  // Left track is at x = 4, Right track is at x = 272. Midpoint is at x = 138 (container center 50%).
  // M1: starts y=64, ends y=444. Crossover 1 at y=556 (in Gap 1->2).
  // M2: starts y=564, ends y=944.
  // Crossover 2 in Gap 2->3 (y=944 to 1124): diagonal 951->1038, horizontal at y=1042.6, transitions to left track by y=1058.6.
  // M3: starts y=1124, ends y=1504. Wire travels safely down left track at x=4, completely clear of 'Life Beyond Code' heading.
  // Crossover 3 in Gap 3->4 (y=1504 to 1644): horizontal at y=1586.
  // M4: starts y=1644, docks into photo card at x=325, y=1840.
  const serpentinePathD = `M145 0.5 L145 10 C145 14.4 141.4 18 137 18 L20 18 C11.2 18 4 25.2 4 34 L4 540 C4 548.8 11.2 556 20 556 L256 556 C264.8 556 272 563.2 272 572 L272 940 C272 944.2 270.3 948.3 267.3 951.3 L180.7 1037.9 C177.7 1040.9 173.6 1042.6 169.4 1042.6 L20 1042.6 C11.2 1042.6 4 1049.8 4 1058.6 L4 1570 C4 1578.8 11.2 1586 20 1586 L256 1586 C264.8 1586 272 1593.2 272 1602 L272 1825 C272 1833.8 279.2 1840 288 1840 L325 1840`

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative pt-10 sm:pt-16 pb-12 sm:pb-16 bg-[var(--color-surface-base)] text-[var(--color-text-main)] scroll-mt-16 overflow-hidden transition-colors duration-200"
    >
      {/* Subtle Ambient Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(var(--color-primary)_1px,transparent_1px)] [background-size:28px_28px]" />

      {/* Top Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-8 sm:mb-12 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-primary)] font-semibold bg-[var(--color-surface-card)] px-4 py-1.5 rounded-full border border-[var(--color-border)] shadow-xs">
            About
          </span>
          <h2 className="text-2xl sm:text-4xl font-sans font-bold text-[var(--color-text-main)] tracking-tight mt-3 leading-tight">
            Here&apos;s a quick intro about me and what I love to do
          </h2>
        </motion.div>
      </div>

      {/* Main Journey Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-4 sm:pt-8 lg:pt-16">

        {/* =========================================================================
            DESKTOP INTERACTIVE SERPENTINE SVG WIRE WITH SCROLL-TRACKING MOVING DOT
            (Rendered at z-30 with pointer-events-none so wire & terminal dot cleanly join with the cards)
        ========================================================================= */}
        <div
          className="pointer-events-none absolute top-0 h-[2020px] w-[380px] hidden lg:block z-30"
          style={{ left: 'calc(50% - 138px)' }}
        >
          <svg
            className="w-[380px] h-[2020px]"
            viewBox="-10 -10 400 2040"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="tealGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Base Background Track (Faint Circuit Wire) */}
            <path
              d={serpentinePathD}
              stroke="var(--color-border)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Active Highlight Stroke (Fills progressively as user scrolls) */}
            <motion.path
              ref={pathRef}
              d={serpentinePathD}
              stroke="var(--color-primary)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                pathLength: smoothProgress,
                filter: 'drop-shadow(0 0 6px var(--color-primary-light))',
              }}
            />

            {/* Terminal Docking Junction onto the final Photo Card */}
            <circle cx="325" cy="1840" r="5" className="fill-[var(--color-primary)]" />
            <circle cx="325" cy="1840" r="8" fill="none" stroke="var(--color-border)" strokeWidth="2" />

            {/* THE INTERACTIVE MOVING GLOWING DOT */}
            <g transform={`translate(${dotPos.x}, ${dotPos.y})`}>
              {/* Outer Soft Halo Glow */}
              <circle
                r="11"
                fill="var(--color-primary)"
                opacity="0.25"
                filter="url(#tealGlow)"
              />
              {/* Core Solid Radiant Dot */}
              <circle
                r="7.5"
                fill="var(--color-primary)"
                filter="url(#tealGlow)"
              />
            </g>
          </svg>
        </div>

        {/* =========================================================================
            MILESTONE 1: My Programming Origins & Academic Foundation
            Desktop: Photo Left, Story Right
            Mobile: Photo Top, Story Bottom (never adjacent to next photo!)
        ========================================================================= */}
        <div className="relative z-20 h-auto lg:h-[380px] flex items-center mb-12 sm:mb-16 lg:mb-0">
          <div className="w-full relative flex flex-col items-center lg:block">
            
            {/* Photo Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-end lg:w-1/2 lg:pr-[155px]"
            >
              <PhotoCard
                imgSrc={profileImg}
                alt="Quadri Amoo - Software Engineer"
                tilt="left"
              />
            </motion.div>

            {/* Story Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
              className="mt-6 lg:mt-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:left-[calc(50%-90px)] max-w-lg lg:max-w-[420px] text-left space-y-3 sm:space-y-4"
            >
              <h3 className="text-xl sm:text-3xl font-sans font-bold text-[var(--color-text-main)] tracking-tight">
                My programming origins
              </h3>
              <p className="text-[var(--color-text-muted)] text-xs sm:text-base leading-relaxed">
                My journey into technology began with a deep curiosity for how software systems operate under the hood. That curiosity led me to pursue a degree in Software Engineering at <strong className="text-[var(--color-text-main)]">Abiola Ajimobi Technical University</strong>, where I recently graduated in the <strong className="text-[var(--color-primary)]">Top 10% of my class</strong> with Second-Class Upper Honors.
              </p>
              <p className="text-[var(--color-text-muted)] text-xs sm:text-base leading-relaxed">
                During my studies, I maintained a <strong className="text-[var(--color-text-main)]">4.45 / 5.00 Final CGPA</strong> alongside a perfect <strong className="text-[var(--color-primary)]">5.0 / 5.0 Major GPA</strong>, earning four subject-specific excellence awards in Operating Systems, Human-Computer Interaction, Software Engineering Practice, and Data Structures.
              </p>
            </motion.div>

          </div>
        </div>

        {/* Transition gap between 1 and 2 on desktop */}
        <div className="hidden lg:block h-[120px]" />

        {/* =========================================================================
            MILESTONE 2: Finding My Way to Web
            Desktop: Story Left, Photo Right
            Mobile: Photo Top, Story Bottom (consistent order prevents 2 images back-to-back!)
        ========================================================================= */}
        <div className="relative z-20 h-auto lg:h-[380px] flex items-center mb-12 sm:mb-16 lg:mb-0">
          <div className="w-full relative flex flex-col items-center lg:block">
            
            {/* Photo Card on right on desktop, on top on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-start lg:w-1/2 lg:ml-auto lg:pl-[155px]"
            >
              <PhotoCard
                imgSrc={profileImg}
                alt="Quadri Amoo - Web Engineering"
                tilt="right"
              />
            </motion.div>

            {/* Story Text on left on desktop, below photo on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
              className="mt-6 lg:mt-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:right-[calc(50%-90px)] max-w-lg lg:max-w-[420px] text-left space-y-3 sm:space-y-4"
            >
              <h3 className="text-xl sm:text-3xl font-sans font-bold text-[var(--color-text-main)] tracking-tight">
                Finding My Way to Web
              </h3>
              <p className="text-[var(--color-text-muted)] text-xs sm:text-base leading-relaxed">
                Despite exploring diverse fields of computing, modern web engineering kept calling my name. With my passion for clean design and performance, frontend and full-stack development felt like the perfect playground. I dove deep into modern HTML, CSS, JavaScript, TypeScript, and React.
              </p>
              <p className="text-[var(--color-text-muted)] text-xs sm:text-base leading-relaxed">
                For my undergraduate thesis supervised by <strong className="text-[var(--color-text-main)]">Dr. J.E.T. Akinsola</strong>, I engineered an intelligent location-based recommendation engine. Bridging theoretical Computer Science research with real-world, accessible web systems became my core mission.
              </p>
            </motion.div>

          </div>
        </div>

        {/* Transition gap between 2 and 3 on desktop */}
        <div className="hidden lg:block h-[180px]" />

        {/* =========================================================================
            MILESTONE 3: Life Beyond Code
            Desktop: Photo Left, Story Right
            Mobile: Photo Top, Story Bottom
        ========================================================================= */}
        <div className="relative z-20 h-auto lg:h-[380px] flex items-center mb-12 sm:mb-16 lg:mb-0">
          <div className="w-full relative flex flex-col items-center lg:block">
            
            {/* Photo Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-end lg:w-1/2 lg:pr-[155px]"
            >
              <PhotoCard
                imgSrc={profileImg}
                alt="Quadri Amoo - Mentorship & Teaching"
                tilt="left"
              />
            </motion.div>

            {/* Story Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
              className="mt-6 lg:mt-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:left-[calc(50%-90px)] max-w-lg lg:max-w-[420px] text-left space-y-3 sm:space-y-4"
            >
              <h3 className="text-xl sm:text-3xl font-sans font-bold text-[var(--color-text-main)] tracking-tight">
                Life Beyond Code
              </h3>
              <p className="text-[var(--color-text-muted)] text-xs sm:text-base leading-relaxed">
                Knowledge sharing has always been at the core of my journey. During my undergraduate years, I spent significant time every single week breaking down difficult topics like <strong className="text-[var(--color-text-main)]">Data Structures, Algorithms, and Discrete Mathematics</strong> for over 350 peers.
              </p>
              <p className="text-[var(--color-text-muted)] text-sm sm:text-base leading-relaxed">
                As an Academic Support Officer with the Nigerian Association of Software Engineering Students (NASSA), I organized foundational workshops for more than 100 students. Seeing peers unlock difficult computing concepts and thrive in their careers is one of the most rewarding experiences I cherish.
              </p>
            </motion.div>

          </div>
        </div>

        {/* Transition gap between 3 and 4 on desktop */}
        <div className="hidden lg:block h-[140px]" />

        {/* =========================================================================
            MILESTONE 4: These Days
            Desktop: Story Left, Photo Right (docks into circuit terminal)
            Mobile: Photo Top, Story Bottom
        ========================================================================= */}
        <div className="relative z-20 h-auto lg:h-[380px] flex items-center">
          <div className="w-full relative flex flex-col items-center lg:block">
            
            {/* Photo Card on right on desktop, on top on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-start lg:w-1/2 lg:ml-auto lg:pl-[155px]"
            >
              <PhotoCard
                imgSrc={profileImg}
                alt="Quadri Amoo - Research & AI Systems"
                tilt="right"
              />
            </motion.div>

            {/* Story Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
              className="mt-6 lg:mt-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:right-[calc(50%-90px)] max-w-lg lg:max-w-[420px] text-left space-y-3 sm:space-y-4"
            >
              <h3 className="text-xl sm:text-3xl font-sans font-bold text-[var(--color-text-main)] tracking-tight">
                These Days
              </h3>
              <p className="text-[var(--color-text-muted)] text-xs sm:text-base leading-relaxed">
                Currently, I serve as a Research Assistant under <strong className="text-[var(--color-text-main)]">Prof. Jude Sinebe</strong>, focusing on machine learning model validation, data-driven systems, and software reliability. When I&apos;m not writing code or evaluating models, I&apos;m publishing academic research and building open-source web tools.
              </p>
              <p className="text-[var(--color-text-muted)] text-xs sm:text-base leading-relaxed">
                Looking ahead, I am actively seeking <strong className="text-[var(--color-primary)]">postgraduate (MSc / PhD) placements</strong> and scholarship opportunities where I can dive deeper into Applied Artificial Intelligence, Natural Language Processing, and intelligent software engineering alongside world-class faculty.
              </p>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  )
}
