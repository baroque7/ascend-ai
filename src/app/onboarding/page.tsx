'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const steps = [
  {
    id: 'welcome',
    emoji: '👋',
    title: 'Welcome to GramScaling',
    desc: 'Let\'s get you set up in 3 quick steps.',
  },
  {
    id: 'goals',
    emoji: '🎯',
    title: 'What\'s your goal?',
    desc: 'We\'ll tailor your daily content plan to match.',
  },
  {
    id: 'handle',
    emoji: '📸',
    title: 'Your Instagram Handle',
    desc: 'We\'ll use this to personalize your strategy.',
  },
  {
    id: 'done',
    emoji: '🚀',
    title: 'You\'re all set!',
    desc: 'Your AI growth dashboard is ready.',
  },
]

const goals = [
  'Grow US followers fast',
  'Boost engagement rates',
  'Find trending content',
  'Build a personal brand',
  'Monetize my account',
  'Reach US brands for deals',
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [handle, setHandle] = useState('')
  const router = useRouter()

  const toggleGoal = (g: string) =>
    setSelectedGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])

  const canNext =
    step === 0 ? true :
    step === 1 ? selectedGoals.length > 0 :
    step === 2 ? true : true

  const current = steps[step]

  function handleNext() {
    if (step < steps.length - 1) { setStep(s => s + 1); return }
    router.push('/dashboard')
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '24px', maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <span style={{ color: '#FFD700', fontWeight: 900, fontSize: 18 }}>GramScaling</span>
        <Link href="/dashboard" style={{ color: '#333', fontSize: 13, textDecoration: 'none' }}>Skip</Link>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: '#111', borderRadius: 2, marginBottom: 40, overflow: 'hidden' }}>
        <motion.div
          style={{ height: '100%', background: '#FFD700', borderRadius: 2 }}
          animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Step content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>{current.emoji}</div>
              <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, marginBottom: 10, letterSpacing: '-0.5px' }}>{current.title}</h1>
              <p style={{ color: '#555', fontSize: 15, lineHeight: 1.6 }}>{current.desc}</p>
            </div>

            {step === 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
                {goals.map(g => {
                  const active = selectedGoals.includes(g)
                  return (
                    <motion.button
                      key={g}
                      onClick={() => toggleGoal(g)}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        padding: '14px 12px',
                        background: active ? 'rgba(255,215,0,0.08)' : '#0a0a0a',
                        border: `1px solid ${active ? 'rgba(255,215,0,0.4)' : '#1a1a1a'}`,
                        borderRadius: 12,
                        color: active ? '#FFD700' : '#666',
                        fontSize: 13,
                        fontWeight: active ? 700 : 400,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${active ? '#FFD700' : '#333'}`, background: active ? '#FFD700' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>
                        {active ? '✓' : ''}
                      </span>
                      {g}
                    </motion.button>
                  )
                })}
              </div>
            )}

            {step === 2 && (
              <div style={{ marginBottom: 24 }}>
                <input
                  type="text"
                  placeholder="@yourhandle"
                  value={handle}
                  onChange={e => setHandle(e.target.value)}
                  style={{ width: '100%', padding: '15px 16px', background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, color: '#fff', fontSize: 16, boxSizing: 'border-box', outline: 'none', textAlign: 'center' }}
                  autoCapitalize="none"
                />
                <p style={{ color: '#333', fontSize: 13, textAlign: 'center', marginTop: 8 }}>You can change this later in Settings</p>
              </div>
            )}

            {step === 3 && (
              <div style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.1)', borderRadius: 16, padding: '24px', marginBottom: 24 }}>
                {[
                  ['📊', 'Profile Analysis', 'AI analyzes your niche + US potential'],
                  ['💡', 'Daily Content Ideas', 'Scripts, captions & hashtags every day'],
                  ['📈', 'Growth Tracking', 'Watch your US audience grow over time'],
                ].map(([icon, title, desc]) => (
                  <div key={title} style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
                    <span style={{ fontSize: 22 }}>{icon}</span>
                    <div>
                      <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '0 0 2px' }}>{title}</p>
                      <p style={{ color: '#555', fontSize: 13 }}>{desc}</p>
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
          disabled={!canNext}
          whileTap={{ scale: 0.98 }}
          style={{ flex: 1, padding: '16px', background: canNext ? '#FFD700' : '#1a1a1a', border: 'none', borderRadius: 50, color: canNext ? '#000' : '#333', fontSize: 17, fontWeight: 800, cursor: canNext ? 'pointer' : 'default' }}
        >
          {step === steps.length - 1 ? 'Go to Dashboard →' : 'Continue →'}
        </motion.button>
      </div>
    </div>
  )
}
