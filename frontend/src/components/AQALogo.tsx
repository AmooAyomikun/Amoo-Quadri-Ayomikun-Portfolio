import React from 'react'
import { motion } from 'framer-motion'

interface AQALogoProps {
  className?: string
  showText?: boolean
}

export const AQALogo: React.FC<AQALogoProps> = ({ className = "h-11", showText = false }) => {
  return (
    <motion.div
      className={`group relative flex items-center gap-2.5 cursor-pointer select-none ${className}`}
      whileHover="hover"
      initial="initial"
    >
      {/* Fun, Custom Stylized Monogram for AQA */}
      <motion.div 
        className="relative flex items-center justify-center p-1.5 rounded-xl transition-colors duration-300 group-hover:bg-[#64ffda]/10"
        variants={{
          initial: { scale: 1, rotate: 0 },
          hover: { 
            scale: 1.08, 
            rotate: [0, -3, 3, 0],
            transition: { duration: 0.35, ease: 'easeInOut' } 
          }
        }}
      >
        <svg
          viewBox="0 0 78 52"
          className="w-12 h-9 sm:w-14 sm:h-10 overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle background glow on hover */}
          <motion.rect
            x="2"
            y="2"
            width="74"
            height="48"
            rx="12"
            className="stroke-[#233554] group-hover:stroke-[#64ffda] transition-colors duration-300"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            fill="transparent"
            variants={{
              initial: { opacity: 0.4 },
              hover: { opacity: 1 }
            }}
          />

          {/* Letter 'A' (Top-Left) */}
          <motion.g
            variants={{
              initial: { y: 0 },
              hover: { y: -1 }
            }}
          >
            {/* Left foot to apex to right foot */}
            <path
              d="M 9 32 L 18 10 L 27 32"
              stroke="#64ffda"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Crossbar */}
            <path
              d="M 13 23 L 23 23"
              stroke="#64ffda"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </motion.g>

          {/* Playful Letter 'Q' (Center Staggered) */}
          <motion.g
            variants={{
              initial: { scale: 1, rotate: 0 },
              hover: { 
                scale: 1.1,
                rotate: [0, 8, -8, 0],
                transition: { duration: 0.4 }
              }
            }}
            style={{ transformOrigin: '39px 26px' }}
          >
            {/* Circular body of Q */}
            <circle
              cx="39"
              cy="25"
              r="10.5"
              stroke="#64ffda"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Playful curved kick/tail */}
            <path
              d="M 44 29 L 52 38"
              stroke="#64ffda"
              strokeWidth="3.8"
              strokeLinecap="round"
            />
            {/* Accent dot on Q's tail for fun character */}
            <circle
              cx="52"
              cy="38"
              r="1.8"
              fill="#ccd6f6"
            />
          </motion.g>

          {/* Letter 'A' (Bottom-Right) */}
          <motion.g
            variants={{
              initial: { y: 0 },
              hover: { y: 1 }
            }}
          >
            {/* Left foot to apex to right foot */}
            <path
              d="M 51 42 L 61 20 L 71 42"
              stroke="#64ffda"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Crossbar */}
            <path
              d="M 55 33 L 66 33"
              stroke="#64ffda"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </motion.g>
        </svg>
      </motion.div>
    </motion.div>
  )
}
