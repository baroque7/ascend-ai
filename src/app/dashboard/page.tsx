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

export default function Home() {
  const { user } = useAuth()
  const { profile, loading } = useProfile()

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'
  const score = profile?.brand_score || 0
  const tip = TIPS[new Date().getDay() % TIPS.length]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const engagementRate = profile?.engagement_rate
    ? `${Number(profile.engagement_rate).toFixed(1)}%`
    : '—'
  const followerCount = profile?.follower_count
    ? profile.follower_count > 999
      ? `${(profile.follower_count / 1000).toFixed(1)}k`
      : profile.follower_count.toString()
    : '—'

  const lastUpdated = profile?.last_scraped_at
    ? new Date(profile.last_scraped_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '24px 20px 100px' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <span style={{ color: '#FFD700', fontWeight: 900, fontSize: 18, letterSpacing: '-0.5px' }}>GramScaling</span>
        <Link href="/dashboard/settings"
          style={{ width: 36, height: 36, background: '#111', border: '1px solid #1a1a1a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#fff', fontSize: 15 }}>
          {(user?.user_metadata?.full_name?.[0] || '?').toUpperCase()}
        </Link>
      </motion.div>

      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
        style={{ marginBottom: 28 }}>
        <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
          {greeting}, {firstName} 👋
        </h2>
        <p style={{ color: '#333', fontSize: 14, margin: 0, lineHeight: 1.5 }}>{tip}</p>
      </motion.div>

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
          {[
            { label: 'Followers', value: followerCount },
            { label: 'Engagement', value: engagementRate },
            { label: 'Niche', value: profile?.niche ? profile.niche.split(' ')[0] : '—' },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ color: '#FFD700', fontWeight: 900, fontSize: 18, letterSpacing: '-0.5px' }}>{value}</div>
              <div style={{ color: '#333', fontSize: 11, marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Profile handle */}
      {profile?.instagram_username && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#333', fontSize: 20 }}>📸</span>
          <div>
            <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>@{profile.instagram_username}</p>
            <p style={{ color: '#333', fontSize: 12, margin: 0 }}>{profile.niche || 'No niche set'}</p>
          </div>
        </motion.div>
      )}

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
        <p style={{ color: '#333', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>QUICK ACTIONS</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { href: '/dashboard/today', icon: '📅', label: "Today's Content", sub: '5 ideas ready' },
            { href: '/dashboard/strategy', icon: '🎯', label: 'My Strategy', sub: 'Brand identity' },
          ].map(card => (
            <Link key={card.href} href={card.href}
              style={{ display: 'block', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, padding: '18px 16px', textDecoration: 'none' }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{card.icon}</div>
              <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '0 0 3px' }}>{card.label}</p>
              <p style={{ color: '#333', fontSize: 12, margin: 0 }}>{card.sub}</p>
            </Link>
          ))}
        </div>
      </motion.div>

    </div>
  )
}
