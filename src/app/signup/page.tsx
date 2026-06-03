'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { signUp, supabase } = useAuth()
  const { t } = useTranslation()

  const inputStyle = {
    width: '100%', padding: '15px 16px',
    background: '#111', border: '1px solid #1a1a1a',
    borderRadius: 12, color: '#fff', fontSize: 16,
    boxSizing: 'border-box' as const, outline: 'none',
  }

  // Tab sync — when user verifies in another tab, redirect this tab to /payment
  useEffect(() => {
    if (!sent) return
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (event === 'SIGNED_IN' && session) {
        window.location.href = '/payment'
      }
    })
    return () => subscription.unsubscribe()
  }, [sent])

  async function handleSignUp(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password) { setError(t('signup.error.fields')); return }
    if (password.length < 6) { setError(t('signup.error.password')); return }
    setLoading(true); setError('')
    const result = await signUp(email.trim(), password, name.trim())
    if (result.error) { setError(result.error); setLoading(false); return }
    setSent(true)
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
            <Link href="/" style={{ display: 'block', textAlign: 'center', color: '#FFD700', fontWeight: 900, fontSize: 22, textDecoration: 'none', marginBottom: 40, letterSpacing: '-0.5px' }}>
              GramScaling
            </Link>

            <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 900, textAlign: 'center', marginBottom: 6, letterSpacing: '-0.5px' }}>{t('signup.title')}</h1>
            <p style={{ color: '#444', textAlign: 'center', marginBottom: 32, fontSize: 14 }}>{t('signup.subtitle')}</p>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, textAlign: 'center' }}>
                  <p style={{ color: '#ff6b6b', fontSize: 14, margin: 0 }}>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input type="text" placeholder={t('signup.name')} value={name} onChange={e => setName(e.target.value)} style={inputStyle} autoComplete="name" />
              <input type="email" placeholder={t('signup.email')} value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} autoComplete="email" />
              <input type="password" placeholder={t('signup.password')} value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} autoComplete="new-password" />

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                style={{ width: '100%', padding: '16px', background: loading ? '#111' : '#FFD700', border: loading ? '1px solid #1a1a1a' : 'none', borderRadius: 50, color: loading ? '#444' : '#000', fontSize: 17, fontWeight: 900, cursor: loading ? 'default' : 'pointer', marginTop: 4 }}
              >
                {loading ? t('signup.creating') : t('signup.continue')}
              </motion.button>
            </form>

            <p style={{ color: '#222', fontSize: 12, textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
              {t('signup.terms_prefix')}{' '}
              <Link href="/terms" style={{ color: '#444', textDecoration: 'underline' }}>{t('signup.terms')}</Link>
              {' '}{t('signup.and')}{' '}
              <Link href="/privacy" style={{ color: '#444', textDecoration: 'underline' }}>{t('signup.privacy')}</Link>
            </p>

            <p style={{ color: '#333', textAlign: 'center', marginTop: 24, fontSize: 14 }}>
              {t('signup.have_account')}{' '}
              <Link href="/login" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 700 }}>{t('signup.signin')}</Link>
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
              ✉️
            </div>
            <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.5px' }}>{t('signup.check_email.title')}</h1>
            <p style={{ color: '#555', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
              {t('signup.check_email.sent')}{' '}
              <span style={{ color: '#FFD700' }}>{email}</span>.{' '}
              {t('signup.check_email.instruction')}
            </p>
            <p style={{ color: '#333', fontSize: 13, lineHeight: 1.6, marginBottom: 32 }}>
              {t('signup.check_email.spam')}
            </p>
            <button
              onClick={() => setSent(false)}
              style={{ color: '#555', fontSize: 14, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {t('signup.try_different')}
            </button>
            <div style={{ marginTop: 24 }}>
              <Link href="/login" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>{t('signup.back_signin')}</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}