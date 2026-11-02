import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { ThemeProvider } from '../lib/theme'

describe('<Navbar /> component', () => {
  const renderNavbar = (initialRoute = '/') => {
    return render(
      <ThemeProvider>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Navbar />
        </MemoryRouter>
      </ThemeProvider>
    )
  }

  it('renders brand identity and navigation links', () => {
    renderNavbar('/')

    // Brand logo / home link
    const brandLink = screen.getByLabelText(/Home - Quadri Ayomikun Amoo/i)
    expect(brandLink).toBeInTheDocument()

    // Nav items
    expect(screen.getAllByText('Research').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Projects').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Experience').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Education').length).toBeGreaterThan(0)
  })

  it('renders theme toggle and allows interaction', () => {
    renderNavbar('/')

    const themeToggle = screen.getByLabelText(/Switch to (dark|light) mode/i)
    expect(themeToggle).toBeInTheDocument()
    fireEvent.click(themeToggle)
  })

  it('toggles mobile menu drawer on mobile toggle click', () => {
    renderNavbar('/')

    const mobileToggle = screen.getByLabelText(/Open full menu/i)
    expect(mobileToggle).toBeInTheDocument()
    fireEvent.click(mobileToggle)

    // Mobile menu drawer should now appear
    expect(screen.getByLabelText(/Close menu/i)).toBeInTheDocument()
  })
})
