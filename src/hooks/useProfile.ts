'use client'
import { useState, useEffect, useCallback, useRef, startTransition } from 'react'
import { useAuth } from '@/contexts/AuthContext'

const USER_TABLE_FIELDS = ['instagram_username', 'language', 'is_subscribed', 'is_promo', 'last_scraped_at']

export interface UserProfile {
  id: string
  instagram_username: string
  language: string
  is_subscribed: boolean
  is_promo: boolean
  last_scraped_at: string | null
  scrape_status: 'pending' | 'scraped' | 'analyzed' | 'failed'
  brand_score: number
  niche: string
  engagement_rate: number
  follower_count: number
  following_count: number
  brand_identity: string
  brand_personality: string
  content_pillars: string[]
  what_makes_unique: string
  current_problems: string[]
  profile_score: number
  best_posting_times: string[]
  top_content_type: string
  format_fatigue: boolean
  format_fatigue_warning: string
  us_growth_strategy: string
  hispanic_to_us_shift: string
  filming_tips: string
  hashtag_strategy: string
  content_variations: string[]
  weekly_plan: string
  bio_rewrite: string
  audience_type: string
  is_hispanic_audience: boolean
  posting_frequency: string
  raw_scraped_data: Record<string, any>
}

const DEFAULTS: Omit<UserProfile, 'id'> = {
  instagram_username: '',
  language: 'English',
  is_subscribed: false,
  is_promo: false,
  last_scraped_at: null,
  scrape_status: 'pending',
  brand_score: 0,
  niche: '',
  engagement_rate: 0,
  follower_count: 0,
  following_count: 0,
  brand_identity: '',
  brand_personality: '',
  content_pillars: [],
  what_makes_unique: '',
  current_problems: [],
  profile_score: 0,
  best_posting_times: [],
  top_content_type: '',
  format_fatigue: false,
  format_fatigue_warning: '',
  us_growth_strategy: '',
  hispanic_to_us_shift: '',
  filming_tips: '',
  hashtag_strategy: '',
  content_variations: [],
  weekly_plan: '',
  bio_rewrite: '',
  audience_type: '',
  is_hispanic_audience: false,
  posting_frequency: '',
  raw_scraped_data: {},
}

export function useProfile() {
  const { user, supabase } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const refreshing = useRef(false)
  // reloadRef breaks the circular dep: silentRefresh needs reload, reload needs silentRefresh
  const reloadRef = useRef<() => Promise<void>>(async () => {})

  // Defined before reload so the React compiler can see it
  const silentRefresh = useCallback(async (username: string) => {
    if (refreshing.current) return
    refreshing.current = true
    try {
      const scrapeRes = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })
      if (!scrapeRes.ok) return
      await fetch('/api/analyze-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      await reloadRef.current()
    } catch {} finally {
      refreshing.current = false
    }
  }, [])

  const reload = useCallback(async () => {
    if (!user) { setLoading(false); return }
    setLoading(true)

    const [{ data: u }, { data: p }] = await Promise.all([
      supabase.from('users').select('*').eq('id', user.id).single(),
      supabase.from('profiles').select('*').eq('user_id', user.id).single(),
    ])

    if (u || p) {
      const meta = user.user_metadata || {}
      const merged: UserProfile = {
        id: user.id,
        ...DEFAULTS,
        // Fall back to auth metadata if the users-table query hiccupped (e.g. flaky mobile),
        // so a dropped query doesn't make an onboarded user look like they have no handle.
        instagram_username: u?.instagram_username || meta.instagram_handle || meta.instagram_username || '',
        language: u?.language ?? 'English',
        is_subscribed: u?.is_subscribed ?? false,
        is_promo: u?.is_promo ?? false,
        last_scraped_at: u?.last_scraped_at ?? null,
        scrape_status: (p?.scrape_status as UserProfile['scrape_status']) ?? 'pending',
        brand_score: p?.brand_score ?? 0,
        niche: p?.niche ?? '',
        engagement_rate: p?.engagement_rate ?? 0,
        follower_count: p?.follower_count ?? 0,
        following_count: p?.following_count ?? 0,
        brand_identity: p?.brand_identity ?? '',
        brand_personality: p?.brand_personality ?? '',
        content_pillars: p?.content_pillars ?? [],
        what_makes_unique: p?.what_makes_unique ?? '',
        current_problems: p?.current_problems ?? [],
        profile_score: p?.profile_score ?? 0,
        best_posting_times: p?.best_posting_times ?? [],
        top_content_type: p?.top_content_type ?? '',
        format_fatigue: p?.format_fatigue ?? false,
        format_fatigue_warning: p?.format_fatigue_warning ?? '',
        us_growth_strategy: p?.us_growth_strategy ?? '',
        hispanic_to_us_shift: p?.hispanic_to_us_shift ?? '',
        filming_tips: p?.filming_tips ?? '',
        hashtag_strategy: p?.hashtag_strategy ?? '',
        content_variations: p?.content_variations ?? [],
        weekly_plan: p?.weekly_plan ?? '',
        bio_rewrite: p?.bio_rewrite ?? '',
        audience_type: p?.audience_type ?? '',
        is_hispanic_audience: p?.is_hispanic_audience ?? false,
        posting_frequency: p?.posting_frequency ?? '',
        raw_scraped_data: p?.raw_scraped_data ?? {},
      }
      setProfile(merged)

      // 24h silent background refresh — guarded so only one runs at a time
      if (u?.last_scraped_at && u?.instagram_username) {
        const stale = Date.now() - new Date(u.last_scraped_at).getTime() > 86_400_000
        if (stale) silentRefresh(u.instagram_username)
      }
    } else {
      // Fallback to auth metadata if tables not yet populated
      const meta = user.user_metadata || {}
      setProfile({
        id: user.id,
        ...DEFAULTS,
        instagram_username: meta.instagram_handle || meta.instagram_username || '',
        language: meta.language || 'English',
        niche: meta.niche || '',
        is_subscribed: meta.subscription_status === 'active',
        is_promo: meta.is_promo === true,
      })
    }
    setLoading(false)
  }, [user?.id, silentRefresh]) // eslint-disable-line react-hooks/exhaustive-deps

  // Keep reloadRef pointing at the latest reload so silentRefresh can call it
  useEffect(() => { reloadRef.current = reload }, [reload])

  async function updateProfile(patch: Partial<Omit<UserProfile, 'id'>>) {
    if (!user) return
    setProfile(prev => prev ? { ...prev, ...patch } : null)

    const userPatch: Record<string, any> = {}
    const profilePatch: Record<string, any> = {}
    for (const [k, v] of Object.entries(patch)) {
      if (USER_TABLE_FIELDS.includes(k)) userPatch[k] = v
      else profilePatch[k] = v
    }

    if (Object.keys(userPatch).length > 0) {
      await supabase.from('users').upsert({ id: user.id, ...userPatch }, { onConflict: 'id' })
    }
    if (Object.keys(profilePatch).length > 0) {
      await supabase.from('profiles').upsert({ user_id: user.id, ...profilePatch }, { onConflict: 'user_id' })
    }
  }

  useEffect(() => { startTransition(() => { void reload() }) }, [reload])

  return { profile, loading, reload, updateProfile }
}
