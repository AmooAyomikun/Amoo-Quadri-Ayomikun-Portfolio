import React, { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an unhandled error:', error, errorInfo)
    }
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-base)] text-[var(--color-text-primary)] px-4">
          <div className="max-w-md w-full text-center p-8 rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-surface-raised)] shadow-xl">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-3xl font-bold">
              !
            </div>
            <h1 className="text-2xl font-bold font-serif mb-2">Something went wrong</h1>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              An unexpected error occurred while rendering this page. You can reload the page or return to the homepage.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="px-5 py-2.5 rounded-lg bg-[var(--color-primary-base)] text-white font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="px-5 py-2.5 rounded-lg border border-[var(--color-surface-border)] text-[var(--color-text-primary)] font-medium text-sm hover:bg-[var(--color-surface-base)] transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
