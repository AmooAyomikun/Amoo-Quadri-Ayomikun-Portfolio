import gsap from 'gsap'

/**
 * Animate elements on page mount with slide up & fade effect.
 */
export const animateFadeInUp = (target: string | Element | Element[], delay = 0) => {
  if (typeof window === 'undefined') return
  gsap.fromTo(
    target,
    { opacity: 0, y: 25 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay,
      ease: 'power3.out',
      stagger: 0.12
    }
  )
}

/**
 * Animate text reveal character / word stagger.
 */
export const animateTextReveal = (target: string | Element, delay = 0) => {
  if (typeof window === 'undefined') return
  gsap.fromTo(
    target,
    { opacity: 0, y: 30, scale: 0.98 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.9,
      delay,
      ease: 'cubic-bezier(0.16, 1, 0.3, 1)'
    }
  )
}
