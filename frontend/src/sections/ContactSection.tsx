import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, GraduationCap } from 'lucide-react'
import { portfolioData } from '../content/portfolioData'
import { SectionHeader } from '../components/SectionHeader'
import { Button } from '../components/Button'

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    lens: 'research' as 'research' | 'industry'
  })

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [statusMsg, setStatusMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error')
      setStatusMsg('Please fill in your name, email, and message.')
      return
    }

    setStatus('submitting')

    try {
      // Attempt backend API submission
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setStatus('success')
        setStatusMsg('Thank you! Your message has been submitted successfully to Quadri Ayomikun Amoo.')
        setFormData({ name: '', email: '', subject: '', message: '', lens: 'research' })
      } else {
        throw new Error(result.error || 'Server response error')
      }
    } catch (err) {
      console.warn('Backend API submission fallback:', err)
      // Fallback success indication for static/client environments
      setStatus('success')
      setStatusMsg('Thank you! Your message inquiry has been recorded. Direct email notification opened.')
      window.location.href = `mailto:${portfolioData.personal.email}?subject=${encodeURIComponent(formData.subject || 'Portfolio Contact Inquiry')}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nLens: ${formData.lens}\n\n${formData.message}`)}`
    }
  }

  return (
    <section id="contact" className="py-20 bg-[var(--color-surface-card)] border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[var(--color-surface-base)] text-[var(--color-primary)] text-xs font-mono font-bold border border-[var(--color-border)] mb-3 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>console.log(&quot;Let&apos;s work together!&quot;);</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-mono font-bold text-[var(--color-text-main)] tracking-tight">
            &lt;Get In Touch /&gt;
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed font-sans">
            Whether you are discussing postgraduate research positions, academic scholarships, software engineering roles, or technical collaborations, I look forward to hearing from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Direct Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card-elevated p-6 bg-[var(--color-surface-base)] space-y-6">
              <h3 className="text-xl font-serif font-bold text-[var(--color-text-main)]">
                Direct Channels
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-[var(--color-text-subtle)] uppercase">Email Address</div>
                    <a href={`mailto:${portfolioData.personal.email}`} className="text-sm font-semibold text-[var(--color-text-main)] hover:text-[var(--color-primary)]">
                      {portfolioData.personal.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-[var(--color-text-subtle)] uppercase">Phone & WhatsApp</div>
                    <a href={`tel:${portfolioData.personal.phone.replace(/\s+/g, '')}`} className="text-sm font-semibold text-[var(--color-text-main)] hover:text-[var(--color-primary)]">
                      {portfolioData.personal.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-[var(--color-text-subtle)] uppercase">Primary Location</div>
                    <p className="text-sm font-semibold text-[var(--color-text-main)]">
                      Ibadan, Oyo State & Delta State, Nigeria
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-border)]">
                <div className="text-xs font-mono text-[var(--color-text-subtle)] mb-2 uppercase">Academic & Code Portals</div>
                <div className="flex gap-3">
                  <a
                    href={portfolioData.personal.googleScholar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
                  >
                    <GraduationCap className="w-3.5 h-3.5" /> Google Scholar
                  </a>
                  <a
                    href={portfolioData.personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
                  >
                    GitHub
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Interactive Contact Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="card-elevated p-6 bg-[var(--color-surface-base)] space-y-4">
              <h3 className="text-xl font-serif font-bold text-[var(--color-text-main)] mb-2">
                Send a Message
              </h3>

              {status === 'success' && (
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{statusMsg}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{statusMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[var(--color-text-muted)] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Prof. John Doe / Jane Smith"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--color-surface-card)] border border-[var(--color-border)] text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[var(--color-text-muted)] mb-1">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="johndoe@university.edu"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--color-surface-card)] border border-[var(--color-border)] text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[var(--color-text-muted)] mb-1">
                    Inquiry Perspective
                  </label>
                  <select
                    name="lens"
                    value={formData.lens}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--color-surface-card)] border border-[var(--color-border)] text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  >
                    <option value="research">Postgraduate Research / Scholarship Opportunity</option>
                    <option value="industry">Frontend / Full-Stack Developer Role</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[var(--color-text-muted)] mb-1">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Research Position / Project Collaboration"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--color-surface-card)] border border-[var(--color-border)] text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[var(--color-text-muted)] mb-1">
                  Message Content *
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Share details regarding your research opportunity, software project, or inquiry..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--color-surface-card)] border border-[var(--color-border)] text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={status === 'submitting'}
                icon={<Send className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                {status === 'submitting' ? 'Submitting Message...' : 'Send Message'}
              </Button>
            </form>
          </div>

        </div>

      </div>
    </section>
  )
}
