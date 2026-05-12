'use client'
import { useState } from 'react'
import Link from 'next/link'

const ideas = [
  {id:1,concept:"Morning Routine Aesthetic",description:"Show your morning routine with trending US sounds. Keep it under 30 seconds.",caption:"POV your morning hits different #morningroutine #aesthetic #fyp",hashtags:"#morningroutine #aesthetic #fyp #foryou #viral",time:"7:00 AM EST"},
  {id:2,concept:"Confidence Glow Up",description:"Before and after transformation video. US audiences love authenticity.",caption:"She said glow different #glowup #confidence #latina",hashtags:"#glowup #confidence #latina #fyp #foryoupage",time:"6:00 PM EST"},
  {id:3,concept:"Day In My Life",description:"Follow me around vlog style. US audiences connect with lifestyle content.",caption:"A day in my life #dayinmylife #vlog #fyp",hashtags:"#dayinmylife #vlog #fyp #lifestyle",time:"12:00 PM EST"},
  {id:4,concept:"Outfit Of The Day",description:"Outfit transition with trending US sound. Fashion content performs well.",caption:"OOTD because why not #ootd #fashion #style",hashtags:"#ootd #fashion #style #fyp #outfitoftheday",time:"3:00 PM EST"},
  {id:5,concept:"Latina Girl Aesthetic",description:"Embrace your culture in a trendy way. US audiences love authentic Latin content.",caption:"Latina and proud #latina #aesthetic #fyp",hashtags:"#latina #aesthetic #fyp #latinagirl #viral",time:"8:00 PM EST"}
]

export default function Ideas() {
  const [copied, setCopied] = useState(0)

  function copyCaption(id: number, caption: string) {
    navigator.clipboard.writeText(caption)
    setCopied(id)
    setTimeout(() => setCopied(0), 2000)
  }

  return (
    <div style={{background:'#000',minHeight:'100vh',padding:'24px',paddingBottom:'80px'}}>
      <div style={{display:'flex',alignItems:'center',marginBottom:'24px'}}>
        <Link href="/dashboard" style={{color:'#666',textDecoration:'none',marginRight:'16px',fontSize:'20px'}}>←</Link>
        <h1 style={{color:'#FFD700',fontSize:'22px',fontWeight:'bold',margin:0}}>Today's Ideas</h1>
      </div>
      <p style={{color:'#666',fontSize:'14px',marginBottom:'24px'}}>5 content ideas optimized for US TikTok audiences</p>
      {ideas.map((idea) => (
        <div key={idea.id} style={{background:'#111',border:'1px solid #222',borderRadius:'12px',padding:'20px',marginBottom:'16px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px'}}>
            <h3 style={{color:'#fff',fontSize:'16px',fontWeight:'bold',margin:0}}>{idea.concept}</h3>
            <span style={{color:'#FFD700',fontSize:'12px',whiteSpace:'nowrap',marginLeft:'8px'}}>{idea.time}</span>
          </div>
          <p style={{color:'#666',fontSize:'14px',marginBottom:'12px',lineHeight:'1.5'}}>{idea.description}</p>
          <div style={{background:'#000',borderRadius:'8px',padding:'12px',marginBottom:'12px'}}>
            <p style={{color:'#999',fontSize:'13px',margin:0,lineHeight:'1.5'}}>{idea.caption}</p>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <p style={{color:'#444',fontSize:'12px',margin:0}}>{idea.hashtags}</p>
            <button onClick={() => copyCaption(idea.id, idea.caption)} style={{background:copied===idea.id?'#22c55e':'#FFD700',border:'none',borderRadius:'8px',padding:'8px 16px',color:'#000',fontSize:'13px',fontWeight:'bold',cursor:'pointer',whiteSpace:'nowrap',marginLeft:'8px'}}>
              {copied===idea.id?'Copied!':'Copy'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}