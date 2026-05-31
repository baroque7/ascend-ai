'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { motion } from 'framer-motion'
import { Suspense } from 'react'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function CallbackContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    async function handleCallback() {
      const type = searchParams.get('type')
      const code = searchParams.get('code')
      const tokenHash = searchParams.get('token_hash')
      const errorParam = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')

      if (errorParam) {
        setStatus('error')
        setMessage(errorDescription || 'Authentication failed. Please try again.')
        return
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          setStatus('error')
          setMessage(error.message)
          return
        }
      } else if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as any,
        })
        if (error) {
          setStatus('error')
          setMessage(error.message)
          return
        }
      }

      if (type === 'recovery') {
        setStatus('success')
        setMessage('Password reset successful! Redirecting…')
        setTimeout(() => router.push('/reset-password'), 2000)
      } else if (type === 'signup') {
        setStatus('success')
        setMessage('Email verified! Redirecting to payment…')
        setTimeout(() => router.push('/payment'), 2000)
      } else {
        setStatus('success')
        setMessage('Authenticated! Redirecting…')
        setTimeout(() => router.push('/dashboard'), 1500)
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: 'center', maxWidth: 360 }}
      >
        {status === 'loading' && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{ width: 48, height: 48, border: '3px solid #1a1a1a', borderTopColor: '#FFD700', borderRadius: '50%', margin: '0 auto 24px' }}
            />
            <p style={{ color: '#555', fontSize: 16 }}>Verifying…</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ fontSize: 52, marginBottom: 20 }}>✅</div>
            <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Success!</h2>
            <p style={{ color: '#555', fontSize: 15 }}>{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ fontSize: 52, marginBottom: 20 }}>❌</div>
            <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Something went wrong</h2>
            <p style={{ color: '#ff6b6b', fontSize: 15, marginBottom: 24 }}>{message}</p>
            <button
              onClick={() => router.push('/login')}
              style={{ background: '#FFD700', color: '#000', border: 'none', borderRadius: 50, padding: '14px 32px', fontSize: 16, fontWeight: 800, cursor: 'pointer' }}
            >
              Back to Sign In
            </button>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div style={{ background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid #1a1a1a', borderTopColor: '#FFD700', borderRadius: '50%' }} />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}