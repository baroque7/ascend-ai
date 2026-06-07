export const maxDuration = 150

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { logServerError } from '@/lib/logError'
import { hasActiveAccess } from '@/lib/subscription'

const GEMINI_KEY = process.env.GEMINI_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

function calculateBrandScore(followers: number, engagementRate: number, bio: string, recentPosts: unknown[]): number {
  let followerScore = 5
  if (followers >= 500000) followerScore = 55
  else if (followers >= 100000) followerScore = 50
  else if (followers >= 50000) followerScore = 40
  else if (followers >= 10000) followerScore = 30
  else if (followers >= 1000) followerScore = 15

  let engagementScore = 5
  if (engagementRate >= 5) engagementScore = 25
  else if (engagementRate >= 3) engagementScore = 22
  else if (engagementRate >= 1) engagementScore = 18
  else if (engagementRate >= 0.5) engagementScore = 12

  let bioScore = 2
  if (bio.length > 80) bioScore = 15
  else if (bio.length > 30) bioScore = 8

  let consistencyScore = 2
  if (recentPosts.length >= 20) consistencyScore = 10
  else if (recentPosts.length >= 10) consistencyScore = 5

  return Math.min(100, followerScore + engagementScore + bioScore + consistencyScore)
}

async function callGemini(payload: object, retries = 2): Promise<object> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(40000),
          body: JSON.stringify(payload),
        }
      )

      console.log('[analyze-profile] Gemini status:', res.status)
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) throw new Error('RATE_LIMIT')
        if ((res.status === 503 || res.status === 500) && attempt < retries) {
          await new Promise(r => setTimeout(r, 1500 * (attempt + 1)))
          continue
        }
        throw new Error((data as { error?: { message?: string } }).error?.message || `Gemini error ${res.status}`)
      }

      const text = (data as { candidates?: { content?: { parts?: { text?: string }[] } }[] })
        .candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) {
        if (attempt < retries) { await new Promise(r => setTimeout(r, 1500 * (attempt + 1))); continue }
        throw new Error('Empty response from Gemini')
      }

      return JSON.parse(text.trim().replace(/^```json|```$/g, '').trim())
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg === 'RATE_LIMIT') throw err
      if (attempt === retries) throw err
      await new Promise(r => setTimeout(r, 1500 * (attempt + 1)))
    }
  }
  throw new Error('Gemini failed after retries')
}

export async function POST(request: NextRequest) {
  console.log('[analyze-profile] ── POST /api/analyze-profile ──────────────────────')
  let userId: string | null = null
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
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    userId = user.id

    // Paid work — require an active subscription (or promo), checked server-side
    if (!(await hasActiveAccess(userId))) {
      return NextResponse.json({ error: 'Subscription required' }, { status: 403 })
    }

    if (!GEMINI_KEY) return NextResponse.json({ error: 'AI not configured' }, { status: 500 })
    if (!SERVICE_ROLE_KEY) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    // Read the raw HikerAPI data saved by /api/scrape
    const { data: profileRow } = await admin
      .from('profiles')
      .select('raw_scraped_data, scrape_status')
      .eq('user_id', userId)
      .single()

    // Allow analysis (and re-analysis/retry) whenever raw scrape data exists —
    // a previous attempt may have left scrape_status = 'failed', which we still want to retry.
    const rawData = profileRow?.raw_scraped_data as Record<string, unknown> | null | undefined
    if (!rawData || Object.keys(rawData).length === 0) {
      return NextResponse.json(
        { error: 'Profile must be scraped before analysis. Call /api/scrape first.' },
        { status: 400 }
      )
    }

    const raw = rawData
    const recentPosts = (Array.isArray(raw.recent_posts) ? raw.recent_posts : [])
      .slice(0, 12)
      .map((p: Record<string, unknown>) => ({
        likes: p.likes ?? 0,
        comments: p.comments ?? 0,
        views: p.views ?? 0,
        caption: typeof p.caption === 'string' ? p.caption.slice(0, 100) : '',
        type: p.type ?? 'photo',
        timestamp: p.date ?? '',
      }))

    const followerCount = Number(raw.follower_count ?? 0)
    const engagementRate = Number(raw.engagement_rate ?? 0)

    const bio = String(raw.bio ?? '')
    const brandScore = calculateBrandScore(followerCount, engagementRate, bio, recentPosts)

    const optimizedForGemini = {
      username: raw.username ?? '',
      bio,
      followerCount,
      followingCount: Number(raw.following_count ?? 0),
      postCount: Number(raw.post_count ?? 0),
      isVerified: Boolean(raw.is_verified ?? false),
      engagementRate,
      recentPosts,
    }

    console.log('[analyze-profile] Sending to Gemini — followers:', followerCount, '| brandScore:', brandScore)

    const gemPayload = {
      contents: [{
        parts: [{
          text: `You are an elite Instagram growth strategist. Analyse this Instagram profile and return a JSON object.
CRITICAL RULES:
- NEVER use she/her/the creator. Always use "you/your" when writing advice.
- Use ONLY the real data provided. Do NOT hallucinate or invent followers, engagement, or post metrics.

Profile data: ${JSON.stringify(optimizedForGemini)}

The brandScore has been pre-calculated as ${brandScore} — use this exact value, do not recalculate it.

Return exactly this JSON:
{
"brandScore": ${brandScore},
"niche": "very specific niche e.g. Latina Fitness Model not just Fitness — based on bio and post captions",
"engagementRate": ${engagementRate > 0 ? engagementRate : 'estimate from post likes/comments vs followers'},
"audienceType": "honest description of current audience demographic",
"isHispanicAudience": true or false based on bio language and caption language,
"brandIdentity": "2-3 sentences about unique brand identity — use YOU/YOUR not she/her",
"brandPersonality": "specific personality type e.g. The Girl Next Door, The Baddie, The Mysterious One",
"contentPillars": ["pillar1", "pillar2", "pillar3"],
"whatMakesThemUnique": "one specific differentiator — write as: Your unique angle is...",
"currentProblems": ["problem using you/your language", "problem2", "problem3"],
"profileScore": number 0-100,
"profileAuthenticityIssues": "bio authenticity assessment — use you/your",
"postingFrequency": "frequency based on timestamps in post data",
"bestPostingTimes": ["time1 EST", "time2 EST", "time3 EST"],
"topPerformingContentType": "content type with highest likes+comments ratio",
"formatFatigue": true or false,
"formatFatigueWarning": "warning using you/your if overusing a format",
"usGrowthStrategy": "4-5 actionable strategies using you/your — no she/her",
"hispanicToUSShift": "audience shift strategy using you/your",
"filmingEnvironmentTips": "filming tips using you/your",
"hashtagStrategy": "20 specific English hashtags for US audiences",
"contentVariations": ["variation1", "variation2", "variation3", "variation4", "variation5"],
"weeklyPlan": "day by day plan using you/your — Mon: post X, Tue: post Y format",
"bioRewrite": "rewrite bio in first person as if the creator is writing it themselves"
}`,
        }],
      }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            brandScore: { type: 'NUMBER' },
            niche: { type: 'STRING' },
            engagementRate: { type: 'NUMBER' },
            audienceType: { type: 'STRING' },
            isHispanicAudience: { type: 'BOOLEAN' },
            brandIdentity: { type: 'STRING' },
            brandPersonality: { type: 'STRING' },
            contentPillars: { type: 'ARRAY', items: { type: 'STRING' } },
            whatMakesThemUnique: { type: 'STRING' },
            currentProblems: { type: 'ARRAY', items: { type: 'STRING' } },
            profileScore: { type: 'NUMBER' },
            profileAuthenticityIssues: { type: 'STRING' },
            postingFrequency: { type: 'STRING' },
            bestPostingTimes: { type: 'ARRAY', items: { type: 'STRING' } },
            topPerformingContentType: { type: 'STRING' },
            formatFatigue: { type: 'BOOLEAN' },
            formatFatigueWarning: { type: 'STRING' },
            usGrowthStrategy: { type: 'STRING' },
            hispanicToUSShift: { type: 'STRING' },
            filmingEnvironmentTips: { type: 'STRING' },
            hashtagStrategy: { type: 'STRING' },
            contentVariations: { type: 'ARRAY', items: { type: 'STRING' } },
            weeklyPlan: { type: 'STRING' },
            bioRewrite: { type: 'STRING' },
          },
          required: ['brandScore', 'niche', 'brandIdentity', 'brandPersonality', 'contentPillars', 'usGrowthStrategy'],
        },
        temperature: 0.7,
        maxOutputTokens: 5000,
      },
    }

    const analysis = await callGemini(gemPayload) as Record<string, unknown>
    const finalEngagement = engagementRate > 0 ? engagementRate : Number(analysis.engagementRate ?? 0)

    console.log('[analyze-profile] Analysis complete — brandScore:', analysis.brandScore)

    const { error: profileErr } = await admin.from('profiles').upsert({
      user_id: userId,
      brand_score: brandScore,
      niche: String(analysis.niche ?? ''),
      engagement_rate: finalEngagement,
      follower_count: followerCount,
      following_count: Number(raw.following_count ?? 0),
      brand_identity: String(analysis.brandIdentity ?? ''),
      brand_personality: String(analysis.brandPersonality ?? ''),
      content_pillars: analysis.contentPillars ?? [],
      what_makes_unique: String(analysis.whatMakesThemUnique ?? ''),
      current_problems: analysis.currentProblems ?? [],
      profile_score: Math.round(Number(analysis.profileScore ?? 0)),
      best_posting_times: analysis.bestPostingTimes ?? [],
      top_content_type: String(analysis.topPerformingContentType ?? ''),
      format_fatigue: Boolean(analysis.formatFatigue ?? false),
      format_fatigue_warning: String(analysis.formatFatigueWarning ?? ''),
      us_growth_strategy: String(analysis.usGrowthStrategy ?? ''),
      hispanic_to_us_shift: String(analysis.hispanicToUSShift ?? ''),
      filming_tips: String(analysis.filmingEnvironmentTips ?? ''),
      hashtag_strategy: String(analysis.hashtagStrategy ?? ''),
      content_variations: analysis.contentVariations ?? [],
      weekly_plan: String(analysis.weeklyPlan ?? ''),
      bio_rewrite: String(analysis.bioRewrite ?? ''),
      audience_type: String(analysis.audienceType ?? ''),
      is_hispanic_audience: Boolean(analysis.isHispanicAudience ?? false),
      posting_frequency: String(analysis.postingFrequency ?? ''),
      scrape_status: 'analyzed',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

    if (profileErr) console.error('[analyze-profile] profiles upsert error:', profileErr)
    else console.log('[analyze-profile] profiles table updated')

    return NextResponse.json({ success: true, analysis })

  } catch (err: unknown) {
    console.error('[analyze-profile] Unhandled error:', err)
    const msg = err instanceof Error ? err.message : 'Unknown error'
    // Record the real reason so it shows up in the error_logs table
    await logServerError(`analyze-profile failed: ${msg}`, {
      url: '/api/analyze-profile',
      userId: userId ?? undefined,
      stack: err instanceof Error ? err.stack : undefined,
    })
    if (userId && SERVICE_ROLE_KEY) {
      try {
        const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
        await admin.from('profiles').upsert(
          { user_id: userId, scrape_status: 'failed', updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        )
      } catch {}
    }
    if (msg === 'RATE_LIMIT') {
      return NextResponse.json({ error: 'AI limit reached. Please try again.' }, { status: 429 })
    }
    return NextResponse.json({ error: `Analysis failed: ${msg}` }, { status: 500 })
  }
}
