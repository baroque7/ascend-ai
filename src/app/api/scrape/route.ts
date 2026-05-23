import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
const HIKERAPI_KEY = process.env.HIKERAPI_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

function extractHashtags(text: string): string[] {
  return (text?.match(/#\w+/g) || []).map(h => h.toLowerCase())
}

function mediaTypeName(t: number): string {
  return t === 2 ? 'video' : t === 8 ? 'carousel' : 'photo'
}

async function hikerGet(path: string) {
  const url = `https://hikerapi.com/api/v1${path}`
  console.log('[scrape] HikerAPI GET:', url)
  const res = await fetch(url, {
    headers: { 'x-access-key': HIKERAPI_KEY!, Accept: 'application/json' },
    signal: AbortSignal.timeout(15000),
  })
  console.log('[scrape] HikerAPI response status:', res.status)
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.error('[scrape] HikerAPI error body:', body)
    throw new Error(`HikerAPI ${res.status}: ${body.slice(0, 200)}`)
  }
  return res.json()
}

export async function POST(request: NextRequest) {
  console.log('[scrape] ── POST /api/scrape ──────────────────────')
  try {
    const body = await request.json()
    const { username, userId } = body
    console.log('[scrape] username:', username, '| userId:', userId)
    console.log('[scrape] GEMINI_KEY present:', !!GEMINI_KEY)
    console.log('[scrape] HIKERAPI_KEY present:', !!HIKERAPI_KEY)
    console.log('[scrape] SERVICE_ROLE_KEY present:', !!SERVICE_ROLE_KEY)
    console.log('[scrape] SUPABASE_URL:', SUPABASE_URL)

    if (!username) return NextResponse.json({ error: 'Username required' }, { status: 400 })
    if (!GEMINI_KEY) return NextResponse.json({ error: 'AI not configured' }, { status: 500 })

    const handle = username.replace('@', '').trim().toLowerCase()
    let scrapedData: Record<string, any> = { username: handle }
    let realEngagement = 0
    let hikerSuccess = false

    // ── HikerAPI ──────────────────────────────────────────────
    if (HIKERAPI_KEY) {
      console.log('[scrape] Starting HikerAPI profile fetch for:', handle)
      try {
        const userInfo = await hikerGet(`/user/by/username?username=${handle}`)
        console.log('[scrape] HikerAPI user keys:', Object.keys(userInfo || {}))

        const pk = userInfo.pk || userInfo.id || userInfo.user?.pk || ''
        const followerCount = userInfo.follower_count ?? userInfo.user?.follower_count ?? 0

        scrapedData = {
          username: userInfo.username || handle,
          full_name: userInfo.full_name || '',
          bio: userInfo.biography || userInfo.bio || '',
          follower_count: followerCount,
          following_count: userInfo.following_count ?? 0,
          post_count: userInfo.media_count ?? 0,
          is_verified: userInfo.is_verified || false,
          user_pk: pk,
        }
        console.log('[scrape] HikerAPI profile scraped — followers:', followerCount, '| pk:', pk)
        hikerSuccess = true

        // ── Media / engagement ────────────────────────────────
        if (pk) {
          console.log('[scrape] Fetching media for pk:', pk)
          try {
            const media = await hikerGet(`/user/medias/chunk?user_id=${pk}&max_id=`)
            console.log('[scrape] Media response keys:', Object.keys(media || {}))
            const posts: any[] = (media.medias || media.items || media.response?.medias || []).slice(0, 30)
            console.log('[scrape] Posts fetched:', posts.length)

            const totalEng = posts.reduce((s, p) => s + (p.like_count || 0) + (p.comment_count || 0), 0)
            realEngagement = followerCount > 0 && posts.length > 0
              ? parseFloat(((totalEng / posts.length / followerCount) * 100).toFixed(2))
              : 0
            console.log('[scrape] Engagement rate calculated:', realEngagement)

            scrapedData.engagement_rate = realEngagement
            scrapedData.recent_posts = posts.map(p => ({
              likes: p.like_count || 0,
              comments: p.comment_count || 0,
              views: p.view_count || p.video_view_count || 0,
              caption: p.caption?.text || '',
              hashtags: extractHashtags(p.caption?.text || ''),
              date: p.taken_at ? new Date(p.taken_at * 1000).toISOString().split('T')[0] : '',
              type: mediaTypeName(p.media_type || 1),
            }))
          } catch (mediaErr) {
            console.warn('[scrape] Media fetch failed (continuing without posts):', mediaErr)
          }
        }
      } catch (hikerErr) {
        console.warn('[scrape] HikerAPI profile fetch failed — falling back to Gemini-only:', hikerErr)
        hikerSuccess = false
      }
    } else {
      console.warn('[scrape] HIKERAPI_KEY not set — Gemini will estimate from username only')
    }

    // ── Gemini analysis ───────────────────────────────────────
    console.log('[scrape] Calling Gemini with scrapedData keys:', Object.keys(scrapedData))
    const gemRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an elite Instagram growth strategist who has helped hundreds of models and creators build audiences of real American men. You have deep knowledge of what content American men engage with, what makes a creator stand out, and how to shift a Hispanic audience to a broader American audience.
Analyse this Instagram profile data and return ONLY a valid JSON object with no markdown no backticks:
Profile data: ${JSON.stringify(scrapedData)}
Return exactly this JSON:
{
"brandScore": number between 0-100 based on profile completeness engagement rate content consistency US appeal potential,
"niche": "their specific niche be very specific e.g. Latina Fitness Model not just Fitness",
"engagementRate": number as percentage,
"audienceType": "describe their current audience demographic honestly",
"isHispanicAudience": true or false,
"brandIdentity": "2-3 sentences describing their unique brand identity that makes them different from every other model",
"brandPersonality": "their specific personality type that resonates with American men e.g. The Girl Next Door, The Baddie, The Mysterious One",
"contentPillars": ["pillar1", "pillar2", "pillar3"],
"whatMakesThemUnique": "one specific thing about them no other model has",
"currentProblems": ["problem1", "problem2", "problem3"],
"profileScore": number 0-100,
"profileAuthenticityIssues": "does their bio sound like a real person or a managed page what to fix",
"postingFrequency": "how often they post",
"bestPostingTimes": ["time1 EST", "time2 EST", "time3 EST"],
"topPerformingContentType": "what type of content gets the most engagement",
"formatFatigue": true or false based on whether they posted same format more than 3 times recently,
"formatFatigueWarning": "specific warning if they are overusing a format",
"usGrowthStrategy": "4-5 specific actionable strategies to grow US audience not generic advice",
"hispanicToUSShift": "specific strategy to shift from Hispanic audience to broader American audience if applicable",
"filmingEnvironmentTips": "specific tips about what to change in filming environment to look more American outlets backgrounds outfits lighting",
"hashtagStrategy": "20 specific hashtags for US audiences in their niche separated by spaces all in English",
"contentVariations": ["variation1", "variation2", "variation3", "variation4", "variation5"],
"weeklyPlan": "specific day by day content plan for this week based on their data",
"bioRewrite": "rewrite their bio to sound like a real American person not a managed page"
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
            maxOutputTokens: 4000,
          },
        }),
      }
    )

    console.log('[scrape] Gemini response status:', gemRes.status)
    const gemData = await gemRes.json()
    if (!gemRes.ok) {
      console.error('[scrape] Gemini error:', JSON.stringify(gemData).slice(0, 300))
      return NextResponse.json({ error: 'AI analysis failed', details: gemData.error?.message }, { status: gemRes.status })
    }

    const text = gemData.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      console.error('[scrape] Gemini returned empty text, full response:', JSON.stringify(gemData).slice(0, 500))
      return NextResponse.json({ error: 'Empty AI response' }, { status: 500 })
    }

    const analysis = JSON.parse(text.trim())
    const engagementRate = realEngagement > 0 ? realEngagement : (analysis.engagementRate || 0)
    console.log('[scrape] Analysis complete — brandScore:', analysis.brandScore, '| niche:', analysis.niche)

    // ── Save to Supabase via service role (if key available) ───
    if (userId && SERVICE_ROLE_KEY) {
      console.log('[scrape] Writing to Supabase via service role...')
      try {
        const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

        const { error: userErr } = await admin.from('users').upsert({
          id: userId,
          instagram_username: handle,
          last_scraped_at: new Date().toISOString(),
        }, { onConflict: 'id' })
        if (userErr) console.error('[scrape] users upsert error:', userErr)

        const { error: profileErr } = await admin.from('profiles').upsert({
          user_id: userId,
          brand_score: Math.round(analysis.brandScore || 0),
          niche: analysis.niche || '',
          engagement_rate: engagementRate,
          follower_count: scrapedData.follower_count || 0,
          following_count: scrapedData.following_count || 0,
          brand_identity: analysis.brandIdentity || '',
          brand_personality: analysis.brandPersonality || '',
          content_pillars: analysis.contentPillars || [],
          what_makes_unique: analysis.whatMakesThemUnique || '',
          current_problems: analysis.currentProblems || [],
          profile_score: Math.round(analysis.profileScore || 0),
          best_posting_times: analysis.bestPostingTimes || [],
          top_content_type: analysis.topPerformingContentType || '',
          format_fatigue: analysis.formatFatigue || false,
          format_fatigue_warning: analysis.formatFatigueWarning || '',
          us_growth_strategy: analysis.usGrowthStrategy || '',
          hispanic_to_us_shift: analysis.hispanicToUSShift || '',
          filming_tips: analysis.filmingEnvironmentTips || '',
          hashtag_strategy: analysis.hashtagStrategy || '',
          content_variations: analysis.contentVariations || [],
          weekly_plan: analysis.weeklyPlan || '',
          bio_rewrite: analysis.bioRewrite || '',
          audience_type: analysis.audienceType || '',
          is_hispanic_audience: analysis.isHispanicAudience || false,
          posting_frequency: analysis.postingFrequency || '',
          raw_scraped_data: scrapedData,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
        if (profileErr) console.error('[scrape] profiles upsert error:', profileErr)
        else console.log('[scrape] Supabase writes completed successfully')
      } catch (dbErr) {
        console.error('[scrape] Supabase write exception:', dbErr)
      }
    } else {
      if (!userId) console.warn('[scrape] No userId — skipping Supabase server-side write')
      if (!SERVICE_ROLE_KEY) console.warn('[scrape] SUPABASE_SERVICE_ROLE_KEY not set — client must save the returned data')
    }

    console.log('[scrape] ── DONE ─────────────────────────────────')
    return NextResponse.json({
      success: true,
      hikerSuccess,
      analysis,
      scrapedData,
      engagementRate,
    })
  } catch (err: any) {
    console.error('[scrape] Unhandled error:', err)
    return NextResponse.json({ error: `Scrape failed: ${err.message}` }, { status: 500 })
  }
}
