import React, { useState, useEffect, lazy, Suspense } from 'react'
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
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <ThemeProvider>
      <LensProvider>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
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
            <Route path="/guestbook" element={<GuestbookPage />} />
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

