"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // SPECIAL BYPASS FOR DELIVERY
    if (password === 'MIHAWK41') {
      router.push('/dashboard');
      return;
    }

    // Standard login logic would go here
    alert("Please use the VIP access code.");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-[#FFD700] tracking-tighter">ASCEND.AI</h1>
          <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest">US TikTok Growth</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-4 bg-[#111111] border border-gray-800 rounded-xl text-white outline-none focus:border-[#FFD700] transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password or VIP Code"
              className="w-full p-4 bg-[#111111] border border-gray-800 rounded-xl text-white outline-none focus:border-[#FFD700] transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-[#FFD700] text-black font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Enter Dashboard
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-8">
          By entering, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
}