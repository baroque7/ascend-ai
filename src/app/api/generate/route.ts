import { NextRequest, NextResponse } from 'next/server'

const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

function fallback() {
  return NextResponse.json([{
    title: 'Tap Refresh to load ideas',
    trendingTopic: 'Daily content creation',
    script: 'Tap the refresh button to load your personalized content ideas for today.',
    caption: 'Great content is one tap away. Refresh!',
    hashtags: '#instagram #growth #content #creator #viral',
    postingTime: '7:00 PM EST',
    contentFormat: 'reel',
    whyThisWorks: 'Fresh daily ideas keep your content calendar full.',
  }])
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userProfile, language } = body

    if (!GEMINI_KEY) return fallback()

    const userLanguage = language || userProfile?.language || 'English'
    const profile = userProfile || {}

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a viral content strategist who knows exactly what makes American men stop scrolling on Instagram. You understand the content pyramid: Setup, Hook, Build, Payoff, Proof, CTA.
Creator profile: ${JSON.stringify(profile)}
Their niche: ${profile.niche || 'Lifestyle'}
Their brand personality: ${profile.brand_personality || 'The Girl Next Door'}
Their language: ${userLanguage}
Top performing content: ${profile.top_content_type || 'Reels'}
Generate exactly 5 unique content ideas for today. Each one must feel completely different.
Return ONLY a valid JSON array with no markdown no backticks:
[
{
"title": "short punchy title for this content idea",
"trendingTopic": "what US trend this taps into right now",
"script": "full script in ${userLanguage} following the pyramid exactly — Setup: one line framing who this is for. Hook: the scroll stopping opening line. Build: raise the stakes without giving the answer. Payoff: the specific unlock. Proof: the receipt that makes it believable. CTA: one clear action. Make it sound like a real person talking not an AI. 150-200 words.",
"caption": "punchy English caption under 150 characters that makes Americans want to follow",
"hashtags": "15 US targeted hashtags in English for their specific niche",
"postingTime": "best time to post today in EST with reason",
"contentFormat": "reel or carousel or photo",
"whyThisWorks": "one sentence explaining why this specific content will attract American men in their niche"
}
]`,
            }],
          }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 6000 },
        }),
      }
    )

    const data = await res.json()
    if (!res.ok) return fallback()

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const start = text.indexOf('[')
    const end = text.lastIndexOf(']')
    if (start === -1 || end === -1) return fallback()

    return NextResponse.json(JSON.parse(text.slice(start, end + 1)))
  } catch (err) {
    console.error('Generate error:', err)
    return fallback()
  }
}

// Keep GET for any legacy calls
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const niche = searchParams.get('niche') || 'Lifestyle'
  const language = searchParams.get('language') || 'English'
  const fakeReq = new Request(request.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userProfile: { niche, language }, language }),
  })
  return POST(new NextRequest(fakeReq))
}
