'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, Users, Eye } from 'lucide-react';
import DashboardNav from '@/components/dashboard/DashboardNav';

export default function MarketDomination() {
  const [selectedNiche, setSelectedNiche] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [marketScore, setMarketScore] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const stats = [
    { label: 'Market Score', value: marketScore !== null ? `${marketScore}/100` : '0', change: '+5.2%', trend: 'up', icon: Trophy },
    { label: 'Target Reach', value: '2.1M', change: '+12%', trend: 'up', icon: Target },
    { label: 'Engagement Rate', value: '6.8%', change: '+0.5%', trend: 'up', icon: TrendingUp },
    { label: 'Total Impressions', value: '45.2M', change: '+18%', trend: 'up', icon: Eye },
  ];

  const niches = [
    'Fashion & Beauty', 'Tech & Gadgets', 'Lifestyle & Travel', 
    'Food & Cooking', 'Fitness & Health', 'Entertainment & Gaming',
    'Education & Career', 'Finance & Business', 'Art & Design'
  ];

  const markets = [
    'North America', 'Europe', 'Asia Pacific', 'Latin America',
    'Middle East & Africa', 'Australia & New Zealand'
  ];

  const generateScore = () => {
    if (!selectedNiche.trim() || !targetMarket.trim()) {
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const score = Math.floor(Math.random() * 30) + 70; // Score between 70-100
      setMarketScore(score);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#060611]">
      <div className="fixed inset-0 bg-gradient-to-br from-[#8b5cf6]/10 via-[#3b82f6]/5 to-[#06b6d4]/10 pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-[#1e1e3f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-white hover:text-[#8b5cf6] transition-colors">
                ← Back
              </Link>
              <h1 className="text-xl font-bold text-white">Market Domination Score</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <DashboardNav currentPage="market-domination" />

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-[#8b5cf6]/20 rounded-lg">
                    <stat.icon className="w-5 h-5 text-[#8b5cf6]" />
                  </div>
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-[#a0a0c0]">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Market Score Form */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Market Domination Score</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Select Your Niche</label>
                <select
                  value={selectedNiche}
                  onChange={(e) => setSelectedNiche(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6]"
                >
                  <option value="">Choose a niche...</option>
                  {niches.map((niche) => (
                    <option key={niche} value={niche}>{niche}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Target Market</label>
                <select
                  value={targetMarket}
                  onChange={(e) => setTargetMarket(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6]"
                >
                  <option value="">Choose a market...</option>
                  {markets.map((market) => (
                    <option key={market} value={market}>{market}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={generateScore}
                disabled={isGenerating || !selectedNiche.trim() || !targetMarket.trim()}
                className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-semibold py-3 px-6 rounded-lg hover:from-[#7c3aed] hover:to-[#2563eb] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating...' : 'Generate Score'}
              </button>
            </div>

            {/* Score Results */}
            {marketScore !== null && (
              <div className="mt-6 p-6 bg-[#8b5cf6]/10 rounded-lg border border-[#8b5cf6]/30">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">Your Market Domination Score</h3>
                  <div className="text-5xl font-bold text-[#8b5cf6] mb-2">{marketScore}/100</div>
                  <p className="text-[#a0a0c0]">Based on your niche and target market analysis</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
