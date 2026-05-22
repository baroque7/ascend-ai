import { NextRequest, NextResponse } from 'next/server'

const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { username, niche, language, scrapeData } = await request.json()

    if (!username) {
      return NextResponse.json({ error: 'Instagram username is required' }, { status: 400 })
    }
    if (!GEMINI_KEY) {
      return NextResponse.json({ error: 'AI service not configured.' }, { status: 500 })
    }

    const lang = language || 'English'
    const scrapeContext = scrapeData && Object.keys(scrapeData).length > 0
      ? `\n\nProfile data: ${JSON.stringify(scrapeData)}`
      : ''

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are an Instagram growth strategist helping creators reach US audiences.

Creator handle: @${username}
Niche: ${niche || 'general content'}
Language: ${lang}${scrapeContext}

Provide a comprehensive US growth analysis. All text in English.` }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                niche: { type: 'STRING' },
                analysis: { type: 'STRING' },
                strategy: { type: 'STRING' },
                hashtags: { type: 'STRING' },
                postingTimes: { type: 'STRING' },
                profileTips: { type: 'STRING' },
                audienceInsights: { type: 'STRING' },
                contentGaps: { type: 'STRING' },
              },
              required: ['niche', 'analysis', 'strategy', 'hashtags', 'postingTimes', 'profileTips'],
            },
            temperature: 0.7,
            maxOutputTokens: 4000,
          },
        }),
      }
    )

    const data = await response.json()
    if (!response.ok) {
      if (response.status === 429) return NextResponse.json({ error: 'AI limit reached. Wait a moment.' }, { status: 429 })
      return NextResponse.json({ error: data.error?.message || 'AI unavailable.' }, { status: response.status })
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) return NextResponse.json({ error: 'Empty response from AI.' }, { status: 500 })

    return NextResponse.json(JSON.parse(text.trim()))
  } catch (error: any) {
    console.error('Analyze error:', error)
    return NextResponse.json({ error: `Analysis failed: ${error.message}` }, { status: 500 })
  }
}
