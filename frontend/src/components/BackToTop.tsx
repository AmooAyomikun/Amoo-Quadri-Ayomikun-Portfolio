import React, { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggleVisible = () => {
      if (window.scrollY > 250) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisible)
    return () => window.removeEventListener('scroll', toggleVisible)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-40 p-3 sm:p-3.5 rounded-full bg-[var(--color-primary)] text-white shadow-[0_8px_30px_rgba(13,92,77,0.4)] hover:bg-[var(--color-primary-hover)] hover:scale-110 active:scale-95 transition-all duration-300 border border-white/20 group cursor-pointer ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
    </button>
  )
}
