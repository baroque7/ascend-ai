import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const WEBHOOK_SECRET = process.env.CREEM_WEBHOOK_SECRET

// Events that mean "this person has paid → grant access"
const GRANT_EVENTS = new Set(['checkout.completed', 'subscription.paid'])
// Events that mean "access should end → revoke"
const REVOKE_EVENTS = new Set(['subscription.canceled', 'subscription.expired'])

export async function POST(request: NextRequest) {
  // 1. Read the RAW body. The signature is computed over these exact bytes,
  //    so we must NOT parse to JSON before verifying.
  const rawBody = await request.text()
  const signature = request.headers.get('creem-signature') || ''

  if (!WEBHOOK_SECRET || !SERVICE_ROLE_KEY) {
    console.error('[creem-webhook] Missing CREEM_WEBHOOK_SECRET or SERVICE_ROLE_KEY')
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  // 2. Verify the signature — HMAC-SHA256 of the raw body with the webhook secret.
  //    Reject anything that doesn't match (this blocks forged "you got paid" events).
  const expected = crypto.createHmac('sha256', WEBHOOK_SECRET).update(rawBody).digest('hex')
  const sigBuf = Buffer.from(signature)
  const expBuf = Buffer.from(expected)
  const valid = sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf)

  if (!valid) {
    console.warn('[creem-webhook] Invalid signature — rejected')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // 3. Signature is valid — now we can trust the payload.
  let event: {
    eventType?: string
    object?: { metadata?: { userId?: string }; customer?: { id?: string } | string }
  }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Bad payload' }, { status: 400 })
  }

  const eventType = event.eventType || ''
  const obj = event.object || {}
  const userId = obj.metadata?.userId
  const customerId = typeof obj.customer === 'string' ? obj.customer : obj.customer?.id

  const grant = GRANT_EVENTS.has(eventType)
  const revoke = REVOKE_EVENTS.has(eventType)

  // Events we don't act on (past_due, update, etc.) — acknowledge so Creem stops retrying.
  if (!grant && !revoke) {
    return NextResponse.json({ received: true })
  }

  try {
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    if (grant) {
      // Prefer the userId we stamped at checkout; also store the Creem customer id
      // so later cancel/expire events can be matched even without metadata.
      // upsert (not update) because the users row may not exist yet — the signup
      // trigger only creates a profiles row, and the users row is otherwise created
      // during onboarding, which happens AFTER payment.
      if (userId) {
        await admin.from('users').upsert({
          id: userId,
          is_subscribed: true,
          creem_customer_id: customerId ?? null,
        }, { onConflict: 'id' })
      } else if (customerId) {
        await admin.from('users').update({ is_subscribed: true }).eq('creem_customer_id', customerId)
      }
    } else if (revoke) {
      if (userId) {
        await admin.from('users').update({ is_subscribed: false }).eq('id', userId)
      } else if (customerId) {
        await admin.from('users').update({ is_subscribed: false }).eq('creem_customer_id', customerId)
      }
    }

    console.log(`[creem-webhook] ${eventType} processed (userId=${userId ?? '—'}, customer=${customerId ?? '—'})`)
  } catch (e) {
    console.error('[creem-webhook] DB update failed:', e)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
