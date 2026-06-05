import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
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
    // The user id comes from the verified session — never from the request body —
    // so the metadata Creem echoes back in the webhook is trustworthy.
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const email = user.email!
    const userId = user.id

    const apiKey = process.env.CREEM_API_KEY
    const productId = process.env.CREEM_PRODUCT_ID
    const apiUrl = process.env.CREEM_API_URL || 'https://api.creem.io'
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gramscaling.com'

    if (!apiKey || !productId) {
      return NextResponse.json({ error: 'Payment not configured' }, { status: 500 })
    }

    const response = await fetch(`${apiUrl}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: productId,
        success_url: `${baseUrl}/payment/success`,
        customer: { email },
        metadata: { userId },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Creem checkout error:', data)
      return NextResponse.json({ error: 'Checkout creation failed' }, { status: response.status })
    }

    return NextResponse.json({ url: data.checkout_url })
  } catch (error: unknown) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}
