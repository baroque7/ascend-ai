'use client'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function Pricing() {
  const { t } = useTranslation()

  const features = [
    t('pricing.feature.1'), t('pricing.feature.2'), t('pricing.feature.3'),
    t('pricing.feature.4'), t('pricing.feature.5'), t('pricing.feature.6'),
    t('pricing.feature.7'), t('pricing.feature.8'), t('pricing.feature.9'),
    t('pricing.feature.10'),
  ]

  const faqs: [string, string][] = [
    [t('pricing.faq.1.q'), t('pricing.faq.1.a')],
    [t('pricing.faq.2.q'), t('pricing.faq.2.a')],
    [t('pricing.faq.3.q'), t('pricing.faq.3.a')],
    [t('pricing.faq.4.q'), t('pricing.faq.4.a')],
  ]

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Link href="/" style={{ color: '#FFD700', fontWeight: 900, fontSize: 20, textDecoration: 'none', marginBottom: 48 }}>
        GramScaling
      </Link>

      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ color: '#fff', fontSize: 34, fontWeight: 900, marginBottom: 10, letterSpacing: '-1px' }}>{t('pricing.title')}</h1>
        <p style={{ color: '#555', fontSize: 16 }}>{t('pricing.subtitle')}</p>
      </div>

      <div style={{ width: '100%', maxWidth: 380, background: '#0a0a0a', border: '2px solid #FFD700', borderRadius: 20, padding: '32px 28px', marginBottom: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <p style={{ color: '#555', fontSize: 14, marginBottom: 12 }}>{t('pricing.plan')}</p>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 4 }}>
            <span style={{ color: '#FFD700', fontSize: 20, fontWeight: 700, marginTop: 8 }}>$</span>
            <span style={{ color: '#FFD700', fontSize: 64, fontWeight: 900, lineHeight: 1, letterSpacing: '-2px' }}>69</span>
            <span style={{ color: '#555', fontSize: 16, marginTop: 8 }}>{t('pricing.per_month')}</span>
          </div>
          <p style={{ color: '#333', fontSize: 13, marginTop: 6 }}>{t('pricing.trial_line')}</p>
        </div>

        <div style={{ marginBottom: 28 }}>
          {features.map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ color: '#FFD700', fontSize: 14, flexShrink: 0 }}>✓</span>
              <span style={{ color: '#888', fontSize: 14 }}>{f}</span>
            </div>
          ))}
        </div>

        <Link
          href="/signup"
          style={{ display: 'block', background: '#FFD700', color: '#000', padding: '17px', borderRadius: 50, textDecoration: 'none', fontSize: 17, fontWeight: 900, textAlign: 'center', letterSpacing: '-0.2px' }}
        >
          {t('pricing.cta')}
        </Link>
        <p style={{ color: '#333', fontSize: 12, textAlign: 'center', marginTop: 12 }}>{t('pricing.no_card')}</p>
      </div>

      <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, padding: '20px', width: '100%', maxWidth: 380, marginBottom: 36 }}>
        <p style={{ color: '#FFD700', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{t('pricing.faq.title')}</p>
        {faqs.map(([q, a]) => (
          <div key={q} style={{ marginBottom: 16 }}>
            <p style={{ color: '#ccc', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{q}</p>
            <p style={{ color: '#555', fontSize: 13, lineHeight: 1.6 }}>{a}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" style={{ color: '#333', fontSize: 13, textDecoration: 'none' }}>{t('pricing.home')}</Link>
        <Link href="/refund" style={{ color: '#333', fontSize: 13, textDecoration: 'none' }}>{t('pricing.refund')}</Link>
        <Link href="/terms" style={{ color: '#333', fontSize: 13, textDecoration: 'none' }}>{t('pricing.terms')}</Link>
      </div>
    </div>
  )
}
