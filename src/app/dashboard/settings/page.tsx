'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function Settings() {
  const { user, signOut } = useAuth()
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{background:'#000',minHeight:'100vh',padding:'24px',paddingBottom:'80px'}}>
      
      <h1 style={{color:'#FFD700',fontSize:'22px',fontWeight:'bold',marginBottom:'32px'}}>Settings</h1>

      <div style={{marginBottom:'24px'}}>
        <h2 style={{color:'#fff',fontSize:'16px',fontWeight:'bold',marginBottom:'16px',borderBottom:'1px solid #222',paddingBottom:'8px'}}>My Profile</h2>
        <div style={{marginBottom:'12px'}}>
          <label style={{color:'#666',fontSize:'13px',display:'block',marginBottom:'6px'}}>Display Name</label>
          <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={{width:'100%',padding:'12px',background:'#111',border:'1px solid #222',borderRadius:'8px',color:'#fff',fontSize:'15px',boxSizing:'border-box',outline:'none'}}/>
        </div>
        <div style={{marginBottom:'16px'}}>
          <label style={{color:'#666',fontSize:'13px',display:'block',marginBottom:'6px'}}>Email</label>
          <input type="email" value={user?.email || ''} readOnly style={{width:'100%',padding:'12px',background:'#0a0a0a',border:'1px solid #1a1a1a',borderRadius:'8px',color:'#555',fontSize:'15px',boxSizing:'border-box',outline:'none'}}/>
        </div>
        <button onClick={handleSave} style={{background:'#FFD700',border:'none',borderRadius:'8px',padding:'12px 24px',color:'#000',fontSize:'15px',fontWeight:'bold',cursor:'pointer'}}>
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div style={{marginBottom:'24px'}}>
        <h2 style={{color:'#fff',fontSize:'16px',fontWeight:'bold',marginBottom:'16px',borderBottom:'1px solid #222',paddingBottom:'8px'}}>My TikTok Account</h2>
        <div style={{background:'#111',border:'1px solid #222',borderRadius:'8px',padding:'16px'}}>
          <p style={{color:'#fff',fontSize:'14px',margin:0,marginBottom:'4px'}}>Status: <span style={{color:'#FFD700'}}>Setting Up</span></p>
          <p style={{color:'#666',fontSize:'13px',margin:0}}>Your US TikTok account is being created. We will notify you when ready.</p>
        </div>
      </div>

      <div style={{marginBottom:'24px'}}>
        <h2 style={{color:'#fff',fontSize:'16px',fontWeight:'bold',marginBottom:'16px',borderBottom:'1px solid #222',paddingBottom:'8px'}}>Support</h2>
        <a href="mailto:baroqueincoporated@gmail.com" style={{display:'block',color:'#FFD700',textDecoration:'none',fontSize:'15px',marginBottom:'12px'}}>Contact Us</a>
        <Link href="/terms" style={{display:'block',color:'#666',textDecoration:'none',fontSize:'15px',marginBottom:'12px'}}>Terms of Service</Link>
        <Link href="/privacy" style={{display:'block',color:'#666',textDecoration:'none',fontSize:'15px'}}>Privacy Policy</Link>
      </div>

      <button onClick={signOut} style={{width:'100%',padding:'14px',background:'transparent',border:'1px solid #ff4444',borderRadius:'8px',color:'#ff4444',fontSize:'16px',fontWeight:'bold',cursor:'pointer'}}>
        Sign Out
      </button>

    </div>
  )
}