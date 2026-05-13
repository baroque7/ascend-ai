"use client";
import { useState, useEffect } from 'react';
import { ChevronLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Ideas() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This tells the page to ask our "Waiter" (route.ts) for the AI data
    fetch('/api/generate')
      .then(res => res.json())
      .then(data => { 
        setIdeas(data); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Link href="/dashboard" className="text-[#FFD700]"><ChevronLeft /></Link>
        <h1 className="text-xl font-bold flex items-center gap-2">
          Daily Hooks <Sparkles className="w-4 h-4 text-[#FFD700]"/>
        </h1>
      </div>

      {/* Logic: If loading, show pulse. If done, show ideas. */}
      {loading ? (
        <div className="text-[#FFD700] animate-pulse font-bold text-center mt-20">
          Scanning US Trends...
        </div>
      ) : (
        <div className="space-y-4">
          {ideas.map((i: any, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#0a0a0a] border border-gray-900">
              <h3 className="text-[#FFD700] font-bold text-sm mb-2">{i.Title}</h3>
              <p className="text-[11px] text-gray-300 mb-4 leading-relaxed">{i.Script}</p>
              <div className="pt-3 border-t border-gray-900 text-[10px] text-gray-500">
                <p className="font-bold mb-1">CAPTION: {i.Caption}</p>
                <p className="text-[#FFD700]">{i.Hashtags}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}