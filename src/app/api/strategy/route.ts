import { NextRequest, NextResponse } from 'next/server'

const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { username, niche, language, scrapeContext, analysisContext } = await request.json()

    if (!username) {
      return NextResponse.json({ error: 'Instagram username required' }, { status: 400 })
    }
    if (!GEMINI_KEY) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 })
    }

    const lang = language || 'English'
    const context = [
      scrapeContext ? `Profile data: ${JSON.stringify(scrapeContext)}` : '',
      analysisContext ? `Analysis: ${JSON.stringify(analysisContext)}` : '',
    ].filter(Boolean).join('\n\n')

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are a premium brand strategist for Instagram creators targeting the US market.

Creator: @${username}
Niche: ${niche || 'general content'}
Language: ${lang}
${context}

Build a complete brand identity strategy. Be specific, bold, and actionable. No generic advice.` }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                brandIdentity: { type: 'STRING' },
                uniqueDifferentiator: { type: 'STRING' },
                usGrowthPlan: { type: 'STRING' },
                formatFatigueWarning: { type: 'STRING' },
                profileTips: { type: 'STRING' },
                filmingTips: { type: 'STRING' },
                contentPillars: { type: 'ARRAY', items: { type: 'STRING' } },
                voiceAndTone: { type: 'STRING' },
                estimatedTimeToResults: { type: 'STRING' },
              },
              required: ['brandIdentity', 'uniqueDifferentiator', 'usGrowthPlan', 'formatFatigueWarning', 'profileTips', 'filmingTips'],
            },
            temperature: 0.8,
            maxOutputTokens: 5000,
          },
        }),
      }
    )

    const data = await response.json()
    if (!response.ok) {
      if (response.status === 429) return NextResponse.json({ error: 'AI limit reached. Wait a moment.' }, { status: 429 })
      return NextResponse.json({ error: data.error?.message || 'AI unavailable' }, { status: response.status })
    }

    const candidate = data.candidates?.[0]
    if (!candidate || (candidate.finishReason && candidate.finishReason !== 'STOP')) {
      return NextResponse.json({ error: `Strategy interrupted. Try again.` }, { status: 500 })
    }

    const text = candidate.content?.parts?.[0]?.text
    if (!text) return NextResponse.json({ error: 'Empty response. Try again.' }, { status: 500 })

    return NextResponse.json(JSON.parse(text.trim()))
  } catch (error: any) {
    console.error('Strategy error:', error)
    return NextResponse.json({ error: `Strategy failed: ${error.message}` }, { status: 500 })
  }
}
