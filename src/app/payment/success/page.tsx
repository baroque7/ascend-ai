'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Suspense } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/hooks/useTranslation'

function SuccessContent() {
  const [status, setStatus] = useState<'loading' | 'done'>('loading')
  const { user, supabase } = useAuth()
  const { t } = useTranslation()

  useEffect(() => {
    let cancelled = false
    async function waitForSubscription() {
      // The Creem webhook sets is_subscribed in the DB (the source of truth).
      // It usually lands in 1-2s — poll for it so we don't redirect the paid user
      // before it arrives. We never set the status here ourselves (that would be forgeable).
      for (let i = 0; i < 8 && !cancelled; i++) {
        if (user) {
          const { data } = await supabase
            .from('users')
            .select('is_subscribed')
            .eq('id', user.id)
            .single()
          if (data?.is_subscribed) break
        }
        await new Promise((r) => setTimeout(r, 1500))
      }
      if (cancelled) return
      setStatus('done')
      setTimeout(() => { window.location.href = '/onboarding' }, 1500)
    }
    waitForSubscription()
    return () => { cancelled = true }
  }, [user, supabase])

  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', maxWidth: 360 }}>
        {status === 'loading' ? (
          <>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{ width: 48, height: 48, border: '3px solid #1a1a1a', borderTopColor: '#FFD700', borderRadius: '50%', margin: '0 auto 24px' }} />
            <p style={{ color: '#555', fontSize: 16 }}>{t('payment_success.confirming')}</p>
          </>
        ) : (
          <>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{ fontSize: 64, marginBottom: 20 }}>🎉</motion.div>
            <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 900, marginBottom: 10, letterSpacing: '-0.5px' }}>{t('payment_success.title')}</h2>
            <p style={{ color: '#555', fontSize: 15 }}>{t('payment_success.subtitle')}</p>
            <motion.div animate={{ width: ['0%', '100%'] }} transition={{ duration: 2, ease: 'linear' }}
              style={{ height: 2, background: '#FFD700', marginTop: 24, borderRadius: 1 }} />
          </>
        )}
      </motion.div>
    </div>
  )
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div style={{ background: '#000', minHeight: '100vh' }} />}>
      <SuccessContent />
    </Suspense>
  )
}
