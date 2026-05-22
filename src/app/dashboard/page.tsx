'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from 'recharts'

const GROWTH_DATA = [
  { day: 'Mon', followers: 1200 },
  { day: 'Tue', followers: 1340 },
  { day: 'Wed', followers: 1290 },
  { day: 'Thu', followers: 1520 },
  { day: 'Fri', followers: 1680 },
  { day: 'Sat', followers: 1850 },
  { day: 'Sun', followers: 2100 },
]

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
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'
  const score = 74
  const tip = TIPS[new Date().getDay() % TIPS.length]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

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

      {/* Score + Stats row */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
        style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 20, padding: '24px 20px', marginBottom: 16 }}>
        <p style={{ color: '#444', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 20, textAlign: 'center' }}>BRAND SCORE</p>
        <ScoreRing score={score} />
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 24, paddingTop: 20, borderTop: '1px solid #111' }}>
          {[
            { label: 'US Reach', value: '+12%' },
            { label: 'Engagement', value: '4.2%' },
            { label: 'Streak', value: '7 days' },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ color: '#FFD700', fontWeight: 900, fontSize: 18, letterSpacing: '-0.5px' }}>{value}</div>
              <div style={{ color: '#333', fontSize: 11, marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Growth chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
        style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 20, padding: '20px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>Follower Growth</p>
          <span style={{ color: '#FFD700', fontSize: 12, fontWeight: 700 }}>+750 this week</span>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={GROWTH_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="day" tick={{ fill: '#333', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#FFD700' }}
              itemStyle={{ color: '#fff' }}
              formatter={(v) => [Number(v).toLocaleString(), 'Followers']}
            />
            <Line type="monotone" dataKey="followers" stroke="#FFD700" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#FFD700', stroke: '#000', strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

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
