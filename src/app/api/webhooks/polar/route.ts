import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function verifyPolarSignature(body: string, signature: string): Promise<boolean> {
  const secret = process.env.POLAR_WEBHOOK_SECRET
  if (!secret) return false

  try {
    const encoder = new TextEncoder()
    const keyData = encoder.encode(secret)
    const msgData = encoder.encode(body)
    const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    const sig = await crypto.subtle.sign('HMAC', key, msgData)
    const hex = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
    return `sha256=${hex}` === signature
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('webhook-signature') || request.headers.get('x-polar-signature') || ''

    if (process.env.POLAR_WEBHOOK_SECRET) {
      const valid = await verifyPolarSignature(body, signature)
      if (!valid) {
        console.error('Invalid Polar webhook signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const event = JSON.parse(body)
    const { type, data } = event

    console.log('Polar webhook:', type, data?.subscription?.id || data?.id)

    switch (type) {
      case 'subscription.created':
      case 'subscription.updated': {
        const sub = data
        const customerEmail = sub.customer?.email || sub.user?.email
        if (customerEmail) {
          const { data: users } = await supabase.auth.admin
            ? await supabase.rpc('get_user_by_email', { email: customerEmail })
            : { data: null }

          if (users) {
            await supabase
              .from('profiles')
              .update({
                subscription_status: sub.status === 'active' ? 'active' : 'inactive',
                updated_at: new Date().toISOString(),
              })
              .eq('email', customerEmail)
          }
        }
        break
      }

      case 'subscription.canceled':
      case 'subscription.revoked': {
        const sub = data
        const customerEmail = sub.customer?.email || sub.user?.email
        if (customerEmail) {
          await supabase
            .from('profiles')
            .update({ subscription_status: 'inactive', updated_at: new Date().toISOString() })
            .eq('email', customerEmail)
        }
        break
      }

      case 'order.created': {
        console.log('New order:', data?.id, 'amount:', data?.amount)
        break
      }

      default:
        console.log('Unhandled Polar event type:', type)
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error('Polar webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
