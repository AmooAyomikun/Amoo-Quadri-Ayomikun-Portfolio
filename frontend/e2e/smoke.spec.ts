import { test, expect } from '@playwright/test'

test.describe('Portfolio Smoke Tests - Every Page Navigation & Render (Issue 4.9)', () => {
  test.beforeEach(async ({ page }) => {
    // Flag preloader seen in session storage to avoid animation delay during tests
    await page.addInitScript(() => {
      sessionStorage.setItem('portfolio_preloader_seen', 'true')
    })
  })

  test('Home Page (/) renders hero and primary sections', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Quadri Ayomikun Amoo/i)
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('#hero')).toBeVisible()
  })

  test('Education Page (/education) renders degree cards and coursework', async ({ page }) => {
    await page.goto('/education')
    await expect(page).toHaveTitle(/Education/i)
    await expect(page.locator('h1')).toContainText(/Education/i)
  })

  test('Research Page (/research) renders research thesis and assistantships', async ({ page }) => {
    await page.goto('/research')
    await expect(page).toHaveTitle(/Research/i)
    await expect(page.locator('h1')).toContainText(/Research/i)
  })

  test('Experience Page (/experience) renders engineering roles and timeline', async ({ page }) => {
    await page.goto('/experience')
    await expect(page).toHaveTitle(/Experience/i)
    await expect(page.locator('h1')).toContainText(/Experience/i)
  })

  test('Projects Showcase Page (/projects) renders project items', async ({ page }) => {
    await page.goto('/projects')
    await expect(page).toHaveTitle(/Projects/i)
    await expect(page.locator('h1')).toContainText(/Projects/i)
  })

  test('Project Detail Page (/projects/dispatch-lane) renders mockup and technical overview', async ({ page }) => {
    await page.goto('/projects/dispatch-lane')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('Testimonials Page (/testimonials) renders peer reviews and recommendations', async ({ page }) => {
    await page.goto('/testimonials')
    await expect(page).toHaveTitle(/Testimonials/i)
    await expect(page.locator('h1')).toContainText(/Recommendations|Testimonials/i)
  })

  test('News Page (/news) renders announcement list', async ({ page }) => {
    await page.goto('/news')
    await expect(page).toHaveTitle(/News/i)
    await expect(page.locator('h1')).toContainText(/News/i)
  })

  test('Contact Page (/contact) renders communication form and direct channels', async ({ page }) => {
    await page.goto('/contact')
    await expect(page).toHaveTitle(/Contact/i)
    await expect(page.locator('h1')).toContainText(/Contact/i)
    await expect(page.locator('form')).toBeVisible()
  })

  test('Guestbook Page (/guestbook) renders signature canvas and entry feed', async ({ page }) => {
    await page.goto('/guestbook')
    await expect(page).toHaveTitle(/Guestbook/i)
    await expect(page.locator('h1')).toContainText(/Guestbook/i)
  })

  test('Admin Authentication Page (/admin) renders restricted access portal', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveTitle(/Admin/i)
    await expect(page.locator('h1')).toContainText(/Admin Portal/i)
  })

  test('Hotel Case Study (/case-study/hotel) renders interactive breakdown', async ({ page }) => {
    await page.goto('/case-study/hotel')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('CleanReport Case Study (/case-study/cleanreport) renders case review', async ({ page }) => {
    await page.goto('/case-study/cleanreport')
    await expect(page.locator('h1')).toBeVisible()
  })
})
