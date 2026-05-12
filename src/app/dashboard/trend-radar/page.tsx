'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Radar, TrendingUp, Globe, Activity, Eye } from 'lucide-react';
import DashboardNav from '@/components/dashboard/DashboardNav';

export default function TrendRadar() {
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const trends = [
    {
      id: 1,
      title: 'Minimalist Aesthetic',
      platform: 'Instagram',
      region: 'North America',
      growth: '+45%',
      engagement: '6.2%',
      reach: '2.1M',
      status: 'rising'
    },
    {
      id: 2,
      title: 'Street Style Fashion',
      platform: 'TikTok',
      region: 'Europe',
      growth: '+78%',
      engagement: '8.9%',
      reach: '3.4M',
      status: 'exploding'
    },
    {
      id: 3,
      title: 'Tech Product Reviews',
      platform: 'YouTube',
      region: 'Asia',
      growth: '+23%',
      engagement: '4.1%',
      reach: '1.8M',
      status: 'stable'
    },
    {
      id: 4,
      title: 'Sustainable Living',
      platform: 'Instagram',
      region: 'Global',
      growth: '+67%',
      engagement: '7.3%',
      reach: '4.2M',
      status: 'viral'
    }
  ];

  const filteredTrends = trends.filter(trend => {
    if (selectedRegion !== 'all' && trend.region !== selectedRegion) return false;
    if (selectedPlatform !== 'all' && trend.platform.toLowerCase() !== selectedPlatform) return false;
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
              <h1 className="text-xl font-bold text-white">Global Trend Radar</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <DashboardNav currentPage="trend-radar" />

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-[#1e1e3f] border border-[#2e2e4f] text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#8b5cf6]"
            >
              <option value="all">All Regions</option>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Asia">Asia</option>
              <option value="Global">Global</option>
            </select>

            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-[#1e1e3f] border border-[#2e2e4f] text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#8b5cf6]"
            >
              <option value="all">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>

          {/* Radar Visualization */}
          <div className="glass-card rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Radar className="w-32 h-32 text-[#8b5cf6]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <p className="text-center text-[#a0a0c0] mb-4">Real-time trend detection across platforms and regions</p>
          </div>

          {/* Trends Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredTrends.map((trend, index) => (
              <motion.div
                key={trend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-xl p-6 hover:border-[#8b5cf6]/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      trend.status === 'viral' ? 'bg-red-500/20 text-red-400' :
                      trend.status === 'exploding' ? 'bg-orange-500/20 text-orange-400' :
                      trend.status === 'rising' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {trend.status}
                    </span>
                    <span className="text-sm text-[#a0a0c0]">{trend.platform}</span>
                  </div>
                  <Globe className="w-4 h-4 text-[#a0a0c0]" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-3">{trend.title}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-[#a0a0c0] mb-1">Growth Rate</p>
                    <p className="text-xl font-bold text-green-400">{trend.growth}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#a0a0c0] mb-1">Engagement</p>
                    <p className="text-xl font-bold text-white">{trend.engagement}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-[#a0a0c0]" />
                    <span className="text-sm text-[#a0a0c0]">Reach: {trend.reach}</span>
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
