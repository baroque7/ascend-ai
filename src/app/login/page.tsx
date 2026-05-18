'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  async function handleLogin() {
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    setError('')
    const result = await signIn(email, password)
    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }
    window.location.href = '/dashboard'
  }

  return (
    <div style={{background:'#000',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
      <div style={{width:'100%',maxWidth:'400px'}}>
        <h1 style={{color:'#FFD700',fontSize:'28px',fontWeight:'bold',textAlign:'center',marginBottom:'8px'}}>Welcome Back</h1>
        <p style={{color:'#999',textAlign:'center',marginBottom:'32px',fontSize:'15px'}}>Sign in to your GramScaling account</p>
        {error && <p style={{color:'#ff4444',marginBottom:'16px',textAlign:'center',fontSize:'14px'}}>{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:'14px',background:'#111',border:'1px solid #222',borderRadius:'8px',color:'#fff',fontSize:'16px',marginBottom:'12px',boxSizing:'border-box',outline:'none'}}/>
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:'14px',background:'#111',border:'1px solid #222',borderRadius:'8px',color:'#fff',fontSize:'16px',marginBottom:'24px',boxSizing:'border-box',outline:'none'}}/>
        <button onClick={handleLogin} disabled={loading} style={{width:'100%',padding:'16px',background:'#FFD700',border:'none',borderRadius:'50px',color:'#000',fontSize:'18px',fontWeight:'bold',cursor:'pointer'}}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        <p style={{color:'#666',textAlign:'center',marginTop:'24px',fontSize:'14px'}}>
          Don't have an account? <Link href="/signup" style={{color:'#FFD700',textDecoration:'none'}}>Sign Up</Link>
        </p>
      </div>
    </div>
  )
}