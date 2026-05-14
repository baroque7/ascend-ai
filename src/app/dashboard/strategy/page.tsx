'use client'
import Link from 'next/link'

export default function Strategy() {
  return (
    <div style={{background:'#000',minHeight:'100vh',padding:'20px',paddingBottom:'100px'}}>
      <div style={{display:'flex',alignItems:'center',marginBottom:'28px'}}>
        <Link href="/dashboard" style={{color:'#FFD700',textDecoration:'none',fontSize:'22px',fontWeight:'bold',marginRight:'12px'}}>←</Link>
        <h1 style={{color:'#fff',fontSize:'20px',fontWeight:'bold',margin:0}}>My US Strategy</h1>
      </div>

      <div style={{background:'#111',border:'2px dashed #333',borderRadius:'14px',padding:'40px 20px',textAlign:'center'}}>
        <div style={{fontSize:'48px',marginBottom:'16px'}}>📊</div>
        <h2 style={{color:'#fff',fontSize:'18px',fontWeight:'bold',marginBottom:'8px'}}>No Strategy Yet</h2>
        <p style={{color:'#555',fontSize:'14px',marginBottom:'24px',lineHeight:'1.6'}}>Analyze your Instagram first to get your personalized US growth strategy.</p>
        <Link href="/dashboard/analyze" style={{background:'#FFD700',color:'#000',padding:'14px 28px',borderRadius:'50px',textDecoration:'none',fontWeight:'bold',fontSize:'16px'}}>
          Analyze My Instagram →
        </Link>
      </div>
    </div>
  )
}