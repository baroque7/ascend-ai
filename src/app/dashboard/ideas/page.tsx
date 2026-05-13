"use client";
import { useState } from 'react';
import { Lightbulb, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function Ideas() {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    { id: 1, t: "The 'Secret' Hook", h: "Stop scrolling...", s: "Show coffee, then phone." },
    { id: 2, t: "US Daily Vlog", h: "A day in the life...", s: "Fast cuts of routine." }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex items-center mb-8">
        <Link href="/dashboard" className="text-[#FFD700] mr-4"><ChevronLeft /></Link>
        <h1 className="text-xl font-bold">Daily Ideas</h1>
      </div>
      <div className="space-y-3">
        {items.map(i => (
          <div key={i.id} onClick={() => setOpen(open === i.id ? null : i.id)} 
               className={p-4 rounded-xl border ${open === i.id ? 'border-[#FFD700]' : 'border-gray-900'} bg-[#0a0a0a]}>
            <div className="flex items-center gap-3 font-bold text-sm">
              <Lightbulb className="w-4 h-4 text-[#FFD700]" /> {i.t}
            </div>
            {open === i.id && <p className="mt-3 text-xs text-gray-400 leading-relaxed">{i.h}<br/><br/>{i.s}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}