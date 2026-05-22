'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, isSubscribed } = useAuth()

  const inputStyle = {
    width: '100%', padding: '15px 16px',
    background: '#111', border: '1px solid #1a1a1a',
    borderRadius: 12, color: '#fff', fontSize: 16,
    boxSizing: 'border-box' as const, outline: 'none',
  }

  async function handleLogin(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields'); return }
    setLoading(true); setError('')
    const result = await signIn(email, password)
    if (result.error) { setError(result.error); setLoading(false); return }
    // Redirect based on subscription status
    if (result.subscribed) {
      window.location.href = '/dashboard'
    } else {
      window.location.href = '/payment'
    }
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 400 }}
      >
        <Link href="/" style={{ display: 'block', textAlign: 'center', color: '#FFD700', fontWeight: 900, fontSize: 22, textDecoration: 'none', marginBottom: 40, letterSpacing: '-0.5px' }}>
          GramScaling
        </Link>

        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 900, textAlign: 'center', marginBottom: 6, letterSpacing: '-0.5px' }}>Welcome Back</h1>
        <p style={{ color: '#444', textAlign: 'center', marginBottom: 32, fontSize: 14 }}>Sign in to your account</p>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, textAlign: 'center' }}>
              <p style={{ color: '#ff6b6b', fontSize: 14, margin: 0 }}>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} autoComplete="email" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} autoComplete="current-password" />

          <div style={{ textAlign: 'right', marginTop: -4, marginBottom: 4 }}>
            <Link href="/forgot-password" style={{ color: '#444', fontSize: 13, textDecoration: 'none' }}>Forgot password?</Link>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            style={{ width: '100%', padding: '16px', background: loading ? '#111' : '#FFD700', border: loading ? '1px solid #1a1a1a' : 'none', borderRadius: 50, color: loading ? '#444' : '#000', fontSize: 17, fontWeight: 900, cursor: loading ? 'default' : 'pointer' }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </motion.button>
        </form>

        <p style={{ color: '#333', textAlign: 'center', marginTop: 28, fontSize: 14 }}>
          Don't have an account?{' '}
          <Link href="/signup" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 700 }}>Sign Up</Link>
        </p>
      </motion.div>
    </div>
  )
}
