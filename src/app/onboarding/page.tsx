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

const LANGUAGES = ['English', 'Spanish', 'French', 'Portuguese', 'Arabic', 'Italian', 'German', 'Turkish', 'Hindi', 'Indonesian']

const steps = [
  { id: 'welcome', emoji: '👋', title: 'Welcome to GramScaling', desc: "Let's personalize your brand strategy in 3 quick steps." },
  { id: 'niche', emoji: '🎯', title: "What's your content niche?", desc: "We'll use this to generate ideas and strategy tailored to you." },
  { id: 'language', emoji: '🌍', title: 'What language do you speak?', desc: "Your scripts will be written in your language. Captions always in English." },
  { id: 'handle', emoji: '📸', title: 'Your Instagram handle', desc: "We'll use this to personalize your US growth strategy." },
  { id: 'done', emoji: '🚀', title: "You're all set!", desc: 'Your personalized dashboard is ready.' },
]

export default function Onboarding() {
  const { supabase } = useAuth()
  const [step, setStep] = useState(0)
  const [niche, setNiche] = useState('')
  const [customNiche, setCustomNiche] = useState('')
  const [language, setLanguage] = useState('English')
  const [handle, setHandle] = useState('')
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const current = steps[step]

  const canNext =
    step === 0 ? true :
    step === 1 ? (niche !== '' || customNiche.trim() !== '') :
    step === 2 ? language !== '' :
    step === 3 ? true : true

  async function handleNext() {
    if (step < steps.length - 1) {
      setStep(s => s + 1)
      return
    }
    setSaving(true)
    await supabase.auth.updateUser({
      data: {
        niche: niche || customNiche.trim(),
        language,
        instagram_handle: handle.replace('@', '').trim(),
      },
    })
    setSaving(false)
    router.push('/dashboard')
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '24px', maxWidth: 480, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <span style={{ color: '#FFD700', fontWeight: 900, fontSize: 18 }}>GramScaling</span>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', color: '#333', fontSize: 13, cursor: 'pointer', padding: 0 }}>Skip</button>
      </div>

      {/* Progress */}
      <div style={{ height: 3, background: '#111', borderRadius: 2, marginBottom: 36, overflow: 'hidden' }}>
        <motion.div
          style={{ height: '100%', background: '#FFD700', borderRadius: 2 }}
          animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.28 }}
          >
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>{current.emoji}</div>
              <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 900, marginBottom: 10, letterSpacing: '-0.5px', lineHeight: 1.2 }}>{current.title}</h1>
              <p style={{ color: '#555', fontSize: 14, lineHeight: 1.6 }}>{current.desc}</p>
            </div>

            {/* Niche step */}
            {step === 1 && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                  {NICHES.map(n => {
                    const active = niche === n
                    return (
                      <motion.button
                        key={n}
                        onClick={() => { setNiche(n); setCustomNiche('') }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          padding: '13px 10px',
                          background: active ? 'rgba(255,215,0,0.08)' : '#0a0a0a',
                          border: `1px solid ${active ? 'rgba(255,215,0,0.4)' : '#1a1a1a'}`,
                          borderRadius: 12,
                          color: active ? '#FFD700' : '#666',
                          fontSize: 12,
                          fontWeight: active ? 700 : 400,
                          cursor: 'pointer',
                          textAlign: 'center',
                        }}
                      >
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

            {/* Language step */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {LANGUAGES.map(l => {
                  const active = language === l
                  return (
                    <motion.button
                      key={l}
                      onClick={() => setLanguage(l)}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        padding: '14px 18px',
                        background: active ? 'rgba(255,215,0,0.08)' : '#0a0a0a',
                        border: `1px solid ${active ? 'rgba(255,215,0,0.4)' : '#1a1a1a'}`,
                        borderRadius: 12,
                        color: active ? '#FFD700' : '#666',
                        fontSize: 14,
                        fontWeight: active ? 700 : 400,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      {l}
                      {active && <span style={{ fontSize: 16 }}>✓</span>}
                    </motion.button>
                  )
                })}
              </div>
            )}

            {/* Handle step */}
            {step === 3 && (
              <div style={{ marginBottom: 24 }}>
                <input
                  type="text"
                  placeholder="@yourhandle"
                  value={handle}
                  onChange={e => setHandle(e.target.value)}
                  style={{ width: '100%', padding: '15px 16px', background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, color: '#fff', fontSize: 16, boxSizing: 'border-box', outline: 'none', textAlign: 'center' }}
                  autoCapitalize="none"
                />
                <p style={{ color: '#333', fontSize: 13, textAlign: 'center', marginTop: 10 }}>You can change this later in Settings</p>
              </div>
            )}

            {/* Done step */}
            {step === 4 && (
              <div style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.1)', borderRadius: 16, padding: '24px', marginBottom: 24 }}>
                {[
                  ['💡', 'Daily Content Ideas', 'Scripts in your language, captions in English'],
                  ['🎯', 'US Brand Strategy', 'Your unique identity and 30-day growth plan'],
                  ['📊', 'Profile Score', 'Track your brand strength over time'],
                ].map(([icon, title, desc]) => (
                  <div key={title} style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
                    <span style={{ fontSize: 22 }}>{icon}</span>
                    <div>
                      <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{title}</p>
                      <p style={{ color: '#555', fontSize: 13, margin: 0 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
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
          disabled={!canNext || saving}
          whileTap={{ scale: 0.98 }}
          style={{ flex: 1, padding: '16px', background: canNext && !saving ? '#FFD700' : '#1a1a1a', border: 'none', borderRadius: 50, color: canNext && !saving ? '#000' : '#333', fontSize: 17, fontWeight: 900, cursor: canNext && !saving ? 'pointer' : 'default' }}
        >
          {saving ? 'Setting up…' : step === steps.length - 1 ? 'Go to Dashboard →' : 'Continue →'}
        </motion.button>
      </div>
    </div>
  )
}
