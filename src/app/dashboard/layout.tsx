'use client';

import BottomNav from '@/components/dashboard/BottomNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#000000] text-[#f8f8ff]">
      <main className="relative z-10 pb-20">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}