import { NextRequest, NextResponse } from 'next/server'

const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

const FALLBACK_TOPICS = [
  'building a personal brand online',
  'making money with a side hustle',
  'fitness transformation secrets',
  'self-improvement for men',
  'building confidence and discipline',
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const niche = searchParams.get('niche') || FALLBACK_TOPICS[Math.floor(Math.random() * FALLBACK_TOPICS.length)]
  const language = searchParams.get('language') || 'English'

  try {
    if (!GEMINI_KEY) {
      return NextResponse.json([
        { Title: 'Set up your API key', Script: 'Add GEMINI_API_KEY to your environment variables to unlock daily content ideas.', Caption: 'Set up complete. Time to grow.', Hashtags: '#growth #instagram #creator', PostingTime: '6:00 PM EST' }
      ])
    }

    const prompt = `You are a viral Instagram content strategist for the US market.

Generate exactly 5 trending content ideas for a creator in the "${niche}" niche targeting American audiences.

Script language: ${language} (write the Script field in ${language}, but Caption and Hashtags MUST always be in English)
Captions: English only
Hashtags: English only

Make each idea feel like a trending US video concept right now. Be specific and compelling.

Return ONLY this JSON array with no extra text:
[
  {
    "Title": "Scroll-stopping hook title under 55 characters",
    "Script": "Full 60-90 second video script in ${language}. Include opening hook, 3 value points, strong CTA.",
    "Caption": "Short punchy English caption under 130 characters with emoji",
    "Hashtags": "#tag1 #tag2 #tag3 #tag4 #tag5 (English only, US-focused)",
    "PostingTime": "Best EST posting time e.g. 7:00 PM EST"
  }
]`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 4000 },
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('Gemini generate error:', response.status)
      return NextResponse.json(fallbackIdeas())
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const start = text.indexOf('[')
    const end = text.lastIndexOf(']')
    if (start === -1 || end === -1) return NextResponse.json(fallbackIdeas())

    const parsed = JSON.parse(text.slice(start, end + 1))
    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json(fallbackIdeas())
  }
}

function fallbackIdeas() {
  return [{ Title: 'Tap Refresh for ideas', Script: 'Tap the refresh button to load fresh content ideas for today.', Caption: 'Great content is one tap away. Refresh!', Hashtags: '#instagram #growth #content #creator #viral', PostingTime: '7:00 PM EST' }]
}
