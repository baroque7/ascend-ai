'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface AnalysisResult {
  niche: string
  analysis: string
  strategy: string
  hashtags: string
  postingTimes: string
  profileTips: string
}

function SkeletonBlock({ height = 72 }: { height?: number }) {
  return <div className="skeleton" style={{ height, borderRadius: 10, marginBottom: 12 }} />
}

export default function Analyze() {
  const [username, setUsername] = useState('')
  const [niche, setNiche] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  async function handleAnalyze(e: React.SyntheticEvent) {
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

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
        <Link href="/dashboard" style={{ color: '#FFD700', textDecoration: 'none', fontSize: 22, marginRight: 14 }}>←</Link>
        <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: '-0.3px' }}>Analyze My Instagram</h1>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p style={{ color: '#555', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              Enter your handle and AI will analyze your profile for the US market.
            </p>

            <form onSubmit={handleAnalyze}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ color: '#555', fontSize: 12, fontWeight: 700, letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>INSTAGRAM USERNAME</label>
                <input
                  type="text" value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="@yourhandle"
                  style={{ width: '100%', padding: '14px 16px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12, color: '#fff', fontSize: 16, boxSizing: 'border-box', outline: 'none' }}
                  autoCapitalize="none"
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: '#555', fontSize: 12, fontWeight: 700, letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>
                  NICHE <span style={{ color: '#2a2a2a', fontWeight: 400 }}>(OPTIONAL — AI WILL DETECT)</span>
                </label>
                <input
                  type="text" value={niche}
                  onChange={e => setNiche(e.target.value)}
                  placeholder="e.g. fitness, beauty, finance…"
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
                style={{ width: '100%', padding: '16px', background: loading ? '#111' : '#FFD700', border: loading ? '1px solid #1a1a1a' : 'none', borderRadius: 50, color: loading ? '#444' : '#000', fontSize: 17, fontWeight: 800, cursor: loading ? 'default' : 'pointer' }}
              >
                {loading ? 'Analyzing your profile…' : 'Analyze My Instagram 🔍'}
              </motion.button>
            </form>

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 28 }}>
                <SkeletonBlock height={52} />
                <SkeletonBlock height={88} />
                <SkeletonBlock height={72} />
                <SkeletonBlock height={60} />
              </motion.div>
            )}

            {!loading && (
              <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, padding: '16px 18px', marginTop: 24 }}>
                <p style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>WHAT YOU'LL GET</p>
                {['Your perfect US market niche', 'Personalized content strategy', 'Best hashtags for US reach', 'Optimal posting times (EST)', 'Profile optimization tips'].map(item => (
                  <p key={item} style={{ color: '#444', fontSize: 13, margin: '0 0 7px', display: 'flex', gap: 8 }}>
                    <span style={{ color: '#FFD700' }}>✓</span> {item}
                  </p>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Niche */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ background: '#FFD700', borderRadius: 14, padding: '18px 20px', marginBottom: 12, textAlign: 'center' }}
            >
              <p style={{ color: 'rgba(0,0,0,0.45)', fontSize: 11, fontWeight: 700, marginBottom: 4, letterSpacing: 1 }}>🎯 YOUR US NICHE</p>
              <p style={{ color: '#000', fontSize: 20, fontWeight: 900, margin: 0 }}>{result.niche}</p>
            </motion.div>

            {[
              { label: 'PROFILE ANALYSIS', icon: '📊', key: 'analysis', content: result.analysis },
              { label: 'US GROWTH STRATEGY', icon: '🚀', key: 'strategy', content: result.strategy },
              { label: 'TOP HASHTAGS FOR US', icon: '#️⃣', key: 'hashtags', content: result.hashtags },
              { label: 'BEST POSTING TIMES (EST)', icon: '⏰', key: 'times', content: result.postingTimes },
              { label: 'PROFILE OPTIMIZATION', icon: '✨', key: 'profile', content: result.profileTips },
            ].map(({ label, icon, key, content }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, padding: '16px 18px', marginBottom: 12 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>{icon} {label}</span>
                  <button
                    onClick={() => copy(content, key)}
                    style={{ background: 'none', border: '1px solid #222', borderRadius: 6, color: copied === key ? '#FFD700' : '#444', fontSize: 11, padding: '3px 9px', cursor: 'pointer' }}
                  >
                    {copied === key ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <p style={{ color: '#bbb', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{content}</p>
              </motion.div>
            ))}

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button
                onClick={() => { setResult(null); setUsername(''); setNiche('') }}
                style={{ flex: 1, padding: '14px', background: 'transparent', border: '1px solid #1a1a1a', borderRadius: 50, color: '#555', fontSize: 14, cursor: 'pointer' }}
              >
                Analyze Another
              </button>
              <Link
                href="/dashboard/today"
                style={{ flex: 1, padding: '14px', background: '#FFD700', borderRadius: 50, color: '#000', fontSize: 14, fontWeight: 800, textDecoration: 'none', textAlign: 'center' }}
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
