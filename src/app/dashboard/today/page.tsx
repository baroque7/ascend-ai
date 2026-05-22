'use client'
import { useState, useEffect } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { motion, AnimatePresence } from 'framer-motion'

interface Idea {
  Title: string
  Script: string
  Caption: string
  Hashtags: string
  PostingTime: string
}

const THUMBNAIL_GRADIENTS = [
  'linear-gradient(135deg, #1a1a00 0%, #3a2800 100%)',
  'linear-gradient(135deg, #001a10 0%, #002a18 100%)',
  'linear-gradient(135deg, #1a0010 0%, #2a0018 100%)',
  'linear-gradient(135deg, #00101a 0%, #001828 100%)',
  'linear-gradient(135deg, #1a0a00 0%, #2a1500 100%)',
]

const THUMBNAIL_ICONS = ['🎬', '🔥', '💡', '⚡', '🚀']

function SkeletonCard() {
  return (
    <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 18, padding: 18, marginBottom: 14 }}>
      <div className="skeleton" style={{ height: 160, borderRadius: 12, marginBottom: 14 }} />
      <div className="skeleton" style={{ height: 16, width: '70%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 12, width: '90%', marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 12, width: '60%' }} />
    </div>
  )
}

export default function TodayPage() {
  const { profile, loading: profileLoading } = useProfile()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState<number | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  async function load() {
    setLoading(true)
    setError('')
    setExpanded(null)
    try {
      const niche = profile?.niche || ''
      const language = profile?.language || 'English'
      const params = new URLSearchParams()
      if (niche) params.set('niche', niche)
      if (language) params.set('language', language)
      const res = await fetch(`/api/generate?${params}`)
      const data = await res.json()
      if (!Array.isArray(data)) throw new Error('Bad response')
      setIdeas(data)
    } catch {
      setError('Could not load ideas. Tap refresh.')
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!profileLoading) load()
  }, [profileLoading, profile?.niche, profile?.language]) // eslint-disable-line react-hooks/exhaustive-deps

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const isLoading = profileLoading || loading

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '24px 20px 100px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <p style={{ color: '#333', fontSize: 12, margin: '0 0 4px' }}>{today}</p>
          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
            Today's Content
            {!isLoading && ideas.length > 0 && (
              <motion.span key={ideas.length} initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ background: '#FFD700', color: '#000', fontWeight: 900, fontSize: 11, padding: '2px 7px', borderRadius: 50, marginLeft: 8 }}>
                {ideas.length}
              </motion.span>
            )}
          </h1>
        </div>
        <motion.button onClick={load} disabled={isLoading} whileTap={{ scale: 0.9 }}
          style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: 10, padding: '8px 14px', color: isLoading ? '#333' : '#FFD700', fontSize: 13, fontWeight: 700, cursor: isLoading ? 'default' : 'pointer' }}>
          {isLoading ? '…' : '↻ Refresh'}
        </motion.button>
      </div>

      {profile?.niche && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: '#333', fontSize: 12, marginBottom: 24, marginTop: 4 }}>
          Niche: <span style={{ color: '#FFD700' }}>{profile.niche}</span>
        </motion.p>
      )}
      {!profile?.niche && !isLoading && <div style={{ marginBottom: 24 }} />}

      {error && (
        <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.15)', borderRadius: 12, padding: 14, marginBottom: 20, textAlign: 'center' }}>
          <p style={{ color: '#ff6b6b', fontSize: 14, margin: 0 }}>{error}</p>
        </div>
      )}

      {isLoading && [0, 1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}

      <AnimatePresence>
        {!isLoading && ideas.map((idea, i) => {
          const isOpen = expanded === i
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              style={{ background: '#0a0a0a', border: `1px solid ${isOpen ? 'rgba(255,215,0,0.2)' : '#1a1a1a'}`, borderRadius: 18, marginBottom: 14, overflow: 'hidden' }}>

              <button onClick={() => setExpanded(isOpen ? null : i)} style={{ width: '100%', border: 'none', background: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ background: THUMBNAIL_GRADIENTS[i % 5], height: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: 16 }}>
                  <div style={{ fontSize: 42, marginBottom: 12 }}>{THUMBNAIL_ICONS[i % 5]}</div>
                  <p style={{ color: '#fff', fontSize: 15, fontWeight: 800, textAlign: 'center', margin: 0, lineHeight: 1.3, letterSpacing: '-0.3px', maxWidth: '85%' }}>{idea.Title}</p>
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: 6, padding: '3px 8px' }}>
                    <span style={{ color: '#FFD700', fontSize: 11, fontWeight: 700 }}>#{i + 1}</span>
                  </div>
                  <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 12 }}>⏰</span>
                    <span style={{ color: '#888', fontSize: 11, fontWeight: 600 }}>{idea.PostingTime}</span>
                  </div>
                </div>

                <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ color: '#555', fontSize: 12, margin: 0, flex: 1, paddingRight: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{idea.Caption}</p>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} style={{ color: '#333', fontSize: 18, flexShrink: 0 }}>↓</motion.span>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
                    <div style={{ borderTop: '1px solid #1a1a1a', padding: '20px 18px' }}>

                      <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <span style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>📹 SCRIPT</span>
                          <button onClick={() => copy(idea.Script, `s${i}`)}
                            style={{ background: 'none', border: '1px solid #222', borderRadius: 6, color: copied === `s${i}` ? '#FFD700' : '#444', fontSize: 11, padding: '3px 9px', cursor: 'pointer' }}>
                            {copied === `s${i}` ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                        <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{idea.Script}</p>
                      </div>

                      <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <span style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>✏️ CAPTION</span>
                          <button onClick={() => copy(idea.Caption, `c${i}`)}
                            style={{ background: 'none', border: '1px solid #222', borderRadius: 6, color: copied === `c${i}` ? '#FFD700' : '#444', fontSize: 11, padding: '3px 9px', cursor: 'pointer' }}>
                            {copied === `c${i}` ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                        <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{idea.Caption}</p>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <span style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>#️⃣ HASHTAGS</span>
                          <button onClick={() => copy(idea.Hashtags, `h${i}`)}
                            style={{ background: 'none', border: '1px solid #222', borderRadius: 6, color: copied === `h${i}` ? '#FFD700' : '#444', fontSize: 11, padding: '3px 9px', cursor: 'pointer' }}>
                            {copied === `h${i}` ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                        <p style={{ color: '#666', fontSize: 13, lineHeight: 1.8, margin: 0 }}>{idea.Hashtags}</p>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
