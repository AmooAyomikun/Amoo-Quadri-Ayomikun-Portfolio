import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AdminLogin from '../pages/AdminLogin'
import AdminDashboard from '../pages/AdminDashboard'
import { setAdminToken, clearAdminToken } from '../lib/api'

describe('Admin Flow: Authentication & Dashboard', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    vi.restoreAllMocks()
    clearAdminToken()
  })

  afterEach(() => {
    global.fetch = originalFetch
    clearAdminToken()
  })

  it('renders login prompt and displays error on invalid passphrase', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        error: 'Invalid admin passphrase. Access denied.',
      }),
    } as Response)

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Admin Portal')).toBeInTheDocument()
    const passwordInput = screen.getByPlaceholderText(/Enter passphrase\.\.\./i)
    const submitBtn = screen.getByRole('button', { name: /Authenticate Access/i })

    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/Invalid admin passphrase\. Access denied\./i)).toBeInTheDocument()
    })
  })

  it('redirects unauthenticated user away from AdminDashboard', async () => {
    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <Routes>
          <Route path="/admin" element={<div>Admin Login Screen</div>} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Admin Login Screen')).toBeInTheDocument()
    })
  })

  it('renders dashboard with news, messages, and guestbook tabs when authenticated', async () => {
    setAdminToken('mock-admin-token-1234')

    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/admin/verify')) {
        return Promise.resolve({ ok: true, json: async () => ({ success: true }) } as Response)
      }
      if (url.includes('/api/news')) {
        return Promise.resolve({ ok: true, json: async () => ({ success: true, data: [] }) } as Response)
      }
      if (url.includes('/api/admin/messages')) {
        return Promise.resolve({ ok: true, json: async () => ({ success: true, data: [] }) } as Response)
      }
      if (url.includes('/api/guestbook')) {
        return Promise.resolve({ ok: true, json: async () => [] } as Response)
      }
      return Promise.resolve({ ok: true, json: async () => ({}) } as Response)
    })

    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <Routes>
          <Route path="/admin" element={<div>Admin Login Screen</div>} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Admin Control/i)).toBeInTheDocument()
    })

    // Verify tabs
    const newsTab = screen.getByRole('button', { name: /Announcements/i })
    const messagesTab = screen.getByRole('button', { name: /Inquiries & Messages/i })
    const guestbookTab = screen.getByRole('button', { name: /Guestbook Signatures/i })

    expect(newsTab).toBeInTheDocument()
    expect(messagesTab).toBeInTheDocument()
    expect(guestbookTab).toBeInTheDocument()

    // Switch to Messages tab
    fireEvent.click(messagesTab)
    expect(screen.getByText(/Contact Inquiries/i)).toBeInTheDocument()

    // Switch to Guestbook tab
    fireEvent.click(guestbookTab)
    expect(screen.getByText(/Guestbook Moderation/i)).toBeInTheDocument()
  })
})
