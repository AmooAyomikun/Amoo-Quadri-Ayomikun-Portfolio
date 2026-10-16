import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from './lib/theme'
import { LensProvider } from './lib/lens'
import { Preloader } from './components/Preloader'
import { BackToTop } from './components/BackToTop'

const Home = lazy(() => import('./pages/Home'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const EducationPage = lazy(() => import('./pages/EducationPage'))
const ResearchPage = lazy(() => import('./pages/ResearchPage'))
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'))
const NewsPage = lazy(() => import('./pages/NewsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const GuestbookPage = lazy(() => import('./pages/GuestbookPage'))
const CaseStudyCleanReport = lazy(() => import('./pages/CaseStudyCleanReport'))
const CaseStudyHotel = lazy(() => import('./pages/CaseStudyHotel'))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'))
const NewsArticlePage = lazy(() => import('./pages/NewsArticlePage'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  // Issue 5.8: Seen-once preloader session memory for recruiters and Lighthouse scores
  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('portfolio_preloader_seen')
    }
    return true
  })

  const handlePreloaderComplete = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('portfolio_preloader_seen', 'true')
    }
    setLoading(false)
  }, [])

  const location = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <ThemeProvider>
      <LensProvider>
        {loading && <Preloader onComplete={handlePreloaderComplete} />}
        <Suspense fallback={<div className="min-h-screen bg-[var(--color-surface-base)]" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsArticlePage />} />
            <Route path="/guestbook" element={<GuestbookPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/case-study/clean-report" element={<CaseStudyCleanReport />} />
            <Route path="/case-study/hotel-recommendation" element={<CaseStudyHotel />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <BackToTop />
      </LensProvider>
    </ThemeProvider>
  )
}

