import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
const HIKERAPI_KEY = process.env.HIKERAPI_KEY || process.env.HIKER_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

function extractHashtags(text: string): string[] {
  return (text?.match(/#\w+/g) || []).map(h => h.toLowerCase())
}

function mediaTypeName(t: number): string {
  return t === 2 ? 'video' : t === 8 ? 'carousel' : 'photo'
}

async function hikerGet(path: string) {
  const url = `https://api.hikerapi.com/v1${path}`
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

    if (!username) return NextResponse.json({ error: 'Username required' }, { status: 400 })
    if (!GEMINI_KEY) return NextResponse.json({ error: 'AI not configured' }, { status: 500 })

    const handle = username.replace('@', '').trim().toLowerCase()
    let scrapedData: Record<string, any> = { username: handle }
    let realEngagement = 0
    let hikerSuccess = false
    let recentPostsForGemini: any[] = []

    // ── HikerAPI ──────────────────────────────────────────────
    if (HIKERAPI_KEY) {
      console.log('[scrape] Starting HikerAPI profile fetch for:', handle)
      try {
        const userInfo = await hikerGet(`/user/by/username?username=${handle}`)
        console.log('[scrape] RAW HikerAPI userInfo:', JSON.stringify(userInfo).slice(0, 3000))
        console.log('[scrape] HikerAPI user keys:', Object.keys(userInfo || {}))

        // Try every known field name for follower/following counts
        const followerCount =
          userInfo.follower_count ??
          userInfo.followers ??
          userInfo.edge_followed_by?.count ??
          userInfo.user?.follower_count ??
          userInfo.user?.followers ??
          0

        const followingCount =
          userInfo.following_count ??
          userInfo.following ??
          userInfo.user?.following_count ??
          0

        const postCount =
          userInfo.media_count ??
          userInfo.post_count ??
          userInfo.user?.media_count ??
          0

        const bio =
          userInfo.biography ??
          userInfo.bio ??
          userInfo.user?.biography ??
          ''

        const pk = userInfo.pk || userInfo.id || userInfo.user?.pk || ''

        console.log('[scrape] Extracted — followers:', followerCount, '| following:', followingCount, '| posts:', postCount, '| pk:', pk)

        scrapedData = {
          username: userInfo.username || handle,
          full_name: userInfo.full_name || userInfo.user?.full_name || '',
          bio,
          follower_count: followerCount,
          following_count: followingCount,
          post_count: postCount,
          is_verified: userInfo.is_verified || userInfo.user?.is_verified || false,
          user_pk: pk,
        }
        hikerSuccess = true

        // ── Media / engagement ────────────────────────────────
        if (pk) {
          console.log('[scrape] Fetching media for pk:', pk)
          try {
            const media = await hikerGet(`/user/medias?user_id=${pk}&count=30`)
            console.log('[scrape] Media response keys:', Object.keys(media || {}))
            const posts: any[] = (media.medias || media.items || media.response?.medias || []).slice(0, 30)
            console.log('[scrape] Posts fetched:', posts.length)
            if (posts.length > 0) {
              console.log('[scrape] Sample post keys:', Object.keys(posts[0] || {}))
              console.log('[scrape] Sample post:', JSON.stringify(posts[0]).slice(0, 500))
            }

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

            // Optimized subset for Gemini (12 posts, capped captions)
            recentPostsForGemini = posts.slice(0, 12).map(p => ({
              likes: p.like_count || 0,
              comments: p.comment_count || 0,
              views: p.view_count || p.video_view_count || 0,
              caption: (p.caption?.text || '').slice(0, 100),
              type: mediaTypeName(p.media_type || 1),
              timestamp: p.taken_at || '',
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

    // ── Build optimized Gemini payload (strip noise) ──────────
    const optimizedForGemini = {
      username: handle,
      bio: scrapedData.bio || '',
      followerCount: scrapedData.follower_count || 0,
      followingCount: scrapedData.following_count || 0,
      postCount: scrapedData.post_count || 0,
      isVerified: scrapedData.is_verified || false,
      engagementRate: realEngagement,
      recentPosts: recentPostsForGemini,
    }

    console.log('[scrape] Sending to Gemini optimizedData:', JSON.stringify(optimizedForGemini))

    // ── Gemini analysis ───────────────────────────────────────
    const gemRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an elite Instagram growth strategist who has helped hundreds of models and creators build audiences of real American men. You have deep knowledge of what content American men engage with, what makes a creator stand out, and how to shift a Hispanic audience to a broader American audience.
Analyse this Instagram profile data and return ONLY a valid JSON object:
Profile data: ${JSON.stringify(optimizedForGemini)}
IMPORTANT: Use the real followerCount (${optimizedForGemini.followerCount}), engagementRate (${optimizedForGemini.engagementRate}%), and recentPosts data provided. Do NOT invent or hallucinate metrics.
Return exactly this JSON:
{
"brandScore": number between 0-100 based on profile completeness engagement rate content consistency US appeal potential,
"niche": "their specific niche be very specific e.g. Latina Fitness Model not just Fitness",
"engagementRate": ${optimizedForGemini.engagementRate > 0 ? optimizedForGemini.engagementRate : 'estimate from post data'},
"audienceType": "describe their current audience demographic honestly",
"isHispanicAudience": true or false,
"brandIdentity": "2-3 sentences describing their unique brand identity",
"brandPersonality": "their specific personality type e.g. The Girl Next Door, The Baddie, The Mysterious One",
"contentPillars": ["pillar1", "pillar2", "pillar3"],
"whatMakesThemUnique": "one specific thing about them no other model has",
"currentProblems": ["problem1", "problem2", "problem3"],
"profileScore": number 0-100,
"profileAuthenticityIssues": "does their bio sound like a real person or a managed page",
"postingFrequency": "how often they post based on post data",
"bestPostingTimes": ["time1 EST", "time2 EST", "time3 EST"],
"topPerformingContentType": "what type of content gets the most engagement",
"formatFatigue": true or false,
"formatFatigueWarning": "specific warning if overusing a format",
"usGrowthStrategy": "4-5 specific actionable strategies to grow US audience",
"hispanicToUSShift": "specific strategy to shift audience if applicable",
"filmingEnvironmentTips": "specific tips about filming environment backgrounds outfits lighting",
"hashtagStrategy": "20 specific hashtags for US audiences all in English",
"contentVariations": ["variation1", "variation2", "variation3", "variation4", "variation5"],
"weeklyPlan": "specific day by day content plan for this week",
"bioRewrite": "rewrite their bio to sound like a real American person"
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
            maxOutputTokens: 8192,
          },
        }),
      }
    )

    console.log('[scrape] Gemini response status:', gemRes.status)
    const gemData = await gemRes.json()
    console.log('[scrape] Gemini raw response:', JSON.stringify(gemData).slice(0, 1000))

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
    // Always use real HikerAPI engagement if available, else fall back to Gemini estimate
    const engagementRate = realEngagement > 0 ? realEngagement : (analysis.engagementRate || 0)
    // Always use real HikerAPI follower count
    const finalFollowerCount = scrapedData.follower_count || 0
    const finalFollowingCount = scrapedData.following_count || 0

    console.log('[scrape] Analysis complete — brandScore:', analysis.brandScore, '| niche:', analysis.niche, '| followers:', finalFollowerCount, '| engagement:', engagementRate)

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
        else console.log('[scrape] users table updated')

        const { error: profileErr } = await admin.from('profiles').upsert({
          user_id: userId,
          brand_score: Math.round(analysis.brandScore || 0),
          niche: analysis.niche || '',
          engagement_rate: engagementRate,
          follower_count: finalFollowerCount,
          following_count: finalFollowingCount,
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
        else console.log('[scrape] profiles table updated with follower_count:', finalFollowerCount)
      } catch (dbErr) {
        console.error('[scrape] Supabase write exception:', dbErr)
      }
    } else {
      if (!userId) console.warn('[scrape] No userId — skipping Supabase server-side write')
      if (!SERVICE_ROLE_KEY) console.warn('[scrape] SUPABASE_SERVICE_ROLE_KEY not set — client must save the returned data')
    }

    console.log('[scrape] ── DONE — returning to client ─────────────────────────────────')
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
