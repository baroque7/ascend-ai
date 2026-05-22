import { NextRequest, NextResponse } from 'next/server'

const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { username, niche, language } = await request.json()

    if (!username) {
      return NextResponse.json({ error: 'Instagram username required' }, { status: 400 })
    }

    if (!GEMINI_KEY) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 })
    }

    const lang = language && language !== 'en' ? language : 'English'

    const prompt = `You are a premium brand strategist for Instagram creators targeting the US market.

Analyze the Instagram creator "@${username}"${niche ? ` who creates ${niche} content` : ''}.
Their preferred language for scripts is: ${lang}.

Build a complete brand identity strategy. Be specific, bold, and actionable. No generic advice.

Return ONLY this JSON:
{
  "brandIdentity": "2-3 sentences describing their unique brand identity and positioning in the US market",
  "uniqueDifferentiator": "What makes them genuinely different from 1000 other creators in this niche — be specific and bold",
  "usGrowthPlan": "A concrete 30-day action plan for US audience growth with specific steps",
  "formatFatigueWarning": "The content formats that are oversaturated in their niche right now and why creators lose followers using them",
  "profileTips": "3-5 specific profile optimization tips for attracting US followers",
  "filmingTips": "3-4 specific filming environment and production tips that signal quality to US audiences",
  "contentPillars": ["pillar1", "pillar2", "pillar3"],
  "voiceAndTone": "Description of the exact voice, tone, and personality they should project to US audiences",
  "estimatedTimeToResults": "Realistic timeline with milestones"
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
      if (response.status === 429) return NextResponse.json({ error: 'AI limit reached. Wait a moment and try again.' }, { status: 429 })
      return NextResponse.json({ error: data.error?.message || 'AI service unavailable' }, { status: response.status })
    }

    const candidate = data.candidates?.[0]
    if (!candidate) return NextResponse.json({ error: 'No response from AI. Try again.' }, { status: 500 })

    if (candidate.finishReason && candidate.finishReason !== 'STOP') {
      return NextResponse.json({ error: `Analysis interrupted (${candidate.finishReason}). Try again.` }, { status: 500 })
    }

    const text = candidate.content?.parts?.[0]?.text
    if (!text) return NextResponse.json({ error: 'Empty response. Try again.' }, { status: 500 })

    return NextResponse.json(JSON.parse(text.trim()))
  } catch (error: any) {
    console.error('Strategy error:', error)
    return NextResponse.json({ error: `Strategy failed: ${error.message}` }, { status: 500 })
  }
}
