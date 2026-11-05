import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ChevronLeft, ChevronRight, X, Send, Loader2, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { apiUrl } from '../lib/api'

interface FAQItem {
  id: string
  question: string
  answer: React.ReactNode
}

const ALL_FAQS: FAQItem[] = [
  {
    id: 'core-specialization',
    question: 'What is your core specialization in web engineering and applied AI?',
    answer: (
      <div className="space-y-2 text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
        <p>
          I specialize in building high-performance, accessible web systems and researching machine learning model validation. I graduated in the <strong className="text-[var(--color-text-main)]">Top 10%</strong> of my class with a <strong className="text-[var(--color-primary)]">4.45 / 5.00 Final CGPA</strong> (Second-Class Upper Honors) in Software Engineering from <strong className="text-[var(--color-text-main)]">Abiola Ajimobi Technical University</strong>.
        </p>
        <p>
          Currently, I serve as an NYSC Research Assistant under <strong className="text-[var(--color-text-main)]">Assoc. Prof. Jude Sinebe</strong>, investigating empirical model validation and developing full-stack software architectures.
        </p>
      </div>
    )
  },
  {
    id: 'graduate-research-directions',
    question: 'What research directions are you prioritizing for prospective graduate studies?',
    answer: (
      <div className="space-y-2 text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
        <p>
          <strong className="text-[var(--color-primary)]">I am actively applying for MSc / PhD placements</strong> and competitive scholarship opportunities in Applied Artificial Intelligence, Natural Language Processing, and intelligent software engineering.
        </p>
        <p>
          I am also enthusiastic about collaborating with faculty and fellow researchers on empirical computing benchmarks, model evaluation, and peer-reviewed papers. Feel free to explore my <Link to="/research" className="text-[var(--color-primary)] hover:underline">Research Page</Link>.
        </p>
      </div>
    )
  },
  {
    id: 'offline-first-architectures',
    question: 'How do you design offline-first and performance-driven web systems?',
    answer: (
      <div className="space-y-2 text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
        <p>
          I prioritize resilience and minimal latency across all layers of the stack. Examples include <strong className="text-[var(--color-text-main)]">CleanReport</strong> (a civic-tech sanitation PWA with offline queueing via Service Workers and IndexedDB), my undergraduate thesis on <strong className="text-[var(--color-text-main)]">Location-Based Hybrid Recommendation Systems</strong>, and <strong className="text-[var(--color-text-main)]">Kynda AI Study Assistant</strong>.
        </p>
        <div className="pt-1">
          <Link to="/projects" className="text-xs font-mono text-[var(--color-primary)] font-semibold hover:underline">
            Inspect all project architectures →
          </Link>
        </div>
      </div>
    )
  },
  {
    id: 'contract-consultancy',
    question: 'How do you collaborate with engineering teams, startups, and client projects?',
    answer: (
      <div className="space-y-2 text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
        <p>
          I selectively partner on contract software engineering, frontend architecture reviews (React, TypeScript, Next.js), and AI model integration workflows.
        </p>
        <p>
          If your team or startup has an engineering initiative, reach out directly at <a href="mailto:amooquadri555@gmail.com" className="text-[var(--color-primary)] hover:underline font-mono">amooquadri555@gmail.com</a> or use the inquiry box below.
        </p>
      </div>
    )
  },
  {
    id: 'technologies-toolchains',
    question: 'Which technologies and development toolchains do you build with daily?',
    answer: (
      <div className="space-y-2 text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
        <p>
          <strong className="text-[var(--color-text-main)]">Frontend:</strong> TypeScript, React, Next.js, Tailwind CSS, Framer Motion, and Service Workers / PWAs.
        </p>
        <p>
          <strong className="text-[var(--color-text-main)]">Backend & Research:</strong> Node.js, Express, Python (scikit-learn, PyTorch fundamentals, pandas/NumPy), PostgreSQL, MongoDB, Docker, and Linux.
        </p>
      </div>
    )
  },
  {
    id: 'mentorship-impact',
    question: 'How did mentoring 350+ peers and academic honors shape your career?',
    answer: (
      <div className="space-y-2 text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
        <p>
          As an Academic Support Officer with NASSA, I led weekly tutorial workshops in Data Structures, Algorithms, Discrete Mathematics, and Operating Systems for over 350 peers, and organized foundational developer bootcamps for 100+ students.
        </p>
        <p>
          Teaching foundational computing concepts solidified my problem-solving discipline and reinforced my commitment to clear, empathetic communication in engineering.
        </p>
      </div>
    )
  }
]

export const QuestionsSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(ALL_FAQS[0].id)
  const [page, setPage] = useState<number>(0)
  const itemsPerPage = 4

  const totalPages = Math.ceil(ALL_FAQS.length / itemsPerPage)
  const currentFaqs = ALL_FAQS.slice(page * itemsPerPage, (page + 1) * itemsPerPage)

  // Question Ask Box state
  const [questionInput, setQuestionInput] = useState('')
  const [asking, setAsking] = useState(false)
  const [aiAnswer, setAiAnswer] = useState<string | null>(null)
  const [lastAskedQuestion, setLastAskedQuestion] = useState('')

  const toggleQuestion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  const handleNextPage = () => {
    setPage((prev) => (prev + 1) % totalPages)
  }

  const handlePrevPage = () => {
    setPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    const q = questionInput.trim()
    if (!q || asking) return

    setAsking(true)
    setLastAskedQuestion(q)
    setAiAnswer(null)

    try {
      const res = await fetch(apiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q })
      })

      if (res.ok) {
        const data = await res.json()
        setAiAnswer(
          data.reply ||
            "I'd be glad to share more details about Quadri's background. Feel free to explore the questions on this page or reach out directly via amooquadri555@gmail.com."
        )
      } else {
        throw new Error('API error')
      }
    } catch {
      setAiAnswer(
        "I couldn't reach the backend server right now, but feel free to explore the questions on the left or email Quadri directly at amooquadri555@gmail.com!"
      )
    } finally {
      setAsking(false)
    }
  }

  return (
    <section id="faq" className="py-14 sm:py-20 bg-[var(--color-surface-base)] text-[var(--color-text-main)] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20">
        <div className="border-t border-[var(--color-border)] pt-12">
          
          {/* Header with Centered Title & Watermark Effect matching the reference */}
          <div className="relative text-center mb-12 sm:mb-16 select-none">
            {/* Watermark Background Title */}
            <span className="absolute left-1/2 -top-6 -translate-x-1/2 text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-[var(--color-text-muted)] opacity-[0.06] whitespace-nowrap pointer-events-none">
              Frequently Ask Question
            </span>

            {/* Foreground Title */}
            <h2 className="relative text-2xl sm:text-4xl font-serif font-bold text-[var(--color-text-main)] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="relative text-xs sm:text-sm text-[var(--color-primary)] font-mono mt-2">
              Have questions? Find quick answers below or ask directly.
            </p>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* LEFT COLUMN: Clean Card Accordions */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-3.5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={page}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3.5"
                >
                  {currentFaqs.map((faq) => {
                    const isOpen = openId === faq.id
                    return (
                      <div
                        key={faq.id}
                        className={`rounded-2xl border transition-all duration-300 bg-[var(--color-surface-card)] shadow-xs ${
                          isOpen
                            ? 'border-[var(--color-primary)]/50 shadow-md ring-1 ring-[var(--color-primary)]/20'
                            : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleQuestion(faq.id)}
                          aria-expanded={isOpen}
                          className="w-full px-5 py-4 sm:px-6 sm:py-4.5 flex items-center justify-between gap-4 text-left cursor-pointer group"
                        >
                          <span className={`text-xs sm:text-sm md:text-[15px] font-medium transition-colors ${
                            isOpen ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-main)] group-hover:text-[var(--color-primary)]'
                          }`}>
                            {faq.question}
                          </span>

                          {/* Circular Cyan Button with '+' Icon matching reference */}
                          <div className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--color-primary)] text-black flex items-center justify-center font-bold shadow-xs transition-transform duration-300 group-hover:scale-105 active:scale-95 ${
                            isOpen ? 'rotate-45' : 'rotate-0'
                          }`}>
                            <Plus className="w-4 h-4" />
                          </div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-5 sm:px-6 sm:pb-5 pt-1 border-t border-[var(--color-border)]/50">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Navigation pagination buttons '<' and '>' matching the reference */}
              <div className="flex items-center gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  aria-label="Previous questions"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--color-primary)] text-black flex items-center justify-center font-bold shadow-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextPage}
                  aria-label="Next questions"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--color-primary)] text-black flex items-center justify-center font-bold shadow-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-[var(--color-text-subtle)] ml-2">
                  Page {page + 1} of {totalPages}
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Ask Box with Graphic matching reference */}
            <div className="lg:col-span-5 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-lg relative">
              
              {/* Graphic / Cloud Illustration on Top matching the reference */}
              <div className="relative w-36 h-32 sm:w-44 sm:h-36 mb-4 flex items-center justify-center">
                {/* Soft Cyan Cloud Backdrop */}
                <div className="absolute inset-0 bg-[var(--color-primary)]/10 rounded-[40px] blur-[1px] border border-[var(--color-primary)]/20 shadow-inner" />
                
                {/* Modern Question Mark & Character/Avatar SVG Illustration */}
                <svg
                  className="w-28 h-28 sm:w-32 sm:h-32 relative z-10"
                  viewBox="0 0 160 160"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Subtle sparkle stars */}
                  <circle cx="35" cy="45" r="2" fill="var(--color-primary)" opacity="0.6" />
                  <circle cx="125" cy="40" r="3" fill="var(--color-primary)" opacity="0.6" />
                  <circle cx="135" cy="95" r="2" fill="var(--color-primary)" opacity="0.4" />
                  
                  {/* Glowing Question Mark matching reference illustration */}
                  <path
                    d="M72 40 C72 26 94 26 94 40 C94 50 82 54 82 66"
                    stroke="var(--color-primary)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="82" cy="78" r="4.5" fill="var(--color-primary)" />

                  {/* Character/Person silhouette looking up at question */}
                  <circle cx="95" cy="98" r="8" fill="var(--color-text-muted)" />
                  <path
                    d="M87 112 C87 106 103 106 103 112 L105 135 L85 135 Z"
                    fill="var(--color-text-muted)"
                    opacity="0.85"
                  />
                  <path
                    d="M90 135 L88 152 M100 135 L102 152"
                    stroke="var(--color-text-muted)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--color-text-main)]">
                Any Question?
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1 mb-5 max-w-xs leading-relaxed">
                You can ask anything you want to know about Quadri.
              </p>

              {/* Form Input Box */}
              <form onSubmit={handleSubmitQuestion} className="w-full text-left">
                <label htmlFor="faq-custom-input" className="block text-xs font-mono text-[var(--color-text-subtle)] mb-1.5">
                  Let me know.
                </label>
                
                <div className="relative flex items-center">
                  <input
                    id="faq-custom-input"
                    type="text"
                    value={questionInput}
                    onChange={(e) => setQuestionInput(e.target.value)}
                    placeholder="Enter Here"
                    disabled={asking}
                    className="w-full px-4 py-2.5 sm:py-3 pr-10 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-hidden text-xs sm:text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-subtle)] transition-colors"
                  />

                  {questionInput && (
                    <button
                      type="button"
                      onClick={() => setQuestionInput('')}
                      className="absolute right-3 p-1 text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Pill-shaped Cyan Submit Button matching reference */}
                <div className="text-center mt-4">
                  <button
                    type="submit"
                    disabled={!questionInput.trim() || asking}
                    className="inline-flex items-center justify-center gap-2 px-8 py-2.5 rounded-full bg-[var(--color-primary)] text-black font-semibold text-xs sm:text-sm shadow-md shadow-[var(--color-primary)]/20 hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {asking ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* AI Response Box when asked */}
              <AnimatePresence>
                {aiAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-5 p-4 rounded-2xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-left w-full text-xs text-[var(--color-text-main)] leading-relaxed shadow-sm relative"
                  >
                    <div className="flex items-center justify-between gap-1.5 text-[var(--color-primary)] font-mono text-[10px] uppercase tracking-wider font-semibold mb-1.5">
                      <span className="flex items-center gap-1.5 truncate">
                        <Sparkles className="w-3 h-3 shrink-0" /> Answer to &ldquo;{lastAskedQuestion}&rdquo;
                      </span>
                      <button 
                        type="button" 
                        onClick={() => setAiAnswer(null)} 
                        className="p-1 text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer shrink-0"
                        title="Dismiss answer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="whitespace-pre-line text-[var(--color-text-muted)] leading-relaxed">
                      {aiAnswer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>

        </div>
      </div>
    </section>
  )
}

export default QuestionsSection
