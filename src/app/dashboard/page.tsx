'use client'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { motion } from 'framer-motion'

const cards = [
  { emoji: '📅', title: "Today's Content", sub: 'Scripts and captions ready to post', href: '/dashboard/today', gold: true },
  { emoji: '📊', title: 'Analyze My Instagram', sub: 'Get your personalized US strategy', href: '/dashboard/analyze', gold: false },
  { emoji: '🎯', title: 'My US Strategy', sub: 'View your growth playbook', href: '/dashboard/strategy', gold: false },
  { emoji: '📈', title: 'Growth Tracking', sub: 'Track your US audience progress', href: '/dashboard/tracking', gold: false },
  { emoji: '⚙️', title: 'Settings', sub: 'Account and subscription', href: '/dashboard/settings', gold: false },
]

export default function Dashboard() {
  const { user } = useAuth()
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '20px 20px 100px' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}
      >
        <span style={{ color: '#FFD700', fontWeight: 900, fontSize: 20, letterSpacing: '-0.5px' }}>GramScaling</span>
        <Link href="/dashboard/settings" style={{ width: 36, height: 36, background: '#111', border: '1px solid #1a1a1a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: 16 }}>
          👤
        </Link>
      </motion.div>

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        style={{ marginBottom: 28 }}
      >
        <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.5px' }}>
          Hey {firstName} 👋
        </h2>
        <p style={{ color: '#444', fontSize: 14, margin: 0 }}>Let's grow your US Instagram audience today.</p>
      </motion.div>

      {/* Cards */}
      {cards.map((card, i) => (
        <motion.div
          key={card.href}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 + i * 0.07 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href={card.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: card.gold ? '#FFD700' : '#0a0a0a',
              border: card.gold ? 'none' : '1px solid #1a1a1a',
              borderRadius: 14,
              padding: '16px 18px',
              textDecoration: 'none',
              marginBottom: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44, height: 44,
                background: card.gold ? 'rgba(0,0,0,0.12)' : '#111',
                borderRadius: 11,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}>
                {card.emoji}
              </div>
              <div>
                <h3 style={{ color: card.gold ? '#000' : '#fff', fontSize: 15, fontWeight: 700, margin: '0 0 3px' }}>{card.title}</h3>
                <p style={{ color: card.gold ? 'rgba(0,0,0,0.55)' : '#444', fontSize: 12, margin: 0 }}>{card.sub}</p>
              </div>
            </div>
            <span style={{ color: card.gold ? 'rgba(0,0,0,0.4)' : '#FFD700', fontSize: 20, fontWeight: 300 }}>›</span>
          </Link>
        </motion.div>
      ))}

      {/* Quick stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ display: 'flex', gap: 10, marginTop: 8 }}
      >
        {[['🇺🇸', 'US Focused'], ['🤖', 'AI-Powered'], ['📅', 'Daily Updates']].map(([icon, label]) => (
          <div key={label} style={{ flex: 1, background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
            <div style={{ color: '#444', fontSize: 11 }}>{label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
