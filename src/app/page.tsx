import Link from 'next/link'

export default function Home() {
  return (
    <div style={{background:'#000',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px',textAlign:'center'}}>
      
      <h1 style={{color:'#FFD700',fontSize:'32px',fontWeight:'bold',marginBottom:'4px',letterSpacing:'-1px'}}>
        ascend.ai
      </h1>
      
      <div style={{marginTop:'48px',marginBottom:'24px'}}>
        <h2 style={{color:'#fff',fontSize:'42px',fontWeight:'bold',lineHeight:'1.1',margin:'0'}}>
          Your US TikTok
        </h2>
        <h2 style={{color:'#fff',fontSize:'42px',fontWeight:'bold',lineHeight:'1.1',margin:'0'}}>
          Account.
        </h2>
        <h2 style={{color:'#FFD700',fontSize:'42px',fontWeight:'bold',lineHeight:'1.1',margin:'0'}}>
          Done For You.
        </h2>
      </div>
      
      <p style={{color:'#999',fontSize:'16px',maxWidth:'360px',lineHeight:'1.6',marginBottom:'40px'}}>
        We create your US TikTok account, tell you what to post every day, and post it automatically from a US device.
      </p>
      
      <Link href="/signup" style={{background:'#FFD700',color:'#000',padding:'18px 36px',borderRadius:'50px',fontSize:'18px',fontWeight:'bold',textDecoration:'none',display:'inline-block'}}>
        Get Started — $89.99/month
      </Link>
      
      <div style={{marginTop:'60px',display:'flex',gap:'32px'}}>
        <Link href="/about" style={{color:'#666',textDecoration:'none',fontSize:'14px'}}>About</Link>
        <a href="mailto:baroqueincoporated@gmail.com" style={{color:'#666',textDecoration:'none',fontSize:'14px'}}>Contact</a>
        <Link href="/terms" style={{color:'#666',textDecoration:'none',fontSize:'14px'}}>Terms</Link>
        <Link href="/privacy" style={{color:'#666',textDecoration:'none',fontSize:'14px'}}>Privacy</Link>
      </div>
      
    </div>
  )
}