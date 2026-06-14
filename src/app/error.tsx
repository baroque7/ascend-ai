'use client' // Error boundaries must be Client Components

// App-level safety screen: catches unexpected runtime errors in any route
// (everything below the root layout) and shows a recoverable fallback instead
// of a blank white screen.
import { useEffect } from 'react'

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error('[error-boundary]', error)
    // Best-effort: record it so it shows up in the error_logs table.
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `error boundary: ${error?.message ?? 'unknown'}`,
          stack: error?.stack ?? '',
          url: typeof window !== 'undefined' ? window.location.pathname : '',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        }),
      }).catch(() => {})
    }
  }, [error])

  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 20 }}>⚠️</div>
      <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 900, margin: '0 0 10px', letterSpacing: '-0.5px' }}>
        Something went wrong
      </h2>
      <p style={{ color: '#555', fontSize: 14, lineHeight: 1.6, margin: '0 0 28px', maxWidth: 360 }}>
        An unexpected error occurred. Try again — if it keeps happening, contact support@gramscaling.com.
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => unstable_retry()}
          style={{ background: '#FFD700', color: '#000', border: 'none', borderRadius: 50, padding: '14px 28px', fontSize: 15, fontWeight: 900, cursor: 'pointer' }}>
          Try again
        </button>
        <a href="/"
          style={{ background: 'transparent', color: '#666', border: '1px solid #222', borderRadius: 50, padding: '14px 28px', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
          Go home
        </a>
      </div>
    </div>
  )
}
