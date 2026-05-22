import { NextRequest, NextResponse } from 'next/server'

const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }
    if (!GEMINI_KEY) {
      return NextResponse.json({ error: 'AI service not configured.' }, { status: 500 })
    }

    const clean = username.replace('@', '').trim().toLowerCase()

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are a social media analyst. Based on the Instagram username "@${clean}", generate a realistic profile analysis for US market positioning.

Return ONLY valid JSON matching this schema exactly:` }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                username: { type: 'STRING' },
                estimatedNiche: { type: 'STRING' },
                estimatedFollowers: { type: 'STRING' },
                contentStyle: { type: 'STRING' },
                usMarketFit: { type: 'STRING' },
                usMarketScore: { type: 'NUMBER' },
                topContentTypes: { type: 'ARRAY', items: { type: 'STRING' } },
                suggestedHashtags: { type: 'ARRAY', items: { type: 'STRING' } },
                bestPostingTimes: { type: 'STRING' },
                growthOpportunities: { type: 'STRING' },
                audiencePersona: { type: 'STRING' },
              },
              required: ['username', 'estimatedNiche', 'usMarketScore', 'growthOpportunities', 'bestPostingTimes'],
            },
            temperature: 0.6,
            maxOutputTokens: 1500,
          },
        }),
      }
    )

    const data = await response.json()
    if (!response.ok) {
      return NextResponse.json({ error: 'Profile analysis failed.' }, { status: response.status })
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) return NextResponse.json({ error: 'No analysis returned.' }, { status: 500 })

    return NextResponse.json({ success: true, profile: JSON.parse(text.trim()) })
  } catch (error: any) {
    console.error('Scrape error:', error)
    return NextResponse.json({ error: `Profile lookup failed: ${error.message}` }, { status: 500 })
  }
}
