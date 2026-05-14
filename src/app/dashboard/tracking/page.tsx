'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Tracking() {
  const [followers, setFollowers] = useState('')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{background:'#000',minHeight:'100vh',padding:'20px',paddingBottom:'100px'}}>
      <div style={{display:'flex',alignItems:'center',marginBottom:'28px'}}>
        <Link href="/dashboard" style={{color:'#FFD700',textDecoration:'none',fontSize:'22px',fontWeight:'bold',marginRight:'12px'}}>←</Link>
        <h1 style={{color:'#fff',fontSize:'20px',fontWeight:'bold',margin:0}}>Growth Tracking</h1>
      </div>

      <p style={{color:'#555',fontSize:'14px',marginBottom:'24px'}}>Track your Instagram growth over time. Update your stats weekly to see your progress.</p>

      <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'14px',padding:'20px',marginBottom:'16px'}}>
        <h2 style={{color:'#fff',fontSize:'16px',fontWeight:'bold',marginBottom:'16px'}}>Update Your Stats</h2>
        <div style={{marginBottom:'12px'}}>
          <label style={{color:'#666',fontSize:'13px',display:'block',marginBottom:'6px'}}>Current Followers</label>
          <input type="number" value={followers} onChange={e=>setFollowers(e.target.value)} placeholder="e.g. 5000" style={{width:'100%',padding:'12px',background:'#000',border:'1px solid #222',borderRadius:'8px',color:'#fff',fontSize:'16px',boxSizing:'border-box',outline:'none'}}/>
        </div>
        <button onClick={handleSave} style={{background:'#FFD700',border:'none',borderRadius:'8px',padding:'12px 24px',color:'#000',fontSize:'15px',fontWeight:'bold',cursor:'pointer'}}>
          {saved ? '✅ Saved!' : 'Save Stats'}
        </button>
      </div>

      <div style={{background:'#111',border:'2px dashed #333',borderRadius:'14px',padding:'32px 20px',textAlign:'center'}}>
        <div style={{fontSize:'40px',marginBottom:'12px'}}>📈</div>
        <p style={{color:'#555',fontSize:'14px',margin:0}}>Your growth chart will appear here after you track your stats for 2 weeks.</p>
      </div>
    </div>
  )
}