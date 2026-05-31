import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

function fallback() {
  return NextResponse.json(
    { error: 'Content generation unavailable. Please try again.' },
    { status: 500 }
  )
}

async function callGemini(prompt: string, retries = 2): Promise<any> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(45000),
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
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
            maxOutputTokens: 5000,
          },
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) throw new Error('RATE_LIMIT')
        if ((res.status === 503 || res.status === 500) && attempt < retries) {
          await new Promise(r => setTimeout(r, 1500 * (attempt + 1)))
          continue
        }
        throw new Error(data.error?.message || `Gemini error ${res.status}`)
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) {
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, 1500 * (attempt + 1)))
          continue
        }
        throw new Error('Empty response from Gemini')
      }

      const clean = text.trim().replace(/^```json|```$/g, '').trim()
      const parsed = JSON.parse(clean)
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Invalid response shape')
      return parsed

    } catch (err: any) {
      if (err.message === 'RATE_LIMIT') throw err
      if (attempt === retries) throw err
      await new Promise(r => setTimeout(r, 1500 * (attempt + 1)))
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { userProfile, language, date } = body

    if (!GEMINI_KEY) return fallback()

    const userLanguage = language || userProfile?.language || 'English'
    const profile = userProfile || {}

    const niche = profile.niche || 'Lifestyle'
    const personality = profile.brand_personality || 'authentic'
    const followers = profile.follower_count ?? 0
    const topFormat = profile.top_content_type || 'Reels'
    const pillars = Array.isArray(profile.content_pillars) ? profile.content_pillars.join(', ') : ''
    const postingTimes = Array.isArray(profile.best_posting_times) ? profile.best_posting_times.join(', ') : '6-9 PM EST'
    const audienceType = profile.audience_type || 'American men 18-35'

    console.log('[generate] Generating for niche:', niche, '| followers:', followers, '| language:', userLanguage)

    const prompt = `You are a top-tier viral content writer who creates scripts for real Instagram creators — not corporate brands, not generic advice pages. You write the way actual creators talk: conversational, direct, specific, a little unfiltered.

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

FILMING DIRECTION FORMAT — the script field must be a filming direction, NOT text to read aloud:
- What to physically film: location, angle, movement, what's in frame
- What to wear or what props/environment to use
- How to move on camera or what action to take
- Editing notes: cuts, transitions, music vibe, text overlays
- Whether talking is needed or if visuals carry it
- Keep it 80-120 words, written like directions from a director to an actor

EXAMPLE of correct format:
"Film yourself at your vanity doing your morning skincare routine. Start tight on just your hands applying serum — no face yet. Cut to you looking in the mirror, hair messy, no makeup. Hold that shot for 3 seconds. Cut to final glam look, same mirror angle. No talking needed. Add trending audio. Text overlay at the start: 'my actual morning' — then at the end: 'vs what they see'. Soft warm lighting only, nothing harsh."

EXAMPLE of WRONG format (never do this):
"Hey guys, today I want to share my morning routine with you. First I wake up at 7am..."

Generate exactly 5 ideas. Return a JSON array.`

    const result = await callGemini(prompt)

    if (date && SERVICE_ROLE_KEY) {
      try {
        const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
        await admin.from('content').upsert(
          { user_id: user.id, date, ideas: result },
          { onConflict: 'user_id,date' }
        )
      } catch (e) {
        console.warn('[generate] Cache save failed (non-fatal):', e)
      }
    }

    return NextResponse.json(result)

  } catch (err: any) {
    console.error('[generate] Error:', err)

    if (err.message === 'RATE_LIMIT') {
      return NextResponse.json({ error: 'AI limit reached. Please try again in a moment.' }, { status: 429 })
    }
    if (err.name === 'TimeoutError' || err.message?.includes('timeout')) {
      return NextResponse.json({ error: 'Request timed out. Please try again.' }, { status: 504 })
    }

    return fallback()
  }
}

