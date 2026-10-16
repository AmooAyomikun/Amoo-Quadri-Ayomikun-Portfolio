/**
 * Centralized API configuration and client helpers
 */

export const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }
  return import.meta.env.PROD
    ? 'https://portfolio-backend-st78.onrender.com'
    : 'http://localhost:5000'
}

export const apiUrl = (endpoint: string): string => {
  const base = getApiBaseUrl().replace(/\/$/, '')
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${base}${path}`
}

export const getAdminToken = (): string | null => {
  return localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token')
}

export const setAdminToken = (token: string): void => {
  localStorage.setItem('admin_token', token)
}

export const clearAdminToken = (): void => {
  localStorage.removeItem('admin_token')
  sessionStorage.removeItem('admin_token')
  localStorage.removeItem('admin_key') // cleanup any legacy keys
}
