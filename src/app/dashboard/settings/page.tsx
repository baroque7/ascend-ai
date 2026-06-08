'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import { normalizeHandle } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslation'
import LanguageToggle from '@/components/LanguageToggle'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  const { user, signOut, supabase, loading: authLoading } = useAuth()
  const { profile } = useProfile()
  const { t } = useTranslation()
  const [handle, setHandle] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [scraping, setScraping] = useState(false)
  const [error, setError] = useState('')
  const [signingOut, setSigningOut] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError] = useState('')

  useEffect(() => {
    if (!authLoading && profile) {
      setHandle(profile.instagram_username || '')
    }
  }, [authLoading, profile?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Read subscription state from the DB (the source the Creem webhook + promo route write).
  // user_metadata is never set by the current flow, so reading it showed paid users as "inactive".
  const isPromo = profile?.is_promo === true
  const subActive = profile?.is_subscribed === true

  async function save() {
    setSaving(true)
    setError('')
    const cleanHandle = normalizeHandle(handle)
    const handleChanged = cleanHandle !== profile?.instagram_username

    // Language is changed instantly via the toggle, so the only thing
    // Save commits is a new Instagram handle. Nothing to do if unchanged.
    if (!handleChanged) {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      return
    }

    // Username changed — scrape + analyze handles all database writes
    setSaving(false)
    setScraping(true)

    try {
      const scrapeRes = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanHandle }),
      })
      const scrapeJson = await scrapeRes.json()

      if (scrapeRes.status === 404 && scrapeJson.error === 'USER_NOT_FOUND') {
        setError(`Could not find @${cleanHandle} ${t('settings.error.not_found')}`)
        setScraping(false)
        return
      }
      if (scrapeJson.error) {
        setError(t('settings.error.fetch_failed'))
        setScraping(false)
        return
      }

      if (scrapeJson.scrapedData?.full_name) {
        await supabase.auth.updateUser({ data: { hiker_full_name: scrapeJson.scrapedData.full_name } })
      }

      const analyzeRes = await fetch('/api/analyze-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const analyzeJson = await analyzeRes.json()

      if (analyzeJson.error) {
        setError(t('settings.error.analyze_failed'))
        setScraping(false)
        return
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
      setError(t('settings.error.generic'))
      setScraping(false)
    }
  }

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
  }

  // Opens the Creem customer portal where the user can cancel / manage billing.
  async function openBillingPortal() {
    setPortalLoading(true)
    setPortalError('')
    try {
      const res = await fetch('/api/billing-portal', { method: 'POST' })
      const json = await res.json()
      if (res.ok && json.url) {
        window.location.href = json.url
        return
      }
      setPortalError(res.status === 404 ? t('settings.billing.no_account') : t('settings.billing.error'))
    } catch {
      setPortalError(t('settings.billing.error'))
    }
    setPortalLoading(false)
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '24px 20px 100px' }}>

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 900, margin: '0 0 28px', letterSpacing: '-0.5px' }}>{t('settings.title')}</h1>
      </motion.div>

      {/* Profile card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.1)', borderRadius: 16, padding: '18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 48, height: 48, background: '#FFD700', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, flexShrink: 0, color: '#000' }}>
          {(user?.user_metadata?.full_name?.[0] || user?.email?.[0] || '?').toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.user_metadata?.full_name || t('settings.creator')}
          </p>
          <p style={{ color: '#444', fontSize: 12, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email}
          </p>
        </div>
        <div style={{ background: isPromo ? 'rgba(255,215,0,0.1)' : subActive ? 'rgba(0,255,128,0.1)' : 'rgba(80,80,80,0.1)', borderRadius: 6, padding: '4px 9px', flexShrink: 0 }}>
          <span style={{ color: isPromo ? '#FFD700' : subActive ? '#00ff80' : '#555', fontSize: 11, fontWeight: 700 }}>
            {isPromo ? t('settings.status.promo') : subActive ? t('settings.status.pro') : t('settings.status.inactive')}
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
          {t('settings.handle_label')}
        </label>
        <input
          type="text"
          value={handle}
          onChange={e => setHandle(e.target.value)}
          placeholder={t('settings.handle_placeholder')}
          autoCapitalize="none"
          style={{ width: '100%', padding: '14px 16px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12, color: '#fff', fontSize: 15, boxSizing: 'border-box', outline: 'none' }}
        />
      </motion.div>

      {/* Language */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ marginBottom: 20 }}>
        <label style={{ color: '#444', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, display: 'block', marginBottom: 8 }}>
          {t('settings.language_label')}
        </label>
        <LanguageToggle />
      </motion.div>

      {/* Save */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginBottom: 32 }}>
        <motion.button
          onClick={save}
          disabled={saving || scraping}
          whileTap={{ scale: 0.98 }}
          style={{ width: '100%', padding: '15px', background: saved ? '#0a0a0a' : '#FFD700', border: saved ? '1px solid rgba(255,215,0,0.3)' : 'none', borderRadius: 50, color: saved ? '#FFD700' : '#000', fontSize: 16, fontWeight: 900, cursor: saving || scraping ? 'default' : 'pointer' }}
        >
          {saving ? t('settings.saving') : scraping ? t('settings.analyzing') : saved ? t('settings.saved') : t('settings.save')}
        </motion.button>
      </motion.div>

      {/* Subscription */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, padding: '16px 18px', marginBottom: 32 }}>
        <p style={{ color: '#444', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, marginBottom: 12 }}>{t('settings.subscription')}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '0 0 3px' }}>{t('settings.plan_name')}</p>
            <p style={{ color: '#444', fontSize: 12, margin: 0 }}>
              {isPromo ? t('settings.plan.promo') : subActive ? t('settings.plan.active') : t('settings.plan.inactive')}
            </p>
          </div>
          <div style={{ background: isPromo || subActive ? 'rgba(255,215,0,0.08)' : 'rgba(80,80,80,0.08)', border: `1px solid ${isPromo || subActive ? 'rgba(255,215,0,0.2)' : '#222'}`, borderRadius: 8, padding: '5px 10px' }}>
            <span style={{ color: isPromo || subActive ? '#FFD700' : '#444', fontSize: 12, fontWeight: 700 }}>
              {isPromo || subActive ? t('settings.status.active') : t('settings.status.inactive')}
            </span>
          </div>
        </div>

        {/* Manage / cancel — only for real paid subscribers (promo has no Creem customer) */}
        {subActive && (
          <button onClick={openBillingPortal} disabled={portalLoading}
            style={{ width: '100%', marginTop: 16, padding: '12px', background: 'transparent', border: '1px solid #222', borderRadius: 10, color: portalLoading ? '#2a2a2a' : '#888', fontSize: 13, fontWeight: 700, cursor: portalLoading ? 'default' : 'pointer' }}>
            {portalLoading ? t('settings.billing.opening') : t('settings.billing.manage')}
          </button>
        )}
        {portalError && (
          <p style={{ color: '#ff6b6b', fontSize: 12, margin: '10px 0 0', textAlign: 'center', lineHeight: 1.5 }}>{portalError}</p>
        )}
      </motion.div>

      {/* Contact support */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} style={{ marginBottom: 12 }}>
        <Link href="/contact"
          style={{ display: 'block', width: '100%', padding: '15px', background: 'transparent', border: '1px solid #1a1a1a', borderRadius: 50, color: '#444', fontSize: 15, fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>
          {t('settings.contact')}
        </Link>
      </motion.div>

      {/* Sign out */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <motion.button
          onClick={handleSignOut}
          disabled={signingOut}
          whileTap={{ scale: 0.98 }}
          style={{ width: '100%', padding: '15px', background: 'transparent', border: '1px solid #222', borderRadius: 50, color: signingOut ? '#2a2a2a' : '#444', fontSize: 15, fontWeight: 700, cursor: signingOut ? 'default' : 'pointer' }}
        >
          {signingOut ? t('settings.signing_out') : t('settings.sign_out')}
        </motion.button>
      </motion.div>

    </div>
  )
}