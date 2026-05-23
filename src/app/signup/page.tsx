'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()

  const inputStyle = {
    width: '100%', padding: '15px 16px',
    background: '#111', border: '1px solid #1a1a1a',
    borderRadius: 12, color: '#fff', fontSize: 16,
    boxSizing: 'border-box' as const, outline: 'none',
  }

  async function handleSignUp(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password) { setError('Please fill in all fields'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true); setError('')
    const result = await signUp(email.trim(), password, name.trim())
    if (result.error) { setError(result.error); setLoading(false); return }
    // Always go to payment — no free access
    window.location.href = '/payment'
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

        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 900, textAlign: 'center', marginBottom: 6, letterSpacing: '-0.5px' }}>Create Your Account</h1>
        <p style={{ color: '#444', textAlign: 'center', marginBottom: 32, fontSize: 14 }}>Start your 5-day free trial</p>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, textAlign: 'center' }}>
              <p style={{ color: '#ff6b6b', fontSize: 14, margin: 0 }}>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} autoComplete="name" />
          <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} autoComplete="email" />
          <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} autoComplete="new-password" />

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            style={{ width: '100%', padding: '16px', background: loading ? '#111' : '#FFD700', border: loading ? '1px solid #1a1a1a' : 'none', borderRadius: 50, color: loading ? '#444' : '#000', fontSize: 17, fontWeight: 900, cursor: loading ? 'default' : 'pointer', marginTop: 4 }}
          >
            {loading ? 'Creating account…' : 'Continue →'}
          </motion.button>
        </form>

        <p style={{ color: '#222', fontSize: 12, textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
          By continuing you agree to our{' '}
          <Link href="/terms" style={{ color: '#444', textDecoration: 'underline' }}>Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" style={{ color: '#444', textDecoration: 'underline' }}>Privacy Policy</Link>
        </p>

        <p style={{ color: '#333', textAlign: 'center', marginTop: 24, fontSize: 14 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 700 }}>Sign In</Link>
        </p>
      </motion.div>
    </div>
  )
}
