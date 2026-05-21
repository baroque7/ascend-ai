'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface Strategy {
  niche: string
  analysis: string
  strategy: string
  hashtags: string
  postingTimes: string
  profileTips: string
}

function SkeletonBlock({ height = 80 }: { height?: number }) {
  return <div className="skeleton" style={{ height, borderRadius: 10, marginBottom: 12 }} />
}

function Section({ label, icon, content, onCopy, copied }: {
  label: string; icon: string; content: string; onCopy: () => void; copied: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, padding: '16px 18px', marginBottom: 12 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>{icon} {label}</span>
        <button
          onClick={onCopy}
          style={{ background: 'none', border: '1px solid #222', borderRadius: 6, color: copied ? '#FFD700' : '#444', fontSize: 11, padding: '3px 9px', cursor: 'pointer' }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <p style={{ color: '#bbb', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{content}</p>
    </motion.div>
  )
}

export default function StrategyPage() {
  const [username, setUsername] = useState('')
  const [niche, setNiche] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Strategy | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  async function analyze(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!username.trim()) { setError('Please enter your Instagram username'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.replace('@', '').trim(), niche: niche.trim() }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please try again.')
    }
    setLoading(false)
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key); setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '20px 20px 100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
        <Link href="/dashboard" style={{ color: '#FFD700', textDecoration: 'none', fontSize: 22, marginRight: 14 }}>←</Link>
        <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>My US Strategy</h1>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p style={{ color: '#555', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              Enter your handle and our AI will build your complete US growth strategy.
            </p>

            <form onSubmit={analyze}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ color: '#666', fontSize: 12, fontWeight: 700, letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>INSTAGRAM USERNAME</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="@yourhandle"
                  style={{ width: '100%', padding: '14px 16px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12, color: '#fff', fontSize: 16, boxSizing: 'border-box', outline: 'none' }}
                  autoCapitalize="none"
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: '#666', fontSize: 12, fontWeight: 700, letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>CONTENT NICHE <span style={{ color: '#333', fontWeight: 400 }}>(OPTIONAL)</span></label>
                <input
                  type="text"
                  value={niche}
                  onChange={e => setNiche(e.target.value)}
                  placeholder="e.g. fitness, beauty, finance, lifestyle…"
                  style={{ width: '100%', padding: '14px 16px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12, color: '#fff', fontSize: 16, boxSizing: 'border-box', outline: 'none' }}
                />
              </div>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.15)', borderRadius: 10, padding: '12px', marginBottom: 16, textAlign: 'center' }}>
                  <p style={{ color: '#ff6b6b', fontSize: 14, margin: 0 }}>{error}</p>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                style={{ width: '100%', padding: '16px', background: loading ? '#111' : '#FFD700', border: loading ? '1px solid #222' : 'none', borderRadius: 50, color: loading ? '#555' : '#000', fontSize: 17, fontWeight: 800, cursor: loading ? 'default' : 'pointer' }}
              >
                {loading ? 'Building your strategy…' : 'Build My US Strategy 🎯'}
              </motion.button>
            </form>

            {/* Loading skeleton */}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 28 }}>
                <SkeletonBlock height={48} />
                <SkeletonBlock height={96} />
                <SkeletonBlock height={80} />
                <SkeletonBlock height={64} />
              </motion.div>
            )}

            {/* What you'll get */}
            {!loading && (
              <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, padding: '16px 18px', marginTop: 24 }}>
                <p style={{ color: '#FFD700', fontSize: 12, fontWeight: 700, marginBottom: 12, letterSpacing: 0.5 }}>WHAT YOU'LL GET</p>
                {['Your perfect US market niche', 'Content strategy personalized to you', 'Top hashtags for US audiences', 'Best posting times (EST)', 'Profile optimization tips'].map(item => (
                  <p key={item} style={{ color: '#555', fontSize: 13, margin: '0 0 8px', display: 'flex', gap: 8 }}>
                    <span style={{ color: '#FFD700' }}>✓</span> {item}
                  </p>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Niche badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ background: '#FFD700', borderRadius: 14, padding: '18px 20px', marginBottom: 16, textAlign: 'center' }}
            >
              <p style={{ color: 'rgba(0,0,0,0.5)', fontSize: 11, fontWeight: 700, marginBottom: 4, letterSpacing: 1 }}>🎯 YOUR US NICHE</p>
              <p style={{ color: '#000', fontSize: 20, fontWeight: 900, margin: 0 }}>{result.niche}</p>
            </motion.div>

            <Section label="PROFILE ANALYSIS" icon="📊" content={result.analysis} onCopy={() => copy(result.analysis, 'analysis')} copied={copied === 'analysis'} />
            <Section label="US GROWTH STRATEGY" icon="🚀" content={result.strategy} onCopy={() => copy(result.strategy, 'strategy')} copied={copied === 'strategy'} />
            <Section label="TOP HASHTAGS FOR US" icon="#️⃣" content={result.hashtags} onCopy={() => copy(result.hashtags, 'hashtags')} copied={copied === 'hashtags'} />
            <Section label="BEST POSTING TIMES (EST)" icon="⏰" content={result.postingTimes} onCopy={() => copy(result.postingTimes, 'times')} copied={copied === 'times'} />
            <Section label="PROFILE OPTIMIZATION" icon="✨" content={result.profileTips} onCopy={() => copy(result.profileTips, 'profile')} copied={copied === 'profile'} />

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button
                onClick={() => { setResult(null); setUsername(''); setNiche('') }}
                style={{ flex: 1, padding: '14px', background: 'transparent', border: '1px solid #1a1a1a', borderRadius: 50, color: '#555', fontSize: 15, cursor: 'pointer' }}
              >
                Analyze Another
              </button>
              <Link
                href="/dashboard/today"
                style={{ flex: 1, padding: '14px', background: '#FFD700', borderRadius: 50, color: '#000', fontSize: 15, fontWeight: 800, textDecoration: 'none', textAlign: 'center' }}
              >
                Today's Ideas →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
