'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/hooks/useProfile'
import Link from 'next/link'
import { motion } from 'framer-motion'

const TIPS = [
  'Post your script within 2 hours of peak EST traffic for 3× the reach.',
  'Reply to every comment in the first 30 minutes — the algorithm rewards it.',
  'Use your first 3 seconds to state the payoff, not the intro.',
  'Add closed captions — 85% of US users watch with sound off.',
  'End every video with a question to boost comment velocity.',
]

function ScoreRing({ score }: { score: number }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => setAnimated(score), 400)
    return () => clearTimeout(timeout)
  }, [score])

  const offset = circ - (animated / 100) * circ

  return (
    <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto' }}>
      <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={70} cy={70} r={r} fill="none" stroke="#111" strokeWidth={10} />
        <circle
          cx={70} cy={70} r={r} fill="none"
          stroke="#FFD700" strokeWidth={10}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
          style={{ color: '#FFD700', fontSize: 34, fontWeight: 900, lineHeight: 1 }}
        >
          {score}
        </motion.span>
        <span style={{ color: '#444', fontSize: 11, fontWeight: 600, marginTop: 2 }}>/ 100</span>
      </div>
    </div>
  )
}

function formatFollowers(n: number | undefined | null): string {
  if (n == null) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

function formatEngagement(n: number | undefined | null): string {
  if (n == null) return '—'
  return `${Number(n).toFixed(1)}%`
}

export default function Home() {
  const { user } = useAuth()
  const { profile, loading } = useProfile()

  // Greeting name: HikerAPI full_name (real Instagram name) → 'Creator'
  const hikerFullName = (user?.user_metadata?.hiker_full_name as string | undefined)
    || (profile?.raw_scraped_data as any)?.full_name
    || ''
  const instagramFallback = profile?.instagram_username
    ? profile.instagram_username.charAt(0).toUpperCase() + profile.instagram_username.slice(1)
    : ''
  const displayName = loading ? '…' : (hikerFullName || instagramFallback || 'there')

  const score = profile?.brand_score ?? 0
  const tip = TIPS[new Date().getDay() % TIPS.length]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const hasData = !!(profile?.brand_score && profile.brand_score > 0)
  const hasHandle = !!profile?.instagram_username

  const lastUpdated = profile?.last_scraped_at
    ? new Date(profile.last_scraped_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null

  // Avatar: first letter of HikerAPI name → instagram handle → email
  const instagramHandle = profile?.instagram_username
  const avatarChar = (hikerFullName?.[0] || instagramHandle?.[0] || user?.email?.[0] || '?').toUpperCase()

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '24px 20px 100px' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <span style={{ color: '#FFD700', fontWeight: 900, fontSize: 18, letterSpacing: '-0.5px' }}>GramScaling</span>
        <Link href="/dashboard/settings"
          style={{ width: 36, height: 36, background: '#111', border: '1px solid #1a1a1a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#fff', fontSize: 15 }}>
          {avatarChar}
        </Link>
      </motion.div>

      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
        style={{ marginBottom: 28 }}>
        <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
          {greeting}, {displayName} 👋
        </h2>
        <p style={{ color: '#333', fontSize: 14, margin: 0, lineHeight: 1.5 }}>{tip}</p>
      </motion.div>

      {/* Never-set-up banner — only for users with no instagram handle at all */}
      {!loading && !hasHandle && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: 14, padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20 }}>⚡</span>
          <div>
            <p style={{ color: '#FFD700', fontWeight: 700, fontSize: 13, margin: '0 0 2px' }}>Set up your profile</p>
            <p style={{ color: '#444', fontSize: 12, margin: 0 }}>Connect your Instagram to unlock your brand score and strategy.</p>
          </div>
          <Link href="/onboarding" style={{ marginLeft: 'auto', background: '#FFD700', color: '#000', fontSize: 12, fontWeight: 800, padding: '6px 14px', borderRadius: 50, textDecoration: 'none', flexShrink: 0 }}>
            Start →
          </Link>
        </motion.div>
      )}

      {/* Analyzing banner — has handle but brand_score still 0 (scrape in progress or just completed) */}
      {!loading && hasHandle && !hasData && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            style={{ width: 18, height: 18, border: '2px solid #222', borderTopColor: '#FFD700', borderRadius: '50%', flexShrink: 0 }} />
          <p style={{ color: '#555', fontSize: 13, margin: 0 }}>Finalizing your brand analysis…</p>
        </motion.div>
      )}

      {/* Score + Stats */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
        style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 20, padding: '24px 20px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ color: '#444', fontSize: 11, fontWeight: 700, letterSpacing: 1, margin: 0 }}>BRAND SCORE</p>
          {lastUpdated && !loading && (
            <span style={{ color: '#2a2a2a', fontSize: 11 }}>Updated {lastUpdated}</span>
          )}
        </div>

        {loading ? (
          <div style={{ width: 140, height: 140, margin: '0 auto', background: '#111', borderRadius: '50%' }} />
        ) : (
          <ScoreRing score={score} />
        )}

        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 24, paddingTop: 20, borderTop: '1px solid #111' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#FFD700', fontWeight: 900, fontSize: 18, letterSpacing: '-0.5px' }}>
              {loading ? '…' : formatFollowers(profile?.follower_count)}
            </div>
            <div style={{ color: '#333', fontSize: 11, marginTop: 3 }}>Followers</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#FFD700', fontWeight: 900, fontSize: 18, letterSpacing: '-0.5px' }}>
              {loading ? '…' : formatEngagement(profile?.engagement_rate)}
            </div>
            <div style={{ color: '#333', fontSize: 11, marginTop: 3 }}>Engagement</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#FFD700', fontWeight: 900, fontSize: 18, letterSpacing: '-0.5px', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {loading ? '…' : (profile?.niche ? profile.niche.split(' ')[0] : '—')}
            </div>
            <div style={{ color: '#333', fontSize: 11, marginTop: 3 }}>Niche</div>
          </div>
        </div>
      </motion.div>

      {/* Profile handle pill */}
      {profile?.instagram_username && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#333', fontSize: 20 }}>📸</span>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>@{profile.instagram_username}</p>
            <p style={{ color: '#333', fontSize: 12, margin: 0 }}>{profile.niche || 'Niche being detected…'}</p>
          </div>
          {profile.following_count > 0 && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#444', fontSize: 11, margin: '0 0 1px' }}>Following</p>
              <p style={{ color: '#FFD700', fontSize: 13, fontWeight: 700, margin: 0 }}>{formatFollowers(profile.following_count)}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
        <p style={{ color: '#444', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>QUICK ACTIONS</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Link href="/dashboard/today"
            style={{ display: 'block', background: '#0a0a0a', border: '1px solid rgba(255,215,0,0.3)', borderRadius: 16, padding: '18px 16px', textDecoration: 'none' }}>
            <div style={{ fontSize: 26, marginBottom: 10 }}>📅</div>
            <p style={{ color: '#FFD700', fontSize: 14, fontWeight: 800, margin: '0 0 4px' }}>Today's Content</p>
            <p style={{ color: '#555', fontSize: 12, margin: 0 }}>5 ideas ready</p>
          </Link>
          <Link href="/dashboard/strategy"
            style={{ display: 'block', background: '#0a0a0a', border: '1px solid rgba(255,215,0,0.3)', borderRadius: 16, padding: '18px 16px', textDecoration: 'none' }}>
            <div style={{ fontSize: 26, marginBottom: 10 }}>🎯</div>
            <p style={{ color: '#FFD700', fontSize: 14, fontWeight: 800, margin: '0 0 4px' }}>My Strategy</p>
            <p style={{ color: '#555', fontSize: 12, margin: 0 }}>Brand identity</p>
          </Link>
        </div>
      </motion.div>

    </div>
  )
}
