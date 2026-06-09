'use client'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function About() {
  const { t } = useTranslation()

  const steps = [
    { icon: '🔍', title: t('about.how.1.title'), desc: t('about.how.1.desc') },
    { icon: '🎯', title: t('about.how.2.title'), desc: t('about.how.2.desc') },
    { icon: '📅', title: t('about.how.3.title'), desc: t('about.how.3.desc') },
    { icon: '📈', title: t('about.how.4.title'), desc: t('about.how.4.desc') },
  ]

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '40px 24px', maxWidth: 560, margin: '0 auto' }}>
      <Link href="/" style={{ color: '#FFD700', fontWeight: 900, fontSize: 20, textDecoration: 'none', display: 'block', marginBottom: 48 }}>
        GramScaling
      </Link>

      <h1 style={{ color: '#fff', fontSize: 34, fontWeight: 900, marginBottom: 16, letterSpacing: '-1px' }}>{t('about.title')}</h1>
      <p style={{ color: '#555', fontSize: 16, marginBottom: 40 }}>{t('about.subtitle')}</p>

      <div style={{ marginBottom: 36 }}>
        <h2 style={{ color: '#FFD700', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{t('about.mission.title')}</h2>
        <p style={{ color: '#888', fontSize: 15, lineHeight: 1.75 }}>
          {t('about.mission.body')}
        </p>
      </div>

      <div style={{ marginBottom: 36 }}>
        <h2 style={{ color: '#FFD700', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{t('about.how.title')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {steps.map(({ icon, title, desc }) => (
            <div key={title} style={{ display: 'flex', gap: 14, background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12, padding: '16px' }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{icon}</span>
              <div>
                <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>{title}</p>
                <p style={{ color: '#555', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 36 }}>
        <h2 style={{ color: '#FFD700', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{t('about.contact.title')}</h2>
        <p style={{ color: '#888', fontSize: 15, lineHeight: 1.7 }}>
          {t('about.contact.body')}{' '}
          <a href="mailto:support@gramscaling.com" style={{ color: '#FFD700', textDecoration: 'none' }}>
            support@gramscaling.com
          </a>
        </p>
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <Link href="/" style={{ color: '#333', fontSize: 13, textDecoration: 'none' }}>{t('about.home')}</Link>
        <Link href="/pricing" style={{ color: '#333', fontSize: 13, textDecoration: 'none' }}>{t('about.pricing')}</Link>
        <Link href="/terms" style={{ color: '#333', fontSize: 13, textDecoration: 'none' }}>{t('about.terms')}</Link>
        <Link href="/privacy" style={{ color: '#333', fontSize: 13, textDecoration: 'none' }}>{t('about.privacy')}</Link>
      </div>
    </div>
  )
}
