'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { normalizeHandle } from '@/lib/utils'

const LANGUAGES = ['English', 'Spanish']

const SETUP_STEPS = [
  { id: 'welcome', emoji: '👋', title: 'Welcome to Ascend.AI', desc: "Let's build your personalized US growth strategy." },
  { id: 'language', emoji: '🌍', title: 'What language do you speak?', desc: "Scripts in your language. Captions always in English." },
  { id: 'handle', emoji: '📸', title: 'Your Instagram handle', desc: "Enter it once — we'll analyze your profile automatically." },
  { id: 'processing', emoji: '⚡', title: 'Analyzing your profile', desc: "Building your personalized brand strategy…" },
]

type ProcessStatus = 'idle' | 'saving' | 'scraping' | 'storing' | 'done' | 'error' | 'not_found'

export default function Onboarding() {
  const { user, supabase } = useAuth()

  const [step, setStep] = useState(0)
  const [language, setLanguage] = useState('English')
  const [handle, setHandle] = useState('')
  const [status, setStatus] = useState<ProcessStatus>('idle')
  const [statusMsg, setStatusMsg] = useState('')

  const current = SETUP_STEPS[step]

  const isSubmitting = status !== 'idle' && status !== 'error' && status !== 'not_found'

  const canNext =
    step === 0 ? true :
    step === 1 ? language !== '' :
    step === 2 ? handle.trim().length > 0 && !isSubmitting : false

  async function handleNext() {
    if (step < 2) { setStep(s => s + 1); return }
    if (isSubmitting) return
    setStep(3)
    await runSetupPipeline()
  }

  function resetToHandle() {
    setStep(2)
    setStatus('idle')
    setStatusMsg('')
  }

  async function runSetupPipeline() {
    const cleanHandle = normalizeHandle(handle)

    try {
      // ── Step 1: Save identity ──────────────────────────────
      setStatus('saving')
      setStatusMsg('Saving your profile…')

      await supabase.auth.updateUser({
        data: { language, instagram_handle: cleanHandle },
      })

      if (user) {
        await supabase.from('users').upsert({
          id: user.id,
          instagram_username: cleanHandle,
          language,
        }, { onConflict: 'id' })
      }

      // ── Step 2: Scrape (HikerAPI) ──────────────────────────
      setStatus('scraping')
      setStatusMsg('Fetching your Instagram data…')

      const scrapeRes = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanHandle }),
      })
      const scrapeJson = await scrapeRes.json()

      if (scrapeRes.status === 404 && scrapeJson.error === 'USER_NOT_FOUND') {
        setStatus('not_found')
        setStatusMsg('')
        return
      }
      if (scrapeJson.error) {
        console.warn('[onboarding] Scrape error:', scrapeJson.error)
        setStatus('error')
        setStatusMsg('Something went wrong. Redirecting to dashboard…')
        setTimeout(() => { window.location.href = '/dashboard' }, 2000)
        return
      }

      // Persist Instagram full_name to auth metadata
      if (scrapeJson.scrapedData?.full_name && user) {
        await supabase.auth.updateUser({ data: { hiker_full_name: scrapeJson.scrapedData.full_name } })
      }

      // ── Step 3: Analyze (Gemini) ───────────────────────────
      setStatus('storing')
      setStatusMsg('Building your brand analysis…')

      const analyzeRes = await fetch('/api/analyze-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const analyzeJson = await analyzeRes.json()

      if (analyzeJson.error) {
        console.warn('[onboarding] Analyze error:', analyzeJson.error)
        setStatus('error')
        setStatusMsg('Analysis failed. Redirecting to dashboard…')
        setTimeout(() => { window.location.href = '/dashboard' }, 2000)
        return
      }

      setStatus('done')
      setStatusMsg('All done! Taking you to your dashboard…')
      setTimeout(() => { window.location.href = '/dashboard' }, 1200)

    } catch (err: unknown) {
      console.error('[onboarding] Pipeline error:', err)
      setStatus('error')
      setStatusMsg('Something went wrong — redirecting to dashboard.')
      setTimeout(() => { window.location.href = '/dashboard' }, 2000)
    }
  }

  const statusSteps: { key: ProcessStatus; label: string }[] = [
    { key: 'saving', label: 'Profile saved' },
    { key: 'scraping', label: 'Instagram analyzed' },
    { key: 'storing', label: 'Brand data stored' },
    { key: 'done', label: 'Ready' },
  ]

  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '24px', maxWidth: 480, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <span style={{ color: '#FFD700', fontWeight: 900, fontSize: 18 }}>Ascend.AI</span>
        {step < 3 && (
          <button onClick={() => { window.location.href = '/dashboard' }}
            style={{ background: 'none', border: 'none', color: '#333', fontSize: 13, cursor: 'pointer', padding: 0 }}>
            Skip
          </button>
        )}
      </div>

      {/* Progress bar */}
      {step < 3 && (
        <div style={{ height: 3, background: '#111', borderRadius: 2, marginBottom: 36, overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', background: '#FFD700', borderRadius: 2 }}
            animate={{ width: `${((step + 1) / 3) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step === 3 ? status : step}
            initial={{ opacity: 0, x: step === 3 ? 0 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: step === 3 ? 0 : -30 }}
            transition={{ duration: 0.28 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >

            {/* NOT FOUND ERROR SCREEN */}
            {step === 3 && status === 'not_found' ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: 56, marginBottom: 24 }}>🔍</div>
                <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 900, marginBottom: 12, letterSpacing: '-0.5px' }}>
                  Account Not Found
                </h2>
                <p style={{ color: '#555', fontSize: 14, lineHeight: 1.7, marginBottom: 32, maxWidth: 320 }}>
                  We couldn&apos;t find <span style={{ color: '#FFD700' }}>@{handle.replace('@', '')}</span> on Instagram. This could be because:
                </p>
                <div style={{ width: '100%', maxWidth: 320, marginBottom: 36 }}>
                  {[
                    '🔒 The account is private',
                    '❌ The account doesn\'t exist',
                    '✏️ The username is misspelled',
                    '🗑️ The account was deleted',
                  ].map((reason, i) => (
                    <div key={i} style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 10, padding: '12px 16px', marginBottom: 8, textAlign: 'left' }}>
                      <p style={{ color: '#666', fontSize: 13, margin: 0 }}>{reason}</p>
                    </div>
                  ))}
                </div>
                <motion.button
                  onClick={resetToHandle}
                  whileTap={{ scale: 0.97 }}
                  style={{ width: '100%', maxWidth: 320, padding: '16px', background: '#FFD700', border: 'none', borderRadius: 50, color: '#000', fontSize: 16, fontWeight: 900, cursor: 'pointer' }}>
                  Try a Different Handle →
                </motion.button>
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: step === 3 ? 48 : 32 }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>{current.emoji}</div>
                  <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 900, marginBottom: 10, letterSpacing: '-0.5px', lineHeight: 1.2 }}>{current.title}</h1>
                  <p style={{ color: '#555', fontSize: 14, lineHeight: 1.6 }}>{current.desc}</p>
                </div>

                {/* LANGUAGE — step 1 */}
                {step === 1 && (
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

                {/* HANDLE — step 2 */}
                {step === 2 && (
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
                    <p style={{ color: '#333', fontSize: 13, textAlign: 'center', marginTop: 10 }}>Your niche is detected automatically from your posts</p>
                  </div>
                )}

                {/* PROCESSING — step 3 */}
                {step === 3 && (
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
                      style={{ color: status === 'error' ? '#ff8c42' : status === 'done' ? '#FFD700' : '#ccc', fontSize: 16, fontWeight: 600, textAlign: 'center', lineHeight: 1.5, marginBottom: 8 }}
                    >
                      {statusMsg}
                    </motion.p>

                    <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                      {statusSteps.map((item, i) => {
                        const order: ProcessStatus[] = ['saving', 'scraping', 'storing', 'done']
                        const itemIdx = order.indexOf(item.key)
                        const currentIdx = order.indexOf(status)
                        const isDone = currentIdx > itemIdx || status === 'done'
                        const isActive = order[currentIdx] === item.key
                        return (
                          <motion.div key={item.key}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: isDone || isActive ? 1 : 0.25, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: isDone ? 'rgba(255,215,0,0.04)' : '#0a0a0a', border: `1px solid ${isDone ? 'rgba(255,215,0,0.15)' : '#111'}`, borderRadius: 10 }}>
                            <span style={{ fontSize: 14, color: isDone ? '#FFD700' : isActive ? '#fff' : '#222' }}>
                              {isDone ? '✓' : isActive ? '●' : '○'}
                            </span>
                            <span style={{ color: isDone ? '#FFD700' : isActive ? '#fff' : '#333', fontSize: 13, fontWeight: isDone ? 700 : 400 }}>
                              {item.label}
                            </span>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {step < 3 && (
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
            {step === 2 ? 'Analyze My Profile →' : 'Continue →'}
          </motion.button>
        </div>
      )}
    </div>
  )
}