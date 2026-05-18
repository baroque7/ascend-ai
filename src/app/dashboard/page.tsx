'use client'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import Logo from '@/components/layout/Logo'

export default function Dashboard() {
  const { user } = useAuth()
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'

  const cards = [
    { emoji: '📊', title: 'Analyze My Instagram', sub: 'Enter your handle and get your US strategy', href: '/dashboard/analyze', gold: true },
    { emoji: '💡', title: "Today's Content Ideas", sub: 'Scripts and captions for US audiences', href: '/dashboard/ideas', gold: false },
    { emoji: '🎯', title: 'My US Strategy', sub: 'Your personalized growth plan', href: '/dashboard/strategy', gold: false },
    { emoji: '📈', title: 'Growth Tracking', sub: 'Track your US audience progress', href: '/dashboard/tracking', gold: false },
    { emoji: '⚙️', title: 'Settings', sub: 'Account and support', href: '/dashboard/settings', gold: false },
  ]

  return (
    <div style={{background:'#000',minHeight:'100vh',padding:'20px',paddingBottom:'100px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'28px'}}>
        <div style={{display:'flex',alignItems:'center'}}>
          <Logo size={20} />
        </div>
        <Link href="/dashboard/settings" style={{width:'34px',height:'34px',background:'#111',border:'1px solid #333',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none',fontSize:'16px'}}>👤</Link>
      </div>

      <h2 style={{color:'#fff',fontSize:'22px',fontWeight:'bold',marginBottom:'4px'}}>Hey {firstName} 👋</h2>
      <p style={{color:'#555',fontSize:'14px',marginBottom:'28px'}}>Let's grow your US Instagram audience</p>

      {cards.map((card) => (
        <Link key={card.href} href={card.href} style={{
          display:'flex',
          alignItems:'center',
          justifyContent:'space-between',
          background: card.gold ? '#FFD700' : '#111',
          border: card.gold ? 'none' : '1px solid #1e1e1e',
          borderRadius:'14px',
          padding:'16px 18px',
          textDecoration:'none',
          marginBottom:'12px'
        }}>
          <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
            <div style={{
              width:'42px',
              height:'42px',
              background: card.gold ? 'rgba(0,0,0,0.1)' : '#1a1a1a',
              borderRadius:'10px',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              fontSize:'20px'
            }}>{card.emoji}</div>
            <div>
              <h3 style={{color: card.gold ? '#000' : '#fff',fontSize:'15px',fontWeight:'bold',margin:0,marginBottom:'2px'}}>{card.title}</h3>
              <p style={{color: card.gold ? '#333' : '#555',fontSize:'12px',margin:0}}>{card.sub}</p>
            </div>
          </div>
          <span style={{color: card.gold ? '#000' : '#FFD700',fontSize:'18px'}}>›</span>
        </Link>
      ))}
    </div>
  )
}