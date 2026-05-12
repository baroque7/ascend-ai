'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Upload() {
  const [caption, setCaption] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  async function handlePost() {
    if (!file) {
      alert('Please select a video first')
      return
    }
    setUploading(true)
    setTimeout(() => {
      setUploading(false)
      setSuccess(true)
    }, 2000)
  }

  if (success) {
    return (
      <div style={{background:'#000',minHeight:'100vh',padding:'24px',paddingBottom:'80px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center'}}>
        <div style={{fontSize:'64px',marginBottom:'16px'}}>✅</div>
        <h2 style={{color:'#fff',fontSize:'22px',fontWeight:'bold',marginBottom:'8px'}}>Content Received!</h2>
        <p style={{color:'#666',fontSize:'15px',marginBottom:'32px',maxWidth:'300px'}}>Your video has been received. We will post it from your US TikTok account within 24 hours.</p>
        <Link href="/dashboard" style={{background:'#FFD700',color:'#000',padding:'14px 32px',borderRadius:'50px',textDecoration:'none',fontWeight:'bold',fontSize:'16px'}}>Back to Dashboard</Link>
      </div>
    )
  }

  return (
    <div style={{background:'#000',minHeight:'100vh',padding:'24px',paddingBottom:'80px'}}>
      <div style={{display:'flex',alignItems:'center',marginBottom:'24px'}}>
        <Link href="/dashboard" style={{color:'#666',textDecoration:'none',marginRight:'16px',fontSize:'20px'}}>←</Link>
        <h1 style={{color:'#FFD700',fontSize:'22px',fontWeight:'bold',margin:0}}>Upload Content</h1>
      </div>

      <p style={{color:'#666',fontSize:'14px',marginBottom:'24px'}}>Upload your video and we will post it from your US TikTok account</p>

      <label style={{display:'block',background:'#111',border:'2px dashed #333',borderRadius:'12px',padding:'40px 20px',textAlign:'center',cursor:'pointer',marginBottom:'16px'}}>
        <input type="file" accept="video/*,image/*" onChange={handleFile} style={{display:'none'}}/>
        {file ? (
          <div>
            <div style={{fontSize:'32px',marginBottom:'8px'}}>✅</div>
            <p style={{color:'#fff',fontSize:'16px',fontWeight:'bold',margin:0,marginBottom:'4px'}}>{file.name}</p>
            <p style={{color:'#666',fontSize:'13px',margin:0}}>Tap to change</p>
          </div>
        ) : (
          <div>
            <div style={{fontSize:'48px',marginBottom:'8px'}}>⬆️</div>
            <p style={{color:'#fff',fontSize:'16px',fontWeight:'bold',margin:0,marginBottom:'4px'}}>Select Video or Photo</p>
            <p style={{color:'#666',fontSize:'13px',margin:0}}>Tap to choose from your gallery</p>
          </div>
        )}
      </label>

      <div style={{marginBottom:'24px'}}>
        <label style={{color:'#fff',fontSize:'14px',fontWeight:'bold',display:'block',marginBottom:'8px'}}>Caption</label>
        <textarea 
          value={caption} 
          onChange={e=>setCaption(e.target.value)}
          placeholder="Write your caption or use one from Today's Ideas..."
          rows={4}
          style={{width:'100%',padding:'14px',background:'#111',border:'1px solid #222',borderRadius:'8px',color:'#fff',fontSize:'15px',boxSizing:'border-box',outline:'none',resize:'none',fontFamily:'inherit'}}
        />
      </div>

      <button 
        onClick={handlePost} 
        disabled={uploading}
        style={{width:'100%',padding:'16px',background:'#FFD700',border:'none',borderRadius:'50px',color:'#000',fontSize:'18px',fontWeight:'bold',cursor:'pointer'}}>
        {uploading ? 'Sending...' : 'Post Now'}
      </button>

      <p style={{color:'#444',fontSize:'12px',textAlign:'center',marginTop:'16px'}}>We will post this from your US TikTok account within 24 hours</p>
    </div>
  )
}