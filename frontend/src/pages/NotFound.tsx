import { Link } from 'react-router-dom'

/** 404 Not Found — Phase 8 will flesh this out with design */
export default function NotFound() {
  return (
    <main
      id="main-content"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-background)',
        padding: '2rem',
        textAlign: 'center',
        gap: '1.5rem',
      }}
    >
      <p className="text-label" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>
        404
      </p>
      <h1 className="text-display-l" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
        Page not found
      </h1>
      <p style={{ color: 'var(--color-ink-muted)' }}>
        The page you are looking for does not exist.
      </p>
      <nav aria-label="Recovery links" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/">← Home</Link>
        <Link to="/research">Research</Link>
      </nav>
    </main>
  )
}
