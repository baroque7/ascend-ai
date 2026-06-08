import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Generates a Creem customer portal link so the logged-in user can manage /
// cancel their subscription. The customer id comes from the DB (stored by the
// payment webhook) — never from the request — so a user can only open THEIR OWN portal.
export async function POST(request: NextRequest) {
  try {
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

    const apiKey = process.env.CREEM_API_KEY
    const apiUrl = process.env.CREEM_API_URL || 'https://api.creem.io'
    if (!apiKey || !SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Billing not configured' }, { status: 500 })
    }

    // Look up the Creem customer id the webhook saved when this user paid.
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
    const { data } = await admin
      .from('users')
      .select('creem_customer_id')
      .eq('id', user.id)
      .single()

    const customerId = data?.creem_customer_id
    if (!customerId) {
      // Promo users (or anyone without a real Creem subscription) have nothing to manage.
      return NextResponse.json({ error: 'NO_CUSTOMER' }, { status: 404 })
    }

    const res = await fetch(`${apiUrl}/v1/customers/billing`, {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_id: customerId }),
    })
    const json = await res.json()

    if (!res.ok || !json.customer_portal_link) {
      console.error('[billing-portal] Creem error:', json)
      return NextResponse.json({ error: 'Could not open billing portal' }, { status: 502 })
    }

    return NextResponse.json({ url: json.customer_portal_link })
  } catch (error: unknown) {
    console.error('[billing-portal] error:', error)
    return NextResponse.json({ error: 'Failed to open billing portal' }, { status: 500 })
  }
}
