"use client";

import { useState } from "react";
import { RefreshCw, Copy } from "lucide-react";

const CopyButton = ({ text }: { text: string }) => {
  const copy = () => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };
  return (
    <button onClick={copy} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
      <Copy size="{16}" className="text-yellow-500"/>
    </button>
  );
};

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHooks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate');
      const data = await res.json();
      setIdeas(data);
    } catch (e) {
      console.error("Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-black min-h-screen pb-24 text-white font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-yellow-500">Daily Hooks</h1>
        <button 
          onClick={fetchHooks} 
          disabled={loading}
          className="p-2 bg-zinc-900 border border-yellow-600/50 rounded-full"
        >
          <RefreshCw className="{loading" ? "animate-spin text-yellow-500" : "text-yellow-500"}/>
        </button>
      </div>

      <div className="grid gap-4">
        {ideas.length === 0 && !loading && (
          <p className="text-gray-500 text-center mt-10 text-sm">Hit refresh to scout viral ideas...</p>
        )}
        
        {ideas.map((i, index) => (
          <div key={index} className="p-5 border border-yellow-600/20 bg-zinc-950 rounded-2xl shadow-xl">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-yellow-400 font-bold text-sm flex-1 pr-4">{i.Title}</h3>
              
              <CopyButton text="{${i.Script}\n\n${i.Caption}\n\n${i.Hashtags}}"/>
            </div>
            <p className="text-[12px] text-gray-300 mb-4 leading-relaxed italic">"{i.Script}"</p>
            <div className="pt-3 border-t border-gray-900 text-[10px] text-gray-500 font-mono">
              {i.Hashtags}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}