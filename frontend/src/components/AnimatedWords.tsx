import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'

interface AnimatedWordsProps {
  text: string
  className?: string
  delay?: number
  staggerDuration?: number
  interactiveHover?: boolean
}

/**
 * AnimatedWords: Renders a string of text where words animate into view with a smooth
 * staggered spring transition, preserving all original parent layout, styles and fonts.
 */
export const AnimatedWords: React.FC<AnimatedWordsProps> = ({
  text,
  className = '',
  delay = 0,
  staggerDuration = 0.08,
  interactiveHover = true
}) => {
  const words = text.split(' ')

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDuration,
        delayChildren: delay
      }
    }
  }

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        damping: 18,
        stiffness: 140
      }
    }
  }

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20px' }}
    >
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden mr-[0.25em] last:mr-0 align-baseline">
          <motion.span 
            variants={wordVariants} 
            className="inline-block transition-transform duration-200"
            whileHover={interactiveHover ? { y: -2, transition: { duration: 0.15 } } : undefined}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

interface RotatingWordsProps {
  words: string[]
  interval?: number
  className?: string
}

/**
 * RotatingWords: Smoothly cycles through an array of words with a clean vertical
 * slide and blur transition, without modifying any surrounding styles or backgrounds.
 */
export const RotatingWords: React.FC<RotatingWordsProps> = ({
  words,
  interval = 3200,
  className = ''
}) => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, interval)
    return () => clearInterval(timer)
  }, [words, interval])

  return (
    <span className={`inline-block relative overflow-hidden align-baseline ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={index}
          initial={{ y: '90%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-90%', opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block cursor-default whitespace-nowrap"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
