import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

// Trim + presence + length caps + email format, all enforced at the door.
const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().min(1).max(200).regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  message: z.string().trim().min(1).max(5000),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)

    // Honeypot — bots fill this, humans don't. Silently succeed so bots don't learn they were blocked.
    if (body?.website) {
      return NextResponse.json({ success: true })
    }

    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Please enter a valid name, email, and message.' }, { status: 400 })
    }
    const { name: cleanName, email: cleanEmail, message: cleanMessage } = parsed.data

    await resend.emails.send({
      from: 'GramScaling <support@gramscaling.com>',
      to: 'support@gramscaling.com',
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
