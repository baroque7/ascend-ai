'use client'
import { useState, useEffect } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

interface ContentPillar {
  pillar: string
  description: string
  percentage: string
}

interface StrategyData {
  brandStatement: string
  uniqueAngle: string
  brandVoice: string
  visualIdentity: string
  contentPillars: ContentPillar[]
  audienceShiftPlan: string
  formatFatigueAlert: string
  top5ContentVariations: string[]
  profileOptimization: {
    bioRewrite: string
    profilePictureTip: string
    highlightStrategy: string
  }
  filmingEnvironment: {
    mustRemove: string[]
    mustAdd: string[]
    outfitRecommendations: string[]
    lightingSetup: string
  }
  weeklySchedule: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  '30dayMilestones': string[]
  warningSignals: string[]
}

function SkeletonBlock({ height = 80 }: { height?: number }) {
  return <div className="skeleton" style={{ height, borderRadius: 12, marginBottom: 12 }} />
}

function Section({ icon, label, content, accent = '#FFD700' }: { icon: string; label: string; content: string; accent?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, padding: '18px', marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ color: accent, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>{icon} {label}</span>
        <button onClick={() => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
          style={{ background: 'none', border: '1px solid #222', borderRadius: 6, color: copied ? '#FFD700' : '#444', fontSize: 11, padding: '3px 9px', cursor: 'pointer' }}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.75, margin: 0 }}>{content}</p>
    </motion.div>
  )
}

function ListSection({ icon, label, items, accent = '#FFD700' }: { icon: string; label: string; items: string[]; accent?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, padding: '18px', marginBottom: 12 }}>
      <p style={{ color: accent, fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>{icon} {label}</p>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < items.length - 1 ? 10 : 0 }}>
          <span style={{ color: accent, fontSize: 13, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}.</span>
          <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{item}</p>
        </div>
      ))}
    </motion.div>
  )
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function StrategyPage() {
  const { user, supabase } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const [data, setData] = useState<StrategyData | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [cachedAt, setCachedAt] = useState<string | null>(null)

  useEffect(() => {
    if (!profileLoading && user) loadStrategy()
  }, [profileLoading, user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function loadStrategy(forceRefresh = false) {
    if (!user) return
    setError('')

    // Check cache: strategy is stored under the fixed key 'strategy', not a date.
    // This prevents regeneration every day — only regenerate after 24h.
    if (!forceRefresh) {
      const { data: cached } = await supabase
        .from('content')
        .select('strategy, created_at')
        .eq('user_id', user.id)
        .eq('date', 'strategy')
        .single()

      if (cached?.strategy && Object.keys(cached.strategy).length > 0) {
        const ageMs = Date.now() - new Date(cached.created_at).getTime()
        if (ageMs < 86_400_000) {
          setData(cached.strategy as StrategyData)
          setCachedAt(cached.created_at)
          return
        }
      }
    }

    // Generate fresh
    if (!profile) return
    setGenerating(true)
    setCachedAt(null)

    async function attemptFetch() {
      const res = await fetch('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile: profile }),
      })
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error || 'Strategy failed')
      return json
    }

    try {
      let json: StrategyData
      try {
        json = await attemptFetch()
      } catch {
        // Exponential backoff: wait 3s then retry once
        await new Promise(r => setTimeout(r, 3000))
        json = await attemptFetch()
      }
      setData(json)

      await supabase.from('content').upsert({
        user_id: user.id,
        date: 'strategy',
        strategy: json,
      }, { onConflict: 'user_id,date' })
    } catch {
      setError('Strategy loading, please wait a moment.')
    }
    setGenerating(false)
  }

  const isLoading = profileLoading || (generating && !data)

  if (!profileLoading && !profile?.instagram_username) {
    return (
      <div style={{ background: '#000', minHeight: '100vh', padding: '24px 20px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>🎯</div>
          <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Profile not set up</h2>
          <p style={{ color: '#444', fontSize: 14, marginBottom: 24 }}>Complete onboarding to get your brand strategy.</p>
          <a href="/onboarding" style={{ background: '#FFD700', color: '#000', padding: '14px 28px', borderRadius: 50, fontWeight: 900, fontSize: 15, textDecoration: 'none', display: 'inline-block' }}>
            Set Up Profile →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '24px 20px 100px' }}>

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 900, margin: '0 0 4px', letterSpacing: '-0.5px' }}>My US Strategy</h1>
          <p style={{ color: '#333', fontSize: 13, margin: 0 }}>
            {profile?.instagram_username ? `@${profile.instagram_username}` : ''}{profile?.niche ? ` · ${profile.niche}` : ''}
            {cachedAt && <span style={{ color: '#2a2a2a' }}> · cached today</span>}
          </p>
        </div>
        {data && !generating && (
          <motion.button onClick={() => loadStrategy(true)} whileTap={{ scale: 0.9 }}
            style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: 10, padding: '8px 12px', color: '#FFD700', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            ↻ Refresh
          </motion.button>
        )}
      </motion.div>

      {error && (
        <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12, padding: '16px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            style={{ width: 18, height: 18, border: '2px solid #222', borderTopColor: '#FFD700', borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ color: '#888', fontSize: 14, margin: '0 0 6px' }}>{error}</p>
            <button onClick={() => loadStrategy(true)} style={{ background: 'none', border: 'none', color: '#FFD700', fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: 0 }}>
              Retry now →
            </button>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 18, padding: '20px', marginBottom: 16, textAlign: 'center' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{ width: 32, height: 32, border: '3px solid #1a1a1a', borderTopColor: '#FFD700', borderRadius: '50%', margin: '0 auto 16px' }} />
              <p style={{ color: '#555', fontSize: 14, margin: 0 }}>Building your brand strategy…</p>
            </div>
            <SkeletonBlock height={96} />
            <SkeletonBlock height={80} />
            <SkeletonBlock height={80} />
            <SkeletonBlock height={72} />
          </motion.div>
        )}

        {!isLoading && data && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* Brand Statement — gold hero card */}
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              style={{ background: '#FFD700', borderRadius: 18, padding: '22px 20px', marginBottom: 16 }}>
              <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>🧠 YOUR BRAND STATEMENT</p>
              <p style={{ color: '#000', fontSize: 16, lineHeight: 1.65, margin: 0, fontWeight: 700 }}>{data.brandStatement}</p>
            </motion.div>

            <Section icon="⚡" label="UNIQUE ANGLE" content={data.uniqueAngle} />
            <Section icon="🎙️" label="BRAND VOICE" content={data.brandVoice} />
            <Section icon="🎨" label="VISUAL IDENTITY" content={data.visualIdentity} />

            {/* Content Pillars */}
            {data.contentPillars?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, padding: '18px', marginBottom: 12 }}>
                <p style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 14 }}>📊 CONTENT PILLARS</p>
                {data.contentPillars.map((p, i) => (
                  <div key={i} style={{ marginBottom: i < data.contentPillars.length - 1 ? 14 : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{p.pillar}</span>
                      <span style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 50, padding: '2px 9px', color: '#FFD700', fontSize: 11, fontWeight: 700 }}>{p.percentage}</span>
                    </div>
                    <p style={{ color: '#555', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{p.description}</p>
                  </div>
                ))}
              </motion.div>
            )}

            <Section icon="🚀" label="AUDIENCE SHIFT PLAN (30 DAYS)" content={data.audienceShiftPlan} />

            {/* Format fatigue warning */}
            {data.formatFatigueAlert && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: 'rgba(255,100,0,0.05)', border: '1px solid rgba(255,100,0,0.2)', borderRadius: 16, padding: '18px', marginBottom: 12 }}>
                <p style={{ color: '#ff8c42', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>⚠️ FORMAT FATIGUE ALERT</p>
                <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.75, margin: 0 }}>{data.formatFatigueAlert}</p>
              </motion.div>
            )}

            {/* Top 5 Content Variations */}
            {data.top5ContentVariations?.length > 0 && (
              <ListSection icon="🔥" label="TOP 5 CONTENT VARIATIONS" items={data.top5ContentVariations} />
            )}

            {/* Profile Optimization */}
            {data.profileOptimization && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, padding: '18px', marginBottom: 12 }}>
                <p style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 14 }}>✨ PROFILE OPTIMIZATION</p>
                <div style={{ marginBottom: 14 }}>
                  <p style={{ color: '#555', fontSize: 11, fontWeight: 700, margin: '0 0 6px', letterSpacing: 0.5 }}>BIO REWRITE</p>
                  <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{data.profileOptimization.bioRewrite}</p>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <p style={{ color: '#555', fontSize: 11, fontWeight: 700, margin: '0 0 6px', letterSpacing: 0.5 }}>PROFILE PICTURE</p>
                  <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{data.profileOptimization.profilePictureTip}</p>
                </div>
                <div>
                  <p style={{ color: '#555', fontSize: 11, fontWeight: 700, margin: '0 0 6px', letterSpacing: 0.5 }}>STORY HIGHLIGHTS</p>
                  <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{data.profileOptimization.highlightStrategy}</p>
                </div>
              </motion.div>
            )}

            {/* Filming Environment */}
            {data.filmingEnvironment && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, padding: '18px', marginBottom: 12 }}>
                <p style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 14 }}>🎥 FILMING ENVIRONMENT</p>

                {data.filmingEnvironment.mustRemove?.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ color: '#ff6b6b', fontSize: 11, fontWeight: 700, margin: '0 0 6px' }}>REMOVE:</p>
                    {data.filmingEnvironment.mustRemove.map((item, i) => (
                      <p key={i} style={{ color: '#ccc', fontSize: 13, margin: '0 0 4px', display: 'flex', gap: 8 }}>
                        <span style={{ color: '#ff6b6b' }}>✗</span> {item}
                      </p>
                    ))}
                  </div>
                )}

                {data.filmingEnvironment.mustAdd?.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ color: '#00ff80', fontSize: 11, fontWeight: 700, margin: '0 0 6px' }}>ADD:</p>
                    {data.filmingEnvironment.mustAdd.map((item, i) => (
                      <p key={i} style={{ color: '#ccc', fontSize: 13, margin: '0 0 4px', display: 'flex', gap: 8 }}>
                        <span style={{ color: '#00ff80' }}>✓</span> {item}
                      </p>
                    ))}
                  </div>
                )}

                {data.filmingEnvironment.outfitRecommendations?.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, margin: '0 0 6px' }}>OUTFITS:</p>
                    {data.filmingEnvironment.outfitRecommendations.map((item, i) => (
                      <p key={i} style={{ color: '#ccc', fontSize: 13, margin: '0 0 4px' }}>· {item}</p>
                    ))}
                  </div>
                )}

                <div>
                  <p style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, margin: '0 0 6px' }}>LIGHTING:</p>
                  <p style={{ color: '#ccc', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{data.filmingEnvironment.lightingSetup}</p>
                </div>
              </motion.div>
            )}

            {/* Weekly Schedule */}
            {data.weeklySchedule && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, padding: '18px', marginBottom: 12 }}>
                <p style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 14 }}>📅 WEEKLY SCHEDULE</p>
                {DAYS.map((day, i) => (
                  <div key={day} style={{ display: 'flex', gap: 12, marginBottom: i < DAYS.length - 1 ? 12 : 0 }}>
                    <span style={{ color: '#333', fontSize: 12, fontWeight: 700, width: 28, flexShrink: 0, marginTop: 2 }}>{DAY_LABELS[i]}</span>
                    <p style={{ color: '#ccc', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{data.weeklySchedule[day]}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* 30-day milestones */}
            {data['30dayMilestones']?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, padding: '18px', marginBottom: 12 }}>
                <p style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 14 }}>🏆 30-DAY MILESTONES</p>
                {data['30dayMilestones'].map((m, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: i < data['30dayMilestones'].length - 1 ? 10 : 0 }}>
                    <span style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 50, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFD700', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>W{i + 1}</span>
                    <p style={{ color: '#ccc', fontSize: 13, margin: 0, lineHeight: 1.5, marginTop: 3 }}>{m}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Warning Signals */}
            {data.warningSignals?.length > 0 && (
              <ListSection icon="🚨" label="WARNING SIGNALS TO WATCH" items={data.warningSignals} accent="#ff8c42" />
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
