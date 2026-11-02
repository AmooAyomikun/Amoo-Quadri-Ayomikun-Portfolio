import type { Variants } from 'framer-motion'

/**
 * Standard staggered fade-in up variants for Framer Motion.
 */
export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: customDelay,
      ease: [0.16, 1, 0.3, 1] as const
    }
  })
}

/**
 * Text reveal variant with slight scale and vertical translate.
 */
export const textRevealVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      delay: customDelay,
      ease: [0.16, 1, 0.3, 1] as const
    }
  })
}
