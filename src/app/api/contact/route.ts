import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, website } = await request.json()

    // Honeypot check — bots fill this, humans don't
    if (website) {
      return NextResponse.json({ success: true }) // silently succeed so bots don't know they were blocked
    }

    const cleanName = String(name ?? '').trim()
    const cleanEmail = String(email ?? '').trim()
    const cleanMessage = String(message ?? '').trim()

    // Presence (after trimming, so whitespace-only doesn't pass)
    if (!cleanName || !cleanEmail || !cleanMessage) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    // Length caps — stop oversized/abusive payloads
    if (cleanName.length > 100 || cleanEmail.length > 200 || cleanMessage.length > 5000) {
      return NextResponse.json({ error: 'Input is too long.' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'GramScaling <support@gramscaling.com>',
      to: 'baroqueincoporated@gmail.com',
      replyTo: cleanEmail,
      subject: `Contact form: ${cleanName}`,
      text: `Name: ${cleanName}\nEmail: ${cleanEmail}\n\nMessage:\n${cleanMessage}`,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact] Email send failed:', err)
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 })
  }
}
