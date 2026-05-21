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

    const cleanUsername = username.replace('@', '').trim().toLowerCase()

    // Use Gemini to generate realistic profile insights based on username patterns
    const prompt = `You are a social media analyst. Based on the Instagram username "@${cleanUsername}", generate a realistic profile analysis for US market positioning.

Return ONLY this JSON with no extra text:
{
  "username": "${cleanUsername}",
  "estimatedNiche": "detected content niche based on username patterns",
  "estimatedFollowers": "estimated follower range e.g. 1K-10K",
  "contentStyle": "description of likely content style",
  "usMarketFit": "high/medium/low",
  "usMarketScore": 75,
  "topContentTypes": ["type1", "type2", "type3"],
  "suggestedHashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "bestPostingTimes": "best EST posting times for US audiences",
  "growthOpportunities": "2-3 specific growth opportunities for US market",
  "competitorNiches": ["niche1", "niche2"]
}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
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
                competitorNiches: { type: 'ARRAY', items: { type: 'STRING' } },
              },
              required: ['username', 'estimatedNiche', 'usMarketScore', 'growthOpportunities'],
            },
            temperature: 0.6,
            maxOutputTokens: 1500,
          },
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: 'Profile analysis failed. Please try again.' }, { status: response.status })
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      return NextResponse.json({ error: 'No analysis returned. Try again.' }, { status: 500 })
    }

    const parsed = JSON.parse(text.trim())
    return NextResponse.json({ success: true, profile: parsed })

  } catch (error: any) {
    console.error('Scrape error:', error)
    return NextResponse.json({ error: `Profile lookup failed: ${error.message || 'Unknown error'}` }, { status: 500 })
  }
}
