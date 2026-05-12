'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Skull, TrendingDown, Eye, AlertTriangle } from 'lucide-react';
import DashboardNav from '@/components/dashboard/DashboardNav';

export default function GraveyardAnalyzer() {
  const [contentToAnalyze, setContentToAnalyze] = useState('');
  const [contentType, setContentType] = useState('reel');
  const [targetMarket, setTargetMarket] = useState('gen-z');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeContent = () => {
    if (!contentToAnalyze.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      const results = {
        topReasons: [
          {
            reason: 'Weak hook in first 3 seconds',
            severity: 'high',
            explanation: 'Your content doesn\'t capture attention quickly enough'
          },
          {
            reason: 'Poor hashtag strategy',
            severity: 'medium',
            explanation: 'Using generic or irrelevant hashtags reduces discoverability'
          },
          {
            reason: 'Low engagement rate',
            severity: 'high',
            explanation: 'Content isn\'t encouraging likes, comments, or shares'
          }
        ],
        fixedCaption: `🔥 **${contentType === 'reel' ? 'REEL' : contentType === 'post' ? 'POST' : 'STORY'} ALERT!** 🔥\n\nStop scrolling! 🛑 This ${contentType} will change how you think about [topic] forever!\n\n💡 **Did you know?** [Surprising fact that relates to content]\n\n👇 **Comment below** what you think and **SHARE** with someone who needs this!\n\n**Follow for more** [content type] tips! 🚀`,
        betterHook: `Wait until you see what happens at the end... 🤯\n\nThis is why [topic] is changing everything...`,
        betterCTA: `👉 **TAG 3 friends** who need to see this!\n\n💬 **COMMENT** your biggest takeaway below!\n\n🔔 **TURN ON NOTIFICATIONS** so you don't miss our next ${contentType}!`,
        score: Math.floor(Math.random() * 30) + 40 // Score between 40-70
      };
      
      setAnalysisResults(results);
      setIsAnalyzing(false);
    }, 2000);
  };

  const stats = [
    { label: 'Total Analyzed', value: '247', change: '+12%', trend: 'up', icon: Skull },
    { label: 'Avg Failure Rate', value: '68%', change: '-5%', trend: 'down', icon: TrendingDown },
    { label: 'Success Rate', value: '32%', change: '+8%', trend: 'up', icon: Eye },
    { label: 'Total Saved', value: '89', change: '+15%', trend: 'up', icon: AlertTriangle },
  ];

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
              <h1 className="text-xl font-bold text-white">Content Graveyard Analyzer</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <DashboardNav currentPage="graveyard-analyzer" />

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
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <stat.icon className="w-5 h-5 text-red-400" />
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

          {/* Content Analysis Form */}
          <div className="glass-card rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">Analyze Underperforming Content</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Content Type</label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6]"
                  >
                    <option value="reel">Reel</option>
                    <option value="post">Post</option>
                    <option value="story">Story</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Target Market</label>
                  <select
                    value={targetMarket}
                    onChange={(e) => setTargetMarket(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg text-white focus:outline-none focus:border-[#8b5cf6]"
                  >
                    <option value="gen-z">Gen Z</option>
                    <option value="millennials">Millennials</option>
                    <option value="gen-x">Gen X</option>
                    <option value="boomers">Boomers</option>
                    <option value="all-ages">All Ages</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={analyzeContent}
                    disabled={isAnalyzing || !contentToAnalyze.trim()}
                    className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-semibold py-3 px-6 rounded-lg hover:from-[#7c3aed] hover:to-[#2563eb] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Paste Underperforming Content Caption</label>
                <textarea
                  value={contentToAnalyze}
                  onChange={(e) => setContentToAnalyze(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1e1e3f] border border-[#2e2e4f] rounded-lg text-white placeholder-[#6060a0] focus:outline-none focus:border-[#8b5cf6] resize-none"
                  rows={8}
                  placeholder="Paste your underperforming content caption, reel description, or story text here..."
                />
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          {analysisResults && (
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Analysis Results</h2>
                <button
                  onClick={() => setAnalysisResults(null)}
                  className="text-[#a0a0c0] hover:text-white transition-colors"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top 3 Reasons */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Top 3 Reasons Why It Failed</h3>
                  <div className="space-y-3">
                    {analysisResults.topReasons.map((reason: any, index: number) => (
                      <div key={index} className="p-3 bg-[#1e1e3f] rounded-lg border border-[#2e2e4f]">
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ${
                            reason.severity === 'high' ? 'bg-red-500' :
                            reason.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold mb-1">{reason.reason}</h4>
                            <p className="text-sm text-[#a0a0c0]">{reason.explanation}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Improvements */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Content Improvements</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Fixed Version of Caption</h4>
                      <div className="p-3 bg-[#1e1e3f] rounded-lg border border-[#2e2e4f]">
                        <p className="text-sm text-[#a0a0c0] whitespace-pre-line">{analysisResults.fixedCaption}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2">Better Hook Suggestion</h4>
                      <div className="p-3 bg-[#8b5cf6]/10 rounded-lg border border-[#8b5cf6]/30">
                        <p className="text-sm text-white">{analysisResults.betterHook}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2">Better Call to Action</h4>
                      <div className="p-3 bg-[#3b82f6]/10 rounded-lg border border-[#3b82f6]/30">
                        <p className="text-sm text-white whitespace-pre-line">{analysisResults.betterCTA}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
