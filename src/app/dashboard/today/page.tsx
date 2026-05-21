'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'

interface Idea {
  Title: string
  Script: string
  Caption: string
  Hashtags: string
}

function SkeletonCard() {
  return (
    <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, padding: 20, marginBottom: 12 }}>
      <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 12, width: '100%', marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 12, width: '85%', marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 12, width: '70%', marginBottom: 16 }} />
      <div className="skeleton" style={{ height: 12, width: '50%' }} />
    </div>
  )
}

function CounterBadge({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ scale: 1.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{ background: '#FFD700', color: '#000', fontWeight: 900, fontSize: 11, padding: '2px 7px', borderRadius: 50, marginLeft: 6 }}
    >
      {value}
    </motion.span>
  )
}

export default function TodayPage() {
  const { user } = useAuth()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState<number | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  async function fetchIdeas() {
    setLoading(true); setError(''); setExpanded(null)
    try {
      const res = await fetch('/api/generate')
      const data = await res.json()
      if (!Array.isArray(data)) throw new Error('Invalid response')
      setIdeas(data)
    } catch {
      setError('Failed to load ideas. Tap refresh to try again.')
    }
    setLoading(false)
  }

  useEffect(() => { fetchIdeas() }, [])

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there'

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '20px 20px 100px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <p style={{ color: '#444', fontSize: 13, marginBottom: 4 }}>{today}</p>
          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
            Today's Ideas
            {!loading && <CounterBadge value={ideas.length} />}
          </h1>
        </div>
        <motion.button
          onClick={fetchIdeas}
          disabled={loading}
          whileTap={{ scale: 0.9 }}
          style={{ background: loading ? '#111' : 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: 10, padding: '8px 14px', color: loading ? '#333' : '#FFD700', fontSize: 13, fontWeight: 700, cursor: loading ? 'default' : 'pointer' }}
        >
          {loading ? '...' : '↻ Refresh'}
        </motion.button>
      </div>

      {/* Daily tip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.1)', borderRadius: 12, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 10, alignItems: 'center' }}
      >
        <span style={{ fontSize: 20 }}>💡</span>
        <p style={{ color: '#888', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
          <span style={{ color: '#FFD700', fontWeight: 700 }}>Pro tip:</span> Post between 6–9 PM EST for maximum US reach.
        </p>
      </motion.div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.15)', borderRadius: 12, padding: '14px 16px', marginBottom: 20, textAlign: 'center' }}>
          <p style={{ color: '#ff6b6b', fontSize: 14, margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div>
          {[0, 1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Ideas */}
      <AnimatePresence>
        {!loading && ideas.map((idea, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{ background: '#0a0a0a', border: `1px solid ${expanded === i ? 'rgba(255,215,0,0.2)' : '#1a1a1a'}`, borderRadius: 14, marginBottom: 12, overflow: 'hidden', cursor: 'pointer' }}
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <div style={{ padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1, paddingRight: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ background: 'rgba(255,215,0,0.1)', color: '#FFD700', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>IDEA {i + 1}</span>
                </div>
                <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{idea.Title}</h3>
              </div>
              <motion.span
                animate={{ rotate: expanded === i ? 180 : 0 }}
                style={{ color: '#333', fontSize: 18, flexShrink: 0 }}
              >
                ↓
              </motion.span>
            </div>

            <AnimatePresence>
              {expanded === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ padding: '0 18px 18px', borderTop: '1px solid #1a1a1a', paddingTop: 16 }}>
                    {/* Script */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>📹 SCRIPT</span>
                        <button
                          onClick={e => { e.stopPropagation(); copyText(idea.Script, `script-${i}`) }}
                          style={{ background: 'none', border: '1px solid #222', borderRadius: 6, color: copied === `script-${i}` ? '#FFD700' : '#444', fontSize: 11, padding: '3px 8px', cursor: 'pointer' }}
                        >
                          {copied === `script-${i}` ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                      <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.65, margin: 0 }}>{idea.Script}</p>
                    </div>

                    {/* Caption */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>✏️ CAPTION</span>
                        <button
                          onClick={e => { e.stopPropagation(); copyText(idea.Caption, `caption-${i}`) }}
                          style={{ background: 'none', border: '1px solid #222', borderRadius: 6, color: copied === `caption-${i}` ? '#FFD700' : '#444', fontSize: 11, padding: '3px 8px', cursor: 'pointer' }}
                        >
                          {copied === `caption-${i}` ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                      <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{idea.Caption}</p>
                    </div>

                    {/* Hashtags */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>#️⃣ HASHTAGS</span>
                        <button
                          onClick={e => { e.stopPropagation(); copyText(idea.Hashtags, `tags-${i}`) }}
                          style={{ background: 'none', border: '1px solid #222', borderRadius: 6, color: copied === `tags-${i}` ? '#FFD700' : '#444', fontSize: 11, padding: '3px 8px', cursor: 'pointer' }}
                        >
                          {copied === `tags-${i}` ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                      <p style={{ color: '#666', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{idea.Hashtags}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Bottom CTA */}
      {!loading && ideas.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: 8 }}
        >
          <Link
            href="/dashboard/analyze"
            style={{ display: 'block', background: '#FFD700', color: '#000', padding: '16px', borderRadius: 50, textAlign: 'center', textDecoration: 'none', fontWeight: 800, fontSize: 16 }}
          >
            Analyze My Instagram for Better Ideas →
          </Link>
        </motion.div>
      )}
    </div>
  )
}
