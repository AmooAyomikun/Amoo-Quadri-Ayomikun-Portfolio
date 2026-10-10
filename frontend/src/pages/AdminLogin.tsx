import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '../components/Button'

export default function AdminLogin() {
  const [passphrase, setPassphrase] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // We do a simple client-side check, but true security is on the backend.
    // The backend expects 'quadri2026' for operations.
    if (passphrase === 'quadri2026') {
      localStorage.setItem('admin_key', passphrase)
      navigate('/admin/dashboard')
    } else {
      setError('Invalid admin passphrase. Access denied.')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-base)] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[var(--color-surface-card)] rounded-3xl p-8 border border-[var(--color-border)] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-[var(--color-primary)]" />
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30">
            <ShieldCheck className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <h1 className="text-2xl font-serif font-bold text-center text-[var(--color-text-main)] mb-2">
          Admin Portal
        </h1>
        <p className="text-sm font-mono text-center text-[var(--color-text-muted)] mb-8">
          Restricted Access. Authorized personnel only.
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-mono text-[var(--color-text-subtle)] mb-2 uppercase tracking-wider">
              Admin Passphrase
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <input
                type="password"
                value={passphrase}
                onChange={(e) => {
                  setPassphrase(e.target.value)
                  setError('')
                }}
                className="w-full bg-[var(--color-surface-base)] border border-[var(--color-border)] rounded-xl py-3 pl-12 pr-4 text-sm text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                placeholder="Enter passphrase..."
                autoFocus
              />
            </div>
            {error && (
              <p className="text-red-400 text-xs font-mono mt-2 flex items-center gap-1">
                {error}
              </p>
            )}
          </div>

          <Button type="submit" variant="primary" className="w-full justify-center">
            Authenticate Access <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </div>
    </div>
  )
}
