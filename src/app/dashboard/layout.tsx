'use client';

import { usePathname } from 'next/navigation';
import BottomNav from '@/components/dashboard/BottomNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#000000] text-[#f8f8ff]">
      {/* Main content */}
      <main className="relative z-10 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentPage={pathname.split('/').pop()} />
    </div>
  );
}
