'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const LANGUAGES = ['English', 'Spanish', 'French', 'Portuguese', 'Arabic', 'Italian', 'German', 'Turkish', 'Hindi', 'Indonesian']

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const [handle, setHandle] = useState(user?.user_metadata?.instagram_handle || '')
  const [language, setLanguage] = useState(user?.user_metadata?.language || 'English')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const isPromo = user?.user_metadata?.is_promo === true
  const subStatus = user?.user_metadata?.subscription_status

  async function save() {
    setSaving(true)
    await supabase.auth.updateUser({
      data: {
        instagram_handle: handle.replace('@', '').trim(),
        language,
      },
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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

      {/* Profile */}
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
        <div style={{ background: isPromo ? 'rgba(255,215,0,0.1)' : subStatus === 'active' ? 'rgba(0,255,128,0.1)' : 'rgba(255,68,68,0.1)', borderRadius: 6, padding: '4px 9px', flexShrink: 0 }}>
          <span style={{ color: isPromo ? '#FFD700' : subStatus === 'active' ? '#00ff80' : '#ff6b6b', fontSize: 11, fontWeight: 700 }}>
            {isPromo ? 'PROMO' : subStatus === 'active' ? 'PRO' : 'INACTIVE'}
          </span>
        </div>
      </motion.div>

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

      {/* Save button */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginBottom: 32 }}>
        <motion.button
          onClick={save}
          disabled={saving}
          whileTap={{ scale: 0.98 }}
          style={{ width: '100%', padding: '15px', background: saved ? '#0a0a0a' : '#FFD700', border: saved ? '1px solid rgba(255,215,0,0.3)' : 'none', borderRadius: 50, color: saved ? '#FFD700' : '#000', fontSize: 16, fontWeight: 900, cursor: saving ? 'default' : 'pointer' }}
        >
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
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
          <div style={{ background: isPromo || subStatus === 'active' ? 'rgba(255,215,0,0.08)' : 'rgba(255,68,68,0.08)', border: `1px solid ${isPromo || subStatus === 'active' ? 'rgba(255,215,0,0.2)' : 'rgba(255,68,68,0.2)'}`, borderRadius: 8, padding: '5px 10px' }}>
            <span style={{ color: isPromo || subStatus === 'active' ? '#FFD700' : '#ff6b6b', fontSize: 12, fontWeight: 700 }}>
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
          style={{ width: '100%', padding: '15px', background: 'transparent', border: '1px solid rgba(255,68,68,0.25)', borderRadius: 50, color: signingOut ? '#555' : '#ff6b6b', fontSize: 15, fontWeight: 700, cursor: signingOut ? 'default' : 'pointer' }}
        >
          {signingOut ? 'Signing out…' : 'Sign Out'}
        </motion.button>
      </motion.div>

    </div>
  )
}
