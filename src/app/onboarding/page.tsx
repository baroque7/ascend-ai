'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'

const NICHES = [
  'Fitness & Health', 'Fashion & Style', 'Food & Cooking', 'Travel',
  'Business & Money', 'Lifestyle', 'Beauty & Skincare', 'Music',
  'Comedy & Entertainment', 'Tech & Gaming',
]

const LANGUAGES = [
  'English', 'Spanish', 'French', 'Portuguese', 'Arabic',
  'Italian', 'German', 'Turkish', 'Hindi', 'Indonesian',
]

const SETUP_STEPS = [
  { id: 'welcome', emoji: '👋', title: 'Welcome to GramScaling', desc: "Let's personalize your brand strategy in 3 quick steps." },
  { id: 'niche', emoji: '🎯', title: "What's your content niche?", desc: "We'll generate ideas and strategy tailored to your niche." },
  { id: 'language', emoji: '🌍', title: 'What language do you speak?', desc: "Scripts in your language. Captions always in English." },
  { id: 'handle', emoji: '📸', title: 'Your Instagram handle', desc: "Enter it once — we'll never ask again." },
  { id: 'processing', emoji: '⚡', title: 'Setting up your profile', desc: "Analyzing your Instagram and building your strategy…" },
]

type ProcessStatus = 'idle' | 'saving' | 'scraping' | 'done' | 'error'

export default function Onboarding() {
  const { user, supabase } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [niche, setNiche] = useState('')
  const [customNiche, setCustomNiche] = useState('')
  const [language, setLanguage] = useState('English')
  const [handle, setHandle] = useState('')
  const [status, setStatus] = useState<ProcessStatus>('idle')
  const [statusMsg, setStatusMsg] = useState('')

  const current = SETUP_STEPS[step]
  const resolvedNiche = niche || customNiche.trim()

  const canNext =
    step === 0 ? true :
    step === 1 ? resolvedNiche !== '' :
    step === 2 ? language !== '' :
    step === 3 ? true : false

  async function handleNext() {
    if (step < 3) { setStep(s => s + 1); return }
    setStep(4)
    await runSetupPipeline()
  }

  async function runSetupPipeline() {
    const cleanHandle = handle.replace('@', '').trim()

    try {
      // 1. Save profile to Supabase + auth metadata
      setStatus('saving')
      setStatusMsg('Saving your profile…')

      await supabase.auth.updateUser({
        data: { niche: resolvedNiche, language, instagram_handle: cleanHandle },
      })

      if (user) {
        await Promise.all([
          supabase.from('users').upsert({
            id: user.id,
            instagram_username: cleanHandle,
            language,
          }, { onConflict: 'id' }),
          supabase.from('profiles').upsert({
            user_id: user.id,
            niche: resolvedNiche,
          }, { onConflict: 'user_id' }),
        ])
      }

      // 2. Scrape Instagram + Gemini analysis (all-in-one)
      setStatus('scraping')
      setStatusMsg('Analyzing your Instagram profile…')

      try {
        await fetch('/api/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: cleanHandle, userId: user?.id }),
        })
      } catch {}

      setStatus('done')
      setStatusMsg('All done! Taking you to your dashboard…')
      setTimeout(() => router.push('/dashboard'), 1200)

    } catch {
      setStatus('error')
      setStatusMsg('Setup incomplete — you can finish in Settings.')
      setTimeout(() => router.push('/dashboard'), 2500)
    }
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '24px', maxWidth: 480, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <span style={{ color: '#FFD700', fontWeight: 900, fontSize: 18 }}>GramScaling</span>
        {step < 4 && (
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', color: '#333', fontSize: 13, cursor: 'pointer', padding: 0 }}>
            Skip
          </button>
        )}
      </div>

      {/* Progress bar */}
      {step < 4 && (
        <div style={{ height: 3, background: '#111', borderRadius: 2, marginBottom: 36, overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', background: '#FFD700', borderRadius: 2 }}
            animate={{ width: `${((step + 1) / 4) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: step === 4 ? 0 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: step === 4 ? 0 : -30 }}
            transition={{ duration: 0.28 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ textAlign: 'center', marginBottom: step === 4 ? 48 : 32 }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>{current.emoji}</div>
              <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 900, marginBottom: 10, letterSpacing: '-0.5px', lineHeight: 1.2 }}>{current.title}</h1>
              <p style={{ color: '#555', fontSize: 14, lineHeight: 1.6 }}>{current.desc}</p>
            </div>

            {/* NICHE step */}
            {step === 1 && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                  {NICHES.map(n => {
                    const active = niche === n
                    return (
                      <motion.button key={n} onClick={() => { setNiche(n); setCustomNiche('') }}
                        whileTap={{ scale: 0.97 }}
                        style={{ padding: '13px 10px', background: active ? 'rgba(255,215,0,0.08)' : '#0a0a0a', border: `1px solid ${active ? 'rgba(255,215,0,0.4)' : '#1a1a1a'}`, borderRadius: 12, color: active ? '#FFD700' : '#666', fontSize: 12, fontWeight: active ? 700 : 400, cursor: 'pointer', textAlign: 'center' }}>
                        {n}
                      </motion.button>
                    )
                  })}
                </div>
                <input
                  type="text"
                  placeholder="Or type your niche…"
                  value={customNiche}
                  onChange={e => { setCustomNiche(e.target.value); setNiche('') }}
                  style={{ width: '100%', padding: '13px 16px', background: '#0a0a0a', border: `1px solid ${customNiche ? 'rgba(255,215,0,0.3)' : '#1a1a1a'}`, borderRadius: 12, color: '#fff', fontSize: 14, boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
            )}

            {/* LANGUAGE step */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {LANGUAGES.map(l => {
                  const active = language === l
                  return (
                    <motion.button key={l} onClick={() => setLanguage(l)} whileTap={{ scale: 0.98 }}
                      style={{ padding: '14px 18px', background: active ? 'rgba(255,215,0,0.08)' : '#0a0a0a', border: `1px solid ${active ? 'rgba(255,215,0,0.4)' : '#1a1a1a'}`, borderRadius: 12, color: active ? '#FFD700' : '#666', fontSize: 14, fontWeight: active ? 700 : 400, cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {l}
                      {active && <span style={{ fontSize: 16 }}>✓</span>}
                    </motion.button>
                  )
                })}
              </div>
            )}

            {/* HANDLE step */}
            {step === 3 && (
              <div style={{ marginBottom: 24 }}>
                <input
                  type="text"
                  placeholder="@yourhandle"
                  value={handle}
                  onChange={e => setHandle(e.target.value)}
                  style={{ width: '100%', padding: '16px', background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, color: '#fff', fontSize: 18, boxSizing: 'border-box', outline: 'none', textAlign: 'center', letterSpacing: '0.5px' }}
                  autoCapitalize="none"
                  autoCorrect="off"
                />
                <p style={{ color: '#333', fontSize: 13, textAlign: 'center', marginTop: 10 }}>You can update this anytime in Settings</p>
              </div>
            )}

            {/* PROCESSING step */}
            {step === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                {status !== 'done' && status !== 'error' && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    style={{ width: 52, height: 52, border: '3px solid #1a1a1a', borderTopColor: '#FFD700', borderRadius: '50%', marginBottom: 28 }}
                  />
                )}
                {status === 'done' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    style={{ fontSize: 56, marginBottom: 24 }}>
                    🎉
                  </motion.div>
                )}
                {status === 'error' && <div style={{ fontSize: 48, marginBottom: 24 }}>⚠️</div>}

                <motion.p
                  key={statusMsg}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ color: status === 'error' ? '#ff8c42' : status === 'done' ? '#FFD700' : '#ccc', fontSize: 16, fontWeight: 600, textAlign: 'center', lineHeight: 1.5 }}
                >
                  {statusMsg}
                </motion.p>

                <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                  {[
                    { key: 'saving', label: 'Profile saved' },
                    { key: 'scraping', label: 'Instagram analyzed' },
                    { key: 'done', label: 'Brand data ready' },
                  ].map((item, i) => {
                    const steps: ProcessStatus[] = ['saving', 'scraping', 'done']
                    const idx = steps.indexOf(item.key as ProcessStatus)
                    const currentIdx = steps.indexOf(status)
                    const isDone = currentIdx > idx || status === 'done'
                    const isActive = steps[currentIdx] === item.key
                    return (
                      <motion.div key={item.key}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: isDone || isActive ? 1 : 0.3, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: isDone ? 'rgba(255,215,0,0.04)' : '#0a0a0a', border: `1px solid ${isDone ? 'rgba(255,215,0,0.15)' : '#111'}`, borderRadius: 10 }}>
                        <span style={{ fontSize: 16 }}>{isDone ? '✓' : isActive ? '⟳' : '○'}</span>
                        <span style={{ color: isDone ? '#FFD700' : isActive ? '#fff' : '#333', fontSize: 13, fontWeight: isDone ? 700 : 400 }}>{item.label}</span>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {step < 4 && (
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{ padding: '15px', background: '#111', border: '1px solid #1a1a1a', borderRadius: 50, color: '#666', fontSize: 20, cursor: 'pointer', width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ←
            </button>
          )}
          <motion.button
            onClick={handleNext}
            disabled={!canNext}
            whileTap={{ scale: 0.98 }}
            style={{ flex: 1, padding: '16px', background: canNext ? '#FFD700' : '#1a1a1a', border: 'none', borderRadius: 50, color: canNext ? '#000' : '#333', fontSize: 17, fontWeight: 900, cursor: canNext ? 'pointer' : 'default' }}
          >
            {step === 3 ? 'Set Up My Dashboard →' : 'Continue →'}
          </motion.button>
        </div>
      )}
    </div>
  )
}
