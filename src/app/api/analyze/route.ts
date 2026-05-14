import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username, niche } = await request.json()

    const prompt = `You are an expert Instagram growth strategist specializing in helping creators reach US audiences. 
    
A creator with Instagram handle @${username} wants to grow their US audience.
${niche ? `Their content niche is: ${niche}` : 'Analyze and determine their best niche for the US market.'}

Provide a comprehensive analysis in this EXACT JSON format:
{
  "niche": "Their specific US market niche (be specific e.g. 'Latina Lifestyle & Confidence' not just 'lifestyle')",
  "analysis": "2-3 sentences analyzing their current profile and potential for US market",
  "strategy": "3-4 specific actionable strategies to grow US audience on Instagram",
  "hashtags": "20 specific hashtags for US audiences in their niche, separated by spaces",
  "postingTimes": "3 best times to post for US audiences with explanation",
  "profileTips": "3 specific tips to optimize their profile for US audience attraction"
}

Return ONLY the JSON. No other text.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    )

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const clean = text.replace(/```json/g, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(clean)

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Analyze error:', error)
    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 })
  }
}