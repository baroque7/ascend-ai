'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

interface StrategyData {
  brandIdentity: string
  uniqueDifferentiator: string
  usGrowthPlan: string
  formatFatigueWarning: string
  profileTips: string
  filmingTips: string
  contentPillars?: string[]
  voiceAndTone?: string
  estimatedTimeToResults?: string
}

function SkeletonBlock({ height = 80 }: { height?: number }) {
  return <div className="skeleton" style={{ height, borderRadius: 12, marginBottom: 12 }} />
}

function Section({ icon, label, content, accentColor = '#FFD700' }: {
  icon: string; label: string; content: string; accentColor?: string
}) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, padding: '18px', marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ color: accentColor, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>{icon} {label}</span>
        <button onClick={copy}
          style={{ background: 'none', border: '1px solid #222', borderRadius: 6, color: copied ? '#FFD700' : '#444', fontSize: 11, padding: '3px 9px', cursor: 'pointer' }}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.75, margin: 0 }}>{content}</p>
    </motion.div>
  )
}

function WarningSection({ content }: { content: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: 'rgba(255,100,0,0.05)', border: '1px solid rgba(255,100,0,0.2)', borderRadius: 16, padding: '18px', marginBottom: 12 }}>
      <p style={{ color: '#ff8c42', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>⚠️ FORMAT FATIGUE WARNING</p>
      <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.75, margin: 0 }}>{content}</p>
    </motion.div>
  )
}

export default function StrategyPage() {
  const { user } = useAuth()
  const [username, setUsername] = useState(user?.user_metadata?.instagram_handle || '')
  const [niche] = useState(user?.user_metadata?.niche || '')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<StrategyData | null>(null)
  const [error, setError] = useState('')

  async function build(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!username.trim()) { setError('Enter your Instagram username'); return }
    setLoading(true); setError(''); setData(null)
    try {
      const res = await fetch('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.replace('@', '').trim(),
          niche,
          language: user?.user_metadata?.language || 'English',
        }),
      })
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error || 'Strategy failed')
      setData(json)
    } catch (err: any) {
      setError(err.message || 'Could not build strategy. Try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '24px 20px 100px' }}>

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 900, margin: '0 0 6px', letterSpacing: '-0.5px' }}>My US Strategy</h1>
        <p style={{ color: '#333', fontSize: 14, margin: '0 0 28px' }}>Your unique brand identity and growth playbook.</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!data ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <form onSubmit={build}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ color: '#444', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, display: 'block', marginBottom: 8 }}>
                  INSTAGRAM USERNAME
                </label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="@yourhandle" autoCapitalize="none"
                  style={{ width: '100%', padding: '15px 16px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12, color: '#fff', fontSize: 16, boxSizing: 'border-box', outline: 'none' }} />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.15)', borderRadius: 10, padding: 12, marginBottom: 14, textAlign: 'center' }}>
                    <p style={{ color: '#ff6b6b', fontSize: 13, margin: 0 }}>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
                style={{ width: '100%', padding: '16px', background: loading ? '#111' : '#FFD700', border: loading ? '1px solid #1a1a1a' : 'none', borderRadius: 50, color: loading ? '#444' : '#000', fontSize: 17, fontWeight: 900, cursor: loading ? 'default' : 'pointer', marginBottom: loading ? 28 : 0 }}>
                {loading ? 'Building your brand strategy…' : 'Build My Brand Strategy →'}
              </motion.button>
            </form>

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <SkeletonBlock height={60} />
                <SkeletonBlock height={96} />
                <SkeletonBlock height={80} />
                <SkeletonBlock height={80} />
                <SkeletonBlock height={72} />
              </motion.div>
            )}

            {!loading && (
              <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, padding: '18px', marginTop: 24 }}>
                <p style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>WHAT YOU'LL GET</p>
                {['Your unique brand identity', 'What makes you different from everyone else', 'A concrete 30-day US growth plan', 'Format fatigue warnings — what NOT to do', 'Profile optimization tips', 'Filming environment tips'].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                    <span style={{ color: '#FFD700', fontSize: 12, flexShrink: 0 }}>✓</span>
                    <span style={{ color: '#555', fontSize: 13 }}>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* Brand identity card */}
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              style={{ background: '#FFD700', borderRadius: 18, padding: '22px 20px', marginBottom: 16 }}>
              <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>🧠 YOUR BRAND IDENTITY</p>
              <p style={{ color: '#000', fontSize: 15, lineHeight: 1.65, margin: 0, fontWeight: 600 }}>{data.brandIdentity}</p>
            </motion.div>

            {/* Content pillars */}
            {data.contentPillars && data.contentPillars.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                {data.contentPillars.map(p => (
                  <span key={p} style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 50, padding: '5px 12px', color: '#FFD700', fontSize: 12, fontWeight: 600 }}>
                    {p}
                  </span>
                ))}
              </motion.div>
            )}

            <Section icon="⚡" label="WHAT MAKES YOU DIFFERENT" content={data.uniqueDifferentiator} />
            {data.voiceAndTone && <Section icon="🎙️" label="YOUR VOICE & TONE" content={data.voiceAndTone} />}
            <Section icon="🚀" label="US GROWTH PLAN (30 DAYS)" content={data.usGrowthPlan} />
            <WarningSection content={data.formatFatigueWarning} />
            <Section icon="✨" label="PROFILE OPTIMIZATION" content={data.profileTips} />
            <Section icon="🎥" label="FILMING ENVIRONMENT TIPS" content={data.filmingTips} />
            {data.estimatedTimeToResults && <Section icon="📅" label="REALISTIC TIMELINE" content={data.estimatedTimeToResults} />}

            <motion.button onClick={() => setData(null)} whileTap={{ scale: 0.98 }}
              style={{ width: '100%', padding: '14px', background: 'transparent', border: '1px solid #1a1a1a', borderRadius: 50, color: '#444', fontSize: 15, cursor: 'pointer', marginTop: 8 }}>
              Build for Another Account
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
