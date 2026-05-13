"use client";
import { useState, useEffect } from 'react';
import { ChevronLeft, Sparkles, Copy, CheckCheck } from 'lucide-react';
import Link from 'next/link';

function SkeletonCard() {
  return (
    <div className="p-5 rounded-2xl bg-[#0a0a0a] border border-gray-900 animate-pulse">
      <div className="h-3 bg-gray-800 rounded w-2/3 mb-3" />
      <div className="space-y-2 mb-4">
        <div className="h-2 bg-gray-800 rounded w-full" />
        <div className="h-2 bg-gray-800 rounded w-4/5" />
        <div className="h-2 bg-gray-800 rounded w-3/4" />
      </div>
      <div className="pt-3 border-t border-gray-900 space-y-2">
        <div className="h-2 bg-gray-800 rounded w-1/2" />
        <div className="h-2 bg-yellow-900 rounded w-2/3" />
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-[#FFD700]">
      {copied ? <CheckCheck className="w-3 h-3 text-[#FFD700]" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export default function Ideas() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchIdeas = () => {
    setLoading(true); setError(false);
    fetch('/api/generate')
      .then(r => r.json())
      .then(data => { setIdeas(data); sessionStorage.setItem('ascend_ideas', JSON.stringify(data)); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  };

  useEffect(() => {
    const cached = sessionStorage.getItem('ascend_ideas');
    if (cached) { setIdeas(JSON.parse(cached)); return; }
    fetchIdeas();
  }, []);

  const handleRefresh = () => { sessionStorage.removeItem('ascend_ideas'); setIdeas([]); fetchIdeas(); };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      <div className="flex justify-between items-center mb-8">
        <Link href="/dashboard" className="text-[#FFD700]"><ChevronLeft /></Link>
        <h1 className="text-xl font-bold flex items-center gap-2">Daily Hooks <Sparkles className="w-4 h-4 text-[#FFD700]" /></h1>
        <button onClick={handleRefresh} className="text-[10px] text-gray-500 hover:text-[#FFD700]">Refresh</button>
      </div>

      {loading && <div className="space-y-4"><p className="text-[#FFD700] text-xs text-center animate-pulse">Scanning US Trends...</p>{[1,2,3,4].map(n => <SkeletonCard key={n} />)}</div>}

      {error && <div className="text-center mt-20"><p className="text-gray-400 text-sm mb-3">AI had a hiccup.</p><button onClick={handleRefresh} className="text-[#FFD700] text-sm font-bold border border-[#FFD700] px-4 py-2 rounded-xl">Try Again</button></div>}

      {!loading && !error && ideas.map((i: any, idx: number) => (
        <div key={idx} className="p-5 rounded-2xl bg-[#0a0a0a] border border-gray-900 mb-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-[#FFD700] font-bold text-sm flex-1 pr-2">{i.Title}</h3>
            <CopyButton text={${i.Script}\n\n${i.Caption}\n\n${i.Hashtags}} />
          </div>
          <p className="text-[11px] text-gray-300 mb-4 leading-relaxed">{i.Script}</p>
          <div className="pt-3 border-t border-gray-900 text-[10px] text-gray-500">
            <p className="font-bold mb-1">CAPTION: {i.Caption}</p>
            <p className="text-[#FFD700]">{i.Hashtags}</p>
          </div>
        </div>
      ))}
    </div>
  );
}