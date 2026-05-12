'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [promo, setPromo] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()

  async function handleSignUp() {
    if (!name || !email || !password) {
      setError('Please fill in all required fields')
      return
    }
    setLoading(true)
    setError('')
    const result = await signUp(email, password, name, promo)
    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }
    if (promo === 'MIHAWK41') {
      window.location.href = '/dashboard'
    } else {
      window.location.href = '/payment'
    }
  }

  return (
    <div style={{background:'#000000',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
      <div style={{width:'100%',maxWidth:'400px'}}>
        <h1 style={{color:'#FFD700',fontSize:'32px',fontWeight:'bold',textAlign:'center',marginBottom:'8px'}}>Create Account</h1>
        <p style={{color:'#999',textAlign:'center',marginBottom:'32px',fontSize:'15px'}}>Start your US TikTok and Instagram journey</p>
        {error && <p style={{color:'#ff4444',marginBottom:'16px',textAlign:'center',fontSize:'14px'}}>{error}</p>}
        <input 
          type="text" 
          placeholder="Full Name" 
          value={name} 
          onChange={e=>setName(e.target.value)} 
          style={{
            width:'100%',
            padding:'14px',
            background:'#111111',
            border:'1px solid #222',
            borderRadius:'8px',
            color:'#fff',
            fontSize:'16px',
            marginBottom:'12px',
            boxSizing:'border-box',
            outline:'none'
          }}
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e=>setEmail(e.target.value)} 
          style={{
            width:'100%',
            padding:'14px',
            background:'#111111',
            border:'1px solid #222',
            borderRadius:'8px',
            color:'#fff',
            fontSize:'16px',
            marginBottom:'12px',
            boxSizing:'border-box',
            outline:'none'
          }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e=>setPassword(e.target.value)} 
          style={{
            width:'100%',
            padding:'14px',
            background:'#111111',
            border:'1px solid #222',
            borderRadius:'8px',
            color:'#fff',
            fontSize:'16px',
            marginBottom:'12px',
            boxSizing:'border-box',
            outline:'none'
          }}
        />
        <input 
          type="text" 
          placeholder="Promo Code (Optional)" 
          value={promo} 
          onChange={e=>setPromo(e.target.value)} 
          style={{
            width:'100%',
            padding:'14px',
            background:'#111111',
            border:'1px solid #222',
            borderRadius:'8px',
            color:'#fff',
            fontSize:'16px',
            marginBottom:'24px',
            boxSizing:'border-box',
            outline:'none'
          }}
        />
        <button 
          onClick={handleSignUp} 
          disabled={loading} 
          style={{
            width:'100%',
            padding:'16px',
            background:'#FFD700',
            border:'none',
            borderRadius:'50px',
            color:'#000',
            fontSize:'18px',
            fontWeight:'bold',
            cursor:'pointer'
          }}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
        <p style={{color:'#666',textAlign:'center',marginTop:'24px',fontSize:'14px'}}>
          Already have an account? 
          <Link href="/login" style={{color:'#FFD700',textDecoration:'none'}}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}
