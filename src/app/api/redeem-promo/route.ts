import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const VALID_PROMO = 'MIHAWK41'
const promoSchema = z.object({ code: z.string().trim().min(1).max(50) })
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    // Verify the session — the user id comes from here, never the request body.
    const cookieStore = await cookies()
    const supabase = createServerClient(
      SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const parsed = promoSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success || parsed.data.code.trim().toUpperCase() !== VALID_PROMO) {
      return NextResponse.json({ error: 'Invalid promo code' }, { status: 400 })
    }

    if (!SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    }

    // Grant promo access via the service role — the only path allowed to write is_promo.
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
    await admin.from('users').upsert(
      { id: user.id, is_promo: true },
      { onConflict: 'id' }
    )

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to redeem code' }, { status: 500 })
  }
}
