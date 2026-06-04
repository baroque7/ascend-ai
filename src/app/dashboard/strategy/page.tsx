'use client'
import { useState, useEffect, useRef } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/hooks/useTranslation'
import { motion, AnimatePresence } from 'framer-motion'

interface ContentPillar {
  pillar: string
  description: string
  percentage: string
}

interface ContentVariation {
  idea: string
  hook: string
  format: string
  cta: string
}

interface StrategyData {
  uniqueAngle: string
  contentPillars: ContentPillar[]
  audienceShiftPlan: string
  top5ContentVariations: ContentVariation[]
  profileOptimization: {
    bioRewrite: string
    profilePictureTip: string
    highlightStrategy: string
  }
  viralHookFormulas: string[]
  contentGaps: string[]
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

export default function StrategyPage() {
  const { user, supabase, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const { t, language } = useTranslation()
  const [data, setData] = useState<StrategyData | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [cachedAt, setCachedAt] = useState<string | null>(null)
  const hasTriggered = useRef(false)

  useEffect(() => {
    if (!profileLoading && user && profile && !hasTriggered.current) {
      hasTriggered.current = true
      loadStrategy()
    }
  }, [profileLoading, user?.id, profile?.instagram_username]) // eslint-disable-line react-hooks/exhaustive-deps

  async function loadStrategy(forceRefresh = false) {
    if (!user) return
    setError('')

    if (!forceRefresh) {
      const { data: cached } = await supabase
        .from('strategy')
        .select('data, created_at')
        .eq('user_id', user.id)
        .single()

      if (cached?.data && Object.keys(cached.data).length > 0) {
        const ageMs = Date.now() - new Date(cached.created_at).getTime()
        if (ageMs < 86_400_000) {
          setData(cached.data as StrategyData)
          setCachedAt(cached.created_at)
          return
        }
      }
    }

    if (!profile) return
    setGenerating(true)
    setCachedAt(null)

    async function attemptFetch() {
      const res = await fetch('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(55000),
        body: JSON.stringify({ userProfile: { ...profile, language } }),
      })
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error || 'Strategy failed')
      return json
    }

    try {
      let json: StrategyData
      try {
        json = await attemptFetch()
      } catch (firstErr: any) {
        if (firstErr.message?.includes('limit') || firstErr.message?.includes('429')) {
          throw firstErr
        }
        await new Promise(r => setTimeout(r, 3000))
        json = await attemptFetch()
      }
      setData(json)

    } catch (err: unknown) {
      const isTimeout = err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError')
      const msg = err instanceof Error ? err.message : ''
      if (isTimeout) {
        setError(t('strategy.timeout'))
      } else if (msg.includes('limit') || msg.includes('429')) {
        setError(t('strategy.ai_busy'))
      } else {
        setError(t('strategy.error'))
      }
    }

    setGenerating(false)
  }

  const isLoading = authLoading || profileLoading || (generating && !data)

  // "Not set up" only when a scrape has genuinely never run (status 'pending').
  // Keying off scrape_status (from the profiles query) instead of instagram_username
  // (from the users query) avoids a false negative when the users query drops on mobile.
  if (!authLoading && !profileLoading && (profile?.scrape_status ?? 'pending') === 'pending') {
    return (
      <div style={{ background: '#000', minHeight: '100vh', padding: '24px 20px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>🎯</div>
          <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 800, marginBottom: 10 }}>{t('strategy.no_profile.title')}</h2>
          <p style={{ color: '#444', fontSize: 14, marginBottom: 24 }}>{t('strategy.no_profile.desc')}</p>
          <a href="/onboarding" style={{ background: '#FFD700', color: '#000', padding: '14px 28px', borderRadius: 50, fontWeight: 900, fontSize: 15, textDecoration: 'none', display: 'inline-block' }}>
            {t('strategy.no_profile.cta')}
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
          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 900, margin: '0 0 4px', letterSpacing: '-0.5px' }}>{t('strategy.title')}</h1>
          <p style={{ color: '#333', fontSize: 13, margin: 0 }}>
            {profile?.instagram_username ? `@${profile.instagram_username}` : ''}{profile?.niche ? ` · ${profile.niche}` : ''}
            {cachedAt && <span style={{ color: '#2a2a2a' }}>{t('strategy.cached')}</span>}
          </p>
        </div>
        {data && !generating && (
          <motion.button onClick={() => loadStrategy(true)} whileTap={{ scale: 0.9 }}
            style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: 10, padding: '8px 12px', color: '#FFD700', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            {t('strategy.refresh')}
          </motion.button>
        )}
      </motion.div>

      {error && (
        <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12, padding: '16px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            style={{ width: 18, height: 18, border: '2px solid #222', borderTopColor: '#FFD700', borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ color: '#888', fontSize: 14, margin: '0 0 6px' }}>{error}</p>
            <button onClick={() => { hasTriggered.current = false; loadStrategy() }} style={{ background: 'none', border: 'none', color: '#FFD700', fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: 0 }}>
              {t('strategy.retry')}
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
              <p style={{ color: '#555', fontSize: 14, margin: 0 }}>{t('strategy.loading')}</p>
            </div>
            <SkeletonBlock height={96} />
            <SkeletonBlock height={80} />
            <SkeletonBlock height={80} />
            <SkeletonBlock height={72} />
          </motion.div>
        )}

        {!isLoading && data && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            <Section icon="⚡" label={t('strategy.unique_angle')} content={data.uniqueAngle} />

            {/* Content Pillars */}
            {data.contentPillars?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, padding: '18px', marginBottom: 12 }}>
                <p style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 14 }}>📊 {t('strategy.content_pillars')}</p>
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

            <Section icon="🚀" label={t('strategy.audience_shift')} content={data.audienceShiftPlan} />

            {/* Top 5 Content Variations */}
            {data.top5ContentVariations?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, padding: '18px', marginBottom: 12 }}>
                <p style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 14 }}>🔥 {t('strategy.top5')}</p>
                {data.top5ContentVariations.map((v, i) => (
                  <div key={i} style={{ marginBottom: i < data.top5ContentVariations.length - 1 ? 16 : 0, paddingBottom: i < data.top5ContentVariations.length - 1 ? 16 : 0, borderBottom: i < data.top5ContentVariations.length - 1 ? '1px solid #111' : 'none' }}>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                      <span style={{ color: '#FFD700', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                      <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0, lineHeight: 1.4 }}>{v.idea}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 22 }}>
                      <p style={{ color: '#888', fontSize: 12, margin: 0 }}><span style={{ color: '#444', fontWeight: 700 }}>{t('strategy.hook')} </span>{v.hook}</p>
                      <p style={{ color: '#888', fontSize: 12, margin: 0 }}><span style={{ color: '#444', fontWeight: 700 }}>{t('strategy.format')} </span>{v.format}</p>
                      <p style={{ color: '#888', fontSize: 12, margin: 0 }}><span style={{ color: '#444', fontWeight: 700 }}>{t('strategy.cta')} </span>{v.cta}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Profile Optimization */}
            {data.profileOptimization && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, padding: '18px', marginBottom: 12 }}>
                <p style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 14 }}>✨ {t('strategy.profile_opt')}</p>
                <div style={{ marginBottom: 14 }}>
                  <p style={{ color: '#555', fontSize: 11, fontWeight: 700, margin: '0 0 6px', letterSpacing: 0.5 }}>{t('strategy.bio_rewrite')}</p>
                  <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{data.profileOptimization.bioRewrite}</p>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <p style={{ color: '#555', fontSize: 11, fontWeight: 700, margin: '0 0 6px', letterSpacing: 0.5 }}>{t('strategy.profile_pic')}</p>
                  <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{data.profileOptimization.profilePictureTip}</p>
                </div>
                <div>
                  <p style={{ color: '#555', fontSize: 11, fontWeight: 700, margin: '0 0 6px', letterSpacing: 0.5 }}>{t('strategy.highlights')}</p>
                  <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{data.profileOptimization.highlightStrategy}</p>
                </div>
              </motion.div>
            )}

            {/* Viral Hook Formulas */}
            {data.viralHookFormulas?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, padding: '18px', marginBottom: 12 }}>
                <p style={{ color: '#FFD700', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 14 }}>🎣 {t('strategy.viral_hooks')}</p>
                {data.viralHookFormulas.map((hook, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < data.viralHookFormulas.length - 1 ? 12 : 0 }}>
                    <span style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: 6, padding: '2px 7px', color: '#FFD700', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                    <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>&ldquo;{hook}&rdquo;</p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Content Gaps */}
            {data.contentGaps?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: 'rgba(255,100,0,0.04)', border: '1px solid rgba(255,100,0,0.15)', borderRadius: 16, padding: '18px', marginBottom: 12 }}>
                <p style={{ color: '#ff8c42', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 14 }}>🕳️ {t('strategy.content_gaps')}</p>
                {data.contentGaps.map((gap, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < data.contentGaps.length - 1 ? 10 : 0 }}>
                    <span style={{ color: '#ff8c42', fontSize: 13, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>→</span>
                    <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{gap}</p>
                  </div>
                ))}
              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}