import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username, niche } = await request.json()

    if (!username) {
      return NextResponse.json({ error: 'Instagram username is required' }, { status: 400 })
    }

    const prompt = `You are an Instagram growth strategist helping creators reach US audiences.

A creator with Instagram handle @${username} wants to grow their US audience.
${niche ? `Their content niche is: ${niche}` : 'Determine their best niche for the US market.'}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
                niche: { type: 'STRING' },
                analysis: { type: 'STRING' },
                strategy: { type: 'STRING' },
                hashtags: { type: 'STRING' },
                postingTimes: { type: 'STRING' },
                profileTips: { type: 'STRING' }
              },
              required: ['niche', 'analysis', 'strategy', 'hashtags', 'postingTimes', 'profileTips']
            },
            temperature: 0.7,
            maxOutputTokens: 4000
          }
        })
      }
    )

    const data = await response.json()

    // 1. Handle HTTP errors explicitly
    if (!response.ok) {
      console.error('Gemini API HTTP Error:', response.status, JSON.stringify(data))
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'AI limit reached. Please wait 10 seconds and try again!' },
          { status: 429 }
        )
      }
      return NextResponse.json(
        { error: data.error?.message || 'AI service is temporarily unavailable.' },
        { status: response.status }
      )
    }

    // 2. Handle block/safety reasons explicitly
    const candidate = data.candidates?.[0]
    if (!candidate) {
      return NextResponse.json(
        { error: 'No response received from AI. Please try a different username or niche.' },
        { status: 500 }
      )
    }

    if (candidate.finishReason && candidate.finishReason !== 'STOP') {
      console.warn('Gemini finished with abnormal reason:', candidate.finishReason)
      if (candidate.finishReason === 'SAFETY') {
        return NextResponse.json(
          { error: 'Content blocked by safety filters. Please try another username or niche.' },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: `AI analysis interrupted (Reason: ${candidate.finishReason}). Please try again.` },
        { status: 500 }
      )
    }

    const text = candidate.content?.parts?.[0]?.text
    if (!text) {
      return NextResponse.json(
        { error: 'Received empty analysis from AI. Please try again.' },
        { status: 500 }
      )
    }

    const parsed = JSON.parse(text.trim())
    return NextResponse.json(parsed)

  } catch (error: any) {
    console.error('Analyze error:', error)
    return NextResponse.json({ error: `Analysis failed: ${error.message || error}` }, { status: 500 })
  }
}