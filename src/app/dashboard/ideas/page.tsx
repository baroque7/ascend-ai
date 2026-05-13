"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

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
    <div className="p-6 bg-black min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-yellow-500">Daily Hooks</h1>
        <button onClick={fetchHooks} disabled={loading} className="p-2 border border-yellow-500 rounded-full">
          <RefreshCw className="{loading" ? "animate-spin" : ""}/>
        </button>
      </div>

      <div className="grid gap-4">
        {ideas.map((item, index) => (
          <div key={index} className="p-4 border border-zinc-800 bg-zinc-900 rounded-xl">
            <h3 className="text-yellow-400 font-bold mb-2">{item.Title}</h3>
            <p className="text-sm text-gray-300">{item.Script}</p>
            <div className="mt-2 text-[10px] text-gray-500">{item.Hashtags}</div>
          </div>
        ))}
      </div>
    </div>
  );
}