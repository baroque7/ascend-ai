'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'
import { useTranslation } from '@/hooks/useTranslation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { t } = useTranslation()

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!email.trim()) { setError(t('forgot.error.email')); return }
    setLoading(true); setError('')
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      })
      if (err) throw err
      setSent(true)
    } catch (err: any) {
      setError(err.message || t('forgot.error.failed'))
    }
    setLoading(false)
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            style={{ width: '100%', maxWidth: 400 }}
          >
            <Link href="/" style={{ display: 'block', textAlign: 'center', color: '#FFD700', fontWeight: 900, fontSize: 22, textDecoration: 'none', marginBottom: 40 }}>
              GramScaling
            </Link>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ width: 64, height: 64, background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>
                ✉️
              </div>
              <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.5px' }}>{t('forgot.title')}</h1>
              <p style={{ color: '#555', fontSize: 15, lineHeight: 1.6 }}>{t('forgot.subtitle')}</p>
            </div>

            {error && (
              <div style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: 10, padding: '12px', marginBottom: 16, textAlign: 'center' }}>
                <p style={{ color: '#ff6b6b', fontSize: 14, margin: 0 }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <input
                type="email" placeholder={t('forgot.email')} value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '15px 16px', background: '#111', border: '1px solid #1a1a1a', borderRadius: 12, color: '#fff', fontSize: 16, boxSizing: 'border-box', outline: 'none', marginBottom: 16 }}
                autoComplete="email"
              />
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                style={{ width: '100%', padding: '16px', background: loading ? '#B8960C' : '#FFD700', border: 'none', borderRadius: 50, color: '#000', fontSize: 17, fontWeight: 800, cursor: loading ? 'default' : 'pointer' }}
              >
                {loading ? t('forgot.sending') : t('forgot.send')}
              </motion.button>
            </form>

            <p style={{ color: '#444', textAlign: 'center', marginTop: 28, fontSize: 14 }}>
              <Link href="/login" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 700 }}>{t('forgot.back_signin')}</Link>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}
          >
            <div style={{ width: 72, height: 72, background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 32 }}>
              ✅
            </div>
            <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.5px' }}>{t('forgot.check_email.title')}</h1>
            <p style={{ color: '#555', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
              {t('forgot.check_email.sent')}{' '}
              <span style={{ color: '#FFD700' }}>{email}</span>.{' '}
              {t('forgot.check_email.instruction')}
            </p>
            <button
              onClick={() => setSent(false)}
              style={{ color: '#555', fontSize: 14, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {t('forgot.try_different')}
            </button>
            <div style={{ marginTop: 24 }}>
              <Link href="/login" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>{t('forgot.back_signin')}</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
