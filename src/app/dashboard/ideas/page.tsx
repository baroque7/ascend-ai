"use client";

import { useState } from "react";
import { RefreshCw, Copy } from "lucide-react";

// Simple CopyButton component if you don't have one
const CopyButton = ({ text }: { text: string }) => {
  const copy = () => navigator.clipboard.writeText(text);
  return (
    <button onClick={copy} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
      <Copy size={16} className="text-yellow-500" />
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
    <div className="p-6 bg-black min-h-screen pb-24 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Daily Hooks</h1>
        <button onClick={fetchHooks} disabled={loading}>
          <RefreshCw className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid gap-4">
        {ideas.map((i, index) => (
          <div key={index} className="p-4 border border-yellow-600/30 bg-zinc-900 rounded-xl">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-[#FFD700] font-bold text-sm flex-1 pr-2">{i.Title}</h3>
              {/* FIXED: Added backticks inside the prop */}
              <CopyButton text={${i.Script}\n\n${i.Caption}\n\n${i.Hashtags}} />
            </div>
            <p className="text-[11px] text-gray-300 mb-4 leading-relaxed">{i.Script}</p>
            <div className="pt-3 border-t border-gray-900 text-[10px] text-gray-500">
              {i.Hashtags}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}