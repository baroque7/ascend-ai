'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Analyze() {
  const [username, setUsername] = useState('')
  const [niche, setNiche] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  async function handleAnalyze() {
    if (!username) {
      setError('Please enter your Instagram username')
      return
    }
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.replace('@', ''), niche })
      })
      const data = await response.json()
      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{background:'#000',minHeight:'100vh',padding:'20px',paddingBottom:'100px'}}>
      
      <div style={{display:'flex',alignItems:'center',marginBottom:'28px'}}>
        <Link href="/dashboard" style={{color:'#FFD700',textDecoration:'none',fontSize:'22px',fontWeight:'bold',marginRight:'12px'}}>←</Link>
        <h1 style={{color:'#fff',fontSize:'20px',fontWeight:'bold',margin:0}}>Analyze My Instagram</h1>
      </div>

      {!result ? (
        <div>
          <p style={{color:'#555',fontSize:'14px',marginBottom:'24px'}}>Enter your Instagram handle and our AI will analyze your profile and create your personalized US growth strategy.</p>

          <div style={{marginBottom:'16px'}}>
            <label style={{color:'#fff',fontSize:'14px',fontWeight:'bold',display:'block',marginBottom:'8px'}}>Instagram Username</label>
            <input
              type="text"
              value={username}
              onChange={e=>setUsername(e.target.value)}
              placeholder="@yourhandle"
              style={{width:'100%',padding:'14px',background:'#111',border:'1px solid #222',borderRadius:'12px',color:'#fff',fontSize:'16px',boxSizing:'border-box',outline:'none'}}
            />
          </div>

          <div style={{marginBottom:'24px'}}>
            <label style={{color:'#fff',fontSize:'14px',fontWeight:'bold',display:'block',marginBottom:'8px'}}>Your Content Niche (Optional)</label>
            <input
              type="text"
              value={niche}
              onChange={e=>setNiche(e.target.value)}
              placeholder="e.g. lifestyle, fitness, beauty, fashion..."
              style={{width:'100%',padding:'14px',background:'#111',border:'1px solid #222',borderRadius:'12px',color:'#fff',fontSize:'16px',boxSizing:'border-box',outline:'none'}}
            />
            <p style={{color:'#555',fontSize:'12px',marginTop:'6px'}}>Not sure? Leave blank and we'll figure it out</p>
          </div>

          {error && <p style={{color:'#ff4444',fontSize:'14px',marginBottom:'16px',textAlign:'center'}}>{error}</p>}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{width:'100%',padding:'16px',background:'#FFD700',border:'none',borderRadius:'50px',color:'#000',fontSize:'18px',fontWeight:'bold',cursor:'pointer'}}
          >
            {loading ? 'Analyzing your profile...' : 'Analyze My Instagram 🔍'}
          </button>

          <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'14px',padding:'16px',marginTop:'24px'}}>
            <p style={{color:'#FFD700',fontSize:'13px',fontWeight:'bold',margin:0,marginBottom:'8px'}}>What you'll get:</p>
            <p style={{color:'#666',fontSize:'13px',margin:0,marginBottom:'6px'}}>✓ Your perfect US market niche</p>
            <p style={{color:'#666',fontSize:'13px',margin:0,marginBottom:'6px'}}>✓ Content strategy personalized to your style</p>
            <p style={{color:'#666',fontSize:'13px',margin:0,marginBottom:'6px'}}>✓ Best hashtags for US audiences</p>
            <p style={{color:'#666',fontSize:'13px',margin:0,marginBottom:'6px'}}>✓ Optimal posting times EST</p>
            <p style={{color:'#666',fontSize:'13px',margin:0}}>✓ Profile optimization tips</p>
          </div>
        </div>
      ) : (
        <div>
          <div style={{background:'#111',border:'2px solid #FFD700',borderRadius:'14px',padding:'20px',marginBottom:'16px'}}>
            <p style={{color:'#FFD700',fontSize:'13px',fontWeight:'bold',margin:0,marginBottom:'4px'}}>🎯 YOUR US NICHE</p>
            <p style={{color:'#fff',fontSize:'18px',fontWeight:'bold',margin:0}}>{result.niche}</p>
          </div>

          <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'14px',padding:'20px',marginBottom:'16px'}}>
            <p style={{color:'#FFD700',fontSize:'13px',fontWeight:'bold',margin:0,marginBottom:'12px'}}>📊 PROFILE ANALYSIS</p>
            <p style={{color:'#ccc',fontSize:'14px',margin:0,lineHeight:'1.6'}}>{result.analysis}</p>
          </div>

          <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'14px',padding:'20px',marginBottom:'16px'}}>
            <p style={{color:'#FFD700',fontSize:'13px',fontWeight:'bold',margin:0,marginBottom:'12px'}}>🚀 YOUR US GROWTH STRATEGY</p>
            <p style={{color:'#ccc',fontSize:'14px',margin:0,lineHeight:'1.6'}}>{result.strategy}</p>
          </div>

          <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'14px',padding:'20px',marginBottom:'16px'}}>
            <p style={{color:'#FFD700',fontSize:'13px',fontWeight:'bold',margin:0,marginBottom:'12px'}}>#️⃣ TOP HASHTAGS FOR US</p>
            <p style={{color:'#ccc',fontSize:'14px',margin:0,lineHeight:'1.8'}}>{result.hashtags}</p>
          </div>

          <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'14px',padding:'20px',marginBottom:'16px'}}>
            <p style={{color:'#FFD700',fontSize:'13px',fontWeight:'bold',margin:0,marginBottom:'12px'}}>⏰ BEST POSTING TIMES (EST)</p>
            <p style={{color:'#ccc',fontSize:'14px',margin:0,lineHeight:'1.8'}}>{result.postingTimes}</p>
          </div>

          <div style={{background:'#111',border:'1px solid #1e1e1e',borderRadius:'14px',padding:'20px',marginBottom:'24px'}}>
            <p style={{color:'#FFD700',fontSize:'13px',fontWeight:'bold',margin:0,marginBottom:'12px'}}>✨ PROFILE OPTIMIZATION</p>
            <p style={{color:'#ccc',fontSize:'14px',margin:0,lineHeight:'1.6'}}>{result.profileTips}</p>
          </div>

          <button
            onClick={()=>setResult(null)}
            style={{width:'100%',padding:'14px',background:'transparent',border:'1px solid #333',borderRadius:'50px',color:'#666',fontSize:'16px',cursor:'pointer',marginBottom:'12px'}}
          >
            Analyze Another Account
          </button>

          <Link href="/dashboard/ideas" style={{display:'block',background:'#FFD700',borderRadius:'50px',padding:'16px',textAlign:'center',textDecoration:'none',color:'#000',fontSize:'16px',fontWeight:'bold'}}>
            See Today's Content Ideas →
          </Link>
        </div>
      )}
    </div>
  )
}