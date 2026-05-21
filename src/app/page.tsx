'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [installed, setInstalled] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
    const handler = (e: any) => { e.preventDefault(); setInstallPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') { setInstalled(true); setInstallPrompt(null) }
  }

  const features = [
    { icon: '🎯', text: 'Niche Finder' },
    { icon: '📝', text: 'Daily Scripts' },
    { icon: '🇺🇸', text: 'US Audience' },
    { icon: '📈', text: 'Growth Tracking' },
  ]

  const steps = [
    { num: '1', title: 'Enter your handle', desc: 'Drop your Instagram username and our AI scans your profile instantly.' },
    { num: '2', title: 'Get your strategy', desc: 'AI builds your personalized US niche, hashtag set, and content plan.' },
    { num: '3', title: 'Post with confidence', desc: 'Get daily scripts written for US audiences. Post and watch your reach explode.' },
  ]

  return (
    <div style={{ background: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px' }}>

      {/* Top bar */}
      <div style={{ width: '100%', maxWidth: 480, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
        <div style={{ color: '#FFD700', fontWeight: 900, fontSize: 20, letterSpacing: '-0.5px' }}>GramScaling</div>
        <Link href="/login" style={{ color: '#666', fontSize: 14, textDecoration: 'none' }}>Sign in</Link>
      </div>

      {/* Hero */}
      <div style={{ width: '100%', maxWidth: 480, textAlign: 'center', paddingTop: 32, paddingBottom: 40 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 50, padding: '6px 14px', marginBottom: 24, fontSize: 13, color: '#FFD700' }}>
            <span>✦</span> AI-Powered Instagram Growth
          </div>

          <h1 style={{ color: '#fff', fontSize: 42, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-1.5px', marginBottom: 8 }}>
            Grow Your Instagram
          </h1>
          <h1 style={{ color: '#fff', fontSize: 42, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-1.5px', marginBottom: 8 }}>
            in the US Market.
          </h1>
          <h1 style={{ color: '#FFD700', fontSize: 42, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-1.5px', marginBottom: 24 }}>
            Powered by AI.
          </h1>

          <p style={{ color: '#666', fontSize: 17, lineHeight: 1.65, maxWidth: 380, margin: '0 auto 32px' }}>
            Enter your Instagram handle. AI analyzes your profile, finds your perfect US niche, and gives you a daily growth plan.
          </p>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 36 }}
        >
          {features.map(f => (
            <span key={f.text} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 50, padding: '7px 14px', color: '#888', fontSize: 13 }}>
              {f.icon} {f.text}
            </span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
        >
          <Link
            href="/signup"
            style={{ display: 'inline-block', background: '#FFD700', color: '#000', padding: '18px 40px', borderRadius: 50, fontSize: 18, fontWeight: 900, textDecoration: 'none', width: '100%', maxWidth: 380, textAlign: 'center', letterSpacing: '-0.3px' }}
          >
            Start Free Trial — $69/mo
          </Link>

          {/* Install PWA button - shown only when installable and not already installed */}
          <AnimatePresence>
            {installPrompt && !isStandalone && (
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={handleInstall}
                style={{ background: 'transparent', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700', padding: '14px 32px', borderRadius: 50, fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', maxWidth: 380, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <span>⬇</span> Install App — Works Offline
              </motion.button>
            )}
            {installed && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#FFD700', fontSize: 14 }}>
                ✓ App installed! Open from your home screen.
              </motion.p>
            )}
          </AnimatePresence>

          <p style={{ color: '#333', fontSize: 13 }}>7-day free trial. Cancel anytime.</p>
        </motion.div>
      </div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        style={{ width: '100%', maxWidth: 480, marginBottom: 48 }}
      >
        <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 800, textAlign: 'center', marginBottom: 24, letterSpacing: '-0.5px' }}>
          How It Works
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
              style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}
            >
              <div style={{ width: 32, height: 32, background: '#FFD700', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 900, fontSize: 15, flexShrink: 0 }}>
                {step.num}
              </div>
              <div>
                <p style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{step.title}</p>
                <p style={{ color: '#555', fontSize: 13, lineHeight: 1.5 }}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Social proof */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ width: '100%', maxWidth: 480, background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.1)', borderRadius: 16, padding: '20px', marginBottom: 48 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          {[['2,400+', 'Creators'], ['$69', '/month'], ['7-day', 'Free Trial']].map(([val, label]) => (
            <div key={label}>
              <div style={{ color: '#FFD700', fontWeight: 900, fontSize: 22 }}>{val}</div>
              <div style={{ color: '#555', fontSize: 12, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Footer links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', paddingBottom: 40, paddingTop: 0 }}
      >
        {[
          { href: '/about', label: 'About' },
          { href: '/pricing', label: 'Pricing' },
          { href: '/terms', label: 'Terms' },
          { href: '/privacy', label: 'Privacy' },
          { href: '/refund', label: 'Refund' },
        ].map(({ href, label }) => (
          <Link key={href} href={href} style={{ color: '#333', textDecoration: 'none', fontSize: 13 }}>{label}</Link>
        ))}
      </motion.div>

    </div>
  )
}
