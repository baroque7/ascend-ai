'use client'

import BottomNav from '@/components/dashboard/BottomNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#000000', minHeight: '100vh', color: '#fff' }}>
      <main style={{ paddingBottom: 80, paddingTop: 'max(0px, env(safe-area-inset-top))' }}>
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
