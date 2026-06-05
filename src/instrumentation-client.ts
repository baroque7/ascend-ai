// Browser-side error logging — reports uncaught errors to /api/log-error,
// which saves them to the error_logs table. Production only; silent in local dev.
if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
  // Ignore noise from browser extensions (MetaMask, ad blockers, wallets, etc.)
  // and opaque cross-origin "Script error." entries — they aren't our bugs and
  // would otherwise bury the real errors.
  const isNoise = (message: string, stack = '', filename = '') => {
    const blob = `${message} ${stack} ${filename}`.toLowerCase()
    return (
      !message ||
      message === 'script error.' ||
      blob.includes('chrome-extension://') ||
      blob.includes('moz-extension://') ||
      blob.includes('safari-web-extension://') ||
      blob.includes('metamask') ||
      blob.includes('ethereum') ||
      blob.includes('web3')
    )
  }

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
    if (isNoise(e.message, e.error?.stack, e.filename)) return
    report(e.message, e.error?.stack)
  })

  window.addEventListener('unhandledrejection', (e) => {
    const reason = e.reason as { message?: string; stack?: string } | undefined
    const message = reason?.message || String(e.reason)
    if (isNoise(message, reason?.stack)) return
    report(message, reason?.stack)
  })
}
