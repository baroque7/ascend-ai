'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import { motion } from 'framer-motion'

const LANGUAGES = ['English', 'Spanish', 'French', 'Portuguese', 'Arabic', 'Italian', 'German', 'Turkish', 'Hindi', 'Indonesian']

export default function SettingsPage() {
  const { user, signOut, supabase } = useAuth()
  const { profile, updateProfile } = useProfile()
  const [handle, setHandle] = useState('')
  const [language, setLanguage] = useState('English')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [scraping, setScraping] = useState(false)
  const [error, setError] = useState('')
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    if (profile) {
      setHandle(profile.instagram_username || '')
      setLanguage(profile.language || 'English')
    }
  }, [profile?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const isPromo = user?.user_metadata?.is_promo === true
  const subStatus = user?.user_metadata?.subscription_status

  async function save() {
    setSaving(true)
    setError('')
    const cleanHandle = handle.replace('@', '').trim().toLowerCase()
    const hadHandle = profile?.instagram_username
    const handleChanged = cleanHandle !== hadHandle

    // Always save language to auth metadata
    await supabase.auth.updateUser({ data: { instagram_handle: cleanHandle, language } })

    // If only language changed, save and done
    if (!handleChanged) {
      await updateProfile({ language })
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      return
    }

    // Username changed — scrape handles ALL database writes
    setSaving(false)
    setScraping(true)

    try {
      // Update users table with new username BEFORE scrape
      await supabase.from('users').update({
        instagram_username: cleanHandle,
        language,
      }).eq('id', user?.id)

      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanHandle, userId: user?.id }),
      })

      const json = await res.json()

      if (res.status === 404 && json.error === 'USER_NOT_FOUND') {
        setError(`Could not find @${cleanHandle} on Instagram. Check the username and try again.`)
        setScraping(false)
        return
      }

      if (json.error) {
        setError('Profile analysis failed. Your username was saved — try refreshing later.')
        setScraping(false)
        return
      }

      // Update auth metadata with new name
      if (json.scrapedData?.full_name) {
        await supabase.auth.updateUser({ data: { hiker_full_name: json.scrapedData.full_name } })
      }

      // Clear old caches so fresh data generates on next visit
      if (user) {
        const todayDate = new Date().toISOString().split('T')[0]

        // Clear strategy cache
        await supabase.from('strategy').delete().eq('user_id', user.id)
        console.log('[settings] strategy cache cleared')

        // Clear today's content cache
        await supabase.from('content').delete().eq('user_id', user.id).eq('date', todayDate)
        console.log('[settings] today content cache cleared')
      }

      setScraping(false)
      setSaved(true)
      setTimeout(() => { window.location.replace('/dashboard') }, 1500)

    } catch {
      setError('Something went wrong during analysis. Your username was saved.')
      setScraping(false)
    }
  }

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '24px 20px 100px' }}>

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 900, margin: '0 0 28px', letterSpacing: '-0.5px' }}>Settings</h1>
      </motion.div>

      {/* Profile card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.1)', borderRadius: 16, padding: '18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 48, height: 48, background: '#FFD700', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, flexShrink: 0, color: '#000' }}>
          {(user?.user_metadata?.full_name?.[0] || user?.email?.[0] || '?').toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.user_metadata?.full_name || 'Creator'}
          </p>
          <p style={{ color: '#444', fontSize: 12, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email}
          </p>
        </div>
        <div style={{ background: isPromo ? 'rgba(255,215,0,0.1)' : subStatus === 'active' ? 'rgba(0,255,128,0.1)' : 'rgba(80,80,80,0.1)', borderRadius: 6, padding: '4px 9px', flexShrink: 0 }}>
          <span style={{ color: isPromo ? '#FFD700' : subStatus === 'active' ? '#00ff80' : '#555', fontSize: 11, fontWeight: 700 }}>
            {isPromo ? 'PROMO' : subStatus === 'active' ? 'PRO' : 'INACTIVE'}
          </span>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.15)', borderRadius: 12, padding: '12px 16px', marginBottom: 16, textAlign: 'center' }}>
          <p style={{ color: '#ff6b6b', fontSize: 13, margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Instagram Handle */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: 14 }}>
        <label style={{ color: '#444', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, display: 'block', marginBottom: 8 }}>
          INSTAGRAM USERNAME
        </label>
        <input
          type="text"
          value={handle}
          onChange={e => setHandle(e.target.value)}
          placeholder="@yourhandle"
          autoCapitalize="none"
          style={{ width: '100%', padding: '14px 16px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12, color: '#fff', fontSize: 15, boxSizing: 'border-box', outline: 'none' }}
        />
      </motion.div>

      {/* Language */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ marginBottom: 20 }}>
        <label style={{ color: '#444', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, display: 'block', marginBottom: 8 }}>
          CONTENT LANGUAGE
        </label>
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          style={{ width: '100%', padding: '14px 16px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12, color: '#fff', fontSize: 15, boxSizing: 'border-box', outline: 'none', appearance: 'none', cursor: 'pointer' }}
        >
          {LANGUAGES.map(l => (
            <option key={l} value={l} style={{ background: '#111' }}>{l}</option>
          ))}
        </select>
      </motion.div>

      {/* Save */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginBottom: 32 }}>
        <motion.button
          onClick={save}
          disabled={saving || scraping}
          whileTap={{ scale: 0.98 }}
          style={{ width: '100%', padding: '15px', background: saved ? '#0a0a0a' : '#FFD700', border: saved ? '1px solid rgba(255,215,0,0.3)' : 'none', borderRadius: 50, color: saved ? '#FFD700' : '#000', fontSize: 16, fontWeight: 900, cursor: saving || scraping ? 'default' : 'pointer' }}
        >
          {saving ? 'Saving…' : scraping ? 'Analyzing new profile…' : saved ? '✓ Saved' : 'Save Changes'}
        </motion.button>
      </motion.div>

      {/* Subscription */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, padding: '16px 18px', marginBottom: 32 }}>
        <p style={{ color: '#444', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, marginBottom: 12 }}>SUBSCRIPTION</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '0 0 3px' }}>GramScaling Pro</p>
            <p style={{ color: '#444', fontSize: 12, margin: 0 }}>
              {isPromo ? 'Promo access — full features unlocked' : subStatus === 'active' ? '$69.99 / month' : 'No active subscription'}
            </p>
          </div>
          <div style={{ background: isPromo || subStatus === 'active' ? 'rgba(255,215,0,0.08)' : 'rgba(80,80,80,0.08)', border: `1px solid ${isPromo || subStatus === 'active' ? 'rgba(255,215,0,0.2)' : '#222'}`, borderRadius: 8, padding: '5px 10px' }}>
            <span style={{ color: isPromo || subStatus === 'active' ? '#FFD700' : '#444', fontSize: 12, fontWeight: 700 }}>
              {isPromo || subStatus === 'active' ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Sign out */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <motion.button
          onClick={handleSignOut}
          disabled={signingOut}
          whileTap={{ scale: 0.98 }}
          style={{ width: '100%', padding: '15px', background: 'transparent', border: '1px solid #222', borderRadius: 50, color: signingOut ? '#2a2a2a' : '#444', fontSize: 15, fontWeight: 700, cursor: signingOut ? 'default' : 'pointer' }}
        >
          {signingOut ? 'Signing out…' : 'Sign Out'}
        </motion.button>
      </motion.div>

    </div>
  )
}