'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Target, TrendingUp, DollarSign, Eye } from 'lucide-react';
import DashboardNav from '@/components/dashboard/DashboardNav';

export default function BrandIntelligence() {
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  const brandDeals = [
    {
      id: 1,
      brand: 'Nike',
      industry: 'Fashion',
      opportunity: 'Sneaker Collaboration',
      value: '$125,000',
      engagement: 'High',
      status: 'active',
      timeframe: '30d'
    },
    {
      id: 2,
      brand: 'TechCorp',
      industry: 'Technology',
      opportunity: 'Product Launch Campaign',
      value: '$85,000',
      engagement: 'Medium',
      status: 'pending',
      timeframe: '30d'
    },
    {
      id: 3,
      brand: 'BeautyBrand',
      industry: 'Beauty',
      opportunity: 'Influencer Partnership',
      value: '$45,000',
      engagement: 'High',
      status: 'completed',
      timeframe: '30d'
    },
    {
      id: 4,
      brand: 'FoodCo',
      industry: 'Food & Beverage',
      opportunity: 'Content Series',
      value: '$67,000',
      engagement: 'Very High',
      status: 'active',
      timeframe: '30d'
    }
  ];

  const filteredDeals = brandDeals.filter(deal => {
    if (selectedBrand !== 'all' && deal.brand !== selectedBrand) return false;
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
              <h1 className="text-xl font-bold text-white">Brand Deal Intelligence</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <DashboardNav currentPage="brand-intelligence" />

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-[#1e1e3f] border border-[#2e2e4f] text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#8b5cf6]"
            >
              <option value="all">All Brands</option>
              <option value="Nike">Nike</option>
              <option value="TechCorp">TechCorp</option>
              <option value="BeautyBrand">BeautyBrand</option>
              <option value="FoodCo">FoodCo</option>
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
                <Target className="w-32 h-32 text-[#8b5cf6]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <p className="text-center text-[#a0a0c0] mb-4">AI-powered brand opportunity analysis</p>
          </div>

          {/* Brand Deals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-xl p-6 hover:border-[#8b5cf6]/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      deal.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      deal.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {deal.status}
                    </span>
                    <span className="text-sm text-[#a0a0c0]">{deal.industry}</span>
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-3">{deal.brand}</h3>
                <p className="text-sm text-[#a0a0c0] mb-4">{deal.opportunity}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-[#a0a0c0] mb-1">Deal Value</p>
                    <p className="text-xl font-bold text-green-400">{deal.value}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#a0a0c0] mb-1">Engagement</p>
                    <p className="text-xl font-bold text-white">{deal.engagement}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-[#a0a0c0]" />
                    <span className="text-sm text-[#a0a0c0]">High Potential</span>
                  </div>
                  <DollarSign className="w-4 h-4 text-green-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
