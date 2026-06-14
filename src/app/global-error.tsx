'use client' // Error boundaries must be Client Components

// Deepest safety net: catches errors in the root layout / providers themselves.
// It replaces the whole document, so it must render its own <html> and <body>.
import { useEffect } from 'react'

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error('[global error-boundary]', error)
  }, [error])

  return (
    <html lang="en">
      <body style={{ background: '#000', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif', margin: 0 }}>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>⚠️</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 10px', letterSpacing: '-0.5px' }}>Something went wrong</h2>
          <p style={{ color: '#888', fontSize: 14, lineHeight: 1.6, margin: '0 0 28px', maxWidth: 360 }}>
            The app hit an unexpected error. Please try again.
          </p>
          <button onClick={() => unstable_retry()}
            style={{ background: '#FFD700', color: '#000', border: 'none', borderRadius: 50, padding: '14px 28px', fontSize: 15, fontWeight: 900, cursor: 'pointer' }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
