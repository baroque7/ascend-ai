'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import BottomNav from '@/components/dashboard/BottomNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isSubscribed } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) { router.replace('/login'); return }
    if (!isSubscribed) { router.replace('/payment'); return }
  }, [user, loading, isSubscribed, router])

  if (loading || !user || !isSubscribed) {
    return (
      <div style={{ background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #1a1a1a', borderTopColor: '#FFD700', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ background: '#000000', minHeight: '100vh', color: '#fff' }}>
      <main style={{ paddingBottom: 80, paddingTop: 'max(0px, env(safe-area-inset-top))' }}>
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
