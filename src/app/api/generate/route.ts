import { NextResponse } from 'next/server'

const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

const TOPICS = [
  'faceless AI automation for passive income',
  'making money online with no experience',
  'side hustles that work while you sleep',
  'AI tools that replace boring jobs',
  'US real estate investing for beginners',
  'productivity hacks used by millionaires',
  'crypto and Web3 opportunities in 2025',
  'dropshipping secrets nobody talks about',
  'how to build a personal brand from zero',
  'fitness transformations that go viral on US feeds',
]

export async function GET() {
  try {
    if (!GEMINI_KEY) {
      return NextResponse.json([
        { Title: 'AI Automation Setup', Script: 'Add GEMINI_API_KEY to your environment to get real content ideas.', Caption: 'Set up your API key to unlock daily AI content.', Hashtags: '#ai #automation #setup' }
      ])
    }

    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)]

    const prompt = `You are a viral Instagram content strategist targeting US audiences.

Generate exactly 4 unique, highly engaging content ideas about: "${topic}"

Rules:
- Scripts should be written in the creator's language if detectable, otherwise English
- Captions MUST always be in English
- Hashtags MUST always be in English
- Make hooks attention-grabbing and specific
- Scripts should be 60-90 seconds when read aloud

Return ONLY this JSON array with no extra text, no markdown, no backticks:
[
  {
    "Title": "Specific hook title (under 60 chars)",
    "Script": "Full 60-90 second video script",
    "Caption": "Short punchy English caption under 150 characters",
    "Hashtags": "#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5"
  }
]`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 3000 },
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('Gemini generate error:', response.status)
      return NextResponse.json([{ Title: 'Try again', Script: 'Tap Refresh to get new ideas.', Caption: 'Refresh for fresh content ideas.', Hashtags: '#content #instagram #growth' }])
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const clean = text.replace(/```json/gi, '').replace(/```/g, '').trim()

    const start = clean.indexOf('[')
    const end = clean.lastIndexOf(']')
    if (start === -1 || end === -1) throw new Error('No JSON array found')

    const parsed = JSON.parse(clean.slice(start, end + 1))
    return NextResponse.json(parsed)

  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json([
      { Title: 'Refresh for ideas', Script: 'Tap the Refresh button to load new content ideas.', Caption: 'Great content is coming. Just refresh!', Hashtags: '#instagram #growth #content' }
    ])
  }
}
