'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, AlertTriangle, Activity, Eye } from 'lucide-react';
import DashboardNav from '@/components/dashboard/DashboardNav';

export default function HealthMonitor() {
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [expandedAccount, setExpandedAccount] = useState<number | null>(null);
  const [showOptimizeModal, setShowOptimizeModal] = useState<number | null>(null);

  const toggleDetails = (accountId: number) => {
    setExpandedAccount(expandedAccount === accountId ? null : accountId);
  };

  const getOptimizationSteps = (accountId: number) => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return [];
    
    const baseSteps = [
      'Post consistently 3-5 times per week',
      'Engage with followers within 2 hours of posting',
      'Use trending hashtags in your niche',
      'Collaborate with accounts in your follower range',
      'Analyze performance metrics weekly'
    ];
    
    if (account.status === 'warning') {
      baseSteps.unshift('Address critical issues immediately');
      baseSteps.push('Reduce posting frequency temporarily');
    }
    
    return baseSteps.slice(0, 5);
  };

  const accounts = [
    {
      id: 1,
      name: '@creativecreator',
      platform: 'Instagram',
      healthScore: 92,
      engagement: '4.8%',
      followers: '45.2K',
      status: 'healthy',
      lastActive: '2 hours ago',
      issues: []
    },
    {
      id: 2,
      name: '@trendsetter',
      platform: 'TikTok',
      healthScore: 78,
      engagement: '6.2%',
      followers: '128.5K',
      status: 'warning',
      lastActive: '5 hours ago',
      issues: ['Low engagement rate', 'Shadow ban risk']
    },
    {
      id: 3,
      name: 'TechReview Pro',
      platform: 'YouTube',
      healthScore: 85,
      engagement: '5.9%',
      followers: '89.3K',
      status: 'healthy',
      lastActive: '1 day ago',
      issues: ['Declining watch time']
    },
    {
      id: 4,
      name: '@minimalistlife',
      platform: 'Instagram',
      healthScore: 65,
      engagement: '5.1%',
      followers: '32.1K',
      status: 'critical',
      lastActive: '3 days ago',
      issues: ['No recent posts', 'Low follower growth', 'Poor engagement']
    }
  ];

  const filteredAccounts = selectedAccount === 'all' ? accounts : accounts.filter(account => account.name === selectedAccount);

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500/20 text-green-400';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'critical': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
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
              <h1 className="text-xl font-bold text-white">Account Health Monitor</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <DashboardNav currentPage="health-monitor" />

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="bg-[#1e1e3f] border border-[#2e2e4f] text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#8b5cf6]"
            >
              <option value="all">All Accounts</option>
              {accounts.map(account => (
                <option key={account.id} value={account.name}>{account.name}</option>
              ))}
            </select>

            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-[#1e1e3f] border border-[#2e2e4f] text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#8b5cf6]"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          {/* Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Heart className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-sm text-green-400">+5%</span>
              </div>
              <p className="text-2xl font-bold text-white">4</p>
              <p className="text-sm text-[#a0a0c0]">Healthy Accounts</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                </div>
                <span className="text-sm text-yellow-400">+2</span>
              </div>
              <p className="text-2xl font-bold text-white">1</p>
              <p className="text-sm text-[#a0a0c0]">Warning Accounts</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <Activity className="w-5 h-5 text-red-400" />
                </div>
                <span className="text-sm text-red-400">-1</span>
              </div>
              <p className="text-2xl font-bold text-white">1</p>
              <p className="text-sm text-[#a0a0c0]">Critical Accounts</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-sm text-blue-400">81.3</span>
              </div>
              <p className="text-2xl font-bold text-white">81.3</p>
              <p className="text-sm text-[#a0a0c0]">Avg Health Score</p>
            </motion.div>
          </div>

          {/* Accounts Health Details */}
          <div className="space-y-6">
            {filteredAccounts.map((account, index) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{account.name}</h3>
                      <span className="text-sm text-[#a0a0c0]">{account.platform}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
                        {account.status}
                      </span>
                      <span className={`text-lg font-bold ${getHealthColor(account.healthScore)}`}>
                        {account.healthScore}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-[#a0a0c0]">Last active: {account.lastActive}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-[#a0a0c0] mb-1">Followers</p>
                    <p className="text-xl font-bold text-white">{account.followers}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#a0a0c0] mb-1">Engagement</p>
                    <p className="text-xl font-bold text-white">{account.engagement}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#a0a0c0] mb-1">Health Trend</p>
                    <p className="text-xl font-bold text-green-400">+2.3%</p>
                  </div>
                </div>

                {account.issues.length > 0 && (
                  <div className="p-4 bg-red-500/10 rounded-lg">
                    <h4 className="text-sm font-medium text-red-400 mb-2">Health Issues Detected:</h4>
                    <ul className="space-y-1">
                      {account.issues.map((issue, issueIndex) => (
                        <li key={issueIndex} className="text-sm text-red-300 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex space-x-2 mt-4">
                  <button 
                    onClick={() => toggleDetails(account.id)}
                    className="flex-1 bg-blue-500/20 text-blue-400 py-2 px-4 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    {expandedAccount === account.id ? 'Hide Details' : 'View Details'}
                  </button>
                  <button 
                    onClick={() => setShowOptimizeModal(account.id)}
                    className="flex-1 bg-green-500/20 text-green-400 py-2 px-4 rounded-lg hover:bg-green-500/30 transition-colors"
                  >
                    Optimize Account
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Expanded Details Panel */}
        {expandedAccount && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.4, 0, 0.2, 1],
              height: { duration: 0.3 },
              opacity: { duration: 0.2 }
            }}
            className="mt-8 mb-8 glass-card rounded-xl p-6 relative z-20 shadow-2xl border-2 border-[#8b5cf6]/30 overflow-hidden"
          >
            {(() => {
              const account = accounts.find(a => a.id === expandedAccount);
              if (!account) return null;
              
              return (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Detailed Analytics - {account.name}</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Detailed Engagement Stats */}
                    <div className="bg-[#1e1e3f] rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Detailed Engagement Stats</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[#a0a0c0] text-sm">Engagement Rate</span>
                          <span className="text-green-400 font-semibold">{account.engagement}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#a0a0c0] text-sm">Likes Rate</span>
                          <span className="text-blue-400 font-semibold">3.2%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#a0a0c0] text-sm">Comments Rate</span>
                          <span className="text-purple-400 font-semibold">1.6%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#a0a0c0] text-sm">Shares Rate</span>
                          <span className="text-orange-400 font-semibold">0.8%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#a0a0c0] text-sm">Saves Rate</span>
                          <span className="text-pink-400 font-semibold">2.1%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Growth Rate */}
                    <div className="bg-[#1e1e3f] rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Growth Rate</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[#a0a0c0] text-sm">Follower Growth</span>
                          <span className="text-green-400 font-semibold">+12.5%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#a0a0c0] text-sm">Weekly Growth</span>
                          <span className="text-blue-400 font-semibold">+2.8%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#a0a0c0] text-sm">Monthly Growth</span>
                          <span className="text-purple-400 font-semibold">+11.2%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#a0a0c0] text-sm">Engagement Growth</span>
                          <span className="text-orange-400 font-semibold">+8.4%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#a0a0c0] text-sm">Reach Growth</span>
                          <span className="text-pink-400 font-semibold">+15.7%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content Performance Breakdown */}
                    <div className="bg-[#1e1e3f] rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Content Performance</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[#a0a0c0] text-sm">Posts This Week</span>
                          <span className="text-white font-semibold">24</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#a0a0c0] text-sm">Avg. Reach</span>
                          <span className="text-blue-400 font-semibold">125.8K</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#a0a0c0] text-sm">Avg. Impressions</span>
                          <span className="text-purple-400 font-semibold">89.2K</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#a0a0c0] text-sm">Avg. Saves</span>
                          <span className="text-green-400 font-semibold">3.2K</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#a0a0c0] text-sm">Avg. Watch Time</span>
                          <span className="text-orange-400 font-semibold">4m 32s</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 3 Specific Recommendations */}
                  <div className="mt-6 bg-gradient-to-r from-[#8b5cf6]/10 to-[#3b82f6]/10 rounded-lg p-4 border border-[#8b5cf6]/30">
                    <h4 className="text-lg font-semibold text-white mb-4">3 Specific Recommendations</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                          1
                        </div>
                        <div>
                          <p className="text-white font-medium mb-1">Optimize Posting Schedule</p>
                          <p className="text-[#a0a0c0] text-sm">Post during peak engagement hours (6-9 PM) to increase reach by 25%</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                          2
                        </div>
                        <div>
                          <p className="text-white font-medium mb-1">Increase Video Content</p>
                          <p className="text-[#a0a0c0] text-sm">Add 2-3 more video posts per week to boost engagement by 30%</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                          3
                        </div>
                        <div>
                          <p className="text-white font-medium mb-1">Improve Hashtag Strategy</p>
                          <p className="text-[#a0a0c0] text-sm">Use 8-12 relevant hashtags per post to increase discoverability by 40%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}

        {/* Optimization Modal */}
        {showOptimizeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#0f0f23] rounded-xl p-6 w-full max-w-md border border-[#1e1e3f]">
              <h3 className="text-xl font-bold text-white mb-4">Account Optimization Steps</h3>
              
              <div className="space-y-3">
                {getOptimizationSteps(showOptimizeModal).map((step, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-[#1e1e3f] rounded-lg">
                    <div className="w-6 h-6 bg-[#8b5cf6] rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-sm text-[#a0a0c0]">{step}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowOptimizeModal(null)}
                  className="px-4 py-2 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-semibold rounded-lg hover:from-[#7c3aed] hover:to-[#2563eb] transition-all duration-300"
                >
                  Got it, thanks!
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
