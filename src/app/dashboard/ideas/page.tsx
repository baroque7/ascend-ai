'use client'
import { useState } from 'react'
import Link from 'next/link'

const ideas = [
  {
    id: 1,
    concept: "The Confidence Check",
    hook: "POV: You finally stopped caring what people think...",
    script: "Start with a close up of your face looking serious. Pause for 2 seconds. Then smile slowly and say: 'She said glow different. And she was right.' Cut to you looking amazing. End with a wink.",
    caption: "She said glow different 💫 and I finally believed her #confidence #glowup #latina #fyp",
    hashtags: "#confidence #glowup #latina #fyp #foryou #viral #selfcare",
    time: "6:00 PM EST",
    sound: "Use any trending soft beat or 'Espresso' by Sabrina Carpenter",
    tip: "Film in good natural lighting. Wear something that makes you feel powerful."
  },
  {
    id: 2,
    concept: "Morning Routine Aesthetic",
    hook: "My morning routine that changed everything...",
    script: "Show yourself waking up, making coffee, doing skincare. Keep each clip 2-3 seconds. Add text overlays like 'wake up 7am' '8 glasses of water' 'sunscreen always'. End with you looking ready and confident.",
    caption: "Morning routine that hits different 🌅 consistency is everything #morningroutine #aesthetic #lifestyle",
    hashtags: "#morningroutine #aesthetic #lifestyle #fyp #routine #selfcare #viral",
    time: "7:00 AM EST",
    sound: "Use a slow trending morning vibe sound",
    tip: "Film everything the night before if needed. Aesthetic lighting is everything."
  },
  {
    id: 3,
    concept: "Outfit Transition",
    hook: "Nobody knew I could look like this...",
    script: "Start in casual clothes looking normal. Do a spin transition. End in your best outfit looking stunning. Add the text 'before' and 'after'. Hold the last shot for 3 seconds confidently.",
    caption: "The transition nobody was ready for 👗✨ #ootd #fashion #transformation #fyp",
    hashtags: "#ootd #fashion #transformation #fyp #style #outfitcheck #viral",
    time: "3:00 PM EST",
    sound: "Use a popular transition sound — check TikTok trending sounds",
    tip: "The transition needs to be smooth. Practice it 3 times before filming."
  },
  {
    id: 4,
    concept: "Day In My Life",
    hook: "Come spend the day with me...",
    script: "Film short 2 second clips throughout your day. Getting ready, going out, eating, laughing. Add location tags if you are somewhere nice. End the video at night saying 'see you tomorrow' with a smile.",
    caption: "A day in my life 🎬 come vibe with me #dayinmylife #vlog #lifestyle #fyp",
    hashtags: "#dayinmylife #vlog #lifestyle #fyp #latina #comeWithMe #viral",
    time: "12:00 PM EST",
    sound: "Use a chill popular vlog sound",
    tip: "US audiences love authentic day in the life content. Be yourself."
  },
  {
    id: 5,
    concept: "Latina Pride Moment",
    hook: "Being Latina in America hits different...",
    script: "Film yourself confidently. Add text that says where you are from. Say one sentence in Spanish then translate it. End with a proud smile and your flag emoji in the caption.",
    caption: "Latina and proud 🇨🇴🌺 representing for us #latina #latinagirl #fyp #proud",
    hashtags: "#latina #latinagirl #fyp #proud #representation #hispanic #viral",
    time: "8:00 PM EST",
    sound: "Use a popular Latin or trending US sound",
    tip: "US audiences LOVE authentic cultural content. Your accent is an asset not a weakness."
  }
]

export default function Ideas() {
  const [copied, setCopied] = useState(0)
  const [expanded, setExpanded] = useState(1)

  function copy(id: number, text: string) {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(0), 2000)
  }

  return (
    <div style={{background:'#000',minHeight:'100vh',padding:'20px',paddingBottom:'100px'}}>
<div style={{display:'flex',alignItems:'center',marginBottom:'8px'}}>
        <Link href="/dashboard" style={{color:'#FFD700',textDecoration:'none',fontSize:'22px',fontWeight:'bold',marginRight:'12px'}}>←</Link>
        <h1 style={{color:'#fff',fontSize:'20px',fontWeight:'bold',margin:0}}>Today's Ideas</h1>
      </div>
      <p style={{color:'#555',fontSize:'13px',marginBottom:'24px'}}>5 trending ideas with full scripts for US audiences</p>

      {ideas.map((idea) => (
        <div key={idea.id} style={{background:'#111',border:1px solid ${expanded===idea.id?'#FFD700':'#1e1e1e'},borderRadius:'14px',marginBottom:'12px',overflow:'hidden'}}>
          
          <div onClick={()=>setExpanded(expanded===idea.id?0:idea.id)} style={{padding:'16px 18px',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <h3 style={{color:'#fff',fontSize:'15px',fontWeight:'bold',margin:0,marginBottom:'4px'}}>{idea.concept}</h3>
              <p style={{color:'#555',fontSize:'12px',margin:0}}>⏰ {idea.time}</p>
            </div>
            <span style={{color:'#FFD700',fontSize:'20px'}}>{expanded===idea.id?'↑':'↓'}</span>
          </div>

          {expanded===idea.id && (
            <div style={{padding:'0 18px 18px'}}>
              
              <div style={{background:'#000',borderRadius:'10px',padding:'12px',marginBottom:'12px'}}>
                <p style={{color:'#FFD700',fontSize:'11px',fontWeight:'bold',margin:0,marginBottom:'6px'}}>🎣 HOOK</p>
                <p style={{color:'#fff',fontSize:'14px',margin:0,lineHeight:'1.5'}}>{idea.hook}</p>
              </div>

              <div style={{background:'#000',borderRadius:'10px',padding:'12px',marginBottom:'12px'}}>
                <p style={{color:'#FFD700',fontSize:'11px',fontWeight:'bold',margin:0,marginBottom:'6px'}}>🎬 SCRIPT</p>
                <p style={{color:'#ccc',fontSize:'14px',margin:0,lineHeight:'1.6'}}>{idea.script}</p>
              </div>

              <div style={{background:'#000',borderRadius:'10px',padding:'12px',marginBottom:'12px'}}>
                <p style={{color:'#FFD700',fontSize:'11px',fontWeight:'bold',margin:0,marginBottom:'6px'}}>📝 CAPTION</p>
                <p style={{color:'#ccc',fontSize:'14px',margin:0,lineHeight:'1.5'}}>{idea.caption}</p>
                <button onClick={()=>copy(idea.id, idea.caption)} style={{marginTop:'8px',background:copied===idea.id?'#22c55e':'#FFD700',border:'none',borderRadius:'8px',padding:'6px 14px',color:'#000',fontSize:'12px',fontWeight:'bold',cursor:'pointer'}}>
                  {copied===idea.id?'Copied!':'Copy Caption'}
                </button>
              </div>

              <div style={{background:'#000',borderRadius:'10px',padding:'12px',marginBottom:'12px'}}>
                <p style={{color:'#FFD700',fontSize:'11px',fontWeight:'bold',margin:0,marginBottom:'6px'}}>🎵 SOUND</p>
                <p style={{color:'#ccc',fontSize:'14px',margin:0}}>{idea.sound}</p>
              </div>

              <div style={{background:'#1a1a00',border:'1px solid #333300',borderRadius:'10px',padding:'12px'}}>
                <p style={{color:'#FFD700',fontSize:'11px',fontWeight:'bold',margin:0,marginBottom:'6px'}}>💡 PRO TIP</p>
                <p style={{color:'#ccc',fontSize:'14px',margin:0,lineHeight:'1.5'}}>{idea.tip}</p>
              </div>

            </div>
          )}
        </div>
      ))}
    </div>
  )
}