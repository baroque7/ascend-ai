import Link from 'next/link'
import Logo from '@/components/layout/Logo'

export default function Home() {
  return (
    <div style={{background:'#000',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px',textAlign:'center'}}>
      
      <div style={{marginBottom:'4px'}}>
        <Logo size={28} />
      </div>
      
      <div style={{marginTop:'48px',marginBottom:'24px'}}>
        <h2 style={{color:'#fff',fontSize:'38px',fontWeight:'bold',lineHeight:'1.1',margin:'0'}}>
          Grow Your Instagram
        </h2>
        <h2 style={{color:'#fff',fontSize:'38px',fontWeight:'bold',lineHeight:'1.1',margin:'0'}}>
          in the US Market.
        </h2>
        <h2 style={{color:'#FFD700',fontSize:'38px',fontWeight:'bold',lineHeight:'1.1',margin:'0'}}>
          Powered by AI.
        </h2>
      </div>
      
      <p style={{color:'#999',fontSize:'16px',maxWidth:'360px',lineHeight:'1.6',marginBottom:'16px'}}>
        Enter your Instagram handle. Our AI analyzes your profile, finds your perfect US niche, and gives you a personalized daily growth plan.
      </p>

      <div style={{display:'flex',gap:'8px',flexWrap:'wrap',justifyContent:'center',marginBottom:'40px'}}>
        <span style={{background:'#111',border:'1px solid #222',borderRadius:'50px',padding:'6px 14px',color:'#999',fontSize:'13px'}}>🎯 Niche Finder</span>
        <span style={{background:'#111',border:'1px solid #222',borderRadius:'50px',padding:'6px 14px',color:'#999',fontSize:'13px'}}>📝 Daily Scripts</span>
        <span style={{background:'#111',border:'1px solid #222',borderRadius:'50px',padding:'6px 14px',color:'#999',fontSize:'13px'}}>🇺🇸 US Audience</span>
        <span style={{background:'#111',border:'1px solid #222',borderRadius:'50px',padding:'6px 14px',color:'#999',fontSize:'13px'}}>📈 Growth Tracking</span>
      </div>
      
      <Link href="/signup" style={{background:'#FFD700',color:'#000',padding:'18px 36px',borderRadius:'50px',fontSize:'18px',fontWeight:'bold',textDecoration:'none',display:'inline-block',marginBottom:'16px'}}>
        Analyze My Instagram — $69/month
      </Link>

      <p style={{color:'#555',fontSize:'13px',marginBottom:'48px'}}>7 day free trial. Cancel anytime.</p>
      
      <div style={{display:'flex',gap:'24px',flexWrap:'wrap',justifyContent:'center'}}>
        <Link href="/about" style={{color:'#444',textDecoration:'none',fontSize:'14px'}}>About</Link>
        <a href="mailto:baroqueincoporated@gmail.com" style={{color:'#444',textDecoration:'none',fontSize:'14px'}}>Contact</a>
        <Link href="/terms" style={{color:'#444',textDecoration:'none',fontSize:'14px'}}>Terms</Link>
        <Link href="/privacy" style={{color:'#444',textDecoration:'none',fontSize:'14px'}}>Privacy</Link>
        <Link href="/pricing" style={{color:'#444',textDecoration:'none',fontSize:'14px'}}>Pricing</Link>
      </div>
      
    </div>
  )
}