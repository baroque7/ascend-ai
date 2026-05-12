'use client'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function Dashboard() {
  const { user, signOut } = useAuth()

  return (
    <div style={{background:'#000',minHeight:'100vh',padding:'24px',paddingBottom:'80px'}}>
      
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'32px'}}>
        <h1 style={{color:'#FFD700',fontSize:'24px',fontWeight:'bold',margin:0}}>ascend.ai</h1>
        <button onClick={signOut} style={{background:'transparent',border:'1px solid #333',borderRadius:'8px',color:'#666',padding:'8px 16px',cursor:'pointer',fontSize:'14px'}}>
          Sign Out
        </button>
      </div>

      <div style={{marginBottom:'32px'}}>
        <h2 style={{color:'#fff',fontSize:'22px',fontWeight:'bold',marginBottom:'4px'}}>
          Welcome back 👋
        </h2>
        <p style={{color:'#666',fontSize:'14px',margin:0}}>
          {user?.email}
        </p>
      </div>

      <div style={{background:'#111',border:'1px solid #222',borderRadius:'12px',padding:'20px',marginBottom:'16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
          <h3 style={{color:'#fff',fontSize:'16px',fontWeight:'bold',margin:0}}>Your TikTok Account</h3>
          <span style={{background:'#FFD700',color:'#000',fontSize:'12px',fontWeight:'bold',padding:'4px 10px',borderRadius:'50px'}}>Setting Up</span>
        </div>
        <p style={{color:'#666',fontSize:'14px',margin:0}}>Your US TikTok account is being created. This usually takes 24 hours. We will notify you when it is ready.</p>
      </div>

      <Link href="/dashboard/ideas" style={{display:'block',background:'#FFD700',borderRadius:'12px',padding:'16px 20px',textDecoration:'none',marginBottom:'16px'}}>
        <h3 style={{color:'#000',fontSize:'16px',fontWeight:'bold',margin:0,marginBottom:'4px'}}>💡 Today's Content Ideas</h3>
        <p style={{color:'#333',fontSize:'14px',margin:0}}>See what to post today to grow your US audience</p>
      </Link>

      <Link href="/dashboard/upload" style={{display:'block',background:'#111',border:'1px solid #222',borderRadius:'12px',padding:'16px 20px',textDecoration:'none'}}>
        <h3 style={{color:'#fff',fontSize:'16px',fontWeight:'bold',margin:0,marginBottom:'4px'}}>⬆️ Upload Content</h3>
        <p style={{color:'#666',fontSize:'14px',margin:0}}>Upload your video and we will post it from a US device</p>
      </Link>

    </div>
  )
}