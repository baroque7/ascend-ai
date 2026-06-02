'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/hooks/useTranslation'

export default function ContactPage() {
  const { user, loading: authLoading } = useAuth()
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot — humans leave this blank
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, website }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || t('contact.error'))
        setLoading(false)
        return
      }
      setSuccess(true)
    } catch {
      setError(t('contact.error'))
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 480 }}
      >
        <Link href="/" style={{ display: 'block', textAlign: 'center', color: '#FFD700', fontWeight: 900, fontSize: 20, textDecoration: 'none', marginBottom: 36 }}>
          GramScaling
        </Link>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
              <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 900, marginBottom: 10 }}>{t('contact.success.title')}</h2>
              <p style={{ color: '#444', fontSize: 15, marginBottom: 28 }}>{t('contact.success.desc')}</p>
              <Link href={!authLoading && user ? '/dashboard/settings' : '/'} style={{ color: '#FFD700', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                {!authLoading && user ? t('contact.success.back_settings') : t('contact.success.back_home')}
              </Link>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 900, textAlign: 'center', marginBottom: 6, letterSpacing: '-0.5px' }}>{t('contact.title')}</h1>
              <p style={{ color: '#444', textAlign: 'center', fontSize: 15, marginBottom: 32 }}>{t('contact.desc')}</p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Honeypot — hidden from humans, bots fill it in */}
                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  autoComplete="off"
                  tabIndex={-1}
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                />
                <input
                  type="text"
                  placeholder={t('contact.name')}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '14px 16px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12, color: '#fff', fontSize: 15, boxSizing: 'border-box', outline: 'none' }}
                />
                <input
                  type="email"
                  placeholder={t('contact.email')}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '14px 16px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12, color: '#fff', fontSize: 15, boxSizing: 'border-box', outline: 'none' }}
                />
                <textarea
                  placeholder={t('contact.message')}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  rows={5}
                  style={{ width: '100%', padding: '14px 16px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12, color: '#fff', fontSize: 15, boxSizing: 'border-box', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                />

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{ color: '#ff6b6b', fontSize: 13, textAlign: 'center', margin: 0 }}
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.98 }}
                  style={{ width: '100%', padding: '16px', background: loading ? '#111' : '#FFD700', border: loading ? '1px solid #1a1a1a' : 'none', borderRadius: 50, color: loading ? '#444' : '#000', fontSize: 16, fontWeight: 900, cursor: loading ? 'default' : 'pointer', marginTop: 4 }}
                >
                  {loading ? t('contact.sending') : t('contact.submit')}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
