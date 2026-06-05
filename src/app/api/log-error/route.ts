import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Receives browser errors and saves them to error_logs.
// Always returns 200 — logging must never surface an error to the user.
export async function POST(request: NextRequest) {
  try {
    if (!SERVICE_ROLE_KEY) return NextResponse.json({ ok: false })

    const body = await request.json()
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    await admin.from('error_logs').insert({
      source: 'client',
      // Cap every field so a malicious caller can't bloat the table
      message: String(body.message ?? '').slice(0, 2000),
      stack: String(body.stack ?? '').slice(0, 8000),
      url: String(body.url ?? '').slice(0, 1000),
      user_agent: String(body.userAgent ?? '').slice(0, 500),
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
