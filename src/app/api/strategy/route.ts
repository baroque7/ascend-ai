import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`

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
              type: 'OBJECT',
              properties: {
                uniqueAngle: { type: 'STRING' },
                contentPillars: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      pillar: { type: 'STRING' },
                      description: { type: 'STRING' },
                      percentage: { type: 'STRING' },
                    },
                  },
                },
                audienceShiftPlan: { type: 'STRING' },
                top5ContentVariations: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      idea: { type: 'STRING' },
                      hook: { type: 'STRING' },
                      format: { type: 'STRING' },
                      cta: { type: 'STRING' },
                    },
                  },
                },
                profileOptimization: {
                  type: 'OBJECT',
                  properties: {
                    bioRewrite: { type: 'STRING' },
                    profilePictureTip: { type: 'STRING' },
                    highlightStrategy: { type: 'STRING' },
                  },
                },
                viralHookFormulas: { type: 'ARRAY', items: { type: 'STRING' } },
                contentGaps: { type: 'ARRAY', items: { type: 'STRING' } },
              },
              required: [
                'uniqueAngle',
                'contentPillars',
                'audienceShiftPlan',
                'top5ContentVariations',
                'profileOptimization',
                'viralHookFormulas',
                'contentGaps',
              ],
            },
            temperature: 0.8,
            maxOutputTokens: 6000,
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
      return JSON.parse(clean)

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

    if (!GEMINI_KEY) {
      return NextResponse.json({ error: 'AI not configured' }, { status: 500 })
    }

    const { userProfile } = await request.json()
    const profile = userProfile || {}

    const rawData = (profile.raw_scraped_data as any) || {}
    const recentPosts = (rawData.recent_posts || []).slice(0, 5).map((p: any) => ({
      likes: p.likes,
      comments: p.comments,
      type: p.type,
      caption: (p.caption || '').slice(0, 80),
      date: p.date,
    }))

    const specificContext = {
      instagramHandle: profile.instagram_username || rawData.username || '',
      actualBio: rawData.bio || profile.bio || '',
      followerCount: profile.follower_count ?? rawData.follower_count ?? 0,
      followingCount: profile.following_count ?? rawData.following_count ?? 0,
      engagementRate: profile.engagement_rate ?? rawData.engagement_rate ?? 0,
      postingFrequency: profile.posting_frequency || '',
      topContentFormat: profile.top_content_type || '',
      detectedNiche: profile.niche || '',
      contentPillars: Array.isArray(profile.content_pillars)
        ? profile.content_pillars.join(', ')
        : '',
      brandPersonality: profile.brand_personality || '',
      audienceType: profile.audience_type || '',
      recentPosts,
      language: profile.language || 'English',
      isVerified: rawData.is_verified || false,
    }

    const userLanguage = specificContext.language || 'English'

    const prompt = `You are a no-fluff Instagram growth strategist specializing in building US audiences. Your job is to give advice so specific it could only apply to THIS account — not any other.

CRITICAL RULES — NEVER violate these:
1. Write ALL advice in ${userLanguage}. Every field in the JSON response must be in ${userLanguage}.
2. NEVER use "she", "her", "they", "the creator", "this account". Always use "you" and "your".
3. NEVER give advice that could apply to any account. Every sentence must reference something real from the data: a specific post, the actual bio, the exact engagement rate, the real follower count.
4. If a field has no data (empty bio, no posts), say exactly what's missing and give the most targeted advice possible based on what IS there.
5. No filler. No motivational fluff. Only sharp, actionable, specific recommendations.
6. For viralHookFormulas: write 5 actual ready-to-use opening lines (not templates) tailored to their exact niche, voice, and top performing content.
7. For contentGaps: identify specific content types their top posts suggest they should be doing MORE of but aren't — cite the actual post data.
8. For top5ContentVariations: each must have a specific idea, a ready-to-use hook, the best format (Reel/Carousel/Static), and a CTA.
9. For audienceShiftPlan: give a concrete week-by-week 30-day breakdown, not general advice.

REAL ACCOUNT DATA:
${JSON.stringify(specificContext, null, 2)}

Return JSON only.`

    const result = await callGemini(prompt)

    if (SERVICE_ROLE_KEY) {
      try {
        const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
        await admin.from('strategy').upsert(
          { user_id: user.id, data: result },
          { onConflict: 'user_id' }
        )
      } catch (e) {
        console.warn('[strategy] Cache save failed (non-fatal):', e)
      }
    }

    return NextResponse.json(result)

  } catch (err: any) {
    console.error('Strategy error:', err)

    if (err.message === 'RATE_LIMIT') {
      return NextResponse.json({ error: 'AI limit reached. Wait a moment and try again.' }, { status: 429 })
    }
    if (err.name === 'TimeoutError' || err.message?.includes('timeout')) {
      return NextResponse.json({ error: 'Request timed out. Please try again.' }, { status: 504 })
    }
    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid response from AI. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ error: `Strategy failed: ${err.message}` }, { status: 500 })
  }
}