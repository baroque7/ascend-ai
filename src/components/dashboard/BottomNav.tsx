'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'

export default function BottomNav() {
  const pathname = usePathname()
  const { t } = useTranslation()

  const tabs = [
    { href: '/dashboard', icon: '🏠', label: t('nav.home'), exact: true },
    { href: '/dashboard/today', icon: '📅', label: t('nav.today') },
    { href: '/dashboard/strategy', icon: '🎯', label: t('nav.strategy') },
    { href: '/dashboard/settings', icon: '⚙️', label: t('nav.settings') },
  ]

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      background: '#000',
      borderTop: '1px solid #111',
      paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', paddingTop: 8 }}>
        {tabs.map((tab) => {
          const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', padding: '4px 12px', position: 'relative', minWidth: 64 }}
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', width: 24, height: 2, background: '#FFD700', borderRadius: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span style={{ fontSize: 22, marginBottom: 3, filter: active ? 'none' : 'grayscale(100%) opacity(35%)' }}>
                {tab.icon}
              </span>
              <span style={{ color: active ? '#FFD700' : '#2a2a2a', fontSize: 10, fontWeight: active ? 700 : 400, letterSpacing: 0.3 }}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
