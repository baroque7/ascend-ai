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

        // Try every known field name for follower/following counts (snake_case + camelCase variants)
        const followerCount =
          userInfo.follower_count ??
          userInfo.followerCount ??
          userInfo.followers ??
          userInfo.followersCount ??
          userInfo.edge_followed_by?.count ??
          userInfo.user?.follower_count ??
          userInfo.user?.followerCount ??
          userInfo.user?.followers ??
          0

        const followingCount =
          userInfo.following_count ??
          userInfo.followingCount ??
          userInfo.following ??
          userInfo.user?.following_count ??
          userInfo.user?.followingCount ??
          0

        const postCount =
          userInfo.media_count ??
          userInfo.mediaCount ??
          userInfo.post_count ??
          userInfo.user?.media_count ??
          userInfo.user?.mediaCount ??
          0

        const bio =
          userInfo.biography ??
          userInfo.bio ??
          userInfo.user?.biography ??
          ''

        const pk =
          userInfo.pk ??
          userInfo.id ??
          userInfo.userId ??
          userInfo.user_id ??
          userInfo.user?.pk ??
          userInfo.user?.id ??
          ''

        console.log('[scrape] Extracted — followers:', followerCount, '| following:', followingCount, '| posts:', postCount, '| pk:', pk)

        scrapedData = {
          username: userInfo.username || handle,
          full_name: userInfo.full_name || userInfo.name || userInfo.user?.full_name || userInfo.user?.name || '',
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
            const rawMedia = media.medias || media.items || media.response?.medias || media
            const posts: any[] = (Array.isArray(rawMedia) ? rawMedia : Object.values(rawMedia)).slice(0, 30)  
            console.log('[scrape] Posts fetched:', posts.length)
            if (posts.length > 0) {
              console.log('[scrape] Sample post keys:', Object.keys(posts[0] || {}))
              console.log('[scrape] Sample post:', JSON.stringify(posts[0]).slice(0, 500))
            }

            // Engagement = (total likes + comments on last 12 posts) / (followers × 12) × 100
            const last12 = posts.slice(0, 12)
            const totalEng = last12.reduce((s, p) => s + (p.like_count || 0) + (p.comment_count || 0), 0)
            realEngagement = followerCount > 0 && last12.length > 0
              ? parseFloat(((totalEng / (followerCount * last12.length)) * 100).toFixed(2))
              : 0
            console.log('[scrape] Engagement rate — totalEng:', totalEng, '| posts used:', last12.length, '| followers:', followerCount, '| rate:', realEngagement)

            scrapedData.engagement_rate = realEngagement
            scrapedData.recent_posts = posts.map(p => ({
              likes: p.like_count || 0,
              comments: p.comment_count || 0,
              views: p.view_count || p.video_view_count || 0,
              caption: p.caption_text || p.caption?.text || '',
              hashtags: extractHashtags(p.caption?.text || ''),
              date: p.taken_at ? new Date(isNaN(Number(p.taken_at)) ? p.taken_at : Number(p.taken_at) * 1000).toISOString().split('T')[0] : '',
              type: mediaTypeName(p.media_type || 1),
            }))

            // Optimized subset for Gemini (12 posts, capped captions)
            recentPostsForGemini = posts.slice(0, 12).map(p => ({
              likes: p.like_count || 0,
              comments: p.comment_count || 0,
              views: p.view_count || p.video_view_count || 0,
              caption: (p.caption?.text || '').slice(0, 100),
              type: mediaTypeName(p.media_type || 1),
              timestamp: p.taken_at ? new Date(isNaN(Number(p.taken_at)) ? p.taken_at : Number(p.taken_at) * 1000).toISOString() : '',
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

    // ── Step 1: Save HikerAPI raw data immediately, before Gemini ─────────
    // This lets the home screen show real follower counts right away.
    if (userId && hikerSuccess) {
      const partialAdmin = SERVICE_ROLE_KEY ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY) : null
      if (partialAdmin) {
        try {
          await partialAdmin.from('users').upsert({
            id: userId,
            instagram_username: handle,
            last_scraped_at: new Date().toISOString(),
          }, { onConflict: 'id' })
          await partialAdmin.from('profiles').upsert({
            user_id: userId,
            follower_count: scrapedData.follower_count || 0,
            following_count: scrapedData.following_count || 0,
            engagement_rate: realEngagement,
            raw_scraped_data: scrapedData,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' })
          console.log('[scrape] Partial HikerAPI data saved — followers:', scrapedData.follower_count)
        } catch (e) {
          console.warn('[scrape] Partial save failed (non-fatal):', e)
        }
      }
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

    // ── Step 2: Gemini analysis (30s timeout) ────────────────────
    const gemRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(30000),
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an elite Instagram growth strategist. Analyse this Instagram profile and return a JSON object.
CRITICAL RULES:
- NEVER use she/her/the creator. Always use "you/your" when writing advice.
- Use ONLY the real data provided. Do NOT hallucinate or invent followers, engagement, or post metrics.

Profile data: ${JSON.stringify(optimizedForGemini)}

BRAND SCORE CALCULATION — use these exact weights, total out of 100:
Follower tier (50 pts max): 0-1k=5, 1k-10k=15, 10k-50k=30, 50k-100k=40, 100k-500k=50, 500k+=55
Engagement quality (25 pts max): below 0.5%=5, 0.5-1%=12, 1-3%=18, 3-5%=22, 5%+=25
Profile completeness/bio quality (15 pts max): strong bio with personality=15, basic bio=8, empty=2
Content consistency (10 pts max): posts regularly with consistent style=10, irregular=5, sporadic=2
A ${optimizedForGemini.followerCount >= 100000 ? '100k+' : optimizedForGemini.followerCount >= 50000 ? '50k+' : optimizedForGemini.followerCount >= 10000 ? '10k+' : 'small'} account MUST score at least ${optimizedForGemini.followerCount >= 100000 ? 50 : optimizedForGemini.followerCount >= 50000 ? 40 : optimizedForGemini.followerCount >= 10000 ? 30 : 15} from followers alone.

Return exactly this JSON:
{
"brandScore": calculated score using the weights above — a ${optimizedForGemini.followerCount} follower account starts at the follower tier score minimum,
"niche": "very specific niche e.g. Latina Fitness Model not just Fitness — based on bio and post captions",
"engagementRate": ${optimizedForGemini.engagementRate > 0 ? optimizedForGemini.engagementRate : 'estimate from post likes/comments vs followers'},
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
            maxOutputTokens: 8192,
          },
        }),
      }
    )

    console.log('[scrape] Gemini response status:', gemRes.status)
    const gemData = await gemRes.json()
    console.log('[scrape] Gemini raw response:', JSON.stringify(gemData).slice(0, 1000))

   if (!gemRes.ok) {
  if (gemRes.status === 503) {
    // Wait 3s and retry once
    console.warn('[scrape] Gemini 503 — retrying in 3s...')
    await new Promise(r => setTimeout(r, 3000))
    // retry the whole Gemini call here
  }
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
