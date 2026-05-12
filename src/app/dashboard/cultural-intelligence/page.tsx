'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, Globe, Users, TrendingUp, Eye } from 'lucide-react';
import DashboardNav from '@/components/dashboard/DashboardNav';

export default function CulturalIntelligence() {
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  const insights = [
    {
      id: 1,
      title: 'Minimalist Movement',
      region: 'North America',
      platform: 'Instagram',
      engagement: 'High',
      growth: '+45%',
      confidence: '92%',
      timeframe: '30d'
    },
    {
      id: 2,
      title: 'Street Fashion Evolution',
      region: 'Europe',
      platform: 'TikTok',
      engagement: 'Very High',
      growth: '+78%',
      confidence: '87%',
      timeframe: '30d'
    },
    {
      id: 3,
      title: 'Tech Content Shift',
      region: 'Asia',
      platform: 'YouTube',
      engagement: 'Medium',
      growth: '+23%',
      confidence: '78%',
      timeframe: '30d'
    },
    {
      id: 4,
      title: 'Sustainable Living Trend',
      region: 'Global',
      platform: 'All',
      engagement: 'High',
      growth: '+67%',
      confidence: '95%',
      timeframe: '30d'
    }
  ];

  const filteredInsights = insights.filter(insight => {
    if (selectedRegion !== 'global' && insight.region !== selectedRegion) return false;
    return true;
  });

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
              <h1 className="text-xl font-bold text-white">Cultural Intelligence</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <DashboardNav currentPage="cultural-intelligence" />

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-[#1e1e3f] border border-[#2e2e4f] text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#8b5cf6]"
            >
              <option value="global">Global</option>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Asia">Asia</option>
            </select>

            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-[#1e1e3f] border border-[#2e2e4f] text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#8b5cf6]"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>

          {/* Intelligence Overview */}
          <div className="glass-card rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Brain className="w-32 h-32 text-[#8b5cf6]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <p className="text-center text-[#a0a0c0] mb-4">AI-powered cultural trend analysis across platforms and regions</p>
          </div>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredInsights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-xl p-6 hover:border-[#8b5cf6]/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      insight.engagement === 'Very High' ? 'bg-red-500/20 text-red-400' :
                      insight.engagement === 'High' ? 'bg-orange-500/20 text-orange-400' :
                      insight.engagement === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {insight.engagement}
                    </span>
                    <span className="text-sm text-[#a0a0c0]">{insight.platform}</span>
                  </div>
                  <Globe className="w-4 h-4 text-[#a0a0c0]" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-3">{insight.title}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-[#a0a0c0] mb-1">Growth Rate</p>
                    <p className="text-xl font-bold text-green-400">{insight.growth}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#a0a0c0] mb-1">Confidence</p>
                    <p className="text-xl font-bold text-white">{insight.confidence}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-[#a0a0c0]" />
                    <span className="text-sm text-[#a0a0c0]">{insight.region}</span>
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
