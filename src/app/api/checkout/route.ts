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
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const email = user.email!
    const userId = user.id

    const accessToken = process.env.POLAR_ACCESS_TOKEN
    const productId = process.env.POLAR_PRODUCT_ID
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gramscaling.com'

    if (!accessToken || !productId) {
      return NextResponse.json({ error: 'Payment not configured' }, { status: 500 })
    }

    const response = await fetch('https://api.polar.sh/v1/checkouts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: productId,
        customer_email: email,
        metadata: { user_id: userId },
        success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_ID}`,
        cancel_url: `${baseUrl}/payment`,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Polar checkout error:', data)
      return NextResponse.json({ error: data.detail || 'Checkout creation failed' }, { status: response.status })
    }

    return NextResponse.json({ url: data.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}
