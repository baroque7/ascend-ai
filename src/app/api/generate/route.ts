import { NextRequest, NextResponse } from 'next/server'

const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

function fallback() {
  return NextResponse.json([{
    title: 'Setting up your content strategy…',
    trendingTopic: '',
    script: 'Your personalized content ideas will appear here once your profile analysis is complete.',
    caption: 'Something great is coming.',
    hashtags: '#instagram #growth #content',
    postingTime: '7:00 PM EST',
    contentFormat: 'reel',
    whyThisWorks: 'Complete your profile setup to unlock niche-specific ideas.',
  }])
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userProfile, language } = body

    if (!GEMINI_KEY) return fallback()

    const userLanguage = language || userProfile?.language || 'English'
    const profile = userProfile || {}

    const niche = profile.niche || 'Lifestyle'
    const personality = profile.brand_personality || 'authentic'
    const followers = profile.follower_count || 0
    const topFormat = profile.top_content_type || 'Reels'
    const pillars = Array.isArray(profile.content_pillars) ? profile.content_pillars.join(', ') : ''
    const postingTimes = Array.isArray(profile.best_posting_times) ? profile.best_posting_times.join(', ') : '6-9 PM EST'
    const audienceType = profile.audience_type || 'American men 18-35'

    console.log('[generate] Generating for niche:', niche, '| followers:', followers, '| language:', userLanguage)

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a top-tier viral content writer who creates scripts for real Instagram creators — not corporate brands, not generic advice pages. You write the way actual creators talk: conversational, direct, specific, a little unfiltered.

CREATOR INFO:
- Niche: ${niche}
- Personality type: ${personality}
- Script language: ${userLanguage}
- Target audience: ${audienceType}
- Top performing format: ${topFormat}
- Content pillars: ${pillars || niche}
- Best posting windows: ${postingTimes}
- Follower count: ${followers.toLocaleString()}

STRICT RULES — violating these makes the output useless:
1. NEVER use "she", "her", "they", "the creator", "this creator". Always write directly to the creator using "you" and "your".
2. Scripts must be in ${userLanguage}. Captions always in English.
3. Each of the 5 ideas must be COMPLETELY different from each other — different hooks, different formats, different angles.
4. Scripts sound like a real person talking to camera — NOT a listicle, NOT corporate advice, NOT an AI summary.
5. Hooks must be specific and unexpected — not "I need to tell you something" or "Here's what nobody talks about".
6. Be very specific to the ${niche} niche. Generic lifestyle advice is BANNED.
7. Use real scenarios, real situations, real emotions that this niche's audience experiences.

SCRIPT STRUCTURE (do not label these sections, just write naturally):
- Open with one line that makes someone stop scrolling — a confession, a contradiction, a specific visual, or a bold claim.
- Immediately make them feel something — curiosity, recognition, FOMO, respect.
- Build tension or stakes without giving away the answer.
- Deliver the payoff — something specific, not obvious.
- End with one clear action — follow, save, comment with one word.

Generate exactly 5 ideas. Return a JSON array:
[{"title":"punchy 4-6 word title — make it sound human not AI","trendingTopic":"one specific US trend or cultural moment this taps","script":"full script in ${userLanguage} — 150-200 words, sounds like a real creator talking, no section labels, flows naturally","caption":"punchy English caption under 140 chars — no generic phrases like 'check this out' or 'you need to see this'","hashtags":"15 highly specific US-targeted hashtags relevant to ${niche}","postingTime":"specific time in EST with one-sentence reason based on ${audienceType} behavior","contentFormat":"reel or carousel or photo — choose the best fit for this specific idea","whyThisWorks":"one very specific sentence explaining why THIS idea will stop THIS audience from scrolling"}]`,
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
                required: ['title', 'script', 'caption', 'hashtags', 'postingTime', 'contentFormat', 'whyThisWorks'],
              },
            },
            temperature: 1.0,
            maxOutputTokens: 8000,
          },
        }),
      }
    )

    console.log('[generate] Gemini status:', res.status)
    const data = await res.json()
    if (!res.ok) {
      console.error('[generate] Gemini error:', JSON.stringify(data).slice(0, 300))
      return fallback()
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    if (!text) return fallback()

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
