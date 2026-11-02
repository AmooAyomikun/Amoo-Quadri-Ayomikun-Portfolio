import { useState, useEffect } from 'react'

export interface UseTypewriterOptions {
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
}

export interface UseTypewriterResult {
  currentText: string
  isDeleting: boolean
  phraseIndex: number
}

/**
 * Reusable typewriter hook with automatic reduced-motion accessibility support (Issue 4.2, 4.8).
 * When prefers-reduced-motion is enabled, animates nothing and immediately renders the full phrase.
 */
export function useTypewriter(
  phrases: string[],
  options: UseTypewriterOptions = {}
): UseTypewriterResult {
  const { typingSpeed = 70, deletingSpeed = 35, pauseDuration = 1800 } = options

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [phraseIndex, setPhraseIndex] = useState(0)
  const [currentText, setCurrentText] = useState(() => (prefersReducedMotion ? phrases[0] || '' : ''))
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion || phrases.length === 0) {
      setCurrentText(phrases[0] || '')
      return
    }

    const targetPhrase = phrases[phraseIndex] || ''
    const speed = isDeleting ? deletingSpeed : typingSpeed

    if (!isDeleting && currentText === targetPhrase) {
      const pauseTimer = setTimeout(() => setIsDeleting(true), pauseDuration)
      return () => clearTimeout(pauseTimer)
    }

    if (isDeleting && currentText === '') {
      setIsDeleting(false)
      setPhraseIndex((prev) => (prev + 1) % phrases.length)
      return
    }

    const charTimer = setTimeout(() => {
      setCurrentText((prev) =>
        isDeleting
          ? targetPhrase.substring(0, prev.length - 1)
          : targetPhrase.substring(0, prev.length + 1)
      )
    }, speed)

    return () => clearTimeout(charTimer)
  }, [currentText, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration, prefersReducedMotion])

  return { currentText, isDeleting, phraseIndex }
}

export default useTypewriter
