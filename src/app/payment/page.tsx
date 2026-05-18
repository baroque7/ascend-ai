 'use client'
import Link from 'next/link'
import Logo from '@/components/layout/Logo'

export default function Payment() {
  return (
    <div style={{background:'#000',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
      <div style={{width:'100%',maxWidth:'400px',textAlign:'center'}}>
        <h1 style={{color:'#FFD700',fontSize:'28px',fontWeight:'bold',marginBottom:'8px'}}>Complete Your Order</h1>
        <p style={{color:'#999',fontSize:'15px',marginBottom:'32px'}}>You are one step away from your US TikTok account</p>
        
        <div style={{background:'#111',border:'1px solid #FFD700',borderRadius:'12px',padding:'24px',marginBottom:'32px'}}>
          <h2 style={{color:'#fff',fontSize:'20px',fontWeight:'bold',marginBottom:'8px'}}>
            <Logo size={18} />
          </h2>
          <p style={{color:'#FFD700',fontSize:'36px',fontWeight:'bold',marginBottom:'4px'}}>$89.99</p>
          <p style={{color:'#666',fontSize:'14px',marginBottom:'24px'}}>/month</p>
          <div style={{textAlign:'left'}}>
            <p style={{color:'#999',fontSize:'14px',marginBottom:'8px'}}>✓ 1 US TikTok account created for you</p>
            <p style={{color:'#999',fontSize:'14px',marginBottom:'8px'}}>✓ Daily AI content ideas</p>
            <p style={{color:'#999',fontSize:'14px',marginBottom:'8px'}}>✓ Auto posting from US device</p>
            <p style={{color:'#999',fontSize:'14px',marginBottom:'8px'}}>✓ Account management included</p>
          </div>
        </div>

        <button style={{width:'100%',padding:'16px',background:'#FFD700',border:'none',borderRadius:'50px',color:'#000',fontSize:'18px',fontWeight:'bold',cursor:'pointer',marginBottom:'16px'}}
          onClick={() => window.location.href = '/dashboard'}>
          Pay Now
        </button>
        
        <p style={{color:'#666',fontSize:'12px',marginBottom:'16px'}}>Secure payment — Cancel anytime</p>
        
        <Link href="/signup" style={{color:'#666',textDecoration:'none',fontSize:'14px'}}>← Back to signup</Link>
      </div>
    </div>
  )
}