import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ContactSection } from '../sections/ContactSection'

describe('Form Workflows: Contact Form', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('renders all contact form input fields and submit button', () => {
    render(
      <MemoryRouter>
        <ContactSection showHeader={true} />
      </MemoryRouter>
    )

    expect(screen.getByPlaceholderText(/Prof\. John Doe/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/johndoe@university\.edu/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Research Position \/ Project Collaboration/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Share details regarding your research opportunity/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument()
  })

  it('successfully submits the form and displays confirmation message', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Thank you! Your message has been received.',
      }),
    } as Response)

    render(
      <MemoryRouter>
        <ContactSection showHeader={true} />
      </MemoryRouter>
    )

    const nameInput = screen.getByPlaceholderText(/Prof\. John Doe/i)
    const emailInput = screen.getByPlaceholderText(/johndoe@university\.edu/i)
    const subjectInput = screen.getByPlaceholderText(/Research Position \/ Project Collaboration/i)
    const messageInput = screen.getByPlaceholderText(/Share details regarding your research opportunity/i)
    const submitBtn = screen.getByRole('button', { name: /Send Message/i })

    fireEvent.change(nameInput, { target: { value: 'Dr. Jane Smith' } })
    fireEvent.change(emailInput, { target: { value: 'jane@mit.edu' } })
    fireEvent.change(subjectInput, { target: { value: 'Research Fellowship' } })
    fireEvent.change(messageInput, { target: { value: 'We would love to discuss graduate research opportunities.' } })

    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/Thank you! Your message has been received/i)).toBeInTheDocument()
    })

    // Form inputs should reset
    expect((nameInput as HTMLInputElement).value).toBe('')
    expect((emailInput as HTMLInputElement).value).toBe('')
  })

  it('shows error message when the backend API fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        error: 'Database rate limit reached. Please try later.',
      }),
    } as Response)

    render(
      <MemoryRouter>
        <ContactSection showHeader={true} />
      </MemoryRouter>
    )

    const nameInput = screen.getByPlaceholderText(/Prof\. John Doe/i)
    const emailInput = screen.getByPlaceholderText(/johndoe@university\.edu/i)
    const subjectInput = screen.getByPlaceholderText(/Research Position \/ Project Collaboration/i)
    const messageInput = screen.getByPlaceholderText(/Share details regarding your research opportunity/i)
    const submitBtn = screen.getByRole('button', { name: /Send Message/i })

    fireEvent.change(nameInput, { target: { value: 'Dr. Jane Smith' } })
    fireEvent.change(emailInput, { target: { value: 'jane@mit.edu' } })
    fireEvent.change(subjectInput, { target: { value: 'Inquiry' } })
    fireEvent.change(messageInput, { target: { value: 'Testing error flow' } })

    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/Submission Failed: Database rate limit reached/i)).toBeInTheDocument()
    })
  })
})
