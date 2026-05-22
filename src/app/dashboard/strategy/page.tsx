'use client'
import { useState, useEffect } from 'react'
import { useProfile } from '@/hooks/useProfile'
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
  const { profile, loading: profileLoading, updateProfile } = useProfile()
  const [data, setData] = useState<StrategyData | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (profileLoading) return
    // If we have stored strategy, show it immediately
    if (profile?.strategy_data && profile.strategy_data.brandIdentity) {
      setData(profile.strategy_data as StrategyData)
    } else if (profile?.instagram_handle || profile?.niche) {
      // Auto-generate if no stored strategy
      generateStrategy()
    }
  }, [profileLoading, profile?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function generateStrategy() {
    if (!profile) return
    setGenerating(true)
    setError('')
    try {
      const res = await fetch('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: profile.instagram_handle || 'creator',
          niche: profile.niche,
          language: profile.language,
          scrapeContext: profile.scrape_data,
          analysisContext: profile.analysis_data,
        }),
      })
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error || 'Strategy failed')
      setData(json)
      // Persist to Supabase so next visit is instant
      await updateProfile({ strategy_data: json })
    } catch (err: any) {
      setError(err.message || 'Could not build strategy. Try again.')
    }
    setGenerating(false)
  }

  async function refresh() {
    setData(null)
    await generateStrategy()
  }

  const isLoading = profileLoading || (generating && !data)

  if (!profileLoading && !profile?.instagram_handle && !profile?.niche) {
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
          {profile?.instagram_handle && (
            <p style={{ color: '#333', fontSize: 13, margin: 0 }}>@{profile.instagram_handle} · {profile.niche}</p>
          )}
        </div>
        {data && !generating && (
          <motion.button onClick={refresh} whileTap={{ scale: 0.9 }}
            style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: 10, padding: '8px 12px', color: '#FFD700', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            ↻ Refresh
          </motion.button>
        )}
      </motion.div>

      {error && (
        <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.15)', borderRadius: 12, padding: 14, marginBottom: 20, textAlign: 'center' }}>
          <p style={{ color: '#ff6b6b', fontSize: 14, margin: '0 0 10px' }}>{error}</p>
          <button onClick={generateStrategy} style={{ background: '#FFD700', border: 'none', borderRadius: 50, padding: '10px 20px', color: '#000', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
            Try Again
          </button>
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

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
