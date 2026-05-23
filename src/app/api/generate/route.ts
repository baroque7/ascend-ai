import { NextRequest, NextResponse } from 'next/server'

const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

function fallback() {
  return NextResponse.json([{
    title: 'Profile analysis loading…',
    trendingTopic: 'Daily content creation',
    script: 'Your personalized content ideas are being prepared. Complete your profile setup to get custom scripts tailored to your niche.',
    caption: 'Building something real takes a moment. Your strategy is coming.',
    hashtags: '#instagram #growth #content #creator #viral',
    postingTime: '7:00 PM EST',
    contentFormat: 'reel',
    whyThisWorks: 'Consistent posting beats sporadic perfection every time.',
  }])
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userProfile, language } = body

    if (!GEMINI_KEY) return fallback()

    const userLanguage = language || userProfile?.language || 'English'
    const profile = userProfile || {}

    // Build optimized context for Gemini (only what matters for content)
    const profileContext = {
      niche: profile.niche || 'Lifestyle',
      brandPersonality: profile.brand_personality || '',
      language: userLanguage,
      topContentType: profile.top_content_type || 'Reels',
      contentPillars: profile.content_pillars || [],
      engagementRate: profile.engagement_rate || 0,
      followerCount: profile.follower_count || 0,
      bestPostingTimes: profile.best_posting_times || [],
      usGrowthStrategy: profile.us_growth_strategy || '',
      hashtagStrategy: profile.hashtag_strategy || '',
      audienceType: profile.audience_type || '',
    }

    console.log('[generate] Profile context:', JSON.stringify(profileContext))

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a viral content strategist who knows exactly what makes American men stop scrolling on Instagram. You understand the content pyramid: Setup, Hook, Build, Payoff, Proof, CTA.
Creator profile: ${JSON.stringify(profileContext)}
Their niche: ${profileContext.niche}
Their brand personality: ${profileContext.brandPersonality || 'authentic and relatable'}
Their language: ${userLanguage}
Top performing content: ${profileContext.topContentType}
Generate exactly 5 unique content ideas for today. Each one must feel completely different from the others. Make them highly specific to this creator's niche — not generic.
Return a JSON array of exactly 5 objects with this shape:
[{"title":"short punchy title","trendingTopic":"US trend this taps into","script":"full script in ${userLanguage} — Setup: one line framing who this is for. Hook: the scroll-stopping opening line. Build: raise the stakes. Payoff: the specific unlock. Proof: the receipt. CTA: one clear action. Sound like a real person, 150-200 words.","caption":"punchy English caption under 150 chars","hashtags":"15 US-targeted hashtags in English","postingTime":"best EST posting time with reason","contentFormat":"reel or carousel or photo","whyThisWorks":"one sentence why this attracts American followers in their niche"}]`,
            }],
          }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  title: { type: 'STRING' },
                  trendingTopic: { type: 'STRING' },
                  script: { type: 'STRING' },
                  caption: { type: 'STRING' },
                  hashtags: { type: 'STRING' },
                  postingTime: { type: 'STRING' },
                  contentFormat: { type: 'STRING' },
                  whyThisWorks: { type: 'STRING' },
                },
                required: ['title', 'script', 'caption', 'hashtags', 'postingTime', 'contentFormat'],
              },
            },
            temperature: 0.9,
            maxOutputTokens: 6000,
          },
        }),
      }
    )

    console.log('[generate] Gemini response status:', res.status)
    const data = await res.json()
    if (!res.ok) {
      console.error('[generate] Gemini error:', JSON.stringify(data).slice(0, 300))
      return fallback()
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    console.log('[generate] Gemini output length:', text.length)

    // With responseMimeType: application/json the response is already clean JSON
    const parsed = JSON.parse(text.trim())
    if (!Array.isArray(parsed) || parsed.length === 0) return fallback()

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('[generate] Error:', err)
    return fallback()
  }
}

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
