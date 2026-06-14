'use client' // Error boundaries must be Client Components

// Dashboard-level safety screen: catches errors inside the dashboard while
// keeping the bottom nav + layout intact, so only the content area recovers.
import { useEffect } from 'react'

export default function DashboardError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error('[dashboard error-boundary]', error)
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `dashboard error boundary: ${error?.message ?? 'unknown'}`,
          stack: error?.stack ?? '',
          url: typeof window !== 'undefined' ? window.location.pathname : '',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        }),
      }).catch(() => {})
    }
  }, [error])

  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
      <div style={{ fontSize: 44, marginBottom: 18 }}>⚠️</div>
      <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 900, margin: '0 0 8px' }}>Couldn&apos;t load this page</h2>
      <p style={{ color: '#555', fontSize: 14, lineHeight: 1.6, margin: '0 0 24px', maxWidth: 340 }}>
        Something went wrong loading your dashboard. Your data is safe — try again.
      </p>
      <button onClick={() => unstable_retry()}
        style={{ background: '#FFD700', color: '#000', border: 'none', borderRadius: 50, padding: '13px 26px', fontSize: 15, fontWeight: 900, cursor: 'pointer' }}>
        Try again
      </button>
    </div>
  )
}
