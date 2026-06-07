export const maxDuration = 60

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { logServerError } from '@/lib/logError'
import { hasActiveAccess } from '@/lib/subscription'
import { normalizeHandle } from '@/lib/utils'

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
    if (res.status === 404) {
      throw { code: 'USER_NOT_FOUND', message: `Account not found: ${path}` }
    }
    throw new Error(`HikerAPI ${res.status}: ${body.slice(0, 200)}`)
  }
  return res.json()
}


export async function POST(request: NextRequest) {
  console.log('[scrape] ── POST /api/scrape ──────────────────────')
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
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    userId = user.id

    // Paid work — require an active subscription (or promo), checked server-side
    if (!(await hasActiveAccess(userId))) {
      return NextResponse.json({ error: 'Subscription required' }, { status: 403 })
    }

    const body = await request.json()
    const { username } = body
    console.log('[scrape] username:', username, '| userId:', userId)
    console.log('[scrape] HIKERAPI_KEY present:', !!HIKERAPI_KEY)
    console.log('[scrape] SERVICE_ROLE_KEY present:', !!SERVICE_ROLE_KEY)

    if (!username) return NextResponse.json({ error: 'Username required' }, { status: 400 })

    const handle = normalizeHandle(username)
    let scrapedData: Record<string, any> = { username: handle }
    let realEngagement = 0
    let hikerSuccess = false

    // ── HikerAPI ──────────────────────────────────────────────
    if (HIKERAPI_KEY) {
      console.log('[scrape] Starting HikerAPI profile fetch for:', handle)
      try {
        const userInfo = await hikerGet(`/user/by/username?username=${handle}`)
        console.log('[scrape] RAW HikerAPI userInfo:', JSON.stringify(userInfo).slice(0, 3000))
        console.log('[scrape] HikerAPI user keys:', Object.keys(userInfo || {}))

        const followerCount =
          userInfo.follower_count ?? userInfo.followerCount ?? userInfo.followers ??
          userInfo.followersCount ?? userInfo.edge_followed_by?.count ??
          userInfo.user?.follower_count ?? userInfo.user?.followerCount ?? userInfo.user?.followers ?? 0

        const followingCount =
          userInfo.following_count ?? userInfo.followingCount ?? userInfo.following ??
          userInfo.user?.following_count ?? userInfo.user?.followingCount ?? 0

        const postCount =
          userInfo.media_count ?? userInfo.mediaCount ?? userInfo.post_count ??
          userInfo.user?.media_count ?? userInfo.user?.mediaCount ?? 0

        const bio = userInfo.biography ?? userInfo.bio ?? userInfo.user?.biography ?? ''

        const pk =
          userInfo.pk ?? userInfo.id ?? userInfo.userId ?? userInfo.user_id ??
          userInfo.user?.pk ?? userInfo.user?.id ?? ''

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

          } catch (mediaErr) {
            console.warn('[scrape] Media fetch failed (continuing without posts):', mediaErr)
          }
        }
      } catch (hikerErr: any) {
        if (hikerErr.code === 'USER_NOT_FOUND') {
          console.warn('[scrape] Account not found:', handle)
          return NextResponse.json({
            error: 'USER_NOT_FOUND',
            message: `We couldn't find the Instagram account @${handle}.`,
          }, { status: 404 })
        }
        console.warn('[scrape] HikerAPI profile fetch failed — falling back to Gemini-only:', hikerErr)
        hikerSuccess = false
      }
    } else {
      console.warn('[scrape] HIKERAPI_KEY not set — Gemini will estimate from username only')
    }

    // ── Step 1: Save HikerAPI raw data immediately ─────────────
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
            follower_count: scrapedData.follower_count ?? 0,
            following_count: scrapedData.following_count ?? 0,
            engagement_rate: realEngagement,
            raw_scraped_data: scrapedData,
            scrape_status: 'scraped',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' })
          console.log('[scrape] Partial HikerAPI data saved — followers:', scrapedData.follower_count)
        } catch (e) {
          console.warn('[scrape] Partial save failed (non-fatal):', e)
        }
      }
    }

    console.log('[scrape] ── HikerAPI done — returning to client for Gemini step ──────────')

    console.log('[scrape] ── DONE — returning to client ─────────────────────────────────')
    return NextResponse.json({ success: true, hikerSuccess, scrapedData })
  } catch (err: any) {
    console.error('[scrape] Unhandled error:', err)
    await logServerError(`scrape failed: ${err?.message ?? 'Unknown error'}`, {
      url: '/api/scrape',
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
    if (err.message === 'RATE_LIMIT') {
      return NextResponse.json({ error: 'AI limit reached. Please try again.' }, { status: 429 })
    }
    return NextResponse.json({ error: `Scrape failed: ${err.message}` }, { status: 500 })
  }
}