'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()

  const tabs = [
    { href: '/dashboard/ideas', icon: '💡', label: 'Ideas' },
    { href: '/dashboard/analyze', icon: '🔍', label: 'Analyze' },
    { href: '/dashboard', icon: '🏠', label: 'Home' },
    { href: '/dashboard/tracking', icon: '📈', label: 'Track' },
    { href: '/dashboard/settings', icon: '⚙️', label: 'Settings' },
  ]

  return (
    <div style={{position:'fixed',bottom:0,left:0,right:0,background:'#0a0a0a',borderTop:'1px solid #1a1a1a',padding:'8px 0',display:'flex',justifyContent:'space-around',alignItems:'center',zIndex:100}}>
      {tabs.map((tab) => {
        const active = pathname === tab.href
        return (
          <Link key={tab.href} href={tab.href} style={{display:'flex',flexDirection:'column',alignItems:'center',textDecoration:'none',padding:'4px 12px'}}>
            <span style={{fontSize:'22px',marginBottom:'2px'}}>{tab.icon}</span>
            <span style={{color: active ? '#FFD700' : '#444',fontSize:'11px',fontWeight: active ? 'bold' : 'normal'}}>{tab.label}</span>
          </Link>
        )
      })}
    </div>
  )
}