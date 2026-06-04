'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const PROMO_CODE = 'MIHAWK41'

export default function Payment() {
  const { user, supabase, loading } = useAuth()
  const { t } = useTranslation()
  const [promo, setPromo] = useState('')
  const [promoError, setPromoError] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  if (loading) return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #1a1a1a', borderTopColor: '#FFD700', borderRadius: '50%' }} />
    </div>
  )

  async function handlePromo(e: React.SyntheticEvent) {
    e.preventDefault()
    const code = promo.trim().toUpperCase()
    if (!code) { setPromoError(t('payment.error.enter_promo')); return }
    if (code !== PROMO_CODE) { setPromoError(t('payment.error.invalid_promo')); return }
    if (!user) { window.location.href = '/signup'; return }

    setPromoLoading(true)
    setPromoError('')

    try {
      const { error: authErr } = await supabase.auth.updateUser({
        data: { subscription_status: 'active', is_promo: true, promo_code: PROMO_CODE },
      })
      if (authErr) throw authErr

      await supabase.from('users').upsert(
        { id: user.id, is_promo: true },
        { onConflict: 'id' }
      )
      console.log('[payment] promo success — user:', user?.id)
      window.location.href = '/onboarding'
    } catch (err: any) {
      setPromoError(err.message || t('payment.error.generic'))
      setPromoLoading(false)
    }
  }

  async function handleCheckout(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!user) { window.location.href = '/signup'; return }
    setCheckoutLoading(true); setCheckoutError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, userId: user.id }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || 'Checkout failed')
      if (data.url) window.location.href = data.url
    } catch (err: any) {
      setCheckoutError(err.message || t('payment.error.checkout'))
    }
    setCheckoutLoading(false)
  }

  const features = [
    t('payment.feature.1'),
    t('payment.feature.2'),
    t('payment.feature.3'),
    t('payment.feature.4'),
    t('payment.feature.5'),
    t('payment.feature.6'),
  ]

  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 400 }}
      >
        <Link href="/" style={{ display: 'block', textAlign: 'center', color: '#FFD700', fontWeight: 900, fontSize: 20, textDecoration: 'none', marginBottom: 36 }}>
          GramScaling
        </Link>

        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 900, textAlign: 'center', marginBottom: 6, letterSpacing: '-0.5px' }}>{t('payment.title')}</h1>
        <p style={{ color: '#444', textAlign: 'center', fontSize: 15, marginBottom: 32 }}>{t('payment.subtitle')}</p>

        <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 20, padding: '24px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>{t('payment.plan')}</span>
            <span style={{ color: '#FFD700', fontWeight: 900, fontSize: 20 }}>$69.99<span style={{ color: '#333', fontWeight: 400, fontSize: 13 }}>/mo</span></span>
          </div>
          {features.map(f => (
            <div key={f} style={{ display: 'flex', gap: 10, marginBottom: 9 }}>
              <span style={{ color: '#FFD700', fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
              <span style={{ color: '#666', fontSize: 14 }}>{f}</span>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {checkoutError && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: 10, padding: 12, marginBottom: 14, textAlign: 'center' }}>
              <p style={{ color: '#ff6b6b', fontSize: 13, margin: 0 }}>{checkoutError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button onClick={handleCheckout} disabled={checkoutLoading} whileTap={{ scale: 0.98 }}
          style={{ width: '100%', padding: '17px', background: checkoutLoading ? '#111' : '#FFD700', border: checkoutLoading ? '1px solid #1a1a1a' : 'none', borderRadius: 50, color: checkoutLoading ? '#444' : '#000', fontSize: 17, fontWeight: 900, cursor: checkoutLoading ? 'default' : 'pointer', marginBottom: 20, letterSpacing: '-0.2px' }}>
          {checkoutLoading ? t('payment.redirecting') : t('payment.pay')}
        </motion.button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: '#1a1a1a' }} />
          <span style={{ color: '#333', fontSize: 12 }}>{t('payment.or_promo')}</span>
          <div style={{ flex: 1, height: 1, background: '#1a1a1a' }} />
        </div>

        <form onSubmit={handlePromo}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="text" value={promo}
              onChange={e => { setPromo(e.target.value.toUpperCase()); setPromoError('') }}
              placeholder={t('payment.promo_placeholder')}
              style={{ flex: 1, padding: '14px 16px', background: '#111', border: `1px solid ${promo ? 'rgba(255,215,0,0.3)' : '#1a1a1a'}`, borderRadius: 12, color: promo ? '#FFD700' : '#666', fontSize: 15, fontWeight: 700, outline: 'none', letterSpacing: 2 }} />
            <motion.button type="submit" disabled={promoLoading} whileTap={{ scale: 0.96 }}
              style={{ padding: '14px 20px', background: promo ? 'rgba(255,215,0,0.1)' : '#0a0a0a', border: `1px solid ${promo ? 'rgba(255,215,0,0.3)' : '#1a1a1a'}`, borderRadius: 12, color: promo ? '#FFD700' : '#333', fontSize: 14, fontWeight: 700, cursor: promoLoading ? 'default' : 'pointer', whiteSpace: 'nowrap' }}>
              {promoLoading ? '…' : t('payment.apply')}
            </motion.button>
          </div>
          <AnimatePresence>
            {promoError && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ color: '#ff6b6b', fontSize: 13, marginTop: 8, textAlign: 'center' }}>
                {promoError}
              </motion.p>
            )}
          </AnimatePresence>
        </form>

        <p style={{ color: '#2a2a2a', fontSize: 12, textAlign: 'center', marginTop: 24, lineHeight: 1.5 }}>
          {t('payment.secure')}
        </p>
      </motion.div>
    </div>
  )
}