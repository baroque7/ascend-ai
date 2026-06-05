// Browser-side error logging — reports uncaught errors to /api/log-error,
// which saves them to the error_logs table. Production only; silent in local dev.
if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
  const report = (message: string, stack?: string) => {
    try {
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message || 'Unknown error',
          stack: stack || '',
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
        keepalive: true, // let the request finish even if the page is closing
      }).catch(() => {})
    } catch {
      /* never let logging break the app */
    }
  }

  window.addEventListener('error', (e) => {
    report(e.message, e.error?.stack)
  })

  window.addEventListener('unhandledrejection', (e) => {
    const reason = e.reason as { message?: string; stack?: string } | undefined
    report(reason?.message || String(e.reason), reason?.stack)
  })
}
