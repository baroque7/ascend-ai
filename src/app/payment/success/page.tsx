'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { motion } from 'framer-motion'
import { Suspense } from 'react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function SuccessContent() {
  const [status, setStatus] = useState<'loading' | 'done'>('loading')
  const searchParams = useSearchParams()

  useEffect(() => {
    async function activate() {
      // Mark user as subscribed in their metadata
      await supabase.auth.updateUser({
        data: { subscription_status: 'active' },
      })
      setStatus('done')
      setTimeout(() => { window.location.href = '/onboarding' }, 2000)
    }
    activate()
  }, [searchParams])

  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', maxWidth: 360 }}>
        {status === 'loading' ? (
          <>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{ width: 48, height: 48, border: '3px solid #1a1a1a', borderTopColor: '#FFD700', borderRadius: '50%', margin: '0 auto 24px' }} />
            <p style={{ color: '#555', fontSize: 16 }}>Confirming your payment…</p>
          </>
        ) : (
          <>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{ fontSize: 64, marginBottom: 20 }}>🎉</motion.div>
            <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 900, marginBottom: 10, letterSpacing: '-0.5px' }}>Payment Confirmed!</h2>
            <p style={{ color: '#555', fontSize: 15 }}>Welcome to GramScaling. Setting up your dashboard…</p>
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
