'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function ResetPassword() {
  const { supabase } = useAuth()
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const inputStyle = {
    width: '100%', padding: '15px 16px',
    background: '#111', border: '1px solid #1a1a1a',
    borderRadius: 12, color: '#fff', fontSize: 16,
    boxSizing: 'border-box' as const, outline: 'none',
  }

  async function handleReset(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!password || !confirm) { setError(t('reset.error.fields')); return }
    if (password.length < 6) { setError(t('reset.error.length')); return }
    if (password !== confirm) { setError(t('reset.error.match')); return }

    setLoading(true)
    setError('')

    try {
      const { error: err } = await supabase.auth.updateUser({ password })
      if (err) throw err
      setDone(true)
      setTimeout(() => { window.location.href = '/dashboard' }, 2000)
    } catch (err: any) {
      setError(err.message || t('reset.error.failed'))
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <AnimatePresence mode="wait">
        {!done ? (
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
                🔒
              </div>
              <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.5px' }}>{t('reset.title')}</h1>
              <p style={{ color: '#555', fontSize: 15, lineHeight: 1.6 }}>{t('reset.subtitle')}</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: 10, padding: '12px', marginBottom: 16, textAlign: 'center' }}>
                  <p style={{ color: '#ff6b6b', fontSize: 14, margin: 0 }}>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="password"
                placeholder={t('reset.password')}
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputStyle}
                autoComplete="new-password"
              />
              <input
                type="password"
                placeholder={t('reset.confirm')}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                style={inputStyle}
                autoComplete="new-password"
              />
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                style={{ width: '100%', padding: '16px', background: loading ? '#111' : '#FFD700', border: loading ? '1px solid #1a1a1a' : 'none', borderRadius: 50, color: loading ? '#444' : '#000', fontSize: 17, fontWeight: 900, cursor: loading ? 'default' : 'pointer', marginTop: 4 }}
              >
                {loading ? t('reset.updating') : t('reset.submit')}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}
          >
            <div style={{ fontSize: 52, marginBottom: 20 }}>✅</div>
            <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 12 }}>{t('reset.done.title')}</h2>
            <p style={{ color: '#555', fontSize: 15 }}>{t('reset.done.subtitle')}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}