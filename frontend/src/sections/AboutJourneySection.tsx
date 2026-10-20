import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
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
    <div className="relative mx-auto w-fit group cursor-pointer select-none">
      {/* Background sleeve/holder slot */}
      <div className="rounded-[22px] border border-[#233554] p-2 w-[210px] h-[300px] bg-[#112240]/40 backdrop-blur-sm shadow-xl transition-all duration-300 group-hover:border-[#64ffda]/30">
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
        className={`absolute left-0 top-0 w-[202px] h-[292px] rounded-xl object-cover shadow-2xl border border-[#233554] transition-all duration-500 ease-out filter contrast-[1.05] group-hover:rotate-0 group-hover:scale-[1.02] group-hover:border-[#64ffda]/50 ${
          isLeft ? 'rotate-[-8deg]' : 'rotate-[8deg]'
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
  const [scrollPercent, setScrollPercent] = useState<number>(0)

  // Track scroll progress through this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 65%', 'end 85%']
  })

  // Synchronize dot movement with user scroll along the winding SVG path
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setScrollPercent(latest)
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
          const totalLength = pathRef.current.getTotalLength()
          const point = pathRef.current.getPointAtLength(0)
          setDotPos({ x: point.x, y: point.y })
        } catch {
          // ignore
        }
      }
    }, 150)
    return () => clearTimeout(timer)
  }, [])

  // Exact serpentine path from braydoncoyer.dev/about (width: 380, height: 1787)
  const serpentinePathD = `M145 0.5 L145 43 C145 51.8 137.8 59 129 59 L20 59 C11.2 59 4 66.2 4 75 L4 515 C4 523.8 11.2 531 20 531 L256 531 C264.8 531 272 538.2 272 547 L272 830.4 C272 834.6 270.3 838.7 267.3 841.7 L78.7 1030.3 C75.7 1033.3 71.6 1035 67.4 1035 L20 1035 C11.2 1035 4 1042.2 4 1051 L4 1471 C4 1479.8 11.2 1487 20 1487 L256 1487 C264.8 1487 272 1494.2 272 1503 L272 1757 C272 1765.8 279.2 1773 288 1773 L380 1773`

  return (
    <section 
      id="about" 
      ref={containerRef}
      className="relative py-24 sm:py-32 bg-[#0a192f] text-[#ccd6f6] scroll-mt-24 overflow-hidden"
    >
      {/* Subtle Ambient Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#64ffda_1px,transparent_1px)] [background-size:28px_28px]" />

      {/* Top Header - Exact Braydon Coyer Headline Style */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-16 sm:mb-24 relative z-20">
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

      {/* Main Journey Container */}
      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">

        {/* =========================================================================
            DESKTOP INTERACTIVE SERPENTINE SVG WIRE WITH SCROLL-TRACKING MOVING DOT
            (Centered spine between columns, exactly like braydoncoyer.dev)
        ========================================================================= */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1787px] hidden lg:flex justify-center z-10">
          <div className="relative w-[380px] h-[1787px]">
            <svg
              className="w-[380px] h-[1787px]"
              viewBox="-10 -10 400 1800"
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
                  pathLength: scrollYProgress,
                  filter: 'drop-shadow(0 0 6px rgba(100,255,218,0.6))'
                }}
              />

              {/* Milestone Checkpoint Nodes along the wire */}
              {/* Start Node at (145, 0.5) */}
              <circle cx="145" cy="0.5" r="7" className="fill-[#0a192f] stroke-[#233554]" strokeWidth="2.5" />
              <circle cx="145" cy="0.5" r="3.5" className="fill-[#64ffda]" />

              {/* Milestone 1 Node at (4, 75) */}
              <circle cx="4" cy="75" r="7" className="fill-[#0a192f] stroke-[#233554]" strokeWidth="2.5" />
              <circle cx="4" cy="75" r="3.5" className={scrollPercent > 0.08 ? "fill-[#64ffda]" : "fill-[#233554]"} />

              {/* Milestone 2 Node at (272, 547) */}
              <circle cx="272" cy="547" r="7" className="fill-[#0a192f] stroke-[#233554]" strokeWidth="2.5" />
              <circle cx="272" cy="547" r="3.5" className={scrollPercent > 0.32 ? "fill-[#64ffda]" : "fill-[#233554]"} />

              {/* Milestone 3 Node at (4, 1051) */}
              <circle cx="4" cy="1051" r="7" className="fill-[#0a192f] stroke-[#233554]" strokeWidth="2.5" />
              <circle cx="4" cy="1051" r="3.5" className={scrollPercent > 0.62 ? "fill-[#64ffda]" : "fill-[#233554]"} />

              {/* Milestone 4 Node at (272, 1503) */}
              <circle cx="272" cy="1503" r="7" className="fill-[#0a192f] stroke-[#233554]" strokeWidth="2.5" />
              <circle cx="272" cy="1503" r="3.5" className={scrollPercent > 0.88 ? "fill-[#64ffda]" : "fill-[#233554]"} />

              {/* THE INTERACTIVE MOVING DOT - Rides smoothly along the winding path as user scrolls */}
              <g transform={`translate(${dotPos.x}, ${dotPos.y})`}>
                {/* Outer Pulsing Glow */}
                <circle
                  r="12"
                  fill="none"
                  stroke="#64ffda"
                  strokeWidth="1.5"
                  opacity="0.6"
                  className="animate-ping"
                />
                {/* Core Glowing Dot */}
                <circle
                  r="8"
                  fill="#64ffda"
                  filter="url(#tealGlow)"
                />
                <circle
                  r="3"
                  fill="#0a192f"
                />
              </g>
            </svg>
          </div>
        </div>

        {/* Mobile Linear Vertical Wire */}
        <div className="lg:hidden absolute left-4 top-8 bottom-12 w-[2px] bg-[#233554] pointer-events-none" />

        {/* =========================================================================
            MILESTONE 1: My Programming Origins & Academic Foundation
            (Left: Tilted Photo Card, Right: Story)
        ========================================================================= */}
        <div className="relative z-20 min-h-[480px] flex items-center mb-16 sm:mb-24 lg:mb-0">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left Column: Tilted Photo Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-end lg:pr-12"
            >
              <PhotoCard 
                imgSrc={profileImg} 
                alt="Quadri Amoo - Software Engineer" 
                tilt="left" 
              />
            </motion.div>

            {/* Right Column: Story Text */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="space-y-4 lg:pl-10 text-left"
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

        {/* =========================================================================
            MILESTONE 2: Finding My Way to Web
            (Left: Story, Right: Tilted Photo Card)
        ========================================================================= */}
        <div className="relative z-20 min-h-[440px] flex items-center mb-16 sm:mb-24 lg:mb-0">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left Column: Story Text */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="space-y-4 order-2 lg:order-1 lg:pr-10 text-left"
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

            {/* Right Column: Tilted Photo Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-start order-1 lg:order-2 lg:pl-12"
            >
              <PhotoCard 
                imgSrc={aboutWebImg} 
                alt="Web Engineering Workspace" 
                tilt="right" 
              />
            </motion.div>

          </div>
        </div>

        {/* =========================================================================
            MILESTONE 3: Life Beyond Code
            (Left: Tilted Photo Card, Right: Story)
        ========================================================================= */}
        <div className="relative z-20 min-h-[480px] flex items-center mb-16 sm:mb-24 lg:mb-0">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left Column: Tilted Photo Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-end lg:pr-12"
            >
              <PhotoCard 
                imgSrc={aboutTutoringImg} 
                alt="Mentorship and Tutoring Peers" 
                tilt="left" 
              />
            </motion.div>

            {/* Right Column: Story Text */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="space-y-4 lg:pl-10 text-left"
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

        {/* =========================================================================
            MILESTONE 4: These Days
            (Left: Story, Right: Tilted Photo Card)
        ========================================================================= */}
        <div className="relative z-20 min-h-[400px] flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left Column: Story Text */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="space-y-4 order-2 lg:order-1 lg:pr-10 text-left"
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

            {/* Right Column: Tilted Photo Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-start order-1 lg:order-2 lg:pl-12"
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
