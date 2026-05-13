"use client";
import React from 'react';
import Link from 'next/link';
import { User, Lightbulb, Upload, Settings } from 'lucide-react';

export default function Dashboard() {
  const menuItems = [
    { title: 'Account', sub: 'US Setup', href: '/dashboard/account', icon: <User /> },
    { title: 'Ideas', sub: 'AI Hooks', href: '/dashboard/ideas', icon: <Lightbulb /> },
    { title: 'Upload', sub: 'Schedule', href: '/dashboard/upload', icon: <Upload /> },
    { title: 'Settings', sub: 'Config', href: '/dashboard/settings', icon: <Settings /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-20">
      <h1 className="text-3xl font-bold mb-8">Hello, <span className="text-[#FFD700]">Creator</span></h1>
      <div className="grid gap-4">
        {menuItems.map((item, i) => (
          <Link key={i} href={item.href} className="bg-[#0a0a0a] border border-gray-900 p-5 rounded-2xl flex items-center gap-4 active:scale-95 transition-all">
            <div className="text-[#FFD700]">{item.icon}</div>
            <div>
              <h3 className="font-bold text-sm">{item.title}</h3>
              <p className="text-[10px] text-gray-500 uppercase">{item.sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}