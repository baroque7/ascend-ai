'use client'
import { useState, useEffect, useRef } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

interface Idea {
  title: string
  trendingTopic: string
  script: string
  caption: string
  hashtags: string
  postingTime: string
  contentFormat: string
  whyThisWorks: string
}

function SkeletonCard() {
  return (
    <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, padding: '20px 18px', marginBottom: 12 }}>
      <div className="skeleton" style={{ height: 18, width: '55%', borderRadius: 8, marginBottom: 16 }} />
      <div className="skeleton" style={{ height: 13, width: '100%', borderRadius: 6, marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 13, width: '85%', borderRadius: 6, marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 13, width: '70%', borderRadius: 6 }} />
    </div>
  )
}

export default function TodayPage() {
  const { user, supabase } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState<number | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const hasTriggered = useRef(false)

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const todayDate = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!profileLoading && user && profile && !hasTriggered.current) {
      hasTriggered.current = true
      load()
    }
  }, [profileLoading, user?.id, profile?.instagram_username]) // eslint-disable-line react-hooks/exhaustive-deps

  async function load(forceRefresh = false) {
    if (!user) return
    setLoading(true)
    setError('')
    setExpanded(null)

    try {
      // Check cache first
      if (!forceRefresh) {
        const { data: cached } = await supabase
          .from('content')
          .select('ideas, created_at')
          .eq('user_id', user.id)
          .eq('date', todayDate)
          .single()

        if (cached?.ideas && Array.isArray(cached.ideas) && cached.ideas.length > 0) {
          setIdeas(cached.ideas as Idea[])
          setLoading(false)
          return
        }
      }

      if (!profile) {
        setLoading(false)
        return
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: profile,
          language: profile?.language || 'English',
        }),
      })

      const data = await res.json()

      // Handle rate limit explicitly
      if (res.status === 429) {
        setError('AI is busy right now. Wait a moment and tap to retry.')
        setLoading(false)
        return
      }

      if (!res.ok || data.error) {
        setError('Could not load ideas. Tap to retry.')
        setLoading(false)
        return
      }

      if (!Array.isArray(data)) throw new Error('Bad response')
      setIdeas(data)

      const { error: upsertError } = await supabase.from('content').upsert({
        user_id: user.id,
        date: todayDate,
        ideas: data,
      }, { onConflict: 'user_id,date' })

      if (upsertError) console.error('UPSERT ERROR:', upsertError)

    } catch {
      setError('Could not load ideas. Tap to retry.')
    }

    setLoading(false)
  }

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
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: '#333', fontSize: 12, margin: '0 0 4px' }}>{today}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
            Today's Content
          </h1>
          {!isLoading && ideas.length > 0 && (
            <motion.span key={ideas.length} initial={{ scale: 1.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              style={{ background: '#FFD700', color: '#000', fontWeight: 900, fontSize: 11, padding: '2px 8px', borderRadius: 50 }}>
              {ideas.length}
            </motion.span>
          )}
        </div>
        {profile?.niche && !isLoading && (
          <p style={{ color: '#333', fontSize: 12, margin: '6px 0 0' }}>
            Niche: <span style={{ color: '#FFD700' }}>{profile.niche}</span>
          </p>
        )}
      </div>

      {error && (
        <button onClick={() => { hasTriggered.current = false; load() }}
          style={{ width: '100%', background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.15)', borderRadius: 12, padding: 14, marginBottom: 20, textAlign: 'center', cursor: 'pointer' }}>
          <p style={{ color: '#ff6b6b', fontSize: 14, margin: 0 }}>{error}</p>
        </button>
      )}

      {isLoading && [0, 1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}

      <AnimatePresence>
        {!isLoading && ideas.map((idea, i) => {
          const isOpen = expanded === i
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              style={{ background: '#0a0a0a', border: `1px solid ${isOpen ? 'rgba(255,215,0,0.25)' : '#1a1a1a'}`, borderRadius: 16, marginBottom: 12, overflow: 'hidden' }}>

              {/* Card header */}
              <button onClick={() => setExpanded(isOpen ? null : i)}
                style={{ width: '100%', border: 'none', background: 'none', padding: '18px 18px 14px', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 50, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFD700', fontSize: 11, fontWeight: 900, flexShrink: 0 }}>{i + 1}</span>
                      <p style={{ color: '#FFD700', fontSize: 15, fontWeight: 800, margin: 0, lineHeight: 1.3 }}>{idea.title}</p>
                    </div>
                    {!isOpen && (
                      <p style={{ color: '#444', fontSize: 13, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: 30 }}>{idea.caption}</p>
                    )}
                  </div>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} style={{ color: '#333', fontSize: 18, flexShrink: 0, marginTop: 2 }}>↓</motion.span>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} style={{ overflow: 'hidden' }}>
                    <div style={{ borderTop: '1px solid #1a1a1a', padding: '18px 18px 20px' }}>

                      {/* Script */}
                      <div style={{ marginBottom: 18 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <span style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, letterSpacing: 0.8 }}>📹 SCRIPT</span>
                          <button onClick={() => copy(idea.script, `s${i}`)}
                            style={{ background: copied === `s${i}` ? 'rgba(255,215,0,0.1)' : 'none', border: `1px solid ${copied === `s${i}` ? 'rgba(255,215,0,0.3)' : '#222'}`, borderRadius: 6, color: copied === `s${i}` ? '#FFD700' : '#444', fontSize: 11, padding: '4px 10px', cursor: 'pointer' }}>
                            {copied === `s${i}` ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                        <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.75, margin: 0, whiteSpace: 'pre-wrap' }}>{idea.script}</p>
                      </div>

                      {/* Caption */}
                      <div style={{ marginBottom: 18 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <span style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, letterSpacing: 0.8 }}>✏️ CAPTION</span>
                          <button onClick={() => copy(idea.caption, `c${i}`)}
                            style={{ background: copied === `c${i}` ? 'rgba(255,215,0,0.1)' : 'none', border: `1px solid ${copied === `c${i}` ? 'rgba(255,215,0,0.3)' : '#222'}`, borderRadius: 6, color: copied === `c${i}` ? '#FFD700' : '#444', fontSize: 11, padding: '4px 10px', cursor: 'pointer' }}>
                            {copied === `c${i}` ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                        <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{idea.caption}</p>
                      </div>

                      {/* Hashtags */}
                      <div style={{ marginBottom: 18 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <span style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, letterSpacing: 0.8 }}>#️⃣ HASHTAGS</span>
                          <button onClick={() => copy(idea.hashtags, `h${i}`)}
                            style={{ background: copied === `h${i}` ? 'rgba(255,215,0,0.1)' : 'none', border: `1px solid ${copied === `h${i}` ? 'rgba(255,215,0,0.3)' : '#222'}`, borderRadius: 6, color: copied === `h${i}` ? '#FFD700' : '#444', fontSize: 11, padding: '4px 10px', cursor: 'pointer' }}>
                            {copied === `h${i}` ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                        <p style={{ color: '#555', fontSize: 13, lineHeight: 1.8, margin: 0 }}>{idea.hashtags}</p>
                      </div>

                      {/* Posting time */}
                      <div style={{ background: '#111', borderRadius: 10, padding: '10px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14 }}>⏰</span>
                        <div>
                          <span style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, letterSpacing: 0.8 }}>BEST TIME TO POST  </span>
                          <span style={{ color: '#888', fontSize: 13 }}>{idea.postingTime}</span>
                        </div>
                      </div>

                      {/* Why this works */}
                      {idea.whyThisWorks && (
                        <div style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.1)', borderRadius: 10, padding: '12px 14px' }}>
                          <p style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, margin: '0 0 6px' }}>💡 WHY THIS WORKS</p>
                          <p style={{ color: '#888', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{idea.whyThisWorks}</p>
                        </div>
                      )}

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