'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'
import LanguageToggle from '@/components/LanguageToggle'

function AnimatedWord({ word, delay = 0 }: { word: string; delay?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 40, rotateX: -20 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'inline-block' }}
    >
      {word}
    </motion.span>
  )
}

function CountUp({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const increment = end / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [inView, end, duration])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

export default function Landing() {
  const valueRef = useRef(null)
  const valueInView = useInView(valueRef, { once: true, margin: '-80px' })

  const { t } = useTranslation()

  const headlineWords = t('landing.headline').split(' ')

  const VALUES = [
    { icon: '🧠', title: t('landing.value1.title'), desc: t('landing.value1.desc') },
    { icon: '🎯', title: t('landing.value2.title'), desc: t('landing.value2.desc') },
    { icon: '📅', title: t('landing.value3.title'), desc: t('landing.value3.desc') },
  ]

  const FEATURES = [
    t('landing.feature.1'), t('landing.feature.2'), t('landing.feature.3'),
    t('landing.feature.4'), t('landing.feature.5'), t('landing.feature.6'),
  ]

  const FOOTER_LINKS = [
    { href: '/about', label: t('landing.footer.about') },
    { href: '/pricing', label: t('landing.footer.pricing') },
    { href: '/terms', label: t('landing.footer.terms') },
    { href: '/privacy', label: t('landing.footer.privacy') },
    { href: '/refund', label: t('landing.footer.refund') },
    { href: '/contact', label: t('landing.footer.contact') },
  ]

  return (
    <div style={{ background: '#000000', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', maxWidth: 640, margin: '0 auto' }}
      >
        <span style={{ color: '#FFD700', fontWeight: 900, fontSize: 20, letterSpacing: '-0.5px' }}>GramScaling</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <LanguageToggle />
          <Link href="/login" style={{ color: '#444', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>{t('landing.signin')}</Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px 0' }}>

        {/* Headline */}
        <div style={{ marginBottom: 24, perspective: 800 }}>
          <h1 style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-1.5px', margin: 0, color: '#fff' }}>
            {headlineWords.map((word, i) => (
              <span key={`${word}-${i}`}>
                <AnimatedWord word={word} delay={0.15 + i * 0.06} />{' '}
              </span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 + headlineWords.length * 0.06, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'inline-block', color: '#FFD700' }}
            >
              {t('landing.headline_accent')}
            </motion.span>
          </h1>
        </div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          style={{ color: '#666', fontSize: 18, lineHeight: 1.65, maxWidth: 420, marginBottom: 40 }}
        >
          {t('landing.subheadline')}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}
        >
          <Link
            href="/signup"
            style={{
              display: 'block',
              background: '#FFD700',
              color: '#000',
              padding: '19px 32px',
              borderRadius: 50,
              fontSize: 17,
              fontWeight: 900,
              textDecoration: 'none',
              textAlign: 'center',
              letterSpacing: '-0.2px',
              boxShadow: '0 0 40px rgba(255,215,0,0.2)',
            }}
          >
            {t('landing.cta')}
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          style={{ color: '#2a2a2a', fontSize: 13, textAlign: 'center', marginBottom: 64 }}
        >
          {t('landing.price_line')}
        </motion.p>

        {/* Floating orb */}
        <div style={{ position: 'relative', height: 0, overflow: 'visible', pointerEvents: 'none' }}>
          <motion.div
            animate={{ y: [0, -18, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', right: -20, top: -200, width: 120, height: 120, background: 'radial-gradient(circle, rgba(255,215,0,0.12) 0%, transparent 70%)', borderRadius: '50%' }}
          />
        </div>

        {/* Value props */}
        <div ref={valueRef} style={{ marginBottom: 64 }}>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={valueInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            style={{ color: '#fff', fontSize: 26, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 24 }}
          >
            {t('landing.values_title')}
          </motion.h2>

          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, x: -24 }}
              animate={valueInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              style={{ display: 'flex', gap: 16, padding: '20px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, marginBottom: 10, alignItems: 'flex-start' }}
            >
              <div style={{ width: 44, height: 44, background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.12)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                {v.icon}
              </div>
              <div>
                <p style={{ color: '#fff', fontSize: 16, fontWeight: 800, margin: '0 0 5px', letterSpacing: '-0.2px' }}>{v.title}</p>
                <p style={{ color: '#555', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social proof numbers */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ background: 'rgba(255,215,0,0.03)', border: '1px solid rgba(255,215,0,0.1)', borderRadius: 20, padding: '28px 24px', marginBottom: 48 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <div>
              <div style={{ color: '#FFD700', fontWeight: 900, fontSize: 26, letterSpacing: '-0.5px' }}>
                $<CountUp end={69} />.99
              </div>
              <div style={{ color: '#333', fontSize: 12, marginTop: 4, fontWeight: 500 }}>{t('landing.stat.per_month')}</div>
            </div>
            <div>
              <div style={{ color: '#FFD700', fontWeight: 900, fontSize: 26, letterSpacing: '-0.5px' }}>✓</div>
              <div style={{ color: '#333', fontSize: 12, marginTop: 4, fontWeight: 500 }}>{t('landing.stat.cancel')}</div>
            </div>
          </div>
        </motion.div>

        {/* Pricing callout */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 20, padding: '32px 24px', marginBottom: 16 }}>
            <p style={{ color: '#444', fontSize: 13, marginBottom: 8, fontWeight: 600, letterSpacing: 1 }}>{t('landing.pro_label')}</p>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 2, marginBottom: 20 }}>
              <span style={{ color: '#FFD700', fontSize: 22, fontWeight: 700, marginTop: 8 }}>$</span>
              <span style={{ color: '#FFD700', fontSize: 72, fontWeight: 900, lineHeight: 1, letterSpacing: '-3px' }}>69</span>
              <span style={{ color: '#555', fontSize: 16, marginTop: 16 }}>.99/mo</span>
            </div>
            {FEATURES.map(f => (
              <p key={f} style={{ color: '#666', fontSize: 14, margin: '0 0 10px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10 }}>
                <span style={{ color: '#FFD700', fontSize: 13 }}>✓</span> {f}
              </p>
            ))}
            <Link
              href="/signup"
              style={{ display: 'block', background: '#FFD700', color: '#000', padding: '17px', borderRadius: 50, textDecoration: 'none', fontSize: 16, fontWeight: 900, marginTop: 24 }}
            >
              {t('landing.pro_cta')}
            </Link>
            <p style={{ color: '#2a2a2a', fontSize: 12, marginTop: 12 }}>{t('landing.trial_note')}</p>
          </div>
        </motion.div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', paddingBottom: 48, borderTop: '1px solid #0a0a0a', paddingTop: 32 }}>
          {FOOTER_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} style={{ color: '#2a2a2a', fontSize: 13, textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>

      </div>
    </div>
  )
}
