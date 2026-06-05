import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Records a handled server-side error to the error_logs table.
// Use this in API route catch blocks — those errors are caught and returned as
// JSON, so Next.js's automatic onRequestError never sees them. Never throws.
export async function logServerError(
  message: string,
  context?: { url?: string; userId?: string; stack?: string }
): Promise<void> {
  if (!SERVICE_ROLE_KEY) return
  try {
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
    await admin.from('error_logs').insert({
      source: 'server',
      message: String(message).slice(0, 2000),
      stack: String(context?.stack ?? '').slice(0, 8000),
      url: String(context?.url ?? '').slice(0, 1000),
      user_id: context?.userId ?? null,
    })
  } catch {
    /* logging must never break the request */
  }
}
