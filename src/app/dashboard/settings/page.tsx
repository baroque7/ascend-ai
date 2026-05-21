'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Settings() {
  const { user, signOut } = useAuth()
  const [saved, setSaved] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
  }

  function Row({ label, value, href, danger }: { label: string; value?: string; href?: string; danger?: boolean }) {
    const content = (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #111' }}>
        <span style={{ color: danger ? '#ff6b6b' : '#ccc', fontSize: 15 }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {value && <span style={{ color: '#444', fontSize: 13 }}>{value}</span>}
          <span style={{ color: '#333', fontSize: 16 }}>›</span>
        </div>
      </div>
    )
    if (href) return <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>{content}</Link>
    return content
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '20px 20px 100px' }}>

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 32, letterSpacing: '-0.5px' }}>Settings</h1>
      </motion.div>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.1)', borderRadius: 16, padding: '20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}
      >
        <div style={{ width: 50, height: 50, background: '#FFD700', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
          {(user?.user_metadata?.full_name?.[0] || user?.email?.[0] || '?').toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 16, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.user_metadata?.full_name || 'Creator'}
          </p>
          <p style={{ color: '#555', fontSize: 13, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email}
          </p>
        </div>
        <div style={{ background: 'rgba(255,215,0,0.1)', borderRadius: 6, padding: '3px 8px' }}>
          <span style={{ color: '#FFD700', fontSize: 11, fontWeight: 700 }}>PRO</span>
        </div>
      </motion.div>

      {/* Account section */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: 24 }}>
        <p style={{ color: '#333', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>ACCOUNT</p>
        <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, padding: '0 16px' }}>
          <Row label="Plan" value="GramScaling Pro — $69/mo" />
          <Row label="Billing & Subscription" href="/pricing" />
          <Row label="Change Password" href="/forgot-password" />
        </div>
      </motion.div>

      {/* TikTok / Instagram status */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ marginBottom: 24 }}>
        <p style={{ color: '#333', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>US ACCOUNT STATUS</p>
        <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, padding: '16px' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20 }}>🇺🇸</span>
            <div>
              <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>
                US Account: <span style={{ color: '#FFD700' }}>Setting Up</span>
              </p>
              <p style={{ color: '#444', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                We're creating your US Instagram presence. You'll get an email when it's ready — usually within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Support section */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginBottom: 24 }}>
        <p style={{ color: '#333', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>SUPPORT</p>
        <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #111' }}>
            <span style={{ color: '#ccc', fontSize: 15 }}>Email Support</span>
            <a href="mailto:baroqueincoporated@gmail.com" style={{ color: '#555', fontSize: 13, textDecoration: 'none' }}>Get Help ›</a>
          </div>
          <Row label="Terms of Service" href="/terms" />
          <Row label="Privacy Policy" href="/privacy" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0' }}>
            <span style={{ color: '#333', fontSize: 13 }}>Version 1.0.0</span>
            <span style={{ color: '#333', fontSize: 13 }}>GramScaling</span>
          </div>
        </div>
      </motion.div>

      {/* Sign out */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <motion.button
          onClick={handleSignOut}
          disabled={signingOut}
          whileTap={{ scale: 0.98 }}
          style={{ width: '100%', padding: '15px', background: 'transparent', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 50, color: signingOut ? '#555' : '#ff6b6b', fontSize: 16, fontWeight: 700, cursor: signingOut ? 'default' : 'pointer' }}
        >
          {signingOut ? 'Signing out…' : 'Sign Out'}
        </motion.button>
      </motion.div>

    </div>
  )
}
