import Link from 'next/link'
import Logo from '@/components/layout/Logo'

export default function Pricing() {
  return (
    <div style={{background:'#000',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px',textAlign:'center'}}>
      
      <h1 style={{color:'#FFD700',fontSize:'28px',fontWeight:'bold',marginBottom:'8px'}}>Simple Pricing</h1>
      <p style={{color:'#666',fontSize:'15px',marginBottom:'40px'}}>One plan. Everything included.</p>

      <div style={{background:'#111',border:'2px solid #FFD700',borderRadius:'16px',padding:'32px',width:'100%',maxWidth:'360px',marginBottom:'32px'}}>
        <h2 style={{color:'#fff',fontSize:'20px',fontWeight:'bold',marginBottom:'4px'}}>
          <Logo size={20} />
        </h2>
        <p style={{color:'#666',fontSize:'14px',marginBottom:'24px'}}>AI Instagram Growth for US Audiences</p>
        <div style={{marginBottom:'24px'}}>
          <span style={{color:'#FFD700',fontSize:'48px',fontWeight:'bold'}}>$69</span>
          <span style={{color:'#666',fontSize:'16px'}}>/month</span>
        </div>
        <div style={{textAlign:'left',marginBottom:'32px'}}>
          <p style={{color:'#999',fontSize:'14px',marginBottom:'10px'}}>✓ Instagram account analysis</p>
          <p style={{color:'#999',fontSize:'14px',marginBottom:'10px'}}>✓ Personalized US growth strategy</p>
          <p style={{color:'#999',fontSize:'14px',marginBottom:'10px'}}>✓ Daily content ideas with scripts</p>
          <p style={{color:'#999',fontSize:'14px',marginBottom:'10px'}}>✓ Niche finder for US market</p>
          <p style={{color:'#999',fontSize:'14px',marginBottom:'10px'}}>✓ Hashtag strategy</p>
          <p style={{color:'#999',fontSize:'14px',marginBottom:'10px'}}>✓ Best posting times for US audiences</p>
          <p style={{color:'#999',fontSize:'14px',marginBottom:'10px'}}>✓ Growth tracking over time</p>
          <p style={{color:'#999',fontSize:'14px',marginBottom:'10px'}}>✓ Scripts in your language</p>
        </div>
        <Link href="/signup" style={{display:'block',background:'#FFD700',color:'#000',padding:'16px',borderRadius:'50px',textDecoration:'none',fontSize:'18px',fontWeight:'bold'}}>
          Start Free Trial
        </Link>
        <p style={{color:'#555',fontSize:'12px',marginTop:'12px'}}>7 day free trial. Cancel anytime.</p>
      </div>

      <a href="/" style={{color:'#666',textDecoration:'none',fontSize:'14px'}}>← Back Home</a>
    </div>
  )
}