import { NextRequest, NextResponse } from 'next/server'

const VALID_PROMO = 'MIHAWK41'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code || code.trim().toUpperCase() !== VALID_PROMO) {
      return NextResponse.json({ error: 'Invalid promo code' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to validate code' }, { status: 500 })
  }
}
