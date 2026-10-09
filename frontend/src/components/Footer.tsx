import React, { useState } from 'react'
import { Mail, ArrowUp, CheckCircle2 } from 'lucide-react'
import { portfolioData } from '../content/portfolioData'

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
)

const TwitterIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

export const Footer: React.FC = () => {
  const [emailInput, setEmailInput] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput) return
    setSubscribed(true)
    setEmailInput('')
    setTimeout(() => setSubscribed(false), 4000)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#050505] text-black pt-12 pb-8 px-3 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Green Watts Asymmetric Arch Pill Container */}
        <div className="rounded-t-[8rem] sm:rounded-tl-[16rem] sm:rounded-tr-[2.5rem] rounded-b-[2.5rem] bg-[#C4FA4C] border border-lime-300/60 p-8 sm:p-14 lg:p-16 relative overflow-hidden shadow-2xl">
          
          {/* Top Row Grid matching Watts Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-12 relative z-10 pt-4 sm:pt-8">
            
            {/* Professional Headline & Copyright (Left Column) */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-black tracking-tight leading-tight max-w-md">
                Engineering scalable software architectures, intelligent algorithms, and high-impact digital systems.
              </h2>
              <p className="text-xs sm:text-sm text-black/80 font-mono pt-2 font-medium">
                © {new Date().getFullYear()} Quadri Amoo. All rights reserved. Designed & Engineered by Quadri Amoo.
              </p>
            </div>

            {/* Navigation & Support Columns Combined */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="font-mono font-bold text-xs text-black uppercase tracking-widest">
                  NAVIGATION
                </h3>
                <ul className="space-y-2.5 text-xs text-black/80 font-medium font-sans">
                  <li><a href="/" className="hover:text-black hover:underline transition-colors">Home</a></li>
                  <li><a href="/education" className="hover:text-black hover:underline transition-colors">Education</a></li>
                  <li><a href="/experience" className="hover:text-black hover:underline transition-colors">Experience</a></li>
                  <li><a href="/research" className="hover:text-black hover:underline transition-colors">Research</a></li>
                  <li><a href="/projects" className="hover:text-black hover:underline transition-colors">Projects</a></li>
                  <li><a href="/guestbook" className="hover:text-black hover:underline transition-colors">Guestbook</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-mono font-bold text-xs text-black uppercase tracking-widest">
                  SUPPORT
                </h3>
                <ul className="space-y-2.5 text-xs text-black/80 font-medium font-sans">
                  <li><a href="/contact" className="hover:text-black hover:underline transition-colors">Contact Me</a></li>
                  <li><a href={portfolioData.personal.github} target="_blank" rel="noreferrer" className="hover:text-black hover:underline transition-colors">GitHub ↗</a></li>
                  <li><a href={portfolioData.personal.linkedIn} target="_blank" rel="noreferrer" className="hover:text-black hover:underline transition-colors">LinkedIn ↗</a></li>
                  <li><a href={portfolioData.personal.googleScholar} target="_blank" rel="noreferrer" className="hover:text-black hover:underline transition-colors">Google Scholar ↗</a></li>
                  <li><a href="/Amoo_Quadri_CV.pdf" download="Amoo_Quadri_CV.pdf" className="hover:text-black hover:underline transition-colors">Download CV ↓</a></li>
                </ul>
              </div>
            </div>

            {/* Subscribe & Social Icons Column */}
            <div className="lg:col-span-3 space-y-6">
              <div>
                <h3 className="font-mono font-bold text-xs text-black uppercase tracking-widest mb-3">
                  GET THE LATEST FROM QUADRI.
                </h3>
                
                <form onSubmit={handleSubscribe} className="relative flex items-center">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Email Address"
                    className="w-full bg-black/90 border border-black/30 rounded-full py-3 pl-4 pr-28 text-xs text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black transition-colors font-mono"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-1 px-5 py-2 bg-white text-black font-mono font-bold text-xs rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    {subscribed ? 'Sent!' : 'Subscribe'}
                  </button>
                </form>

                {subscribed && (
                  <p className="text-xs font-mono text-black font-bold flex items-center gap-1.5 mt-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Subscribed successfully!
                  </p>
                )}
              </div>

              {/* Follow Us Badges */}
              <div>
                <h4 className="font-mono font-bold text-[10px] text-black uppercase tracking-widest mb-3">
                  FOLLOW US
                </h4>
                <div className="flex items-center gap-2.5">
                  <a
                    href={`mailto:${portfolioData.personal.email}`}
                    className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-all cursor-pointer shadow-md"
                    aria-label="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  <a
                    href={portfolioData.personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-all cursor-pointer shadow-md"
                    aria-label="GitHub"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={portfolioData.personal.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-all cursor-pointer shadow-md"
                    aria-label="LinkedIn"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={portfolioData.personal.twitter || 'https://x.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-all cursor-pointer shadow-md"
                    aria-label="Twitter"
                  >
                    <TwitterIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Massive Typography Watermark ("watts" -> "quadri") */}
          <div className="relative pt-4 flex flex-col items-end justify-between border-t border-black/15 mt-6">
            <h1 className="text-[18vw] sm:text-[16vw] lg:text-[14vw] font-sans font-black tracking-tighter leading-none text-black select-none text-right uppercase pointer-events-none w-full">
              quadri
            </h1>

            {/* Back to top row */}
            <div className="w-full flex justify-between items-center pt-6 text-xs font-mono text-black/80 font-medium">
              <span className="uppercase">LAGOS, NIGERIA (GMT+1)</span>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-1.5 text-black font-bold hover:opacity-75 transition-opacity cursor-pointer"
              >
                <span>BACK TO TOP</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </footer>
  )
}
