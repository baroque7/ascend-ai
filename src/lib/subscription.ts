import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side subscription check. Reads the DB (the source of truth the webhook
// writes) via the service role. Fails CLOSED — any error means "not subscribed",
// so a problem can never accidentally grant paid access.
export async function hasActiveAccess(userId: string): Promise<boolean> {
  if (!SERVICE_ROLE_KEY || !userId) return false
  try {
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
    const { data } = await admin
      .from('users')
      .select('is_subscribed, is_promo')
      .eq('id', userId)
      .single()
    return Boolean(data?.is_subscribed || data?.is_promo)
  } catch {
    return false
  }
}
