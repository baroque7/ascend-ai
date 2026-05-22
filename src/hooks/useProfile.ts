'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export interface UserProfile {
  id: string
  instagram_handle: string
  niche: string
  language: string
  scrape_data: Record<string, any>
  analysis_data: Record<string, any>
  strategy_data: Record<string, any>
  scraped_at: string | null
  analyzed_at: string | null
}

export function useProfile() {
  const { user, supabase } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    if (!user) { setLoading(false); return }
    setLoading(true)

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) {
      setProfile(data as UserProfile)
      if (data.scraped_at && data.instagram_handle) {
        const stale = Date.now() - new Date(data.scraped_at).getTime() > 86_400_000
        if (stale) silentRefresh(data as UserProfile)
      }
    } else {
      // Fallback to user_metadata (pre-migration or table not yet created)
      const meta = user.user_metadata || {}
      if (meta.instagram_handle || meta.niche) {
        setProfile({
          id: user.id,
          instagram_handle: meta.instagram_handle || '',
          niche: meta.niche || '',
          language: meta.language || 'English',
          scrape_data: {},
          analysis_data: {},
          strategy_data: {},
          scraped_at: null,
          analyzed_at: null,
        })
      } else {
        setProfile(null)
      }
    }
    setLoading(false)
  }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function silentRefresh(p: UserProfile) {
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: p.instagram_handle }),
      })
      const result = await res.json()
      if (result.profile && !result.error) {
        const patch = { scrape_data: result.profile, scraped_at: new Date().toISOString() }
        await supabase.from('profiles').update(patch).eq('id', p.id)
        setProfile(prev => prev ? { ...prev, ...patch } : prev)
      }
    } catch {}
  }

  async function updateProfile(patch: Partial<Omit<UserProfile, 'id'>>) {
    if (!user) return
    setProfile(prev => prev ? { ...prev, ...patch } : { id: user.id, instagram_handle: '', niche: '', language: 'English', scrape_data: {}, analysis_data: {}, strategy_data: {}, scraped_at: null, analyzed_at: null, ...patch })
    await supabase.from('profiles').upsert({ id: user.id, ...patch })
  }

  useEffect(() => { reload() }, [reload])

  return { profile, loading, reload, updateProfile }
}
