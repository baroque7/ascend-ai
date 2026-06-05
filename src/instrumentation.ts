import type { Instrumentation } from 'next'

// Next.js calls this whenever a server error is thrown (API routes, server rendering, proxy).
// We write it straight to the error_logs table via the service role. Production only.
export const onRequestError: Instrumentation.onRequestError = async (err, request) => {
  if (process.env.NODE_ENV !== 'production') return

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
    const e = err as Error
    await admin.from('error_logs').insert({
      source: 'server',
      message: String(e?.message ?? 'Unknown server error').slice(0, 2000),
      stack: String(e?.stack ?? '').slice(0, 8000),
      url: String(request?.path ?? '').slice(0, 1000),
    })
  } catch {
    /* never let logging break the server */
  }
}
