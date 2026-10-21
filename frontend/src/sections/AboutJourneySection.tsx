import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent, useSpring } from 'framer-motion'
import profileImg from '../assets/profile.png'
import aboutWebImg from '../assets/about-web.jpg'
import aboutTutoringImg from '../assets/about-tutoring.jpg'
import aboutConferenceImg from '../assets/about-conference.jpg'

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
      <div className="rounded-[22px] border border-[#233554] p-2 w-[210px] h-[295px] bg-[#112240]/40 backdrop-blur-sm shadow-xl transition-all duration-300 group-hover:border-[#64ffda]/40">
        <div className="w-full h-full rounded-xl border border-[#233554]/50 bg-[#0a192f]/60 flex items-center justify-center">
          <span className="font-mono text-[10px] tracking-widest text-[#495670] uppercase">
            AQA • ARCHIVE
          </span>
        </div>
      </div>

      {/* Foreground tilted photograph */}
      <img
        src={imgSrc}
        alt={alt}
        className={`absolute left-0 top-0 w-[202px] h-[287px] rounded-xl object-cover shadow-2xl border border-[#233554] transition-all duration-500 ease-out filter contrast-[1.05] group-hover:rotate-0 group-hover:scale-[1.02] group-hover:border-[#64ffda]/50 ${
          isLeft ? 'rotate-[-6deg]' : 'rotate-[6deg]'
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

  // Track scroll progress through this section with a natural, measured scroll range
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 35%', 'end 85%']
  })

  // Calibrated smooth spring physics for a graceful, measured scroll dot movement
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 24,
    mass: 0.5,
    restDelta: 0.001
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
  // M1 Center: y = 318 (runs at x = 4, text ends at y = 448, crossover at y = 556 -> 108px clearance)
  // M2 Center: y = 818 (runs at x = 272)
  // M3 Center: y = 1368 (runs at x = 4, text ends at y = 1528, crossover at y = 1626 -> 98px clearance)
  // M4 Center: y = 1898 (terminal wire docks into card sleeve at x = 325, y = 1898)
  const serpentinePathD = `M145 0.5 L145 10 C145 14.4 141.4 18 137 18 L20 18 C11.2 18 4 25.2 4 34 L4 540 C4 548.8 11.2 556 20 556 L256 556 C264.8 556 272 563.2 272 572 L272 1040 C272 1044.2 270.3 1048.3 267.3 1051.3 L180.7 1137.9 C177.7 1140.9 173.6 1142.6 169.4 1142.6 L20 1142.6 C11.2 1142.6 4 1149.8 4 1158.6 L4 1610 C4 1618.8 11.2 1626 20 1626 L256 1626 C264.8 1626 272 1633.2 272 1642 L272 1883 C272 1891.8 279.2 1898 288 1898 L325 1898`

  return (
    <section 
      id="about" 
      ref={containerRef}
      className="relative pt-20 sm:pt-28 pb-12 sm:pb-14 bg-[#0a192f] text-[#ccd6f6] scroll-mt-24 overflow-hidden"
    >
      {/* Subtle Ambient Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#64ffda_1px,transparent_1px)] [background-size:28px_28px]" />

      {/* Top Header */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-16 sm:mb-20 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-mono text-xs uppercase tracking-widest text-[#64ffda] font-semibold bg-[#112240] px-4 py-1.5 rounded-full border border-[#233554] shadow-sm">
            About
          </span>
          <h2 className="text-3xl sm:text-5xl font-sans font-bold text-[#ccd6f6] tracking-tight mt-4 leading-tight">
            Here's a quick intro about me and what I love to do
          </h2>
        </motion.div>
      </div>

      {/* Main Journey Container (Centered: max-w-4xl ~ 896px) with generous top space */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 pt-32">

        {/* =========================================================================
            DESKTOP INTERACTIVE SERPENTINE SVG WIRE WITH SCROLL-TRACKING MOVING DOT
            (Rendered at z-30 with pointer-events-none so wire & terminal dot cleanly join with the cards)
        ========================================================================= */}
        <div 
          className="pointer-events-none absolute top-0 h-[1980px] w-[380px] hidden lg:block z-30"
          style={{ left: 'calc(50% - 138px)' }}
        >
          <svg
            className="w-[380px] h-[1980px]"
            viewBox="-10 -10 400 2000"
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
              stroke="#233554"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Active Highlight Stroke (Fills progressively as user scrolls) */}
            <motion.path
              ref={pathRef}
              d={serpentinePathD}
              stroke="#64ffda"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                pathLength: smoothProgress,
                filter: 'drop-shadow(0 0 6px rgba(100,255,218,0.6))'
              }}
            />

            {/* Terminal Docking Junction onto the final Photo Card */}
            <circle cx="325" cy="1898" r="5" className="fill-[#64ffda]" />
            <circle cx="325" cy="1898" r="8" fill="none" stroke="#233554" strokeWidth="2" />

            {/* THE INTERACTIVE MOVING GLOWING DOT (Single solid traveling dot like Braydon Coyer) */}
            <g transform={`translate(${dotPos.x}, ${dotPos.y})`}>
              {/* Outer Soft Halo Glow */}
              <circle
                r="11"
                fill="#64ffda"
                opacity="0.25"
                filter="url(#tealGlow)"
              />
              {/* Core Solid Radiant Dot */}
              <circle
                r="7.5"
                fill="#64ffda"
                filter="url(#tealGlow)"
              />
            </g>
          </svg>
        </div>

        {/* Mobile Linear Vertical Wire */}
        <div className="lg:hidden absolute left-4 top-8 bottom-12 w-[2px] bg-[#233554] pointer-events-none" />

        {/* =========================================================================
            MILESTONE 1: My Programming Origins & Academic Foundation
            (Left: Tilted Photo Card, Right: Story Text — 65px intimate spacing)
        ========================================================================= */}
        <div className="relative z-20 h-auto lg:h-[380px] flex items-center mb-16 lg:mb-0">
          <div className="w-full relative lg:flex lg:items-center">
            
            {/* Left Column: Photo Card (right edge at 50% - 155px, 21px from Left Track) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-end lg:w-1/2 lg:pr-[155px]"
            >
              <PhotoCard 
                imgSrc={profileImg} 
                alt="Quadri Amoo - Software Engineer" 
                tilt="left" 
              />
            </motion.div>

            {/* Right Column: Story Text (left edge at 50% - 90px, 44px from Left Track) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="mt-8 lg:mt-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:left-[calc(50%-90px)] max-w-lg lg:max-w-[420px] text-left space-y-4"
            >
              <h3 className="text-2xl sm:text-3xl font-sans font-bold text-[#ccd6f6] tracking-tight">
                My programming origins
              </h3>
              <p className="text-[#8892b0] text-sm sm:text-base leading-relaxed">
                My journey into technology began with a deep curiosity for how software systems operate under the hood. That curiosity led me to pursue a degree in Software Engineering at <strong className="text-[#ccd6f6]">Abiola Ajimobi Technical University</strong>, where I recently graduated in the <strong className="text-[#64ffda]">Top 10% of my class</strong> with Second-Class Upper Honors.
              </p>
              <p className="text-[#8892b0] text-sm sm:text-base leading-relaxed">
                During my studies, I maintained a <strong className="text-[#ccd6f6]">4.45 / 5.00 Final CGPA</strong> alongside a perfect <strong className="text-[#64ffda]">5.0 / 5.0 Major GPA</strong>, earning four subject-specific excellence awards in Operating Systems, Human-Computer Interaction, Software Engineering Practice, and Data Structures.
              </p>
            </motion.div>

          </div>
        </div>

        {/* TRANSITION GAP 1 -> 2:
            Horizontal connector line crosses cleanly at y = 556 from x = 20 to x = 256 (108px below text). */}
        <div className="hidden lg:block h-[120px]" />

        {/* =========================================================================
            MILESTONE 2: Finding My Way to Web
            (Left: Story Text, Right: Tilted Photo Card — 65px intimate spacing)
        ========================================================================= */}
        <div className="relative z-20 h-auto lg:h-[380px] flex items-center mb-16 lg:mb-0">
          <div className="w-full relative lg:flex lg:items-center">
            
            {/* Left Column: Story Text (right edge at 50% + 90px, 44px from Right Track) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1 mt-8 lg:mt-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:right-[calc(50%-90px)] max-w-lg lg:max-w-[420px] text-left space-y-4"
            >
              <h3 className="text-2xl sm:text-3xl font-sans font-bold text-[#ccd6f6] tracking-tight">
                Finding My Way to Web
              </h3>
              <p className="text-[#8892b0] text-sm sm:text-base leading-relaxed">
                Despite exploring diverse fields of computing, modern web engineering kept calling my name. With my passion for clean design and performance, frontend and full-stack development felt like the perfect playground. I dove deep into modern HTML, CSS, JavaScript, TypeScript, and React.
              </p>
              <p className="text-[#8892b0] text-sm sm:text-base leading-relaxed">
                For my undergraduate thesis supervised by <strong className="text-[#ccd6f6]">Dr. J.E.T. Akinsola</strong>, I engineered an intelligent location-based recommendation engine. Bridging theoretical Computer Science research with real-world, accessible web systems became my core mission.
              </p>
            </motion.div>

            {/* Right Column: Photo Card (left edge at 50% + 155px, 21px from Right Track) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2 flex justify-center lg:justify-start lg:w-1/2 lg:ml-auto lg:pl-[155px]"
            >
              <PhotoCard 
                imgSrc={aboutWebImg} 
                alt="Web Engineering Workspace" 
                tilt="right" 
              />
            </motion.div>

          </div>
        </div>

        {/* TRANSITION GAP 2 -> 3:
            Braydon Coyer 45-degree diagonal line from Right Track to Left Track */}
        <div className="hidden lg:block h-[160px]" />

        {/* =========================================================================
            MILESTONE 3: Life Beyond Code
            (Left: Tilted Photo Card, Right: Story Text — 65px intimate spacing)
        ========================================================================= */}
        <div className="relative z-20 h-auto lg:h-[400px] flex items-center mb-16 lg:mb-0">
          <div className="w-full relative lg:flex lg:items-center">
            
            {/* Left Column: Photo Card (right edge at 50% - 155px, 21px from Left Track) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-end lg:w-1/2 lg:pr-[155px]"
            >
              <PhotoCard 
                imgSrc={aboutTutoringImg} 
                alt="Mentorship and Tutoring Peers" 
                tilt="left" 
              />
            </motion.div>

            {/* Right Column: Story Text (left edge at 50% - 90px, 44px from Left Track) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="mt-8 lg:mt-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:left-[calc(50%-90px)] max-w-lg lg:max-w-[420px] text-left space-y-4"
            >
              <h3 className="text-2xl sm:text-3xl font-sans font-bold text-[#ccd6f6] tracking-tight">
                Life Beyond Code
              </h3>
              <p className="text-[#8892b0] text-sm sm:text-base leading-relaxed">
                Knowledge sharing has always been at the core of my journey. During my undergraduate years, I spent significant time every single week breaking down difficult topics like <strong className="text-[#ccd6f6]">Data Structures, Algorithms, and Discrete Mathematics</strong> for over 350 peers.
              </p>
              <p className="text-[#8892b0] text-sm sm:text-base leading-relaxed">
                As an Academic Support Officer with the Nigerian Association of Software Engineering Students (NASSA), I organized foundational workshops for more than 100 students. Seeing peers unlock difficult computing concepts and thrive in their careers is one of the most rewarding experiences I cherish.
              </p>
            </motion.div>

          </div>
        </div>

        {/* TRANSITION GAP 3 -> 4:
            Horizontal connector line crosses cleanly at y = 1626 from x = 20 to x = 256 (over 98px below text). */}
        <div className="hidden lg:block h-[140px]" />

        {/* =========================================================================
            MILESTONE 4: These Days
            (Left: Story Text, Right: Tilted Photo Card directly joined with terminal dot)
        ========================================================================= */}
        <div className="relative z-20 h-auto lg:h-[380px] flex items-center">
          <div className="w-full relative lg:flex lg:items-center">
            
            {/* Left Column: Story Text (right edge at 50% + 90px, 44px from Right Track) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1 mt-8 lg:mt-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:right-[calc(50%-90px)] max-w-lg lg:max-w-[420px] text-left space-y-4"
            >
              <h3 className="text-2xl sm:text-3xl font-sans font-bold text-[#ccd6f6] tracking-tight">
                These Days
              </h3>
              <p className="text-[#8892b0] text-sm sm:text-base leading-relaxed">
                Currently, I serve as a Research Assistant under <strong className="text-[#ccd6f6]">Prof. Jude Sinebe</strong>, focusing on machine learning model validation, data-driven systems, and software reliability. When I'm not writing code or evaluating models, I'm publishing academic research and building open-source web tools.
              </p>
              <p className="text-[#8892b0] text-sm sm:text-base leading-relaxed">
                Looking ahead, I am actively seeking <strong className="text-[#64ffda]">postgraduate (MSc / PhD) placements</strong> and scholarship opportunities where I can dive deeper into Applied Artificial Intelligence, Natural Language Processing, and intelligent software engineering alongside world-class faculty.
              </p>
            </motion.div>

            {/* Right Column: Photo Card (left edge at 50% + 155px, terminal dot joins at x=310, y=1560) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2 flex justify-center lg:justify-start lg:w-1/2 lg:ml-auto lg:pl-[155px]"
            >
              <PhotoCard 
                imgSrc={aboutConferenceImg} 
                alt="Presenting Research and AI Systems" 
                tilt="right" 
              />
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  )
}
